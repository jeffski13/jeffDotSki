/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import FuriganaGeneratorPage, { KANJI_PLACEHOLDER, ROMAJI_PLACEHOLDER } from './index';
import { ENV } from '../../infra/env';
import testInfoKanji from './testInfoKanji.txt?raw';
import testInfoRomaji from './testInfoRomaji.txt?raw';
import testInfoKanjiOnly from './testInfoKanjiOnly.txt?raw';
import { buildFuriganaLinesFromKanji } from './kanjiToHiragana';
import { downloadLyricsSongFile } from './exportLyricsSong';
import { applyChorusSeparators } from './chorusSeparators';

vi.mock('./kanjiToHiragana', () => ({
  buildFuriganaLinesFromKanji: vi.fn(),
}));

vi.mock('./exportLyricsSong', () => ({
  downloadLyricsSongFile: vi.fn(),
}));

vi.mock('./chorusSeparators', () => ({
  applyChorusSeparators: vi.fn(),
}));

const renderComponent = () => render(<MemoryRouter><FuriganaGeneratorPage /></MemoryRouter>);

// jsdom does not implement scrollIntoView, which the results section calls on conversion.
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

const KANJI = '誰にも見せない';
const ROMAJI = 'dare nimo misenai';
const EXPECTED_FURIGANA = '誰（だれ）にも見（み）せない';

const generateFurigana = () => {
  fireEvent.change(screen.getByPlaceholderText(KANJI_PLACEHOLDER), { target: { value: KANJI } });
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

    expect(screen.getByPlaceholderText(KANJI_PLACEHOLDER)).toHaveValue(testInfoKanji);
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

    expect(screen.getByPlaceholderText(KANJI_PLACEHOLDER)).toHaveValue(testInfoKanjiOnly);
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
    fireEvent.change(screen.getByPlaceholderText(KANJI_PLACEHOLDER), { target: { value: KANJI } });
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
    fireEvent.change(screen.getByPlaceholderText(KANJI_PLACEHOLDER), { target: { value: KANJI } });
    fireEvent.click(screen.getByRole('button', { name: 'Generate Furigana' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Something went wrong generating furigana. Please try again.',
    );
    expect(screen.getByRole('button', { name: 'Generate Furigana' })).toBeInTheDocument();
  });

  it('clears a previous error message on the next successful conversion', async () => {
    vi.mocked(buildFuriganaLinesFromKanji).mockRejectedValueOnce(new Error('boom'));

    renderComponent();
    fireEvent.change(screen.getByPlaceholderText(KANJI_PLACEHOLDER), { target: { value: KANJI } });
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
    generateFurigana();

    fireEvent.change(screen.getByPlaceholderText('Song title, used for the exported file'), {
      target: { value: '涙 (Namida)' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Export .ts' }));

    expect(downloadLyricsSongFile).toHaveBeenCalledWith({
      title: '涙 (Namida)',
      kanjiText: KANJI,
      romajiText: ROMAJI,
      convertedLines: [{ kanji: KANJI, hiragana: 'だれにもみせない', furigana: EXPECTED_FURIGANA }],
    });
  });

  describe('Chorus Separators checkbox', () => {
    beforeEach(() => {
      vi.mocked(applyChorusSeparators).mockReset();
    });

    it('is unchecked by default and does not call the chorus separator service', async () => {
      const mockedLines = [{ kanji: KANJI, hiragana: 'だれにもみせない', furigana: EXPECTED_FURIGANA }];
      vi.mocked(buildFuriganaLinesFromKanji).mockResolvedValue(mockedLines);

      renderComponent();
      expect(screen.getByLabelText('Chorus Separators')).not.toBeChecked();

      fireEvent.change(screen.getByPlaceholderText(KANJI_PLACEHOLDER), { target: { value: KANJI } });
      fireEvent.click(screen.getByRole('button', { name: 'Generate Furigana' }));

      await waitFor(() => {
        expect(buildFuriganaLinesFromKanji).toHaveBeenCalledWith(KANJI);
      });
      expect(applyChorusSeparators).not.toHaveBeenCalled();
    });

    it('sends the kanji text to /chorusSeparators first, then feeds its result to buildFuriganaLinesFromKanji', async () => {
      const TRANSFORMED_KANJI = '【サビ】\n誰にも見せない';
      vi.mocked(applyChorusSeparators).mockResolvedValue(TRANSFORMED_KANJI);
      const mockedLines = [{ kanji: KANJI, hiragana: 'だれにもみせない', furigana: EXPECTED_FURIGANA }];
      vi.mocked(buildFuriganaLinesFromKanji).mockResolvedValue(mockedLines);

      renderComponent();
      fireEvent.click(screen.getByLabelText('Chorus Separators'));
      fireEvent.change(screen.getByPlaceholderText(KANJI_PLACEHOLDER), { target: { value: KANJI } });
      fireEvent.click(screen.getByRole('button', { name: 'Generate Furigana' }));

      await waitFor(() => {
        expect(buildFuriganaLinesFromKanji).toHaveBeenCalledWith(TRANSFORMED_KANJI);
      });
      expect(applyChorusSeparators).toHaveBeenCalledWith(KANJI);
    });

    it('feeds the chorus-separated text into the romaji conversion path when romaji is supplied', async () => {
      const TRANSFORMED_KANJI = 'だれにもみせない';
      vi.mocked(applyChorusSeparators).mockResolvedValue(TRANSFORMED_KANJI);

      const { container } = renderComponent();
      fireEvent.click(screen.getByLabelText('Chorus Separators'));
      fireEvent.change(screen.getByPlaceholderText(KANJI_PLACEHOLDER), { target: { value: KANJI } });
      fireEvent.change(screen.getByPlaceholderText(ROMAJI_PLACEHOLDER), { target: { value: ROMAJI } });
      fireEvent.click(screen.getByRole('button', { name: 'Generate Furigana' }));

      await waitFor(() => {
        const parenColumn = container.querySelector('.furiganaGenerator_output-col');
        expect(parenColumn?.textContent).toContain(TRANSFORMED_KANJI);
      });
      expect(applyChorusSeparators).toHaveBeenCalledWith(KANJI);
      // Already-hiragana chorus-separated text needs no furigana annotation, unlike the raw kanji.
      expect(container.querySelector('.furiganaGenerator_output-col')?.textContent).not.toContain('（');
    });

    it('shows an error message when the chorus separator service request fails', async () => {
      vi.mocked(applyChorusSeparators).mockRejectedValue(new Error('Chorus separator service request failed: 500 Error'));

      renderComponent();
      fireEvent.click(screen.getByLabelText('Chorus Separators'));
      fireEvent.change(screen.getByPlaceholderText(KANJI_PLACEHOLDER), { target: { value: KANJI } });
      fireEvent.click(screen.getByRole('button', { name: 'Generate Furigana' }));

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Something went wrong generating furigana. Please try again.',
      );
    });
  });

  describe('display mode checkboxes', () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    it('defaults to both checkboxes checked, showing both output columns', () => {
      const { container } = renderComponent();
      generateFurigana();

      expect(screen.getByLabelText('Kanji with parentheses')).toBeChecked();
      expect(screen.getByLabelText('Furigana results')).toBeChecked();
      expect(container.querySelectorAll('.furiganaGenerator_output-col')).toHaveLength(2);
    });

    it('hides the parenthetical column when its checkbox is unchecked, leaving the ruby column', () => {
      const { container } = renderComponent();
      generateFurigana();

      fireEvent.click(screen.getByLabelText('Kanji with parentheses'));

      const columns = container.querySelectorAll('.furiganaGenerator_output-col');
      expect(columns).toHaveLength(1);
      expect(columns[0].querySelectorAll('ruby').length).toBeGreaterThan(0);
    });

    it('hides the ruby column when its checkbox is unchecked, leaving the parenthetical column', () => {
      const { container } = renderComponent();
      generateFurigana();

      fireEvent.click(screen.getByLabelText('Furigana results'));

      const columns = container.querySelectorAll('.furiganaGenerator_output-col');
      expect(columns).toHaveLength(1);
      expect(columns[0].textContent).toContain(EXPECTED_FURIGANA);
      expect(columns[0].querySelectorAll('ruby')).toHaveLength(0);
    });

    it('persists display settings to localStorage and restores them on reload', () => {
      const first = renderComponent();
      generateFurigana();

      fireEvent.click(screen.getByLabelText('Kanji with parentheses'));

      const saved = JSON.parse(window.localStorage.getItem('furiganaGenerator.displaySettings')!);
      expect(saved).toEqual({ showKanjiParentheses: false, showFuriganaResults: true });

      first.unmount();

      const second = renderComponent();
      expect(screen.getByLabelText('Kanji with parentheses')).not.toBeChecked();
      expect(screen.getByLabelText('Furigana results')).toBeChecked();
    });
  });
});
