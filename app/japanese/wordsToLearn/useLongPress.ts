import { useEffect, useRef } from 'react';

export const LONG_PRESS_MS = 600;
// finger drift (px) allowed before the press counts as a scroll instead
const MOVE_TOLERANCE_PX = 10;

// onTap fires for a short touch/pen tap that didn't move or turn into a long press;
// mouse clicks are left alone since desktop has its own buttons
export function useLongPress(onLongPress: () => void, onTap?: () => void, delay = LONG_PRESS_MS) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const tapPending = useRef(false);

  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    start.current = null;
  };

  useEffect(() => cancel, []);

  return {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      cancel();
      tapPending.current = e.pointerType === 'touch' || e.pointerType === 'pen';
      start.current = { x: e.clientX, y: e.clientY };
      timer.current = setTimeout(() => {
        timer.current = null;
        tapPending.current = false;
        onLongPress();
      }, delay);
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (!start.current) return;
      if (Math.abs(e.clientX - start.current.x) > MOVE_TOLERANCE_PX || Math.abs(e.clientY - start.current.y) > MOVE_TOLERANCE_PX) {
        tapPending.current = false;
        cancel();
      }
    },
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: () => {
      tapPending.current = false;
      cancel();
    },
    // the tap acts on click (not pointerup) so the follow-up click can't land on whatever the tap opened
    onClick: () => {
      if (!tapPending.current) return;
      tapPending.current = false;
      onTap?.();
    },
    // right-click on desktop (and Android's own long-press event) acts as a long press
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault();
      tapPending.current = false;
      cancel();
      onLongPress();
    },
  };
}
