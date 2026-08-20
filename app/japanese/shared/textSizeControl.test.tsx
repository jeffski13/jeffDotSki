/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import { clampFontSize, useTextSize, TextSizeControl } from './textSizeControl';

describe('clampFontSize', () => {
  it('leaves a size within the default bounds untouched', () => {
    expect(clampFontSize(20)).toBe(20);
  });

  it('clamps to the default min/max', () => {
    expect(clampFontSize(0)).toBe(12);
    expect(clampFontSize(1000)).toBe(48);
  });

  it('clamps to custom min/max when provided', () => {
    expect(clampFontSize(5, 10, 30)).toBe(10);
    expect(clampFontSize(50, 10, 30)).toBe(30);
  });
});

function TestHarness({ storageKey }: { storageKey: string }) {
  const [fontSize, setFontSize] = useTextSize(storageKey);
  return <TextSizeControl fontSize={fontSize} onChange={setFontSize} />;
}

describe('TextSizeControl + useTextSize', () => {
  const KEY = 'test.fontSize';

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('defaults to 16px when nothing is stored', () => {
    render(<TestHarness storageKey={KEY} />);
    expect(screen.getByText('16px')).toBeInTheDocument();
  });

  it('restores a previously stored size', () => {
    window.localStorage.setItem(KEY, '24');
    render(<TestHarness storageKey={KEY} />);
    expect(screen.getByText('24px')).toBeInTheDocument();
  });

  it('ignores an invalid stored value and falls back to the default', () => {
    window.localStorage.setItem(KEY, 'not-a-number');
    render(<TestHarness storageKey={KEY} />);
    expect(screen.getByText('16px')).toBeInTheDocument();
  });

  it('increases and decreases the font size, disabling buttons at the limits', () => {
    render(<TestHarness storageKey={KEY} />);
    const decrease = screen.getByLabelText('Decrease text size');
    const increase = screen.getByLabelText('Increase text size');

    fireEvent.click(increase);
    expect(screen.getByText('18px')).toBeInTheDocument();

    fireEvent.click(decrease);
    fireEvent.click(decrease);
    expect(screen.getByText('14px')).toBeInTheDocument();

    for (let i = 0; i < 10; i++) fireEvent.click(decrease);
    expect(screen.getByText('12px')).toBeInTheDocument();
    expect(decrease).toBeDisabled();

    for (let i = 0; i < 20; i++) fireEvent.click(increase);
    expect(screen.getByText('48px')).toBeInTheDocument();
    expect(increase).toBeDisabled();
  });

  it('persists the font size to localStorage under the given key', () => {
    render(<TestHarness storageKey={KEY} />);
    fireEvent.click(screen.getByLabelText('Increase text size'));

    expect(window.localStorage.getItem(KEY)).toBe('18');
  });
});
