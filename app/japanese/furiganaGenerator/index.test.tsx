import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import FuriganaGeneratorPage from './index';
import { ENV } from '../../infra/env';
import testInfoKanji from './testInfoKanji.txt?raw';
import testInfoRomaji from './testInfoRomaji.txt?raw';

const renderComponent = () => render(<MemoryRouter><FuriganaGeneratorPage /></MemoryRouter>);

const KANJI = '誰にも見せない';
const ROMAJI = 'dare nimo misenai';
const EXPECTED_FURIGANA = '誰（だれ）にも見（み）せない';

const generateFurigana = () => {
  fireEvent.change(screen.getByPlaceholderText('漢字の文章をここに入力してください。'), { target: { value: KANJI } });
  fireEvent.change(
    screen.getByPlaceholderText('Enter the romaji reading here, matching each kanji line.'),
    { target: { value: ROMAJI } },
  );
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
    expect(screen.getByPlaceholderText('Enter the romaji reading here, matching each kanji line.')).toHaveValue(
      testInfoRomaji,
    );
  });

  it('hides the "Load Sample" button outside of dev', () => {
    process.env.NODE_ENV = ENV.PROD;
    renderComponent();

    expect(screen.queryByRole('button', { name: 'Load Sample' })).not.toBeInTheDocument();
  });
});
