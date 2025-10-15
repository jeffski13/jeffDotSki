import { render, screen, fireEvent } from '@testing-library/react';
import BackNavigationConfirmModal from './BackNavigationConfirmModal';

describe('BackNavigationConfirmModal', () => {
  it('calls onCancelNavigation when No button is clicked', () => {
    let didCancel = false;
    const onCancelNavigation = () => {
        didCancel = true;
    };
    render(
      <BackNavigationConfirmModal
        onCancelNavigation={onCancelNavigation}
        destination="/test-destination"
      />
    );
    const noButton = screen.getByRole('button', { name: /No/i });
    fireEvent.click(noButton);
    expect(didCancel).toBe(true);
  });

  it('navigates to destination when Yes button is clicked', () => {

    // Mock window.location.href
    const originalLocation = window.location;
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { href: '' };

    render(
      <BackNavigationConfirmModal
        onCancelNavigation={()=>{}}
        destination="/test-destination"
      />
    );
    const yesButton = screen.getByRole('button', { name: /Yes/i });
    fireEvent.click(yesButton);
    expect(window.location.href).toBe('/test-destination');

    window.location = originalLocation;
  });
});
