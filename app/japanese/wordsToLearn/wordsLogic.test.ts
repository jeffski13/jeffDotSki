/// <reference types="vitest/globals" />
import {
  addWord,
  applyLocalChanges,
  applySyncResponse,
  deleteWord,
  dirtyWords,
  editWord,
  matchesQuery,
  mergeWords,
  moveToBottomOfList,
  nextSortMode,
  moveWordTo,
  shouldReplace,
  sortDirection,
  sortWords,
  visibleWords,
  type LocalWordsState,
  type Word,
} from './wordsLogic';

const word = (overrides: Partial<Word> = {}): Word => ({
  id: 'a',
  romaji: 'katsudou',
  english: 'activity',
  list: 'learning',
  order: 0,
  lastModified: 100,
  deleted: false,
  ...overrides,
});

const ids = (words: Word[]) => words.map((w) => w.id);

describe('shouldReplace / mergeWords', () => {
  it('prefers the newer lastModified and lets a delete win a tie', () => {
    expect(shouldReplace(undefined, word())).toBe(true);
    expect(shouldReplace(word({ lastModified: 1 }), word({ lastModified: 2 }))).toBe(true);
    expect(shouldReplace(word({ lastModified: 2 }), word({ lastModified: 1 }))).toBe(false);
    expect(shouldReplace(word(), word({ deleted: true }))).toBe(true);
    expect(shouldReplace(word({ deleted: true }), word())).toBe(false);
  });

  it('keeps words added on both devices, even if they look like duplicates', () => {
    const merged = mergeWords([word({ id: 'device1' })], [word({ id: 'device2' })]);
    expect(ids(merged).sort()).toEqual(['device1', 'device2']);
  });
});

describe('sortWords', () => {
  const words = [
    word({ id: '1', romaji: 'shouhin', english: 'stuff', order: 2 }),
    word({ id: '2', romaji: 'Akiraka ni', english: 'obviously', order: 0 }),
    word({ id: '3', romaji: 'katsudou', english: 'activity', order: 1 }),
  ];

  it('sorts by custom order', () => {
    expect(ids(sortWords(words, 'custom'))).toEqual(['2', '3', '1']);
  });

  it('sorts by romaji, ignoring case', () => {
    expect(ids(sortWords(words, 'romaji'))).toEqual(['2', '3', '1']);
  });

  it('sorts by english', () => {
    expect(ids(sortWords(words, 'english'))).toEqual(['3', '2', '1']);
  });

  it('sorts in reverse for the descending modes', () => {
    expect(ids(sortWords(words, 'romajiDesc'))).toEqual(['1', '3', '2']);
    expect(ids(sortWords(words, 'englishDesc'))).toEqual(['1', '2', '3']);
  });

  it('keeps custom order for ties when sorting descending', () => {
    const tied = [word({ id: 'b', romaji: 'same', order: 1 }), word({ id: 'a', romaji: 'same', order: 0 }), word({ id: 'z', romaji: 'zzz', order: 2 })];
    expect(ids(sortWords(tied, 'romajiDesc'))).toEqual(['z', 'a', 'b']);
  });

  it('breaks custom-order ties deterministically', () => {
    const tied = [word({ id: 'b', order: 0, lastModified: 5 }), word({ id: 'a', order: 0, lastModified: 5 }), word({ id: 'c', order: 0, lastModified: 1 })];
    expect(ids(sortWords(tied, 'custom'))).toEqual(['c', 'a', 'b']);
  });

  it('does not mutate the input', () => {
    const copy = [...words];
    sortWords(words, 'english');
    expect(words).toEqual(copy);
  });
});

describe('nextSortMode / sortDirection', () => {
  it('cycles a column through ascending, descending, then custom', () => {
    expect(nextSortMode('custom', 'romaji')).toBe('romaji');
    expect(nextSortMode('romaji', 'romaji')).toBe('romajiDesc');
    expect(nextSortMode('romajiDesc', 'romaji')).toBe('custom');
  });

  it('starts ascending when switching from another column', () => {
    expect(nextSortMode('romajiDesc', 'english')).toBe('english');
    expect(nextSortMode('english', 'romaji')).toBe('romaji');
  });

  it('reports the direction only for the active column', () => {
    expect(sortDirection('romaji', 'romaji')).toBe('asc');
    expect(sortDirection('romajiDesc', 'romaji')).toBe('desc');
    expect(sortDirection('romaji', 'english')).toBeNull();
    expect(sortDirection('custom', 'english')).toBeNull();
  });
});

describe('matchesQuery / visibleWords', () => {
  it('matches romaji or english case-insensitively', () => {
    expect(matchesQuery(word(), 'KATSU')).toBe(true);
    expect(matchesQuery(word(), 'activ')).toBe(true);
    expect(matchesQuery(word(), 'zzz')).toBe(false);
    expect(matchesQuery(word(), '   ')).toBe(true);
  });

  it('keeps the lists separate and hides deleted words', () => {
    const words = [
      word({ id: 'l1' }),
      word({ id: 'w1', list: 'wantToLearn' }),
      word({ id: 'gone', deleted: true }),
    ];
    expect(ids(visibleWords(words, 'learning', 'custom', ''))).toEqual(['l1']);
    expect(ids(visibleWords(words, 'wantToLearn', 'custom', ''))).toEqual(['w1']);
  });
});

describe('addWord', () => {
  it('adds a trimmed word to the bottom of the given list only', () => {
    const words = [word({ id: 'l', order: 4 }), word({ id: 'w', list: 'wantToLearn', order: 9 })];
    const [added] = addWord(words, 'learning', '  shouhin ', ' stuff ', 500, 'new');
    expect(added).toEqual({ id: 'new', romaji: 'shouhin', english: 'stuff', list: 'learning', order: 5, lastModified: 500, deleted: false });
  });

  it('starts at order 0 in an empty list, ignoring deleted words', () => {
    const [added] = addWord([word({ order: 7, deleted: true })], 'learning', 'a', 'b', 1, 'new');
    expect(added.order).toBe(0);
  });
});

describe('editWord', () => {
  it('updates the trimmed text and lastModified, keeping list and order', () => {
    const words = [word({ id: 'x', list: 'wantToLearn', order: 3 })];
    expect(editWord(words, 'x', ' tanki ', ' short term ', 500)).toEqual([
      word({ id: 'x', list: 'wantToLearn', order: 3, romaji: 'tanki', english: 'short term', lastModified: 500 }),
    ]);
  });

  it('changes nothing for blank text, unchanged text or an unknown id', () => {
    expect(editWord([word()], 'a', '  ', 'b', 1)).toEqual([]);
    expect(editWord([word()], 'a', 'katsudou', 'activity', 1)).toEqual([]);
    expect(editWord([word()], 'nope', 'x', 'y', 1)).toEqual([]);
  });
});

describe('moveToBottomOfList', () => {
  it('moves a Learning word to the bottom of Want to Learn', () => {
    const words = [word({ id: 'l' }), word({ id: 'w1', list: 'wantToLearn', order: 3 })];
    expect(moveToBottomOfList(words, 'l', 'wantToLearn', 500)).toEqual([
      word({ id: 'l', list: 'wantToLearn', order: 4, lastModified: 500 }),
    ]);
  });

  it('moves a word already in the list to its bottom', () => {
    const words = [word({ id: 'x', list: 'wantToLearn', order: 0 }), word({ id: 'y', list: 'wantToLearn', order: 1 })];
    expect(moveToBottomOfList(words, 'x', 'wantToLearn', 500)[0].order).toBe(2);
  });

  it('keeps the word at the bottom when it is already last', () => {
    const words = [word({ id: 'x', list: 'wantToLearn', order: 0 }), word({ id: 'y', list: 'wantToLearn', order: 1 })];
    expect(moveToBottomOfList(words, 'y', 'wantToLearn', 500)[0].order).toBe(1);
  });

  it('returns nothing for an unknown id', () => {
    expect(moveToBottomOfList([word()], 'nope', 'learning', 1)).toEqual([]);
  });
});

describe('deleteWord', () => {
  it('tombstones the word with a new lastModified', () => {
    expect(deleteWord([word()], 'a', 500)).toEqual([word({ deleted: true, lastModified: 500 })]);
    expect(deleteWord([word()], 'nope', 500)).toEqual([]);
  });
});

describe('moveWordTo', () => {
  const words = [
    word({ id: 'a', order: 0 }),
    word({ id: 'b', order: 1 }),
    word({ id: 'c', order: 2 }),
    word({ id: 'w', list: 'wantToLearn', order: 0 }),
  ];

  it('swaps a word with its neighbour and returns only the changed words', () => {
    const changed = moveWordTo(words, 'c', 1, 500);
    expect(changed).toEqual([
      word({ id: 'c', order: 1, lastModified: 500 }),
      word({ id: 'b', order: 2, lastModified: 500 }),
    ]);
  });

  it('moves a word several places at once', () => {
    const learningAfter = (id: string, toIndex: number) =>
      ids(visibleWords(mergeWords(words, moveWordTo(words, id, toIndex, 500)), 'learning', 'custom', ''));
    expect(learningAfter('a', 2)).toEqual(['b', 'c', 'a']);
    expect(learningAfter('c', 0)).toEqual(['c', 'a', 'b']);
  });

  it('does nothing for the same position, out-of-range targets or unknown ids', () => {
    expect(moveWordTo(words, 'b', 1, 500)).toEqual([]);
    expect(moveWordTo(words, 'a', -1, 500)).toEqual([]);
    expect(moveWordTo(words, 'c', 3, 500)).toEqual([]);
    expect(moveWordTo(words, 'w', 1, 500)).toEqual([]);
    expect(moveWordTo(words, 'nope', 0, 500)).toEqual([]);
  });

  it('renumbers tied orders so the word still moves', () => {
    const tied = [word({ id: 'x', order: 0, lastModified: 1 }), word({ id: 'y', order: 0, lastModified: 2 })];
    const changed = moveWordTo(tied, 'y', 0, 500);
    const result = sortWords(mergeWords(tied, changed), 'custom');
    expect(ids(result)).toEqual(['y', 'x']);
  });
});

describe('local state and syncing', () => {
  const synced: LocalWordsState = { words: [word({ id: 'a' }), word({ id: 'b' })], dirtyIds: [] };

  it('applyLocalChanges replaces changed words and marks them dirty', () => {
    const next = applyLocalChanges(synced, [word({ id: 'a', english: 'edited', lastModified: 200 }), word({ id: 'new' })]);
    expect(next.words.find((w) => w.id === 'a')?.english).toBe('edited');
    expect(next.dirtyIds.sort()).toEqual(['a', 'new']);
    expect(ids(dirtyWords(next)).sort()).toEqual(['a', 'new']);
  });

  it('applyLocalChanges returns the same state when nothing changed', () => {
    expect(applyLocalChanges(synced, [])).toBe(synced);
  });

  it('applySyncResponse takes the server list and clears dirty words the server confirmed', () => {
    const local = applyLocalChanges(synced, [word({ id: 'mine', lastModified: 200 })]);
    const server = [word({ id: 'a' }), word({ id: 'mine', lastModified: 200 }), word({ id: 'fromOtherDevice' })];

    const next = applySyncResponse(local, server);

    expect(ids(next.words).sort()).toEqual(['a', 'fromOtherDevice', 'mine']);
    expect(next.dirtyIds).toEqual([]);
  });

  it('applySyncResponse keeps local edits made while the request was in flight', () => {
    const local = applyLocalChanges(synced, [word({ id: 'a', english: 'newest', lastModified: 300 }), word({ id: 'added', lastModified: 300 })]);
    const server = [word({ id: 'a', english: 'sent', lastModified: 200 })];

    const next = applySyncResponse(local, server);

    expect(next.words.find((w) => w.id === 'a')?.english).toBe('newest');
    expect(next.dirtyIds.sort()).toEqual(['a', 'added']);
  });

  it('applySyncResponse lets a newer server edit win over an older local edit', () => {
    const local = applyLocalChanges(synced, [word({ id: 'a', english: 'older', lastModified: 150 })]);
    const next = applySyncResponse(local, [word({ id: 'a', english: 'newer', lastModified: 250 })]);

    expect(next.words).toEqual([word({ id: 'a', english: 'newer', lastModified: 250 })]);
    expect(next.dirtyIds).toEqual([]);
  });
});
