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

    it('shows all three display modes checked and visible by default', () => {
      const { container } = renderComponent();

      expect(screen.getByLabelText('Japanese')).toBeChecked();
      expect(screen.getByLabelText('Furigana')).toBeChecked();
      expect(screen.getByLabelText('Romaji')).toBeChecked();

      expect(container.textContent).toContain(jpLine);
      expect(container.textContent).toContain(romajiLine);
      expect(container.querySelectorAll('ruby').length).toBeGreaterThan(0);
    });

    it('hides the Japanese column when its checkbox is unchecked, leaving the others', () => {
      const { container } = renderComponent();

      fireEvent.click(screen.getByLabelText('Japanese'));

      expect(container.textContent).not.toContain(jpLine);
      expect(container.textContent).toContain(romajiLine);
      expect(container.querySelectorAll('ruby').length).toBeGreaterThan(0);
    });

    it('hides the Romaji column when its checkbox is unchecked, leaving the others', () => {
      const { container } = renderComponent();

      fireEvent.click(screen.getByLabelText('Romaji'));

      expect(container.textContent).toContain(jpLine);
      expect(container.textContent).not.toContain(romajiLine);
      expect(container.querySelectorAll('ruby').length).toBeGreaterThan(0);
    });

    it('hides the Furigana column when its checkbox is unchecked, leaving the others', () => {
      const { container } = renderComponent();

      fireEvent.click(screen.getByLabelText('Furigana'));

      expect(container.textContent).toContain(jpLine);
      expect(container.textContent).toContain(romajiLine);
      expect(container.querySelectorAll('ruby')).toHaveLength(0);
    });

    it('re-shows a column when its checkbox is checked again', () => {
      const { container } = renderComponent();
      const jpCheckbox = screen.getByLabelText('Japanese');

      fireEvent.click(jpCheckbox);
      expect(container.textContent).not.toContain(jpLine);

      fireEvent.click(jpCheckbox);
      expect(container.textContent).toContain(jpLine);
    });
  });
});
