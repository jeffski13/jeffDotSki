import { render, screen, fireEvent } from '@testing-library/react';
import ReadingsNihonDe from './index';

describe('ReadingsNihonDe', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it.each([
    { key: 'toggle',    label: 'toggle language' },
    { key: 'english',   label: 'English'         },
    { key: 'japanese',  label: 'Kanji'           },
    { key: 'kanaOnly',  label: 'Kana'            },
    { key: 'kanjiKana', label: 'Kanji and Kana'  },
    { key: 'furigana',  label: 'Furigana'        },
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
});
