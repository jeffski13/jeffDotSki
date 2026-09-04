/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useShowScrollTop, ScrollTopButton } from './scrollTopButton';

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { value, writable: true, configurable: true });
}

function TestHarness({ threshold }: { threshold?: number }) {
  const show = useShowScrollTop(threshold);
  return show ? <ScrollTopButton /> : null;
}

describe('useShowScrollTop', () => {
  afterEach(() => {
    setScrollY(0);
  });

  it('is hidden before the threshold is crossed', () => {
    render(<TestHarness />);
    expect(screen.queryByLabelText('Scroll to top')).not.toBeInTheDocument();
  });

  it('appears once scrollY passes the default threshold', () => {
    render(<TestHarness />);
    setScrollY(301);
    act(() => window.dispatchEvent(new Event('scroll')));
    expect(screen.getByLabelText('Scroll to top')).toBeInTheDocument();
  });

  it('respects a custom threshold', () => {
    render(<TestHarness threshold={50} />);
    setScrollY(60);
    act(() => window.dispatchEvent(new Event('scroll')));
    expect(screen.getByLabelText('Scroll to top')).toBeInTheDocument();
  });
});

describe('ScrollTopButton', () => {
  it('scrolls to top on click by default', () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;
    render(<ScrollTopButton />);
    fireEvent.click(screen.getByLabelText('Scroll to top'));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('calls a custom onClick handler instead of the default when provided', () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;
    const onClick = vi.fn();
    render(<ScrollTopButton onClick={onClick} />);
    fireEvent.click(screen.getByLabelText('Scroll to top'));
    expect(onClick).toHaveBeenCalled();
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('adds the floating modifier class when floating is set', () => {
    render(<ScrollTopButton floating />);
    expect(screen.getByLabelText('Scroll to top')).toHaveClass('scroll-top-btn--floating');
  });
});
