/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import { LONG_PRESS_MS, useLongPress } from './useLongPress';

function Target({ onLongPress }: { onLongPress: () => void }) {
  return <div data-testid="target" {...useLongPress(onLongPress)} />;
}

// jsdom has no PointerEvent, so without this button/clientX are dropped from the events
if (!window.PointerEvent) {
  window.PointerEvent = class extends MouseEvent {} as typeof PointerEvent;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useLongPress', () => {
  it('fires after the press is held long enough', () => {
    const onLongPress = vi.fn();
    render(<Target onLongPress={onLongPress} />);

    fireEvent.pointerDown(screen.getByTestId('target'), { button: 0, clientX: 0, clientY: 0 });
    vi.advanceTimersByTime(LONG_PRESS_MS - 1);
    expect(onLongPress).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire on a short tap', () => {
    const onLongPress = vi.fn();
    render(<Target onLongPress={onLongPress} />);

    fireEvent.pointerDown(screen.getByTestId('target'), { button: 0 });
    fireEvent.pointerUp(screen.getByTestId('target'));
    vi.advanceTimersByTime(LONG_PRESS_MS * 2);
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('cancels when the finger moves (scrolling)', () => {
    const onLongPress = vi.fn();
    render(<Target onLongPress={onLongPress} />);

    fireEvent.pointerDown(screen.getByTestId('target'), { button: 0, clientX: 0, clientY: 0 });
    fireEvent.pointerMove(screen.getByTestId('target'), { clientX: 0, clientY: 40 });
    vi.advanceTimersByTime(LONG_PRESS_MS * 2);
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('ignores non-primary buttons', () => {
    const onLongPress = vi.fn();
    render(<Target onLongPress={onLongPress} />);

    fireEvent.pointerDown(screen.getByTestId('target'), { button: 2 });
    vi.advanceTimersByTime(LONG_PRESS_MS * 2);
    expect(onLongPress).not.toHaveBeenCalled();
  });
});
