import { render, screen, fireEvent } from '@testing-library/react';
import ReadingsNihonDe from './index';

describe('ReadingsNihonDe', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('restores toggle language to on when handleResetSettings is called with it disabled', () => {
    render(<ReadingsNihonDe />);

    // Open the settings panel
    fireEvent.click(screen.getByText('Settings'));

    // The toggle language switch should be on by default
    const toggleSwitch = document.getElementById('display-toggle-toggle') as HTMLInputElement;
    expect(toggleSwitch).not.toBeNull();
    expect(toggleSwitch.checked).toBe(true);

    // Turn toggle language off
    fireEvent.click(toggleSwitch);
    expect(toggleSwitch.checked).toBe(false);

    // Click the reset settings button to open the confirmation modal
    fireEvent.click(screen.getByRole('button', { name: /reset settings/i }));

    // Confirm the reset by clicking Yes
    fireEvent.click(screen.getByText('Yes'));

    // Toggle language should be restored to on
    expect(toggleSwitch.checked).toBe(true);
  });

  it.each([
    { key: 'english',   label: 'English'  },
    { key: 'japanese',  label: 'Kanji'  },
    { key: 'kanaOnly',  label: 'Kana'  },
    { key: 'kanjiKana', label: 'Kanji and Kana'  },
    { key: 'furigana',  label: 'Furigana' },
  ])('restores $label switch to its default ($defaultEnabled) after handleResetSettings', ({ key }) => {
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
});
