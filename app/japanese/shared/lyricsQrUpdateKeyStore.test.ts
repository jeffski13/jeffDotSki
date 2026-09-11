/// <reference types="vitest/globals" />
import { lyricsQrUpdateKeyStoreImpl } from './lyricsQrUpdateKeyStore';

describe('lyricsQrUpdateKeyStoreImpl', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns an empty string when nothing has been saved', () => {
    expect(lyricsQrUpdateKeyStoreImpl.getUpdateKey()).toBe('');
  });

  it('saves and retrieves the update key', () => {
    lyricsQrUpdateKeyStoreImpl.setUpdateKey('my-secret-key');

    expect(lyricsQrUpdateKeyStoreImpl.getUpdateKey()).toBe('my-secret-key');
  });

  it('overwrites a previously saved update key', () => {
    lyricsQrUpdateKeyStoreImpl.setUpdateKey('old-key');
    lyricsQrUpdateKeyStoreImpl.setUpdateKey('new-key');

    expect(lyricsQrUpdateKeyStoreImpl.getUpdateKey()).toBe('new-key');
  });
});
