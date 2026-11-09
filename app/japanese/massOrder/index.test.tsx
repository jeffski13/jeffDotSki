/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import MassOrderPage, { DISPLAY_SETTINGS_KEY, FONT_SIZE_KEY } from './index';
import orderOfMass from './order_of_mass';
import { furiganaToKanji } from '../shared/furiganaText';

const lineTexts = (el: Element) => Array.from(el.querySelectorAll('.parallel-text-line')).map((p) => p.textContent);

describe('order of mass data', () => {
  it('has the same number of Japanese and English lines', () => {
    expect(orderOfMass.furigana.length).toBe(orderOfMass.english.length);
  });

  it('has section separators on the same lines in both languages', () => {
    orderOfMass.furigana.forEach((line, i) => {
      expect({ i, separator: line.startsWith('---') }).toEqual({
        i,
        separator: orderOfMass.english[i].startsWith('---'),
      });
    });
  });
});

describe('MassOrderPage', () => {
  const englishLine = orderOfMass.english[3];
  const kanjiLine = furiganaToKanji(orderOfMass.furigana[3]);

  beforeEach(() => window.localStorage.clear());

  it('defaults to Furigana and English side by side', () => {
    const { container } = render(<MassOrderPage />);

    expect(screen.getByLabelText('Furigana')).toBeChecked();
    expect(screen.getByLabelText('Japanese')).not.toBeChecked();
    expect(screen.getByLabelText('English')).toBeChecked();
    expect(screen.getByLabelText('Line by line')).not.toBeChecked();

    const columns = container.querySelectorAll('.parallel-text-column');
    expect(columns).toHaveLength(2);
    columns.forEach((col) => {
      expect(col.querySelectorAll('.parallel-text-line')).toHaveLength(orderOfMass.furigana.length);
    });
    expect(columns[0].querySelectorAll('ruby').length).toBeGreaterThan(0);
    expect(lineTexts(columns[1])).toEqual(orderOfMass.english);
  });

  it('shows the Japanese column without furigana readings when checked', () => {
    const { container } = render(<MassOrderPage />);
    fireEvent.click(screen.getByLabelText('Japanese'));

    const columns = container.querySelectorAll('.parallel-text-column');
    expect(columns).toHaveLength(3);
    expect(lineTexts(columns[1])[3]).toBe(kanjiLine);
    expect(columns[1].querySelectorAll('ruby')).toHaveLength(0);
  });

  it('hides the English column when unchecked', () => {
    const { container } = render(<MassOrderPage />);
    fireEvent.click(screen.getByLabelText('English'));

    expect(container.querySelectorAll('.parallel-text-column')).toHaveLength(1);
    expect(container.textContent).not.toContain(englishLine);
  });

  it('interleaves the languages per line in line by line mode', () => {
    const { container } = render(<MassOrderPage />);
    fireEvent.click(screen.getByLabelText('Line by line'));

    expect(container.querySelectorAll('.parallel-text-column')).toHaveLength(0);
    const groups = container.querySelectorAll('.parallel-text-group');
    expect(groups).toHaveLength(orderOfMass.furigana.length);
    const group = groups[3].querySelectorAll('.parallel-text-line');
    expect(group).toHaveLength(2);
    expect(group[0].querySelector('ruby')).not.toBeNull();
    expect(group[1].textContent).toBe(englishLine);
  });

  it('marks section headings as separators', () => {
    const { container } = render(<MassOrderPage />);
    const separatorCount = orderOfMass.furigana.filter((l) => l.startsWith('---')).length;
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
    expect((second.container.querySelector('.parallel-text') as HTMLElement).style.fontSize).toBe('18px');
  });
});
