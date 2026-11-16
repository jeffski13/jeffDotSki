/// <reference types="vitest/globals" />
import { renderHook, act } from '@testing-library/react';
import { loadBooleanSettings, usePersistedBooleanSettings } from './persistedSettings';

const KEY = 'test.settings';
const DEFAULTS = { a: true, b: false };

describe('loadBooleanSettings', () => {
  beforeEach(() => window.localStorage.clear());

  it('returns the defaults when nothing is stored', () => {
    expect(loadBooleanSettings(KEY, DEFAULTS)).toEqual(DEFAULTS);
  });

  it('returns stored values', () => {
    window.localStorage.setItem(KEY, JSON.stringify({ a: false, b: true }));
    expect(loadBooleanSettings(KEY, DEFAULTS)).toEqual({ a: false, b: true });
  });

  it('falls back per field for missing or non-boolean values', () => {
    window.localStorage.setItem(KEY, JSON.stringify({ a: 'no', b: true }));
    expect(loadBooleanSettings(KEY, DEFAULTS)).toEqual({ a: true, b: true });
  });

  it('ignores fields that are not in the defaults', () => {
    window.localStorage.setItem(KEY, JSON.stringify({ a: false, extra: true }));
    expect(loadBooleanSettings(KEY, DEFAULTS)).toEqual({ a: false, b: false });
  });

  it('returns the defaults when the stored value is not valid JSON', () => {
    window.localStorage.setItem(KEY, '{not json');
    expect(loadBooleanSettings(KEY, DEFAULTS)).toEqual(DEFAULTS);
  });

  it('returns the defaults when the stored value is JSON null', () => {
    window.localStorage.setItem(KEY, 'null');
    expect(loadBooleanSettings(KEY, DEFAULTS)).toEqual(DEFAULTS);
  });
});

describe('usePersistedBooleanSettings', () => {
  beforeEach(() => window.localStorage.clear());

  it('starts from stored values and saves updates', () => {
    window.localStorage.setItem(KEY, JSON.stringify({ a: false, b: false }));
    const { result } = renderHook(() => usePersistedBooleanSettings(KEY, DEFAULTS));
    expect(result.current[0]).toEqual({ a: false, b: false });

    act(() => result.current[1]((prev) => ({ ...prev, b: true })));

    expect(result.current[0]).toEqual({ a: false, b: true });
    expect(JSON.parse(window.localStorage.getItem(KEY)!)).toEqual({ a: false, b: true });
  });
});
