/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import {
  ParallelTextView,
  ParallelTextControls,
  isSeparatorLine,
  zipLines,
  type ParallelTextChannel,
} from './parallelText';

describe('isSeparatorLine', () => {
  it('detects lines that start with dashes', () => {
    expect(isSeparatorLine('------------Chorus------------')).toBe(true);
  });

  it('rejects normal, empty and missing lines', () => {
    expect(isSeparatorLine('hello')).toBe(false);
    expect(isSeparatorLine('-- only two')).toBe(false);
    expect(isSeparatorLine('')).toBe(false);
    expect(isSeparatorLine(undefined)).toBe(false);
  });
});

describe('zipLines', () => {
  it('combines parallel arrays into one record per line', () => {
    expect(zipLines({ a: ['1', '2'], b: ['x', 'y'] })).toEqual([
      { a: '1', b: 'x' },
      { a: '2', b: 'y' },
    ]);
  });

  it('pads shorter or missing arrays with empty strings', () => {
    expect(zipLines({ a: ['1', '2', '3'], b: ['x'], c: undefined })).toEqual([
      { a: '1', b: 'x', c: '' },
      { a: '2', b: '', c: '' },
      { a: '3', b: '', c: '' },
    ]);
  });

  it('returns no lines when every array is empty', () => {
    expect(zipLines({ a: [], b: undefined })).toEqual([]);
  });
});

describe('ParallelTextView', () => {
  const lines = zipLines({ jp: ['---A---', 'こんにちは'], en: ['---A---', 'Hello'] });
  type Line = (typeof lines)[number];
  const channels: ParallelTextChannel<Line>[] = [
    { key: 'jp', render: (line) => line.jp },
    { key: 'en', render: (line) => line.en },
  ];
  const isSeparator = (line: Line) => isSeparatorLine(line.jp);

  it('renders one column per channel, each with every line', () => {
    const { container } = render(
      <ParallelTextView lines={lines} channels={channels} lineByLine={false} fontSize={16} isSeparator={isSeparator} />
    );
    const columns = container.querySelectorAll('.parallel-text-column');
    expect(columns).toHaveLength(2);
    expect(Array.from(columns[0].querySelectorAll('.parallel-text-line')).map((p) => p.textContent)).toEqual([
      '---A---',
      'こんにちは',
    ]);
    expect(Array.from(columns[1].querySelectorAll('.parallel-text-line')).map((p) => p.textContent)).toEqual([
      '---A---',
      'Hello',
    ]);
    expect(container.querySelectorAll('.parallel-text-group')).toHaveLength(0);
  });

  it('splits the 12-column grid evenly between channels', () => {
    const { container } = render(
      <ParallelTextView lines={lines} channels={channels} lineByLine={false} fontSize={16} />
    );
    container.querySelectorAll('.parallel-text-column').forEach((col) => expect(col).toHaveClass('col-md-6'));
  });

  it('groups every channel of a line together in line by line mode', () => {
    const { container } = render(
      <ParallelTextView lines={lines} channels={channels} lineByLine fontSize={16} />
    );
    expect(container.querySelectorAll('.parallel-text-column')).toHaveLength(0);
    const groups = container.querySelectorAll('.parallel-text-group');
    expect(groups).toHaveLength(2);
    expect(Array.from(groups[1].querySelectorAll('.parallel-text-line')).map((p) => p.textContent)).toEqual([
      'こんにちは',
      'Hello',
    ]);
  });

  it('marks separator lines', () => {
    const { container } = render(
      <ParallelTextView lines={lines} channels={channels} lineByLine={false} fontSize={16} isSeparator={isSeparator} />
    );
    const separators = container.querySelectorAll('.parallel-text-separator');
    expect(separators).toHaveLength(2);
    separators.forEach((p) => expect(p.textContent).toBe('---A---'));
  });

  it('applies the font size', () => {
    const { container } = render(
      <ParallelTextView lines={lines} channels={channels} lineByLine={false} fontSize={22} />
    );
    expect((container.querySelector('.parallel-text') as HTMLElement).style.fontSize).toBe('22px');
  });
});

describe('ParallelTextControls', () => {
  it('renders the leading content, checkboxes and text size control', () => {
    const onChange = vi.fn();
    const onFontSizeChange = vi.fn();
    render(
      <ParallelTextControls
        leading={<span>Title here</span>}
        options={[
          { id: 'opt-a', label: 'Option A', checked: true, onChange },
          { id: 'opt-b', label: 'Option B', checked: false, disabled: true, onChange },
        ]}
        fontSize={16}
        onFontSizeChange={onFontSizeChange}
      />
    );

    expect(screen.getByText('Title here')).toBeInTheDocument();
    expect(screen.getByLabelText('Option A')).toBeChecked();
    expect(screen.getByLabelText('Option B')).not.toBeChecked();
    expect(screen.getByLabelText('Option B')).toBeDisabled();

    fireEvent.click(screen.getByLabelText('Option A'));
    expect(onChange).toHaveBeenCalledWith(false);

    fireEvent.click(screen.getByLabelText('Increase text size'));
    expect(onFontSizeChange).toHaveBeenCalledWith(18);
  });

  it('omits the leading column when there is no leading content', () => {
    const { container } = render(
      <ParallelTextControls options={[]} fontSize={16} onFontSizeChange={() => {}} />
    );
    expect(container.querySelector('.parallel-text-leading-col')).toBeNull();
  });
});
