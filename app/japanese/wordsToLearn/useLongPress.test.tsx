/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import { LONG_PRESS_MS, useLongPress } from './useLongPress';

function Target({ onLongPress, onTap }: { onLongPress: () => void; onTap?: () => void }) {
  return <div data-testid="target" {...useLongPress(onLongPress, onTap)} />;
}

const tap = (pointerType: string, moveY = 0) => {
  const target = screen.getByTestId('target');
  fireEvent.pointerDown(target, { button: 0, pointerType, clientX: 0, clientY: 0 });
  if (moveY) fireEvent.pointerMove(target, { pointerType, clientX: 0, clientY: moveY });
  fireEvent.pointerUp(target, { pointerType });
  fireEvent.click(target);
};

// jsdom has no PointerEvent, so without this button/clientX are dropped from the events
if (!window.PointerEvent) {
  window.PointerEvent = class extends MouseEvent {
    pointerType: string;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerType = init.pointerType ?? '';
    }
  } as typeof PointerEvent;
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

  it('fires on right-click and blocks the browser context menu', () => {
    const onLongPress = vi.fn();
    render(<Target onLongPress={onLongPress} />);

    const notPrevented = fireEvent.contextMenu(screen.getByTestId('target'));
    expect(notPrevented).toBe(false);
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('fires only once when a held press also triggers a context menu event', () => {
    const onLongPress = vi.fn();
    render(<Target onLongPress={onLongPress} />);

    fireEvent.pointerDown(screen.getByTestId('target'), { button: 0, clientX: 0, clientY: 0 });
    vi.advanceTimersByTime(LONG_PRESS_MS / 2);
    fireEvent.contextMenu(screen.getByTestId('target'));
    vi.advanceTimersByTime(LONG_PRESS_MS * 2);
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('calls onTap for a short touch tap', () => {
    const onLongPress = vi.fn();
    const onTap = vi.fn();
    render(<Target onLongPress={onLongPress} onTap={onTap} />);

    tap('touch');
    expect(onTap).toHaveBeenCalledTimes(1);
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('does not call onTap for a mouse click', () => {
    const onTap = vi.fn();
    render(<Target onLongPress={vi.fn()} onTap={onTap} />);

    tap('mouse');
    expect(onTap).not.toHaveBeenCalled();
  });

  it('does not call onTap when the finger moved (scrolling)', () => {
    const onTap = vi.fn();
    render(<Target onLongPress={vi.fn()} onTap={onTap} />);

    tap('touch', 40);
    expect(onTap).not.toHaveBeenCalled();
  });

  it('does not call onTap after a long press', () => {
    const onLongPress = vi.fn();
    const onTap = vi.fn();
    render(<Target onLongPress={onLongPress} onTap={onTap} />);

    const target = screen.getByTestId('target');
    fireEvent.pointerDown(target, { button: 0, pointerType: 'touch', clientX: 0, clientY: 0 });
    vi.advanceTimersByTime(LONG_PRESS_MS);
    fireEvent.pointerUp(target, { pointerType: 'touch' });
    fireEvent.click(target);
    expect(onLongPress).toHaveBeenCalledTimes(1);
    expect(onTap).not.toHaveBeenCalled();
  });
});
