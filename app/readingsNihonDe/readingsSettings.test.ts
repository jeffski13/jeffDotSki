import { readingsSettingsStoreImpl, ROWKEYS, DEFAULT_ENABLED, DEFAULT_SPLIT_JP_DIALOGUE, DEFAULT_TOGGLE_FURIGANA } from './readingsSettings';

const STORAGE_KEY = 'readingsNihonDe-displaySettings';

const LEGACY_SETTINGS_MISSING_TOGGLE_FURIGANA = JSON.stringify({
  order: ['english', 'japanese', 'toggle', 'kanaOnly', 'kanjiKana', 'furigana'],
  enabled: { english: true, japanese: true, toggle: true, kanaOnly: true, kanjiKana: true, furigana: true },
  splitOnKuten: false,
  defaultToggleKanjiKana: false,
  splitEnglishDialogue: false,
  splitJpDialogue: { english: false, japanese: false, toggle: false, kanaOnly: false, kanjiKana: false, furigana: false },
  lastBook: 'John',
  lastChapter: '1',
});

const LEGACY_SETTINGS_MISSING_FURIGANA = JSON.stringify({
  order: ['english', 'japanese', 'toggle', 'kanaOnly', 'kanjiKana'],
  enabled: { english: true, japanese: true, toggle: true, kanaOnly: true, kanjiKana: true },
  splitOnKuten: false,
  defaultToggleKanjiKana: false,
  splitEnglishDialogue: false,
  splitJpDialogue: { english: false, japanese: false, toggle: false, kanaOnly: false, kanjiKana: false },
  lastBook: 'John',
  lastChapter: '1',
});

describe('readingsSettingsStoreImpl.getSettings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('appends missing languages to the end of order when loading legacy settings', () => {
    localStorage.setItem(STORAGE_KEY, LEGACY_SETTINGS_MISSING_FURIGANA);

    const settings = readingsSettingsStoreImpl.getSettings();
    const savedOrder = ['english', 'japanese', 'toggle', 'kanaOnly', 'kanjiKana'];

    expect(settings.order).toContain(ROWKEYS.FURIGANA);
    expect(settings.order.indexOf(ROWKEYS.FURIGANA)).toBeGreaterThanOrEqual(savedOrder.length);
  });

  it('preserves the saved order for existing languages', () => {
    localStorage.setItem(STORAGE_KEY, LEGACY_SETTINGS_MISSING_FURIGANA);

    const settings = readingsSettingsStoreImpl.getSettings();
    const savedOrder = ['english', 'japanese', 'toggle', 'kanaOnly', 'kanjiKana'];

    savedOrder.forEach((key, idx) => {
      expect(settings.order[idx]).toBe(key);
    });
  });

  it('gives missing languages the default enabled value', () => {
    localStorage.setItem(STORAGE_KEY, LEGACY_SETTINGS_MISSING_FURIGANA);

    const settings = readingsSettingsStoreImpl.getSettings();

    expect(settings.enabled[ROWKEYS.FURIGANA]).toBe(DEFAULT_ENABLED[ROWKEYS.FURIGANA]);
  });

  it('gives missing languages the default splitJpDialogue value', () => {
    localStorage.setItem(STORAGE_KEY, LEGACY_SETTINGS_MISSING_FURIGANA);

    const settings = readingsSettingsStoreImpl.getSettings();

    expect(settings.splitJpDialogue[ROWKEYS.FURIGANA]).toBe(DEFAULT_SPLIT_JP_DIALOGUE[ROWKEYS.FURIGANA]);
  });

  it('preserves saved enabled values for existing languages', () => {
    localStorage.setItem(STORAGE_KEY, LEGACY_SETTINGS_MISSING_FURIGANA);

    const settings = readingsSettingsStoreImpl.getSettings();

    expect(settings.enabled[ROWKEYS.ENGLISH]).toBe(true);
    expect(settings.enabled[ROWKEYS.JAPANESE]).toBe(true);
    expect(settings.enabled[ROWKEYS.TOGGLE]).toBe(true);
    expect(settings.enabled[ROWKEYS.KANA_ONLY]).toBe(true);
    expect(settings.enabled[ROWKEYS.KANJI_KANA]).toBe(true);
  });

  it('appends missing toggleFurigana to the end of order when loading legacy settings', () => {
    localStorage.setItem(STORAGE_KEY, LEGACY_SETTINGS_MISSING_TOGGLE_FURIGANA);

    const settings = readingsSettingsStoreImpl.getSettings();

    expect(settings.order).toContain(ROWKEYS.TOGGLE_FURIGANA);
    expect(settings.order.indexOf(ROWKEYS.TOGGLE_FURIGANA)).toBe(settings.order.length - 1);
  });

  it('gives missing toggleFurigana the default enabled value', () => {
    localStorage.setItem(STORAGE_KEY, LEGACY_SETTINGS_MISSING_TOGGLE_FURIGANA);

    const settings = readingsSettingsStoreImpl.getSettings();

    expect(settings.enabled[ROWKEYS.TOGGLE_FURIGANA]).toBe(DEFAULT_ENABLED[ROWKEYS.TOGGLE_FURIGANA]);
  });

  it('gives missing toggleFurigana the default splitJpDialogue value', () => {
    localStorage.setItem(STORAGE_KEY, LEGACY_SETTINGS_MISSING_TOGGLE_FURIGANA);

    const settings = readingsSettingsStoreImpl.getSettings();

    expect(settings.splitJpDialogue[ROWKEYS.TOGGLE_FURIGANA]).toBe(DEFAULT_SPLIT_JP_DIALOGUE[ROWKEYS.TOGGLE_FURIGANA]);
  });

  it('gives missing toggleFurigana the default defaultToggleFurigana value', () => {
    localStorage.setItem(STORAGE_KEY, LEGACY_SETTINGS_MISSING_TOGGLE_FURIGANA);

    const settings = readingsSettingsStoreImpl.getSettings();

    expect(settings.defaultToggleFurigana).toBe(DEFAULT_TOGGLE_FURIGANA);
  });

  it('preserves saved enabled values for existing languages when toggleFurigana is missing', () => {
    localStorage.setItem(STORAGE_KEY, LEGACY_SETTINGS_MISSING_TOGGLE_FURIGANA);

    const settings = readingsSettingsStoreImpl.getSettings();

    expect(settings.enabled[ROWKEYS.ENGLISH]).toBe(true);
    expect(settings.enabled[ROWKEYS.JAPANESE]).toBe(true);
    expect(settings.enabled[ROWKEYS.TOGGLE]).toBe(true);
    expect(settings.enabled[ROWKEYS.KANA_ONLY]).toBe(true);
    expect(settings.enabled[ROWKEYS.KANJI_KANA]).toBe(true);
    expect(settings.enabled[ROWKEYS.FURIGANA]).toBe(true);
  });
});
