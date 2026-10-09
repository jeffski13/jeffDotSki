/// <reference types="vitest/globals" />
import { DEFAULT_SORT, wordsToLearnStoreImpl } from './wordsToLearnStore';

beforeEach(() => {
  localStorage.clear();
});

describe('wordsToLearnStoreImpl', () => {
  it('returns an empty state when nothing is saved', () => {
    expect(wordsToLearnStoreImpl.loadWords()).toEqual({ words: [], dirtyIds: [] });
  });

  it('round-trips the words state', () => {
    const state = {
      words: [{ id: 'a', romaji: 'r', english: 'e', list: 'learning' as const, order: 0, lastModified: 1, deleted: false }],
      dirtyIds: ['a'],
    };
    wordsToLearnStoreImpl.saveWords(state);
    expect(wordsToLearnStoreImpl.loadWords()).toEqual(state);
  });

  it('falls back to defaults on corrupt data', () => {
    localStorage.setItem('wordsToLearn.words', '{not json');
    expect(wordsToLearnStoreImpl.loadWords()).toEqual({ words: [], dirtyIds: [] });
  });

  it('round-trips the sort settings, defaulting to custom order', () => {
    expect(wordsToLearnStoreImpl.loadSort()).toEqual(DEFAULT_SORT);
    wordsToLearnStoreImpl.saveSort({ learning: 'english', wantToLearn: 'romaji' });
    expect(wordsToLearnStoreImpl.loadSort()).toEqual({ learning: 'english', wantToLearn: 'romaji' });
  });
});
