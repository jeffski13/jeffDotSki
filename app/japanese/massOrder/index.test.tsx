/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import MassOrderPage, { DISPLAY_SETTINGS_KEY, FONT_SIZE_KEY } from './index';
import orderOfMass from './order_of_mass';
import { furiganaToKanji } from '../shared/furiganaText';

const lineTexts = (el: Element) => Array.from(el.querySelectorAll('.parallel-text-line')).map((p) => p.textContent);
const allFurigana = orderOfMass.furigana.flat(2);
const allEnglish = orderOfMass.english.flat(2);
const subsectionsFurigana = orderOfMass.furigana.flat();
const sectionCount = orderOfMass.furigana.length;
const viewCount = subsectionsFurigana.length;
// Columns of the given channel index, one per subsection view.
const channelColumns = (container: Element, channel: number) =>
  Array.from(container.querySelectorAll('.parallel-text')).map((view) => view.querySelectorAll('.parallel-text-column')[channel]);

describe('order of mass data', () => {
  it('has the same sections in both languages', () => {
    expect(sectionCount).toBeGreaterThan(1);
    expect(orderOfMass.english).toHaveLength(sectionCount);
  });

  it('has the same subsections and line counts in both languages', () => {
    const shape = (sections: string[][][]) => sections.map((subs) => subs.map((lines) => lines.length));
    expect(shape(orderOfMass.english)).toEqual(shape(orderOfMass.furigana));
  });

  it('starts every subsection with a heading', () => {
    orderOfMass.furigana.forEach((subs, s) => {
      subs.forEach((lines, sub) => {
        const en = orderOfMass.english[s][sub];
        expect({ s, sub, jp: lines[0].startsWith('---'), en: en[0].startsWith('---') }).toEqual({ s, sub, jp: true, en: true });
      });
    });
  });

  it('has section separators on the same lines in both languages', () => {
    allFurigana.forEach((line, i) => {
      expect({ i, separator: line.startsWith('---') }).toEqual({
        i,
        separator: allEnglish[i].startsWith('---'),
      });
    });
  });
});

describe('MassOrderPage', () => {
  // Line 1 of the "2. Greeting" subsection.
  const englishLine = orderOfMass.english[0][1][1];
  const kanjiLine = furiganaToKanji(orderOfMass.furigana[0][1][1]);

  beforeEach(() => window.localStorage.clear());

  it('defaults to Furigana and English side by side', () => {
    const { container } = render(<MassOrderPage />);

    expect(screen.getByLabelText('Furigana')).toBeChecked();
    expect(screen.getByLabelText('Japanese')).not.toBeChecked();
    expect(screen.getByLabelText('English')).toBeChecked();
    expect(screen.getByLabelText('Line by line')).not.toBeChecked();

    expect(container.querySelectorAll('.mass-order-section')).toHaveLength(sectionCount);
    expect(container.querySelectorAll('.parallel-text')).toHaveLength(viewCount);
    expect(container.querySelectorAll('.parallel-text-column')).toHaveLength(viewCount * 2);
    channelColumns(container, 0).forEach((col, v) => {
      expect(col.querySelectorAll('.parallel-text-line')).toHaveLength(subsectionsFurigana[v].length);
    });
    expect(channelColumns(container, 0)[1].querySelectorAll('ruby').length).toBeGreaterThan(0);
    expect(channelColumns(container, 1).flatMap(lineTexts)).toEqual(allEnglish);
  });

  it('shows the Japanese column without furigana readings when checked', () => {
    const { container } = render(<MassOrderPage />);
    fireEvent.click(screen.getByLabelText('Japanese'));

    expect(container.querySelectorAll('.parallel-text-column')).toHaveLength(viewCount * 3);
    const jpColumns = channelColumns(container, 1);
    expect(lineTexts(jpColumns[1])[1]).toBe(kanjiLine);
    jpColumns.forEach((col) => expect(col.querySelectorAll('ruby')).toHaveLength(0));
  });

  it('hides the English column when unchecked', () => {
    const { container } = render(<MassOrderPage />);
    fireEvent.click(screen.getByLabelText('English'));

    expect(container.querySelectorAll('.parallel-text-column')).toHaveLength(viewCount);
    expect(container.textContent).not.toContain(englishLine);
  });

  it('interleaves the languages per line in line by line mode', () => {
    const { container } = render(<MassOrderPage />);
    fireEvent.click(screen.getByLabelText('Line by line'));

    expect(container.querySelectorAll('.parallel-text-column')).toHaveLength(0);
    const groups = container.querySelectorAll('.parallel-text-group');
    expect(groups).toHaveLength(allFurigana.length);
    const group = groups[3].querySelectorAll('.parallel-text-line');
    expect(group).toHaveLength(2);
    expect(group[0].querySelector('ruby')).not.toBeNull();
    expect(group[1].textContent).toBe(englishLine);
  });

  it('marks section headings as separators', () => {
    const { container } = render(<MassOrderPage />);
    const separatorCount = allFurigana.filter((l) => l.startsWith('---')).length;
    expect(container.querySelectorAll('.parallel-text-separator')).toHaveLength(separatorCount * 2);
  });

  it('remembers display settings and text size across reloads', () => {
    const first = render(<MassOrderPage />);
    fireEvent.click(screen.getByLabelText('Japanese'));
    fireEvent.click(screen.getByLabelText('Increase text size'));

    expect(JSON.parse(window.localStorage.getItem(DISPLAY_SETTINGS_KEY)!)).toEqual({
      showFurigana: true,
      showJp: true,
      showEnglish: true,
      lineByLine: false,
    });
    expect(window.localStorage.getItem(FONT_SIZE_KEY)).toBe('18');

    first.unmount();
    const second = render(<MassOrderPage />);
    expect(screen.getByLabelText('Japanese')).toBeChecked();
    expect(screen.getByText('18px')).toBeInTheDocument();
    second.container.querySelectorAll('.parallel-text').forEach((view) => {
      expect((view as HTMLElement).style.fontSize).toBe('18px');
    });
  });
});
