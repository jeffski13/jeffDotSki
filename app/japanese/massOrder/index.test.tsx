/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import MassOrderPage, { DISPLAY_SETTINGS_KEY, FONT_SIZE_KEY } from './index';
import orderOfMass from './order_of_mass';
import { furiganaToKanji } from '../shared/furiganaText';

const lineTexts = (el: Element) => Array.from(el.querySelectorAll('.parallel-text-line')).map((p) => p.textContent);
const allFurigana = orderOfMass.furigana.flat();
const allEnglish = orderOfMass.english.flat();
const sectionCount = orderOfMass.furigana.length;
// Columns of the given channel index, one per section view.
const channelColumns = (container: Element, channel: number) =>
  Array.from(container.querySelectorAll('.parallel-text')).map((view) => view.querySelectorAll('.parallel-text-column')[channel]);

describe('order of mass data', () => {
  it('has the same sections in both languages', () => {
    expect(sectionCount).toBeGreaterThan(1);
    expect(orderOfMass.english).toHaveLength(sectionCount);
  });

  it('has the same number of Japanese and English lines in each section', () => {
    orderOfMass.furigana.forEach((section, s) => {
      expect({ s, length: section.length }).toEqual({ s, length: orderOfMass.english[s].length });
    });
  });

  it('starts every section with a heading', () => {
    orderOfMass.furigana.forEach((section, s) => {
      expect({ s, jp: section[0].startsWith('---'), en: orderOfMass.english[s][0].startsWith('---') }).toEqual({ s, jp: true, en: true });
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
  const englishLine = orderOfMass.english[0][3];
  const kanjiLine = furiganaToKanji(orderOfMass.furigana[0][3]);

  beforeEach(() => window.localStorage.clear());

  it('defaults to Furigana and English side by side', () => {
    const { container } = render(<MassOrderPage />);

    expect(screen.getByLabelText('Furigana')).toBeChecked();
    expect(screen.getByLabelText('Japanese')).not.toBeChecked();
    expect(screen.getByLabelText('English')).toBeChecked();
    expect(screen.getByLabelText('Line by line')).not.toBeChecked();

    expect(container.querySelectorAll('.parallel-text')).toHaveLength(sectionCount);
    expect(container.querySelectorAll('.parallel-text-column')).toHaveLength(sectionCount * 2);
    channelColumns(container, 0).forEach((col, s) => {
      expect(col.querySelectorAll('.parallel-text-line')).toHaveLength(orderOfMass.furigana[s].length);
      expect(col.querySelectorAll('ruby').length).toBeGreaterThan(0);
    });
    expect(channelColumns(container, 1).flatMap(lineTexts)).toEqual(allEnglish);
  });

  it('shows the Japanese column without furigana readings when checked', () => {
    const { container } = render(<MassOrderPage />);
    fireEvent.click(screen.getByLabelText('Japanese'));

    expect(container.querySelectorAll('.parallel-text-column')).toHaveLength(sectionCount * 3);
    const jpColumns = channelColumns(container, 1);
    expect(lineTexts(jpColumns[0])[3]).toBe(kanjiLine);
    jpColumns.forEach((col) => expect(col.querySelectorAll('ruby')).toHaveLength(0));
  });

  it('hides the English column when unchecked', () => {
    const { container } = render(<MassOrderPage />);
    fireEvent.click(screen.getByLabelText('English'));

    expect(container.querySelectorAll('.parallel-text-column')).toHaveLength(sectionCount);
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
