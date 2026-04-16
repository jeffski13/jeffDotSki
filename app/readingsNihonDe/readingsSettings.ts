export const ROWKEYS = {
  ENGLISH: 'english',
  JAPANESE: 'japanese',
  TOGGLE: 'toggle',
  KANA_ONLY: 'kanaOnly',
  KANJI_KANA: 'kanjiKana',
  FURIGANA: 'furigana',
};

export type RowKey = typeof ROWKEYS[keyof typeof ROWKEYS];

export interface DisplayOption {
  key: RowKey;
  label: string;
  tagText: string;
  tagClass: string;
}

export const DISPLAY_OPTIONS: DisplayOption[] = [
  { key: ROWKEYS.ENGLISH,    label: 'English',                           tagText: 'EN',   tagClass: 'verse-tag--en' },
  { key: ROWKEYS.FURIGANA,   label: 'Furigana',                          tagText: 'ルビ', tagClass: 'verse-tag--furigana' },
  { key: ROWKEYS.TOGGLE,     label: 'Tap Icon to Toggle Kanji and Kana', tagText: '調整', tagClass: 'verse-tag--toggle' },
  { key: ROWKEYS.JAPANESE,   label: 'Kanji',                             tagText: '漢字', tagClass: 'verse-tag--kanji' },
  { key: ROWKEYS.KANA_ONLY,  label: 'Kana',                              tagText: 'かな', tagClass: 'verse-tag--kana' },
  { key: ROWKEYS.KANJI_KANA, label: 'Kanji and Kana',                    tagText: '両方', tagClass: 'verse-tag--kanjikana' },
];

export const DEFAULT_ORDER: RowKey[] = DISPLAY_OPTIONS.map((o) => o.key);
export const DEFAULT_ENABLED: Record<RowKey, boolean> = {
  [ROWKEYS.ENGLISH]: true, [ROWKEYS.JAPANESE]: true, [ROWKEYS.TOGGLE]: true, [ROWKEYS.KANA_ONLY]: true, [ROWKEYS.KANJI_KANA]: true, [ROWKEYS.FURIGANA]: true,
};
export const DEFAULT_SPLIT_ON_KUTEN = false;
export const DEFAULT_TOGGLE_KANJI_KANA = false;
export const DEFAULT_SPLIT_ENGLISH_DIALOGUE = false;
export const DEFAULT_SPLIT_JP_DIALOGUE: Record<RowKey, boolean> = {
  [ROWKEYS.ENGLISH]: false, [ROWKEYS.JAPANESE]: false, [ROWKEYS.TOGGLE]: false, [ROWKEYS.KANA_ONLY]: false, [ROWKEYS.KANJI_KANA]: false, [ROWKEYS.FURIGANA]: false,
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
        const parsed = JSON.parse(raw) as ReadingsDisplaySettings;
        const allKeys = DISPLAY_OPTIONS.map((o) => o.key);
        const missingFromOrder = allKeys.filter((k) => !parsed.order.includes(k));
        return {
          ...parsed,
          order: [...parsed.order, ...missingFromOrder],
          enabled: { ...DEFAULT_ENABLED, ...parsed.enabled },
          splitJpDialogue: { ...DEFAULT_SPLIT_JP_DIALOGUE, ...parsed.splitJpDialogue },
        };
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
