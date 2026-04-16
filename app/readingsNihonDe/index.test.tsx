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
});
