import { useState, useEffect } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import './textSizeControl.css';

export const DEFAULT_MIN_FONT_SIZE = 12;
export const DEFAULT_MAX_FONT_SIZE = 48;
export const DEFAULT_FONT_SIZE_STEP = 2;

export function clampFontSize(size: number, min: number = DEFAULT_MIN_FONT_SIZE, max: number = DEFAULT_MAX_FONT_SIZE): number {
  return Math.min(max, Math.max(min, size));
}

function loadFontSize(storageKey: string, defaultSize: number, min: number, max: number): number {
  if (typeof window === 'undefined') return defaultSize;
  try {
    const raw = window.localStorage.getItem(storageKey);
    const parsed = raw === null ? NaN : Number(raw);
    return Number.isFinite(parsed) ? clampFontSize(parsed, min, max) : defaultSize;
  } catch {
    return defaultSize;
  }
}

type UseTextSizeOptions = {
  defaultSize?: number;
  min?: number;
  max?: number;
};

// Persists the chosen text size to localStorage under `storageKey` so it's remembered per-page.
export function useTextSize(storageKey: string, options?: UseTextSizeOptions) {
  const { defaultSize = 16, min = DEFAULT_MIN_FONT_SIZE, max = DEFAULT_MAX_FONT_SIZE } = options ?? {};
  const [fontSize, setFontSize] = useState<number>(() => loadFontSize(storageKey, defaultSize, min, max));

  useEffect(() => {
    window.localStorage.setItem(storageKey, String(fontSize));
  }, [storageKey, fontSize]);

  return [fontSize, setFontSize] as const;
}

type TextSizeControlProps = {
  fontSize: number;
  onChange: (size: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

export function TextSizeControl({
  fontSize,
  onChange,
  min = DEFAULT_MIN_FONT_SIZE,
  max = DEFAULT_MAX_FONT_SIZE,
  step = DEFAULT_FONT_SIZE_STEP,
}: TextSizeControlProps) {
  return (
    <ButtonGroup aria-label="Text size" className="text-size-control">
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => onChange(clampFontSize(fontSize - step, min, max))}
        disabled={fontSize <= min}
        aria-label="Decrease text size"
      >
        A-
      </Button>
      <Button variant="outline-secondary" size="sm" disabled>
        {fontSize}px
      </Button>
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => onChange(clampFontSize(fontSize + step, min, max))}
        disabled={fontSize >= max}
        aria-label="Increase text size"
      >
        A+
      </Button>
    </ButtonGroup>
  );
}
