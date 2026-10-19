import { useCallback, useEffect, useRef, useState } from 'react';
import { applyLocalChanges, applySyncResponse, dirtyWords, type LocalWordsState, type Word } from './wordsLogic';
import { fetchWords, pushWords, WordsToLearnForbiddenError } from './wordsToLearnApi';
import { lyricsQrUpdateKeyStoreImpl } from '../shared/lyricsQrUpdateKeyStore';
import { wordsToLearnStoreImpl, type WordsToLearnStore } from './wordsToLearnStore';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error' | 'forbidden';

export const SYNC_DEBOUNCE_MS = 800;

export interface WordsToLearnApi {
  fetchWords: () => Promise<Word[]>;
  pushWords: (words: Word[], updateKey: string) => Promise<Word[]>;
}

const defaultApi: WordsToLearnApi = { fetchWords, pushWords };

const defaultGetUpdateKey = () => lyricsQrUpdateKeyStoreImpl.getUpdateKey();

const isOnline = () => typeof navigator === 'undefined' || navigator.onLine !== false;

// Local-first: every change is applied to localStorage immediately, then pushed to the
// server when online. Changes made offline (or rejected for a bad update key) stay queued
// (dirtyIds) until the next sync. getUpdateKey is only called when there is something to push.
export function useWordsToLearn(
  api: WordsToLearnApi = defaultApi,
  store: WordsToLearnStore = wordsToLearnStoreImpl,
  getUpdateKey: () => string = defaultGetUpdateKey,
) {
  const [state, setState] = useState<LocalWordsState>(() => store.loadWords());
  const [status, setStatus] = useState<SyncStatus>('idle');
  const stateRef = useRef(state);
  const syncing = useRef(false);
  const resyncRequested = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // kept in a ref so a new function each render doesn't recreate sync and re-run the effect
  const getUpdateKeyRef = useRef(getUpdateKey);
  useEffect(() => {
    getUpdateKeyRef.current = getUpdateKey;
  }, [getUpdateKey]);

  const commit = useCallback((next: LocalWordsState) => {
    stateRef.current = next;
    store.saveWords(next);
    setState(next);
  }, [store]);

  const sync = useCallback(async () => {
    if (!isOnline()) {
      setStatus('offline');
      return;
    }
    if (syncing.current) {
      resyncRequested.current = true;
      return;
    }
    syncing.current = true;
    setStatus('syncing');
    try {
      // loop again if a sync was requested while this one was in flight
      do {
        resyncRequested.current = false;
        const pending = dirtyWords(stateRef.current);
        const serverWords = pending.length > 0
          ? await api.pushWords(pending, getUpdateKeyRef.current())
          : await api.fetchWords();
        commit(applySyncResponse(stateRef.current, serverWords));
      } while (resyncRequested.current);
      setStatus('synced');
    } catch (err) {
      if (err instanceof WordsToLearnForbiddenError) {
        setStatus('forbidden');
      } else {
        setStatus(isOnline() ? 'error' : 'offline');
      }
    } finally {
      syncing.current = false;
    }
  }, [api, commit]);

  const scheduleSync = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      debounceTimer.current = null;
      void sync();
    }, SYNC_DEBOUNCE_MS);
  }, [sync]);

  // changeFn receives the current words and returns only the words it changed
  const change = useCallback((changeFn: (words: Word[]) => Word[]) => {
    const changed = changeFn(stateRef.current.words);
    if (changed.length === 0) return;
    commit(applyLocalChanges(stateRef.current, changed));
    scheduleSync();
  }, [commit, scheduleSync]);

  useEffect(() => {
    // deferred so the initial sync's status updates don't run inside the effect itself
    const initialSync = setTimeout(() => void sync(), 0);
    const handleOnline = () => void sync();
    const handleOffline = () => setStatus('offline');
    // pick up changes made on other devices when coming back to the tab
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') void sync();
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      clearTimeout(initialSync);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [sync]);

  return { words: state.words, pendingCount: state.dirtyIds.length, status, change, sync };
}
