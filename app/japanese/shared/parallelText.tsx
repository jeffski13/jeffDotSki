import { useRef, type ReactNode } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { TextSizeControl } from './textSizeControl';
import { charFromPoint, selectWordAt } from './wordSelect';
import './displayControls.css';
import './parallelText.css';

// One kind of text shown for every line (e.g. furigana, romaji, English).
export type ParallelTextChannel<T> = {
  key: string;
  render: (line: T, idx: number) => ReactNode;
};

// Lines starting with dashes (e.g. "------------Chorus------------") are section separators.
export function isSeparatorLine(text: string | undefined): boolean {
  return !!text && text.startsWith('---');
}

// Turns parallel arrays ({ jp: [...], romaji: [...] }) into one record per line, padding
// shorter arrays with "" so every line has a value for every key.
export function zipLines<K extends string>(columns: Record<K, string[] | undefined>): Record<K, string>[] {
  const keys = Object.keys(columns) as K[];
  const length = Math.max(0, ...keys.map((k) => columns[k]?.length ?? 0));
  return Array.from({ length }, (_, i) => {
    const line = {} as Record<K, string>;
    for (const k of keys) line[k] = columns[k]?.[i] ?? '';
    return line;
  });
}

type ParallelTextViewProps<T> = {
  lines: T[];
  channels: ParallelTextChannel<T>[];
  // true: each line's channels are stacked together. false: each channel is its own column.
  lineByLine: boolean;
  fontSize: number;
  isSeparator?: (line: T) => boolean;
};

// Shows the same text in several forms, either side by side in columns or interleaved line by line.
// Tapping a kanji selects the word around it (kanji run + trailing hiragana) so it can be looked up.
export function ParallelTextView<T>({ lines, channels, lineByLine, fontSize, isSeparator }: ParallelTextViewProps<T>) {
  const lastAutoSelection = useRef<string | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const line = (e.target as HTMLElement).closest?.('.parallel-text-line');
    if (!line) return;
    const selection = window.getSelection();
    // Don't clobber a selection the user just made by dragging.
    if (selection && !selection.isCollapsed && selection.toString() !== lastAutoSelection.current) return;
    const hit = charFromPoint(document, e.clientX, e.clientY);
    if (!hit || !line.contains(hit.node)) return;
    if (selectWordAt(line, hit.node, hit.offset)) {
      lastAutoSelection.current = window.getSelection()?.toString() ?? null;
    }
  };

  const lineClass = (line: T) =>
    isSeparator?.(line) ? 'parallel-text-line parallel-text-separator' : 'parallel-text-line';

  const colWidth = channels.length > 0 ? Math.floor(12 / channels.length) : 12;

  return (
    <div className="parallel-text" style={{ fontSize: `${fontSize}px` }} onClick={handleClick}>
      {lineByLine ? (
        lines.map((line, idx) => (
          <div key={idx} className="parallel-text-group">
            {channels.map((channel) => (
              <p key={channel.key} className={lineClass(line)}>
                {channel.render(line, idx)}
              </p>
            ))}
          </div>
        ))
      ) : (
        <Row className="parallel-text-columns">
          {channels.map((channel) => (
            <Col key={channel.key} xs={12} md={colWidth} className="parallel-text-column">
              {lines.map((line, idx) => (
                <p key={idx} className={lineClass(line)}>
                  {channel.render(line, idx)}
                </p>
              ))}
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export type ParallelTextOption = {
  id: string;
  label: ReactNode;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

type ParallelTextControlsProps = {
  // Shown at the start of the controls row, e.g. a song picker or a page title.
  leading?: ReactNode;
  options: ParallelTextOption[];
  fontSize: number;
  onFontSizeChange: (size: number) => void;
};

// The controls row above a ParallelTextView: optional leading content, display checkboxes and text size.
export function ParallelTextControls({ leading, options, fontSize, onFontSizeChange }: ParallelTextControlsProps) {
  return (
    <>
      <Row className="mb-3 align-items-center parallel-text-controls japanese-display-controls">
        {leading && (
          <Col xs="auto" className="parallel-text-leading-col">
            {leading}
          </Col>
        )}
        <Col xs="auto" className="parallel-text-checkbox-col">
          <div className="parallel-text-checkbox-group">
            {options.map((option) => (
              <Form.Check
                key={option.id}
                type="checkbox"
                id={option.id}
                label={option.label}
                checked={option.checked}
                disabled={option.disabled}
                onChange={(e) => option.onChange(e.target.checked)}
              />
            ))}
          </div>
        </Col>
        <Col xs="auto" className="parallel-text-size-col">
          <TextSizeControl fontSize={fontSize} onChange={onFontSizeChange} />
        </Col>
      </Row>
      <hr className="japanese-controls-divider" />
    </>
  );
}
