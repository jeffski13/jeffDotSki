export type RowKey = 'english' | 'japanese' | 'toggle' | 'kanaOnly' | 'kanjiKana';

export interface DisplayOption {
  key: RowKey;
  label: string;
  tagText: string;
  tagClass: string;
}

export const DISPLAY_OPTIONS: DisplayOption[] = [
  { key: 'english',   label: 'English',             tagText: 'EN',   tagClass: 'verse-tag--en' },
  { key: 'japanese',  label: 'Kanji',     tagText: '漢字', tagClass: 'verse-tag--kanji' },
  { key: 'toggle',    label: 'Toggle Kanji and Kana',          tagText: '調整', tagClass: 'verse-tag--toggle' },
  { key: 'kanaOnly',  label: 'Kana',                 tagText: 'かな', tagClass: 'verse-tag--kana' },
  { key: 'kanjiKana', label: 'Kanji and Kana',  tagText: '両方', tagClass: 'verse-tag--kanjikana' },
];

export const DEFAULT_ORDER: RowKey[] = DISPLAY_OPTIONS.map((o) => o.key);
export const DEFAULT_ENABLED: Record<RowKey, boolean> = {
  english: true, japanese: true, toggle: true, kanaOnly: true, kanjiKana: true,
};
export const DEFAULT_SPLIT_ON_KUTEN = false;

export interface ReadingsDisplaySettings {
  order: RowKey[];
  enabled: Record<RowKey, boolean>;
  splitOnKuten: boolean;
}

export interface ReadingsSettingsStore {
  getSettings: () => ReadingsDisplaySettings;
  saveSettings: (settings: ReadingsDisplaySettings) => void;
}

const STORAGE_KEY = 'readingsNihonDe-displaySettings';

export const readingsSettingsStoreImpl: ReadingsSettingsStore = {
  getSettings(): ReadingsDisplaySettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as ReadingsDisplaySettings;
      }
    } catch {
      // ignore corrupt data
    }
    return { order: DEFAULT_ORDER, enabled: DEFAULT_ENABLED, splitOnKuten: DEFAULT_SPLIT_ON_KUTEN };
  },
  saveSettings(settings: ReadingsDisplaySettings): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  },
};
