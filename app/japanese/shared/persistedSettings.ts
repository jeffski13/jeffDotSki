import { useState, useEffect } from 'react';

type BooleanSettings = Record<string, boolean>;

// Reads a JSON object of boolean flags from localStorage, falling back to `defaults` for any
// missing or non-boolean field (and for the whole object if it's absent or unparseable).
export function loadBooleanSettings<T extends BooleanSettings>(storageKey: string, defaults: T): T {
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    const result = { ...defaults };
    for (const key of Object.keys(defaults) as (keyof T)[]) {
      const value = parsed?.[key];
      if (typeof value === 'boolean') result[key] = value as T[keyof T];
    }
    return result;
  } catch {
    return defaults;
  }
}

// useState for a set of boolean display flags that is remembered in localStorage under `storageKey`.
export function usePersistedBooleanSettings<T extends BooleanSettings>(storageKey: string, defaults: T) {
  const [settings, setSettings] = useState<T>(() => loadBooleanSettings(storageKey, defaults));

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [storageKey, settings]);

  return [settings, setSettings] as const;
}
