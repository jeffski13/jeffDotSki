import { useEffect, useRef } from 'react';

export const LONG_PRESS_MS = 600;
// finger drift (px) allowed before the press counts as a scroll instead
const MOVE_TOLERANCE_PX = 10;

export function useLongPress(onLongPress: () => void, delay = LONG_PRESS_MS) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);

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
      start.current = { x: e.clientX, y: e.clientY };
      timer.current = setTimeout(() => {
        timer.current = null;
        onLongPress();
      }, delay);
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (!start.current) return;
      if (Math.abs(e.clientX - start.current.x) > MOVE_TOLERANCE_PX || Math.abs(e.clientY - start.current.y) > MOVE_TOLERANCE_PX) {
        cancel();
      }
    },
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    // keep the mobile long-press context menu from opening over the word
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  };
}
