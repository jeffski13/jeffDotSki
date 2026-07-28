/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import FuriganaGeneratorPage from './index';
import { ENV } from '../../infra/env';
import testInfoKanji from './testInfoKanji.txt?raw';
import testInfoRomaji from './testInfoRomaji.txt?raw';
import testInfoKanjiOnly from './testInfoKanjiOnly.txt?raw';
import { buildFuriganaLinesFromKanji } from './kanjiToHiragana';
import { downloadLyricsSongFile } from './exportLyricsSong';

vi.mock('./kanjiToHiragana', () => ({
  buildFuriganaLinesFromKanji: vi.fn(),
}));

vi.mock('./exportLyricsSong', () => ({
  downloadLyricsSongFile: vi.fn(),
}));

const renderComponent = () => render(<MemoryRouter><FuriganaGeneratorPage /></MemoryRouter>);

const KANJI = '誰にも見せない';
const ROMAJI = 'dare nimo misenai';
const EXPECTED_FURIGANA = '誰（だれ）にも見（み）せない';
const ROMAJI_PLACEHOLDER = 'Enter the romaji reading here, matching each kanji line. Leave blank to auto-generate from the kanji.';

const generateFurigana = () => {
  fireEvent.change(screen.getByPlaceholderText('漢字の文章をここに入力してください。'), { target: { value: KANJI } });
  fireEvent.change(screen.getByPlaceholderText(ROMAJI_PLACEHOLDER), { target: { value: ROMAJI } });
  fireEvent.click(screen.getByRole('button', { name: 'Generate Furigana' }));
};

describe('FuriganaGeneratorPage', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('renders both the parenthetical and ruby-stylized output side by side', () => {
    const { container } = renderComponent();
    generateFurigana();

    const columns = container.querySelectorAll('.furiganaGenerator_output-col');
    expect(columns).toHaveLength(2);
    const [parenColumn, rubyColumn] = columns;

    // Left column: plain kanji（かんじ）text, no <ruby> markup.
    expect(parenColumn.textContent).toContain(EXPECTED_FURIGANA);
    expect(parenColumn.querySelectorAll('ruby')).toHaveLength(0);

    // Right column: stylized <ruby>/<rt> furigana, no parentheses.
    const rubyEls = rubyColumn.querySelectorAll('ruby');
    expect(rubyEls.length).toBeGreaterThan(0);
    expect(rubyColumn.textContent).not.toContain('（');
    expect(rubyEls[0].querySelector('rt')?.textContent).toBe('だれ');
  });

  it('fills both textareas with the sample files when "Load Sample" is clicked', () => {
    process.env.NODE_ENV = ENV.DEV;
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: 'Load Sample' }));

    expect(screen.getByPlaceholderText('漢字の文章をここに入力してください。')).toHaveValue(testInfoKanji);
    expect(screen.getByPlaceholderText(ROMAJI_PLACEHOLDER)).toHaveValue(testInfoRomaji);
  });

  it('hides the "Load Sample" button outside of dev', () => {
    process.env.NODE_ENV = ENV.PROD;
    renderComponent();

    expect(screen.queryByRole('button', { name: 'Load Sample' })).not.toBeInTheDocument();
  });

  it('fills the kanji textarea and clears romaji when "Load Kanji-Only Sample" is clicked', () => {
    process.env.NODE_ENV = ENV.DEV;
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(ROMAJI_PLACEHOLDER), { target: { value: ROMAJI } });
    fireEvent.click(screen.getByRole('button', { name: 'Load Kanji-Only Sample' }));

    expect(screen.getByPlaceholderText('漢字の文章をここに入力してください。')).toHaveValue(testInfoKanjiOnly);
    expect(screen.getByPlaceholderText(ROMAJI_PLACEHOLDER)).toHaveValue('');
  });

  it('hides the "Load Kanji-Only Sample" button outside of dev', () => {
    process.env.NODE_ENV = ENV.PROD;
    renderComponent();

    expect(screen.queryByRole('button', { name: 'Load Kanji-Only Sample' })).not.toBeInTheDocument();
  });

  it('derives the hiragana reading from the kanji when Romaji is left blank', async () => {
    const mockedLines = [{ kanji: KANJI, hiragana: 'だれにもみせない', furigana: EXPECTED_FURIGANA }];
    vi.mocked(buildFuriganaLinesFromKanji).mockResolvedValue(mockedLines);

    const { container } = renderComponent();
    fireEvent.change(screen.getByPlaceholderText('漢字の文章をここに入力してください。'), { target: { value: KANJI } });
    fireEvent.click(screen.getByRole('button', { name: 'Generate Furigana' }));

    expect(screen.getByRole('button', { name: 'Converting…' })).toBeDisabled();
    expect(buildFuriganaLinesFromKanji).toHaveBeenCalledWith(KANJI);

    await waitFor(() => {
      const parenColumn = container.querySelector('.furiganaGenerator_output-col');
      expect(parenColumn?.textContent).toContain(EXPECTED_FURIGANA);
    });
    expect(screen.getByRole('button', { name: 'Generate Furigana' })).toBeInTheDocument();
  });

  it('shows an error message when the furigana service request fails', async () => {
    vi.mocked(buildFuriganaLinesFromKanji).mockRejectedValue(new Error('Furigana service request failed: 500 Error'));

    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('漢字の文章をここに入力してください。'), { target: { value: KANJI } });
    fireEvent.click(screen.getByRole('button', { name: 'Generate Furigana' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Something went wrong generating furigana. Please try again.',
    );
    expect(screen.getByRole('button', { name: 'Generate Furigana' })).toBeInTheDocument();
  });

  it('clears a previous error message on the next successful conversion', async () => {
    vi.mocked(buildFuriganaLinesFromKanji).mockRejectedValueOnce(new Error('boom'));

    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('漢字の文章をここに入力してください。'), { target: { value: KANJI } });
    fireEvent.click(screen.getByRole('button', { name: 'Generate Furigana' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    const mockedLines = [{ kanji: KANJI, hiragana: 'だれにもみせない', furigana: EXPECTED_FURIGANA }];
    vi.mocked(buildFuriganaLinesFromKanji).mockResolvedValueOnce(mockedLines);
    fireEvent.click(screen.getByRole('button', { name: 'Generate Furigana' }));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('exports a LyricsSong .ts file with the title, kanji, romaji, and converted lines when "Export .ts" is clicked', () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('Song title, used for the exported file'), {
      target: { value: '涙 (Namida)' },
    });
    generateFurigana();

    fireEvent.click(screen.getByRole('button', { name: 'Export .ts' }));

    expect(downloadLyricsSongFile).toHaveBeenCalledWith({
      title: '涙 (Namida)',
      kanjiText: KANJI,
      romajiText: ROMAJI,
      convertedLines: [{ kanji: KANJI, hiragana: 'だれにもみせない', furigana: EXPECTED_FURIGANA }],
    });
  });
});
