const UPDATE_KEY_STORAGE_KEY = 'lyricsQrUpdateKey';

export interface LyricsQrUpdateKeyStore {
  getUpdateKey: () => string;
  setUpdateKey: (updateKey: string) => void;
}

export const lyricsQrUpdateKeyStoreImpl: LyricsQrUpdateKeyStore = {
  getUpdateKey: function (): string {
    return localStorage.getItem(UPDATE_KEY_STORAGE_KEY) ?? '';
  },
  setUpdateKey: function (updateKey: string): void {
    localStorage.setItem(UPDATE_KEY_STORAGE_KEY, updateKey);
  },
};
