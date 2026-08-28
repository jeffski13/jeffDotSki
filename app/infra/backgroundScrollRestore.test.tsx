/// <reference types="vitest/globals" />
import { render } from '@testing-library/react';
import { useBackgroundScrollRestore } from './backgroundScrollRestore';

function TestHarness() {
  useBackgroundScrollRestore();
  return null;
}

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { value, configurable: true, writable: true });
}

function setVisibilityState(value: DocumentVisibilityState) {
  Object.defineProperty(document, 'visibilityState', { value, configurable: true, writable: true });
}

describe('useBackgroundScrollRestore', () => {
  let scrollToSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    setScrollY(0);
    setVisibilityState('visible');
  });

  afterEach(() => {
    scrollToSpy.mockRestore();
  });

  it('restores the pre-hide scroll position after a pagehide/pageshow cycle that resets scroll to 0', () => {
    render(<TestHarness />);

    setScrollY(420);
    window.dispatchEvent(new Event('pagehide'));

    // simulate iOS Safari backgrounding the tab and losing scroll position
    setScrollY(0);
    window.dispatchEvent(new Event('pageshow'));

    expect(scrollToSpy).toHaveBeenCalledWith(0, 420);
  });

  it('restores the pre-hide scroll position via visibilitychange when pageshow does not fire', () => {
    render(<TestHarness />);

    setScrollY(250);
    setVisibilityState('hidden');
    document.dispatchEvent(new Event('visibilitychange'));

    setScrollY(0);
    setVisibilityState('visible');
    document.dispatchEvent(new Event('visibilitychange'));

    expect(scrollToSpy).toHaveBeenCalledWith(0, 250);
  });

  it('does not restore scroll when the page becomes visible at a non-zero scroll position', () => {
    render(<TestHarness />);

    setScrollY(300);
    window.dispatchEvent(new Event('pagehide'));

    // browser kept the scroll position on its own — no correction needed
    setScrollY(300);
    window.dispatchEvent(new Event('pageshow'));

    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it('does not call scrollTo if the page was already at the top before hiding', () => {
    render(<TestHarness />);

    setScrollY(0);
    window.dispatchEvent(new Event('pagehide'));

    setScrollY(0);
    window.dispatchEvent(new Event('pageshow'));

    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it('removes its listeners on unmount', () => {
    const { unmount } = render(<TestHarness />);
    unmount();

    setScrollY(150);
    window.dispatchEvent(new Event('pagehide'));
    setScrollY(0);
    window.dispatchEvent(new Event('pageshow'));

    expect(scrollToSpy).not.toHaveBeenCalled();
  });
});
