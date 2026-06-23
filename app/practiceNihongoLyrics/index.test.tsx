import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import HomePage from './index';
import senNoYoruWoKoete from './src/senNoYoruWoKoete';
import tegami from './src/tegami';
import stayWithMe from './src/stayWithMe';

const songs = [senNoYoruWoKoete, tegami, stayWithMe];

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
});
