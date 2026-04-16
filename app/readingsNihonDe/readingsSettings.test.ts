import { readingsSettingsStoreImpl, ROWKEYS, DEFAULT_ENABLED, DEFAULT_SPLIT_JP_DIALOGUE } from './readingsSettings';

const STORAGE_KEY = 'readingsNihonDe-displaySettings';

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

    expect(settings.order).toContain(ROWKEYS.FURIGANA);
    expect(settings.order.indexOf(ROWKEYS.FURIGANA)).toBe(settings.order.length - 1);
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
});
