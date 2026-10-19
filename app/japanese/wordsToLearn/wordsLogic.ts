export type WordList = 'learning' | 'wantToLearn';

// Mirrors the Word type in jeffDotSkiFuriganaServer/src/wordsToLearn/wordsToLearnMerge.ts.
// Deletions are kept as tombstones (deleted: true) so they sync to other devices.
export interface Word {
  id: string;
  romaji: string;
  english: string;
  list: WordList;
  order: number;
  lastModified: number;
  deleted: boolean;
}

export type SortColumn = 'romaji' | 'english';
export type SortMode = 'custom' | SortColumn | `${SortColumn}Desc`;

// Clicking a column header sorts ascending, then descending, then back to custom order.
export function nextSortMode(current: SortMode, column: SortColumn): SortMode {
  if (current === column) return `${column}Desc`;
  if (current === `${column}Desc`) return 'custom';
  return column;
}

export function sortDirection(mode: SortMode, column: SortColumn): 'asc' | 'desc' | null {
  if (mode === column) return 'asc';
  if (mode === `${column}Desc`) return 'desc';
  return null;
}

// dirtyIds are words changed on this device that the server hasn't confirmed yet.
export interface LocalWordsState {
  words: Word[];
  dirtyIds: string[];
}

// Should `incoming` replace `existing`? Newer lastModified wins; on a tie a deletion
// wins so a delete is never silently undone. Same rule as the server.
export function shouldReplace(existing: Word | undefined, incoming: Word): boolean {
  if (!existing) return true;
  if (incoming.lastModified !== existing.lastModified) {
    return incoming.lastModified > existing.lastModified;
  }
  return incoming.deleted && !existing.deleted;
}

// Additive merge: every id from either side is kept, newer copy wins for shared ids.
export function mergeWords(existing: Word[], incoming: Word[]): Word[] {
  const byId = new Map(existing.map((word) => [word.id, word]));
  for (const word of incoming) {
    if (shouldReplace(byId.get(word.id), word)) byId.set(word.id, word);
  }
  return [...byId.values()];
}

const compareText = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: 'base' });

const compareCustom = (a: Word, b: Word) =>
  a.order - b.order || a.lastModified - b.lastModified || a.id.localeCompare(b.id);

export function sortWords(words: Word[], mode: SortMode): Word[] {
  const sorted = [...words];
  for (const column of ['romaji', 'english'] as const) {
    const direction = sortDirection(mode, column);
    if (direction) {
      const sign = direction === 'asc' ? 1 : -1;
      return sorted.sort((a, b) => sign * compareText(a[column], b[column]) || compareCustom(a, b));
    }
  }
  return sorted.sort(compareCustom);
}

export function matchesQuery(word: Word, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return word.romaji.toLowerCase().includes(q) || word.english.toLowerCase().includes(q);
}

const wordsInList = (words: Word[], list: WordList) => words.filter((w) => !w.deleted && w.list === list);

export function visibleWords(words: Word[], list: WordList, mode: SortMode, query: string): Word[] {
  return sortWords(wordsInList(words, list).filter((w) => matchesQuery(w, query)), mode);
}

function bottomOrder(words: Word[], list: WordList, excludeId?: string): number {
  const orders = wordsInList(words, list).filter((w) => w.id !== excludeId).map((w) => w.order);
  return orders.length > 0 ? Math.max(...orders) + 1 : 0;
}

function topOrder(words: Word[], list: WordList, excludeId?: string): number {
  const orders = wordsInList(words, list).filter((w) => w.id !== excludeId).map((w) => w.order);
  return orders.length > 0 ? Math.min(...orders) - 1 : 0;
}

// The functions below return only the words they changed, ready for applyLocalChanges.

export function addWord(words: Word[], list: WordList, romaji: string, english: string, now: number, id: string): Word[] {
  return [{ id, romaji: romaji.trim(), english: english.trim(), list, order: bottomOrder(words, list), lastModified: now, deleted: false }];
}

export function moveToBottomOfList(words: Word[], id: string, list: WordList, now: number): Word[] {
  const word = words.find((w) => w.id === id);
  if (!word) return [];
  return [{ ...word, list, order: bottomOrder(words, list, id), lastModified: now }];
}

export function moveToTopOfList(words: Word[], id: string, list: WordList, now: number): Word[] {
  const word = words.find((w) => w.id === id);
  if (!word) return [];
  return [{ ...word, list, order: topOrder(words, list, id), lastModified: now }];
}

export function editWord(words: Word[], id: string, romaji: string, english: string, now: number): Word[] {
  const word = words.find((w) => w.id === id);
  const nextRomaji = romaji.trim();
  const nextEnglish = english.trim();
  if (!word || !nextRomaji || !nextEnglish) return [];
  if (word.romaji === nextRomaji && word.english === nextEnglish) return [];
  return [{ ...word, romaji: nextRomaji, english: nextEnglish, lastModified: now }];
}

export function deleteWord(words: Word[], id: string, now: number): Word[] {
  const word = words.find((w) => w.id === id);
  if (!word) return [];
  return [{ ...word, deleted: true, lastModified: now }];
}

// Moves a word to position toIndex in its list's custom order. Renumbers the list so
// words with tied orders (e.g. added on two devices at once) still move.
export function moveWordTo(words: Word[], id: string, toIndex: number, now: number): Word[] {
  const word = words.find((w) => w.id === id);
  if (!word) return [];
  const ordered = sortWords(wordsInList(words, word.list), 'custom');
  const index = ordered.findIndex((w) => w.id === id);
  if (index < 0 || toIndex < 0 || toIndex >= ordered.length || toIndex === index) return [];

  ordered.splice(index, 1);
  ordered.splice(toIndex, 0, word);
  return ordered
    .map((w, order) => (w.order === order ? null : { ...w, order, lastModified: now }))
    .filter((w): w is Word => w !== null);
}

export function moveWordToTop(words: Word[], id: string, now: number): Word[] {
  return moveWordTo(words, id, 0, now);
}

export function moveWordToBottom(words: Word[], id: string, now: number): Word[] {
  const word = words.find((w) => w.id === id);
  if (!word) return [];
  return moveWordTo(words, id, wordsInList(words, word.list).length - 1, now);
}

export function applyLocalChanges(state: LocalWordsState, changed: Word[]): LocalWordsState {
  if (changed.length === 0) return state;
  const byId = new Map(state.words.map((w) => [w.id, w]));
  changed.forEach((w) => byId.set(w.id, w));
  const dirtyIds = new Set(state.dirtyIds);
  changed.forEach((w) => dirtyIds.add(w.id));
  return { words: [...byId.values()], dirtyIds: [...dirtyIds] };
}

export function dirtyWords(state: LocalWordsState): Word[] {
  const dirtyIds = new Set(state.dirtyIds);
  return state.words.filter((w) => dirtyIds.has(w.id));
}

// The server's list is the truth, except for local edits newer than the server's copy
// (e.g. made while the request was in flight) — those are kept and stay dirty.
export function applySyncResponse(state: LocalWordsState, serverWords: Word[]): LocalWordsState {
  const serverById = new Map(serverWords.map((w) => [w.id, w]));
  const stillDirty = dirtyWords(state).filter((w) => shouldReplace(serverById.get(w.id), w));
  return {
    words: mergeWords(serverWords, stillDirty),
    dirtyIds: stillDirty.map((w) => w.id),
  };
}
