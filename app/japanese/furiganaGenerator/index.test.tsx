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
      window.localStorage.clear();
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

    it('persists the checkbox state to localStorage and restores it on reload', () => {
      const first = renderComponent();
      fireEvent.click(screen.getByLabelText('Chorus Separators'));

      expect(window.localStorage.getItem('furiganaGenerator.useChorusSeparators')).toBe('true');

      first.unmount();

      const second = renderComponent();
      expect(screen.getByLabelText('Chorus Separators')).toBeChecked();
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

      expect(screen.getByLabelText('Kanji 振(ふ)')).toBeChecked();
      expect(screen.getByLabelText('Furigana 振ふ')).toBeChecked();
      expect(container.querySelectorAll('.furiganaGenerator_output-col')).toHaveLength(2);
    });

    it('hides the parenthetical column when its checkbox is unchecked, leaving the ruby column', () => {
      const { container } = renderComponent();
      generateFurigana();

      fireEvent.click(screen.getByLabelText('Kanji 振(ふ)'));

      const columns = container.querySelectorAll('.furiganaGenerator_output-col');
      expect(columns).toHaveLength(1);
      expect(columns[0].querySelectorAll('ruby').length).toBeGreaterThan(0);
    });

    it('hides the ruby column when its checkbox is unchecked, leaving the parenthetical column', () => {
      const { container } = renderComponent();
      generateFurigana();

      fireEvent.click(screen.getByLabelText('Furigana 振ふ'));

      const columns = container.querySelectorAll('.furiganaGenerator_output-col');
      expect(columns).toHaveLength(1);
      expect(columns[0].textContent).toContain(EXPECTED_FURIGANA);
      expect(columns[0].querySelectorAll('ruby')).toHaveLength(0);
    });

    it('persists display settings to localStorage and restores them on reload', () => {
      const first = renderComponent();
      generateFurigana();

      fireEvent.click(screen.getByLabelText('Kanji 振(ふ)'));

      const saved = JSON.parse(window.localStorage.getItem('furiganaGenerator.displaySettings')!);
      expect(saved).toEqual({ showKanjiParentheses: false, showFuriganaResults: true });

      first.unmount();

      const second = renderComponent();
      expect(screen.getByLabelText('Kanji 振(ふ)')).not.toBeChecked();
      expect(screen.getByLabelText('Furigana 振ふ')).toBeChecked();
    });
  });

  describe('text size controls', () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    it('does not show the text size control before any results have been generated', () => {
      renderComponent();
      expect(screen.queryByLabelText('Increase text size')).not.toBeInTheDocument();
    });

    it('defaults to 16px once results are generated', () => {
      renderComponent();
      generateFurigana();

      expect(screen.getByText('16px')).toBeInTheDocument();
    });

    it('increases and decreases the font size, disabling buttons at the limits', () => {
      renderComponent();
      generateFurigana();
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
      expect(screen.getByText('48px')).toBeInTheDocument();
      expect(increase).toBeDisabled();
    });

    it('applies the font size to the results output', () => {
      const { container } = renderComponent();
      generateFurigana();
      fireEvent.click(screen.getByLabelText('Increase text size'));

      const output = container.querySelector('#furiganaGenerator_output') as HTMLElement;
      expect(output.style.fontSize).toBe('18px');
    });

    it('persists the font size to localStorage and restores it on reload', () => {
      const first = renderComponent();
      generateFurigana();
      fireEvent.click(screen.getByLabelText('Increase text size'));

      expect(window.localStorage.getItem('furiganaGenerator.fontSize')).toBe('18');

      first.unmount();

      renderComponent();
      generateFurigana();
      expect(screen.getByText('18px')).toBeInTheDocument();
    });

    it('hides the text size control while in edit mode', async () => {
      vi.mocked(buildFuriganaLinesFromKanji).mockResolvedValue([
        { kanji: KANJI, hiragana: 'だれにもみせない', furigana: EXPECTED_FURIGANA },
      ]);
      renderComponent();
      fireEvent.change(screen.getByPlaceholderText(KANJI_PLACEHOLDER), { target: { value: KANJI } });
      fireEvent.click(screen.getByRole('button', { name: 'Generate Furigana' }));
      await screen.findByText(EXPECTED_FURIGANA);

      expect(screen.getByLabelText('Increase text size')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Edit line order' }));
      expect(screen.queryByLabelText('Increase text size')).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Done editing line order' }));
      expect(screen.getByLabelText('Increase text size')).toBeInTheDocument();
    });
  });

  describe('Romaji collapsible field', () => {
    it('is collapsed by default and expands when the label is clicked', () => {
      renderComponent();

      const toggle = screen.getByRole('button', { name: /Romaji/ });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(toggle);

      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByPlaceholderText(ROMAJI_PLACEHOLDER)).toBeInTheDocument();
    });
  });

  describe('Edit mode line reordering', () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    const LINE_1 = { kanji: 'どうやっていますか', hiragana: 'どうやっていますか', furigana: 'どうやっていますか' };
    const LINE_2 = { kanji: 'これはいいです', hiragana: 'これはいいです', furigana: 'これはいいです' };

    const generateTwoLines = async () => {
      vi.mocked(buildFuriganaLinesFromKanji).mockResolvedValue([LINE_1, LINE_2]);
      fireEvent.change(screen.getByPlaceholderText(KANJI_PLACEHOLDER), {
        target: { value: `${LINE_1.kanji}\n${LINE_2.kanji}` },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Generate Furigana' }));
      await screen.findByText(LINE_1.furigana);
    };

    it('does not show the edit toggle before any results have been generated', () => {
      renderComponent();
      expect(screen.queryByRole('button', { name: 'Edit line order' })).not.toBeInTheDocument();
    });

    it('switches from the two-column output to a draggable line list when the edit icon is clicked, and back when done', async () => {
      const { container } = renderComponent();
      await generateTwoLines();

      expect(container.querySelectorAll('.furiganaGenerator_output-col')).toHaveLength(2);
      expect(container.querySelectorAll('.furiganaGenerator_edit-row-content')).toHaveLength(0);

      fireEvent.click(screen.getByRole('button', { name: 'Edit line order' }));

      expect(container.querySelectorAll('.furiganaGenerator_output-col')).toHaveLength(0);
      const rows = container.querySelectorAll('.furiganaGenerator_edit-row-content');
      expect(rows).toHaveLength(2);
      expect(rows[0].textContent).toContain(LINE_1.furigana);
      expect(rows[1].textContent).toContain(LINE_2.furigana);

      fireEvent.click(screen.getByRole('button', { name: 'Done editing line order' }));

      expect(container.querySelectorAll('.furiganaGenerator_output-col')).toHaveLength(2);
      expect(container.querySelectorAll('.furiganaGenerator_edit-row-content')).toHaveLength(0);
    });

    it('reorders the lines when a row is dragged past another, and the new order sticks after leaving edit mode', async () => {
      const { container } = renderComponent();
      await generateTwoLines();
      fireEvent.click(screen.getByRole('button', { name: 'Edit line order' }));

      const rowContents = () => container.querySelectorAll('.furiganaGenerator_edit-row-content');
      const dropTargets = () => container.querySelectorAll('.furiganaGenerator_edit-row');

      fireEvent.dragStart(rowContents()[0], { dataTransfer: {} });
      fireEvent.dragOver(dropTargets()[1], { dataTransfer: {} });
      fireEvent.drop(dropTargets()[1], { dataTransfer: {} });

      expect(rowContents()[0].textContent).toContain(LINE_2.furigana);
      expect(rowContents()[1].textContent).toContain(LINE_1.furigana);

      fireEvent.click(screen.getByRole('button', { name: 'Done editing line order' }));

      const parenColumn = container.querySelector('.furiganaGenerator_output-col')!;
      const idxLine2 = parenColumn.textContent!.indexOf(LINE_2.furigana);
      const idxLine1 = parenColumn.textContent!.indexOf(LINE_1.furigana);
      expect(idxLine2).toBeGreaterThanOrEqual(0);
      expect(idxLine2).toBeLessThan(idxLine1);
    });

    it('exports the reordered lines', async () => {
      renderComponent();
      await generateTwoLines();
      fireEvent.click(screen.getByRole('button', { name: 'Edit line order' }));

      const rowContents = () => document.querySelectorAll('.furiganaGenerator_edit-row-content');
      const dropTargets = () => document.querySelectorAll('.furiganaGenerator_edit-row');
      fireEvent.dragStart(rowContents()[0], { dataTransfer: {} });
      fireEvent.dragOver(dropTargets()[1], { dataTransfer: {} });
      fireEvent.drop(dropTargets()[1], { dataTransfer: {} });
      fireEvent.click(screen.getByRole('button', { name: 'Done editing line order' }));

      fireEvent.click(screen.getByRole('button', { name: 'Export .ts' }));

      expect(downloadLyricsSongFile).toHaveBeenCalledWith(
        expect.objectContaining({ convertedLines: [LINE_2, LINE_1] }),
      );
    });

    it('leaves edit mode when a new conversion is generated', async () => {
      const { container } = renderComponent();
      await generateTwoLines();
      fireEvent.click(screen.getByRole('button', { name: 'Edit line order' }));
      expect(container.querySelectorAll('.furiganaGenerator_edit-row-content')).toHaveLength(2);

      await generateTwoLines();

      expect(container.querySelectorAll('.furiganaGenerator_edit-row-content')).toHaveLength(0);
      expect(container.querySelectorAll('.furiganaGenerator_output-col')).toHaveLength(2);
    });
  });
});
