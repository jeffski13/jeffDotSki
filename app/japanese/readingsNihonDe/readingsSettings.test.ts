import { readingsSettingsStoreImpl, ROWKEYS, DEFAULT_ENABLED, DEFAULT_SPLIT_JP_DIALOGUE, DEFAULT_TOGGLE_FURIGANA } from './readingsSettings';

const STORAGE_KEY = 'readingsNihonDe-displaySettings';

const LEGACY_SETTINGS_MISSING_TOGGLE_FURIGANA = JSON.stringify({
  order: ['english', 'japanese', 'kanaToggle', 'kanaOnly', 'kanjiKana', 'furigana'],
  enabled: { english: true, japanese: true, kanaToggle: true, kanaOnly: true, kanjiKana: true, furigana: true },
  splitOnKuten: false,
  defaultToggleKanjiKana: false,
  splitEnglishDialogue: false,
  splitJpDialogue: { english: false, japanese: false, toggle: false, kanaOnly: false, kanjiKana: false, furigana: false },
  lastBook: 'John',
  lastChapter: '1',
});

const LEGACY_SETTINGS_MISSING_FURIGANA = JSON.stringify({
  order: ['english', 'japanese', 'kanaToggle', 'kanaOnly', 'kanjiKana'],
  enabled: { english: true, japanese: true, kanaToggle: true, kanaOnly: true, kanjiKana: true },
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
    const savedOrder = ['english', 'japanese', 'kanaToggle', 'kanaOnly', 'kanjiKana'];

    expect(settings.order).toContain(ROWKEYS.FURIGANA);
    expect(settings.order.indexOf(ROWKEYS.FURIGANA)).toBeGreaterThanOrEqual(savedOrder.length);
  });

  it('preserves the saved order for existing languages', () => {
    localStorage.setItem(STORAGE_KEY, LEGACY_SETTINGS_MISSING_FURIGANA);

    const settings = readingsSettingsStoreImpl.getSettings();
    const savedOrder = ['english', 'japanese', 'kanaToggle', 'kanaOnly', 'kanjiKana'];

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
    expect(settings.enabled[ROWKEYS.TOGGLE_KANA]).toBe(true);
    expect(settings.enabled[ROWKEYS.KANA_ONLY]).toBe(true);
    expect(settings.enabled[ROWKEYS.KANJI_KANA]).toBe(true);
  });

  it('appends missing furiganaToggle to the end of order when loading legacy settings', () => {
    localStorage.setItem(STORAGE_KEY, LEGACY_SETTINGS_MISSING_TOGGLE_FURIGANA);

    const settings = readingsSettingsStoreImpl.getSettings();

    expect(settings.order).toContain(ROWKEYS.TOGGLE_FURIGANA);
    expect(settings.order.indexOf(ROWKEYS.TOGGLE_FURIGANA)).toBe(settings.order.length - 1);
  });

  it('gives missing furiganaToggle the default enabled value', () => {
    localStorage.setItem(STORAGE_KEY, LEGACY_SETTINGS_MISSING_TOGGLE_FURIGANA);

    const settings = readingsSettingsStoreImpl.getSettings();

    expect(settings.enabled[ROWKEYS.TOGGLE_FURIGANA]).toBe(DEFAULT_ENABLED[ROWKEYS.TOGGLE_FURIGANA]);
  });

  it('gives missing furiganaToggle the default splitJpDialogue value', () => {
    localStorage.setItem(STORAGE_KEY, LEGACY_SETTINGS_MISSING_TOGGLE_FURIGANA);

    const settings = readingsSettingsStoreImpl.getSettings();

    expect(settings.splitJpDialogue[ROWKEYS.TOGGLE_FURIGANA]).toBe(DEFAULT_SPLIT_JP_DIALOGUE[ROWKEYS.TOGGLE_FURIGANA]);
  });

  it('gives missing furiganaToggle the default defaultToggleFurigana value', () => {
    localStorage.setItem(STORAGE_KEY, LEGACY_SETTINGS_MISSING_TOGGLE_FURIGANA);

    const settings = readingsSettingsStoreImpl.getSettings();

    expect(settings.defaultToggleFurigana).toBe(DEFAULT_TOGGLE_FURIGANA);
  });

  it('strips unknown/old keys from order so DISPLAY_OPTIONS.find never returns undefined', () => {
    const settingsWithOldKey = JSON.stringify({
      order: ['oldLanguage', 'english', 'japanese', 'kanaToggle', 'kanaOnly', 'kanjiKana', 'furigana', 'furiganaToggle'],
      enabled: { english: true, japanese: true, kanaToggle: false, kanaOnly: false, kanjiKana: false, furigana: false, furiganaToggle: true },
      splitOnKuten: false,
      defaultToggleKanjiKana: false,
      defaultToggleFurigana: true,
      splitEnglishDialogue: false,
      splitJpDialogue: { english: false, japanese: false, kanaToggle: false, kanaOnly: false, kanjiKana: false, furigana: false, furiganaToggle: false },
    });
    localStorage.setItem(STORAGE_KEY, settingsWithOldKey);

    const settings = readingsSettingsStoreImpl.getSettings();

    expect(settings.order).not.toContain('oldLanguage');
    settings.order.forEach((key) => {
      expect(Object.values(ROWKEYS)).toContain(key);
    });
  });

  it('preserves saved enabled values for existing languages when furiganaToggle is missing', () => {
    localStorage.setItem(STORAGE_KEY, LEGACY_SETTINGS_MISSING_TOGGLE_FURIGANA);

    const settings = readingsSettingsStoreImpl.getSettings();

    expect(settings.enabled[ROWKEYS.ENGLISH]).toBe(true);
    expect(settings.enabled[ROWKEYS.JAPANESE]).toBe(true);
    expect(settings.enabled[ROWKEYS.TOGGLE_KANA]).toBe(true);
    expect(settings.enabled[ROWKEYS.KANA_ONLY]).toBe(true);
    expect(settings.enabled[ROWKEYS.KANJI_KANA]).toBe(true);
    expect(settings.enabled[ROWKEYS.FURIGANA]).toBe(true);
  });
});

describe('readingsSettingsStoreImpl - book, chapter, and verse persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and retrieves lastBook', () => {
    const settings = readingsSettingsStoreImpl.getSettings();
    readingsSettingsStoreImpl.saveSettings({ ...settings, lastBook: 'Genesis' });

    expect(readingsSettingsStoreImpl.getSettings().lastBook).toBe('Genesis');
  });

  it('saves and retrieves lastChapter', () => {
    const settings = readingsSettingsStoreImpl.getSettings();
    readingsSettingsStoreImpl.saveSettings({ ...settings, lastChapter: '5' });

    expect(readingsSettingsStoreImpl.getSettings().lastChapter).toBe('5');
  });

  it('saves and retrieves lastStartVerse', () => {
    const settings = readingsSettingsStoreImpl.getSettings();
    readingsSettingsStoreImpl.saveSettings({ ...settings, lastStartVerse: '12' });

    expect(readingsSettingsStoreImpl.getSettings().lastStartVerse).toBe('12');
  });

  it('saves and retrieves book, chapter, and verse together', () => {
    const settings = readingsSettingsStoreImpl.getSettings();
    readingsSettingsStoreImpl.saveSettings({ ...settings, lastBook: 'Revelation', lastChapter: '3', lastStartVerse: '7' });

    const retrieved = readingsSettingsStoreImpl.getSettings();
    expect(retrieved.lastBook).toBe('Revelation');
    expect(retrieved.lastChapter).toBe('3');
    expect(retrieved.lastStartVerse).toBe('7');
  });

  it('returns undefined for lastBook, lastChapter, and lastStartVerse when nothing is saved', () => {
    const settings = readingsSettingsStoreImpl.getSettings();

    expect(settings.lastBook).toBeUndefined();
    expect(settings.lastChapter).toBeUndefined();
    expect(settings.lastStartVerse).toBeUndefined();
  });

  it('overwrites previously saved book, chapter, and verse', () => {
    const settings = readingsSettingsStoreImpl.getSettings();
    readingsSettingsStoreImpl.saveSettings({ ...settings, lastBook: 'John', lastChapter: '1', lastStartVerse: '1' });
    readingsSettingsStoreImpl.saveSettings({ ...readingsSettingsStoreImpl.getSettings(), lastBook: 'Mark', lastChapter: '2', lastStartVerse: '3' });

    const retrieved = readingsSettingsStoreImpl.getSettings();
    expect(retrieved.lastBook).toBe('Mark');
    expect(retrieved.lastChapter).toBe('2');
    expect(retrieved.lastStartVerse).toBe('3');
  });
});
