export const ROW_KEY_ENGLISH   = 'english'   as const;
export const ROW_KEY_JAPANESE  = 'japanese'  as const;
export const ROW_KEY_TOGGLE    = 'toggle'    as const;
export const ROW_KEY_KANA_ONLY = 'kanaOnly'  as const;
export const ROW_KEY_KANJI_KANA = 'kanjiKana' as const;
export const ROW_KEY_FURIGANA  = 'furigana'  as const;

export const ROWKEYS = {
  ENGLISH: 'english',
  JAPANESE: 'japanese',
  TOGGLE: 'toggle',
  KANA_ONLY: 'kanaOnly',
  KANJI_KANA: 'kanjiKana',
  FURIGANA: 'furigana',
} as const

export type RowKey = typeof ROW_KEY_ENGLISH | typeof ROW_KEY_JAPANESE | typeof ROW_KEY_TOGGLE | typeof ROW_KEY_KANA_ONLY | typeof ROW_KEY_KANJI_KANA | typeof ROW_KEY_FURIGANA;

export interface DisplayOption {
  key: RowKey;
  label: string;
  tagText: string;
  tagClass: string;
}

export const DISPLAY_OPTIONS: DisplayOption[] = [
  { key: ROW_KEY_ENGLISH,    label: 'English',                        tagText: 'EN',   tagClass: 'verse-tag--en' },
  { key: ROW_KEY_JAPANESE,   label: 'Kanji',                          tagText: '漢字', tagClass: 'verse-tag--kanji' },
  { key: ROW_KEY_TOGGLE,     label: 'Tap Icon to Toggle Kanji and Kana', tagText: '調整', tagClass: 'verse-tag--toggle' },
  { key: ROW_KEY_KANA_ONLY,  label: 'Kana',                           tagText: 'かな', tagClass: 'verse-tag--kana' },
  { key: ROW_KEY_KANJI_KANA, label: 'Kanji and Kana',                 tagText: '両方', tagClass: 'verse-tag--kanjikana' },
  { key: ROW_KEY_FURIGANA,   label: 'Furigana',                       tagText: 'ルビ', tagClass: 'verse-tag--furigana' },
];

export const DEFAULT_ORDER: RowKey[] = DISPLAY_OPTIONS.map((o) => o.key);
export const DEFAULT_ENABLED: Record<RowKey, boolean> = {
  [ROW_KEY_ENGLISH]: true, [ROW_KEY_JAPANESE]: true, [ROW_KEY_TOGGLE]: true, [ROW_KEY_KANA_ONLY]: true, [ROW_KEY_KANJI_KANA]: true, [ROW_KEY_FURIGANA]: true,
};
export const DEFAULT_SPLIT_ON_KUTEN = false;
export const DEFAULT_TOGGLE_KANJI_KANA = false;
export const DEFAULT_SPLIT_ENGLISH_DIALOGUE = false;
export const DEFAULT_SPLIT_JP_DIALOGUE: Record<RowKey, boolean> = {
  [ROW_KEY_ENGLISH]: false, [ROW_KEY_JAPANESE]: false, [ROW_KEY_TOGGLE]: false, [ROW_KEY_KANA_ONLY]: false, [ROW_KEY_KANJI_KANA]: false, [ROW_KEY_FURIGANA]: false,
};

export interface ReadingsDisplaySettings {
  order: RowKey[];
  enabled: Record<RowKey, boolean>;
  splitOnKuten: boolean;
  defaultToggleKanjiKana: boolean;
  splitEnglishDialogue: boolean;
  splitJpDialogue: Record<RowKey, boolean>;
  lastBook?: string;
  lastChapter?: string;
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
    return { order: DEFAULT_ORDER, enabled: DEFAULT_ENABLED, splitOnKuten: DEFAULT_SPLIT_ON_KUTEN, defaultToggleKanjiKana: DEFAULT_TOGGLE_KANJI_KANA, splitEnglishDialogue: DEFAULT_SPLIT_ENGLISH_DIALOGUE, splitJpDialogue: DEFAULT_SPLIT_JP_DIALOGUE };
  },
  saveSettings(settings: ReadingsDisplaySettings): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  },
};
