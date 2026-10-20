import { useEffect, useRef, useState, type CSSProperties } from 'react';

// pointer travel (px) before a press on a row turns into a drag
const DRAG_THRESHOLD_PX = 5;

// Rows that can be dragged carry data-drag-id; a press anywhere on them starts a drag
// with a mouse, but only on a [data-drag-handle] with touch/pen so the page can scroll.
export const DRAG_ID_ATTR = 'data-drag-id';
export const DRAG_HANDLE_ATTR = 'data-drag-handle';

interface DragState {
  id: string;
  from: number;
  to: number;
  offset: number;
  height: number;
}

// Where the dragged row lands: after every other row whose center is above its own.
export function dropIndex(centers: number[], from: number, draggedCenter: number): number {
  return centers.filter((center, i) => i !== from && center < draggedCenter).length;
}

// How far a non-dragged row slides to make room while the dragged row hovers at `to`.
export function dragShift(index: number, from: number, to: number, height: number): number {
  if (from < to && index > from && index <= to) return -height;
  if (to < from && index >= to && index < from) return height;
  return 0;
}

export function useDragReorder<T extends HTMLElement>(ids: string[], onDrop: (id: string, toIndex: number) => void) {
  const listRef = useRef<T>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const stopListening = useRef<(() => void) | null>(null);

  useEffect(() => () => stopListening.current?.(), []);

  const onPointerDown = (e: React.PointerEvent, id: string) => {
    if (e.button !== 0 || !listRef.current) return;
    const target = e.target as HTMLElement;
    const onHandle = target.closest(`[${DRAG_HANDLE_ATTR}]`) !== null;
    if (!onHandle && (e.pointerType !== 'mouse' || target.closest('button, a, input'))) return;

    const from = ids.indexOf(id);
    const rows = Array.from(listRef.current.querySelectorAll<HTMLElement>(`[${DRAG_ID_ATTR}]`));
    if (from < 0 || rows.length !== ids.length) return;
    const rects = rows.map((row) => row.getBoundingClientRect());
    const centers = rects.map((rect) => rect.top + rect.height / 2);
    const startY = e.clientY;
    const pointerId = e.pointerId;
    let latest: DragState | null = null;

    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      const offset = ev.clientY - startY;
      if (!latest && Math.abs(offset) < DRAG_THRESHOLD_PX) return;
      latest = { id, from, offset, height: rects[from].height, to: dropIndex(centers, from, centers[from] + offset) };
      setDrag(latest);
    };
    const end = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      stop();
      setDrag(null);
      if (ev.type === 'pointerup' && latest && latest.to !== from) onDrop(id, latest.to);
    };
    const stop = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      stopListening.current = null;
    };

    stopListening.current?.();
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    stopListening.current = stop;
  };

  const rowStyle = (id: string, index: number): CSSProperties | undefined => {
    if (!drag) return undefined;
    const shift = id === drag.id ? drag.offset : dragShift(index, drag.from, drag.to, drag.height);
    return shift ? { transform: `translateY(${shift}px)` } : undefined;
  };

  return { listRef, draggingId: drag?.id ?? null, onPointerDown, rowStyle };
}
