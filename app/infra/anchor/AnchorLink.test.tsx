import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AnchorLink from './AnchorLink';

describe('AnchorLink', () => {
  it('Component renders', () => {
    render(<AnchorLink targetId='' isWindowLocationAvailable={false} />);
    const button = screen.getByRole('button', { name: /Copy link/i });
    expect(button).toBeInTheDocument();

    //default state in click to copy
    const img = screen.getByRole('img', { name: /Copy Link Icon/i });
    expect(img).toBeInTheDocument();
  });

  it('clicking the button changes the icon', () => {
    render(<AnchorLink targetId='' isWindowLocationAvailable={false} />);
    const button = screen.getByRole('button', { name: /Copy link/i });
    fireEvent.click(button);
    const img = screen.getByRole('img', { name: /Copied Successfully Icon/i });
    expect(img).toBeInTheDocument();
  });

  it('icon changes back after', async () => {
    render(<AnchorLink animationTime={10} targetId='' isWindowLocationAvailable={false} />);
    const button = screen.getByRole('button', { name: /Copy link/i });
    fireEvent.click(button);
    await new Promise((r) => setTimeout(r, 20));
    const img = screen.getByRole('img', { name: /Copy Link Icon/i });
    expect(img).toBeInTheDocument();
  });
});