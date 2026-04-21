export const ROWKEYS = {
  ENGLISH: 'english',
  TOGGLE_FURIGANA: 'furiganaToggle',
  JAPANESE: 'japanese',
  TOGGLE_KANA: 'kanaToggle',
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
  { key: ROWKEYS.ENGLISH,         label: 'English',                                 tagText: 'EN',   tagClass: 'verse-tag--en' },
  { key: ROWKEYS.TOGGLE_FURIGANA, label: 'Tap Icon to Toggle Kanji and Furigana',   tagText: '', tagClass: 'verse-tag--toggle-furigana' },
  { key: ROWKEYS.FURIGANA,        label: 'Furigana',                                tagText: '振り', tagClass: 'verse-tag--furigana' },
  { key: ROWKEYS.TOGGLE_KANA,     label: 'Tap Icon to Toggle Kanji and parentheses',tagText: '日±(ひ)', tagClass: 'verse-tag--toggle' },
  { key: ROWKEYS.JAPANESE,        label: 'Kanji Only',                              tagText: '漢字', tagClass: 'verse-tag--kanji' },
  { key: ROWKEYS.KANA_ONLY,       label: 'Kana Only',                               tagText: 'かな', tagClass: 'verse-tag--kana' },
  { key: ROWKEYS.KANJI_KANA,      label: 'Kanji with hiragana in parentheses',      tagText: '日(ひ)', tagClass: 'verse-tag--kanjikana' },
];

export const DEFAULT_ORDER: RowKey[] = DISPLAY_OPTIONS.map((o) => o.key);
export const DEFAULT_ENABLED: Record<RowKey, boolean> = {
  [ROWKEYS.ENGLISH]: true, [ROWKEYS.JAPANESE]: false, [ROWKEYS.TOGGLE_KANA]: false, [ROWKEYS.TOGGLE_FURIGANA]: true, [ROWKEYS.KANA_ONLY]: false, [ROWKEYS.KANJI_KANA]: false, [ROWKEYS.FURIGANA]: false,
};
export const DEFAULT_SPLIT_ON_KUTEN = false;
export const DEFAULT_TOGGLE_KANJI_KANA = false;
export const DEFAULT_TOGGLE_FURIGANA = true;
export const DEFAULT_SPLIT_ENGLISH_DIALOGUE = false;
export const DEFAULT_SPLIT_JP_DIALOGUE: Record<RowKey, boolean> = {
  [ROWKEYS.ENGLISH]: false, [ROWKEYS.JAPANESE]: false, [ROWKEYS.TOGGLE_KANA]: false, [ROWKEYS.TOGGLE_FURIGANA]: false, [ROWKEYS.KANA_ONLY]: false, [ROWKEYS.KANJI_KANA]: false, [ROWKEYS.FURIGANA]: false,
};

export interface ReadingsDisplaySettings {
  order: RowKey[];
  enabled: Record<RowKey, boolean>;
  splitOnKuten: boolean;
  defaultToggleKanjiKana: boolean;
  defaultToggleFurigana: boolean;
  splitEnglishDialogue: boolean;
  splitJpDialogue: Record<RowKey, boolean>;
  lastBook?: string;
  lastChapter?: string;
  lastStartVerse?: string;
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
        const knownOrder = parsed.order.filter((k) => allKeys.includes(k));
        const missingFromOrder = allKeys.filter((k) => !knownOrder.includes(k));
        return {
          ...parsed,
          order: [...knownOrder, ...missingFromOrder],
          enabled: { ...DEFAULT_ENABLED, ...parsed.enabled },
          splitJpDialogue: { ...DEFAULT_SPLIT_JP_DIALOGUE, ...parsed.splitJpDialogue },
          defaultToggleFurigana: parsed.defaultToggleFurigana ?? DEFAULT_TOGGLE_FURIGANA,
        };
      }
    } catch {
      // ignore corrupt data
    }
    return { order: DEFAULT_ORDER, enabled: DEFAULT_ENABLED, splitOnKuten: DEFAULT_SPLIT_ON_KUTEN, defaultToggleKanjiKana: DEFAULT_TOGGLE_KANJI_KANA, defaultToggleFurigana: DEFAULT_TOGGLE_FURIGANA, splitEnglishDialogue: DEFAULT_SPLIT_ENGLISH_DIALOGUE, splitJpDialogue: DEFAULT_SPLIT_JP_DIALOGUE };
  },
  saveSettings(settings: ReadingsDisplaySettings): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  },
};
