import { render, screen, fireEvent } from '@testing-library/react';
import ReadingsNihonDe from './index';
import { ROWKEYS, DEFAULT_ORDER, DEFAULT_ENABLED, DEFAULT_SPLIT_ON_KUTEN, DEFAULT_TOGGLE_KANJI_KANA, DEFAULT_SPLIT_ENGLISH_DIALOGUE, DEFAULT_SPLIT_JP_DIALOGUE } from './readingsSettings';

describe('ReadingsNihonDe', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it.each([
    { key: ROWKEYS.TOGGLE_KANA,    label: 'toggle language' },
    { key: ROWKEYS.ENGLISH,   label: 'English'         },
    { key: ROWKEYS.JAPANESE,  label: 'Kanji'           },
    { key: ROWKEYS.KANA_ONLY, label: 'Kana'            },
    { key: ROWKEYS.KANJI_KANA, label: 'Kanji and Kana' },
    { key: ROWKEYS.FURIGANA,  label: 'Furigana'        },
  ])('restores $label to on when handleResetSettings is called with it disabled', ({ key }) => {
    render(<ReadingsNihonDe />);

    // Open the settings panel
    fireEvent.click(screen.getByText('Settings'));

    const langSwitch = document.getElementById(`display-toggle-${key}`) as HTMLInputElement;
    expect(langSwitch).not.toBeNull();
    expect(langSwitch.checked).toBe(true);

    // Toggle the switch away from its default
    fireEvent.click(langSwitch);
    expect(langSwitch.checked).toBe(false);

    // Open the reset confirmation modal and confirm
    fireEvent.click(screen.getByRole('button', { name: /reset settings/i }));
    fireEvent.click(screen.getByText('Yes'));

    // Switch should be restored to its default
    expect(langSwitch.checked).toBe(true);
  });

  it('resets all sub-setting checkboxes to off after handleResetSettings', () => {
    render(<ReadingsNihonDe />);

    fireEvent.click(screen.getByText('Settings'));

    const checkboxIds = [
      'split-on-kuten',
      'split-english-dialogue',
      'default-toggle-kanji-kana',
      `split-jp-dialogue-${ROWKEYS.TOGGLE_KANA}`,
      `split-jp-dialogue-${ROWKEYS.JAPANESE}`,
      `split-jp-dialogue-${ROWKEYS.KANA_ONLY}`,
      `split-jp-dialogue-${ROWKEYS.KANJI_KANA}`,
      `split-jp-dialogue-${ROWKEYS.FURIGANA}`,
    ];

    // Turn all checkboxes on
    checkboxIds.forEach((id) => {
      const checkbox = document.getElementById(id) as HTMLInputElement;
      expect(checkbox).not.toBeNull();
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);
    });

    // Reset settings and confirm
    fireEvent.click(screen.getByRole('button', { name: /reset settings/i }));
    fireEvent.click(screen.getByText('Yes'));

    // All checkboxes should be off
    checkboxIds.forEach((id) => {
      const checkbox = document.getElementById(id) as HTMLInputElement;
      expect(checkbox.checked).toBe(false);
    });
  });

  it('restores display order to default after handleResetSettings is called with a scrambled order', () => {
    const scrambledOrder = [ROWKEYS.ENGLISH, ROWKEYS.FURIGANA, ROWKEYS.TOGGLE_KANA, ROWKEYS.KANA_ONLY, ROWKEYS.KANJI_KANA, ROWKEYS.JAPANESE, ROWKEYS.TOGGLE_FURIGANA];
    localStorage.setItem('readingsNihonDe-displaySettings', JSON.stringify({
      order: scrambledOrder,
      enabled: DEFAULT_ENABLED,
      splitOnKuten: DEFAULT_SPLIT_ON_KUTEN,
      defaultToggleKanjiKana: DEFAULT_TOGGLE_KANJI_KANA,
      splitEnglishDialogue: DEFAULT_SPLIT_ENGLISH_DIALOGUE,
      splitJpDialogue: DEFAULT_SPLIT_JP_DIALOGUE,
    }));

    render(<ReadingsNihonDe />);
    fireEvent.click(screen.getByText('Settings'));

    const getSettingsOrder = () =>
      Array.from(document.querySelectorAll('[data-drag-key]')).map((el) => el.getAttribute('data-drag-key'));

    expect(getSettingsOrder()).toEqual(scrambledOrder);

    fireEvent.click(screen.getByRole('button', { name: /reset settings/i }));
    fireEvent.click(screen.getByText('Yes'));

    expect(getSettingsOrder()).toEqual(DEFAULT_ORDER);
  });
});
