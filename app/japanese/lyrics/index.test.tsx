/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';
import HomePage from './index';
import {songs, songsByKey, MAX_FONT_SIZE} from './index';

const renderComponent = () => render(<MemoryRouter><HomePage /></MemoryRouter>);

describe('PracticeNihongoLyrics', () => {
  it('renders all song titles in the dropdown', () => {
    renderComponent();
    const select = screen.getByRole('combobox');
    const options = Array.from((select as HTMLSelectElement).options).map((o) => o.value);
    expect(options).toEqual(songs.map((s) => s.title));
  });

  it.each(songs)('renders the correct number of lyric lines for $title', (song) => {
    const { container } = renderComponent();
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: song.title } });

    const expectedRows = Math.max(song.jp.length, song.romaji.length);
    // Default display settings show only the Furigana column, skipped if the song has no furigana lines.
    const expectedColumns = Number(!!song.furigana?.length);
    expect(container.querySelectorAll('.parallel-text-column')).toHaveLength(expectedColumns);
    container.querySelectorAll('.parallel-text-column').forEach((col) => {
      expect(col.querySelectorAll('.parallel-text-line')).toHaveLength(expectedRows);
    });
  });

  describe('display mode checkboxes', () => {
    const song = songs.find((s) => s.title === 'Bay City (Bay City)')!;
    const jpLine = song.jp[0];
    const romajiLine = song.romaji[0];

    beforeEach(() => {
      window.localStorage.clear();
    });

    it('defaults to only Furigana checked, with Japanese and Romaji unchecked', () => {
      const { container } = renderComponent();
      fireEvent.change(screen.getByRole('combobox'), { target: { value: song.title } });

      expect(screen.getByLabelText('Japanese')).not.toBeChecked();
      expect(screen.getByLabelText('Furigana')).toBeChecked();
      expect(screen.getByLabelText('Romaji')).not.toBeChecked();

      expect(container.textContent).not.toContain(jpLine);
      expect(container.textContent).not.toContain(romajiLine);
      expect(container.querySelectorAll('ruby').length).toBeGreaterThan(0);
    });

    it('shows the Japanese column once its checkbox is checked', () => {
      const { container } = renderComponent();
      fireEvent.change(screen.getByRole('combobox'), { target: { value: song.title } });

      fireEvent.click(screen.getByLabelText('Japanese'));

      expect(container.textContent).toContain(jpLine);
      expect(container.textContent).not.toContain(romajiLine);
      expect(container.querySelectorAll('ruby').length).toBeGreaterThan(0);
    });

    it('shows the Romaji column once its checkbox is checked, leaving the others', () => {
      const { container } = renderComponent();
      fireEvent.change(screen.getByRole('combobox'), { target: { value: song.title } });

      fireEvent.click(screen.getByLabelText('Japanese'));
      fireEvent.click(screen.getByLabelText('Romaji'));

      expect(container.textContent).toContain(jpLine);
      expect(container.textContent).toContain(romajiLine);
      expect(container.querySelectorAll('ruby').length).toBeGreaterThan(0);
    });

    it('hides the Furigana column when its checkbox is unchecked, leaving the others', () => {
      const { container } = renderComponent();
      fireEvent.change(screen.getByRole('combobox'), { target: { value: song.title } });

      fireEvent.click(screen.getByLabelText('Japanese'));
      fireEvent.click(screen.getByLabelText('Furigana'));

      expect(container.textContent).toContain(jpLine);
      expect(container.textContent).not.toContain(romajiLine);
      expect(container.querySelectorAll('ruby')).toHaveLength(0);
    });

    it('re-hides a column when its checkbox is unchecked again', () => {
      const { container } = renderComponent();
      fireEvent.change(screen.getByRole('combobox'), { target: { value: song.title } });
      const jpCheckbox = screen.getByLabelText('Japanese');

      fireEvent.click(jpCheckbox);
      expect(container.textContent).toContain(jpLine);

      fireEvent.click(jpCheckbox);
      expect(container.textContent).not.toContain(jpLine);
    });

    it('persists display settings to localStorage and restores them on reload', () => {
      const first = renderComponent();
      fireEvent.change(screen.getByRole('combobox'), { target: { value: song.title } });

      fireEvent.click(screen.getByLabelText('Japanese'));
      fireEvent.click(screen.getByLabelText('Romaji'));

      const saved = JSON.parse(window.localStorage.getItem('practiceNihongoLyrics.displaySettings')!);
      expect(saved).toEqual({ showJp: true, showFurigana: true, showRomaji: true, lineByLine: false });

      first.unmount();

      const second = renderComponent();
      expect(screen.getByLabelText('Japanese')).toBeChecked();
      expect(screen.getByLabelText('Furigana')).toBeChecked();
      expect(screen.getByLabelText('Romaji')).toBeChecked();
      expect(second.container.textContent).toContain(jpLine);
      expect(second.container.textContent).toContain(romajiLine);
    });
  });

  describe('disabling checkboxes for empty lyric arrays', () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    it.each(songs)('disables checkboxes whose arrays are empty for $title', (song) => {
      renderComponent();
      fireEvent.change(screen.getByRole('combobox'), { target: { value: song.title } });

      expect((screen.getByLabelText('Japanese') as HTMLInputElement).disabled).toBe(song.jp.length === 0);
      expect((screen.getByLabelText('Romaji') as HTMLInputElement).disabled).toBe(song.romaji.length === 0);
      expect((screen.getByLabelText('Furigana') as HTMLInputElement).disabled).toBe(!song.furigana?.length);
    });

    it('disables Romaji and hides its column for a song with no romaji lines', () => {
      const song = songsByKey.aitai;
      expect(song.romaji).toHaveLength(0);

      const { container } = renderComponent();
      fireEvent.change(screen.getByRole('combobox'), { target: { value: song.title } });

      expect(screen.getByLabelText('Romaji')).toBeDisabled();
      expect(screen.getByLabelText('Japanese')).toBeEnabled();
      // Only the Furigana column remains.
      expect(container.querySelectorAll('.parallel-text-column')).toHaveLength(1);
    });

    it('enables Romaji again when switching to a song that has romaji lines', () => {
      renderComponent();
      fireEvent.change(screen.getByRole('combobox'), { target: { value: songsByKey.aitai.title } });
      expect(screen.getByLabelText('Romaji')).toBeDisabled();

      fireEvent.change(screen.getByRole('combobox'), { target: { value: songsByKey.bayCity.title } });
      expect(screen.getByLabelText('Romaji')).toBeEnabled();
      expect(screen.getByLabelText('Romaji')).not.toBeChecked();
    });
  });

  describe('line by line mode', () => {
    const song = songs.find((s) => s.title === 'Bay City (Bay City)')!;
    const jpLine = song.jp[0];
    const romajiLine = song.romaji[0];

    beforeEach(() => {
      window.localStorage.clear();
    });

    it('defaults to unchecked, showing language options grouped into columns', () => {
      const { container } = renderComponent();
      fireEvent.change(screen.getByRole('combobox'), { target: { value: song.title } });

      expect(screen.getByLabelText('Line by line')).not.toBeChecked();
      expect(container.querySelectorAll('.parallel-text-column').length).toBeGreaterThan(0);
      expect(container.querySelectorAll('.parallel-text-group')).toHaveLength(0);
    });

    it('interleaves furigana, kanji, and romaji per line when checked', () => {
      const { container } = renderComponent();
      fireEvent.change(screen.getByRole('combobox'), { target: { value: song.title } });

      fireEvent.click(screen.getByLabelText('Japanese'));
      fireEvent.click(screen.getByLabelText('Romaji'));
      fireEvent.click(screen.getByLabelText('Line by line'));

      expect(container.querySelectorAll('.parallel-text-column')).toHaveLength(0);
      const groups = container.querySelectorAll('.parallel-text-group');
      expect(groups.length).toBeGreaterThan(0);

      const firstGroupLines = groups[0].querySelectorAll('.parallel-text-line');
      expect(firstGroupLines).toHaveLength(3);
      expect(firstGroupLines[0].querySelector('ruby')).not.toBeNull();
      expect(firstGroupLines[1].textContent).toBe(jpLine);
      expect(firstGroupLines[2].textContent).toBe(romajiLine);
    });
  });

  describe('text size controls', () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    it('defaults to 30px', () => {
      renderComponent();
      expect(screen.getByText('30px')).toBeInTheDocument();
    });

    it('increases and decreases the font size, disabling buttons at the limits', () => {
      renderComponent();
      const decrease = screen.getByLabelText('Decrease text size');
      const increase = screen.getByLabelText('Increase text size');

      fireEvent.click(increase);
      expect(screen.getByText('32px')).toBeInTheDocument();

      fireEvent.click(decrease);
      fireEvent.click(decrease);
      expect(screen.getByText('28px')).toBeInTheDocument();

      for (let i = 0; i < 10; i++) fireEvent.click(decrease);
      expect(screen.getByText('12px')).toBeInTheDocument();
      expect(decrease).toBeDisabled();

      for (let i = 0; i < 20; i++) fireEvent.click(increase);
      expect(screen.getByText(`${MAX_FONT_SIZE}px`)).toBeInTheDocument();
      expect(increase).toBeDisabled();
    });

    it('applies the font size to the lyrics area', () => {
      const { container } = renderComponent();
      fireEvent.click(screen.getByLabelText('Increase text size'));

      const area = container.querySelector('.parallel-text') as HTMLElement;
      expect(area.style.fontSize).toBe('32px');
    });

    it('persists the font size to localStorage and restores it on reload', () => {
      const first = renderComponent();
      fireEvent.click(screen.getByLabelText('Increase text size'));

      expect(window.localStorage.getItem('practiceNihongoLyrics.fontSize')).toBe('32');

      first.unmount();

      renderComponent();
      expect(screen.getByText('32px')).toBeInTheDocument();
    });
  });

  describe('title query parameter', () => {
    const SELECTED_SONG_KEY = 'practiceNihongoLyrics.selectedSongIndex';
    let currentSearch = '';
    const LocationSpy = () => {
      currentSearch = useLocation().search;
      return null;
    };
    const renderAt = (url: string) =>
      render(
        <MemoryRouter initialEntries={[url]}>
          <HomePage />
          <LocationSpy />
        </MemoryRouter>
      );
    const selectedValue = () => (screen.getByRole('combobox') as HTMLSelectElement).value;

    beforeEach(() => {
      window.localStorage.clear();
      currentSearch = '';
    });

    it.each(Object.entries(songsByKey))('selects %s from ?title=', (key, song) => {
      renderAt(`/?title=${key}`);
      expect(selectedValue()).toBe(song.title);
    });

    it('overrides and overwrites the song saved in localStorage', () => {
      window.localStorage.setItem(SELECTED_SONG_KEY, String(songs.indexOf(songsByKey.tegami)));
      renderAt('/?title=reason');

      expect(selectedValue()).toBe(songsByKey.reason.title);
      expect(window.localStorage.getItem(SELECTED_SONG_KEY)).toBe(String(songs.indexOf(songsByKey.reason)));
    });

    it('falls back to the localStorage song when the query parameter is missing', () => {
      window.localStorage.setItem(SELECTED_SONG_KEY, String(songs.indexOf(songsByKey.tegami)));
      renderAt('/');
      expect(selectedValue()).toBe(songsByKey.tegami.title);
    });

    it('ignores an unknown title and falls back to the localStorage song', () => {
      window.localStorage.setItem(SELECTED_SONG_KEY, String(songs.indexOf(songsByKey.tegami)));
      renderAt('/?title=notASong');
      expect(selectedValue()).toBe(songsByKey.tegami.title);
      expect(window.localStorage.getItem(SELECTED_SONG_KEY)).toBe(String(songs.indexOf(songsByKey.tegami)));
    });

    it('updates the query parameter when a song is chosen from the dropdown', () => {
      renderAt('/?title=reason');
      fireEvent.change(screen.getByRole('combobox'), { target: { value: songsByKey.land.title } });

      expect(new URLSearchParams(currentSearch).get('title')).toBe('land');
      expect(window.localStorage.getItem(SELECTED_SONG_KEY)).toBe(String(songs.indexOf(songsByKey.land)));
    });
  });
});
