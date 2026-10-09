import type { LocalWordsState, SortMode } from './wordsLogic';

const WORDS_STORAGE_KEY = 'wordsToLearn.words';
const SORT_STORAGE_KEY = 'wordsToLearn.sort';

export interface SortSettings {
  learning: SortMode;
  wantToLearn: SortMode;
}

export const DEFAULT_SORT: SortSettings = { learning: 'custom', wantToLearn: 'custom' };

const EMPTY_STATE: LocalWordsState = { words: [], dirtyIds: [] };

export interface WordsToLearnStore {
  loadWords: () => LocalWordsState;
  saveWords: (state: LocalWordsState) => void;
  loadSort: () => SortSettings;
  saveSort: (sort: SortSettings) => void;
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or unavailable — skip silently
  }
}

export const wordsToLearnStoreImpl: WordsToLearnStore = {
  loadWords: () => read(WORDS_STORAGE_KEY, EMPTY_STATE),
  saveWords: (state) => write(WORDS_STORAGE_KEY, state),
  loadSort: () => read(SORT_STORAGE_KEY, DEFAULT_SORT),
  saveSort: (sort) => write(SORT_STORAGE_KEY, sort),
};
