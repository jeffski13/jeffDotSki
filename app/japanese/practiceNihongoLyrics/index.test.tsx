import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import HomePage from './index';
import {songs} from './index';

const renderComponent = () => render(<MemoryRouter><HomePage /></MemoryRouter>);

describe('PracticeNihongoLyrics', () => {
  it('renders all song titles in the dropdown', () => {
    renderComponent();
    const select = screen.getByRole('combobox');
    const options = Array.from((select as HTMLSelectElement).options).map((o) => o.value);
    expect(options).toEqual(songs.map((s) => s.title));
  });

  it.each(songs)('renders the correct number of lyric rows for $title', (song) => {
    const { container } = renderComponent();
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: song.title } });

    const expectedRows = Math.max(song.jp.length, song.romaji.length);
    expect(container.querySelectorAll('.lyric-pair')).toHaveLength(expectedRows);
  });

  describe('display mode checkboxes', () => {
    const [song] = songs;
    const jpLine = song.jp[0];
    const romajiLine = song.romaji[0];

    beforeEach(() => {
      window.localStorage.clear();
    });

    it('defaults to Furigana and Romaji checked, with Japanese unchecked', () => {
      const { container } = renderComponent();

      expect(screen.getByLabelText('Japanese')).not.toBeChecked();
      expect(screen.getByLabelText('Furigana')).toBeChecked();
      expect(screen.getByLabelText('Romaji')).toBeChecked();

      expect(container.textContent).not.toContain(jpLine);
      expect(container.textContent).toContain(romajiLine);
      expect(container.querySelectorAll('ruby').length).toBeGreaterThan(0);
    });

    it('shows the Japanese column once its checkbox is checked', () => {
      const { container } = renderComponent();

      fireEvent.click(screen.getByLabelText('Japanese'));

      expect(container.textContent).toContain(jpLine);
      expect(container.textContent).toContain(romajiLine);
      expect(container.querySelectorAll('ruby').length).toBeGreaterThan(0);
    });

    it('hides the Romaji column when its checkbox is unchecked, leaving the others', () => {
      const { container } = renderComponent();

      fireEvent.click(screen.getByLabelText('Japanese'));
      fireEvent.click(screen.getByLabelText('Romaji'));

      expect(container.textContent).toContain(jpLine);
      expect(container.textContent).not.toContain(romajiLine);
      expect(container.querySelectorAll('ruby').length).toBeGreaterThan(0);
    });

    it('hides the Furigana column when its checkbox is unchecked, leaving the others', () => {
      const { container } = renderComponent();

      fireEvent.click(screen.getByLabelText('Japanese'));
      fireEvent.click(screen.getByLabelText('Furigana'));

      expect(container.textContent).toContain(jpLine);
      expect(container.textContent).toContain(romajiLine);
      expect(container.querySelectorAll('ruby')).toHaveLength(0);
    });

    it('re-hides a column when its checkbox is unchecked again', () => {
      const { container } = renderComponent();
      const jpCheckbox = screen.getByLabelText('Japanese');

      fireEvent.click(jpCheckbox);
      expect(container.textContent).toContain(jpLine);

      fireEvent.click(jpCheckbox);
      expect(container.textContent).not.toContain(jpLine);
    });

    it('persists display settings to localStorage and restores them on reload', () => {
      const first = renderComponent();

      fireEvent.click(screen.getByLabelText('Japanese'));
      fireEvent.click(screen.getByLabelText('Romaji'));

      const saved = JSON.parse(window.localStorage.getItem('practiceNihongoLyrics.displaySettings')!);
      expect(saved).toEqual({ showJp: true, showFurigana: true, showRomaji: false });

      first.unmount();

      const second = renderComponent();
      expect(screen.getByLabelText('Japanese')).toBeChecked();
      expect(screen.getByLabelText('Furigana')).toBeChecked();
      expect(screen.getByLabelText('Romaji')).not.toBeChecked();
      expect(second.container.textContent).toContain(jpLine);
      expect(second.container.textContent).not.toContain(romajiLine);
    });
  });

  describe('text size controls', () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    it('defaults to 16px', () => {
      renderComponent();
      expect(screen.getByText('16px')).toBeInTheDocument();
    });

    it('increases and decreases the font size, disabling buttons at the limits', () => {
      renderComponent();
      const decrease = screen.getByLabelText('Decrease text size');
      const increase = screen.getByLabelText('Increase text size');

      fireEvent.click(increase);
      expect(screen.getByText('18px')).toBeInTheDocument();

      fireEvent.click(decrease);
      fireEvent.click(decrease);
      expect(screen.getByText('14px')).toBeInTheDocument();

      for (let i = 0; i < 10; i++) fireEvent.click(decrease);
      expect(screen.getByText('12px')).toBeInTheDocument();
      expect(decrease).toBeDisabled();

      for (let i = 0; i < 20; i++) fireEvent.click(increase);
      expect(screen.getByText('32px')).toBeInTheDocument();
      expect(increase).toBeDisabled();
    });

    it('applies the font size to the lyric rows', () => {
      const { container } = renderComponent();
      fireEvent.click(screen.getByLabelText('Increase text size'));

      const row = container.querySelector('.lyric-pair') as HTMLElement;
      expect(row.style.fontSize).toBe('18px');
    });

    it('persists the font size to localStorage and restores it on reload', () => {
      const first = renderComponent();
      fireEvent.click(screen.getByLabelText('Increase text size'));

      expect(window.localStorage.getItem('practiceNihongoLyrics.fontSize')).toBe('18');

      first.unmount();

      renderComponent();
      expect(screen.getByText('18px')).toBeInTheDocument();
    });
  });
});
