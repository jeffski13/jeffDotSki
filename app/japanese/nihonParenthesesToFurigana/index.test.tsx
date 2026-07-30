/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import NihonParenthesesToFuriganaPage from './index';
import { ENV } from '../../infra/env';
import testInfoParentheses from './testInfoParentheses.txt?raw';

const renderComponent = () => render(<MemoryRouter><NihonParenthesesToFuriganaPage /></MemoryRouter>);

const PLACEHOLDER = '漢字（かんじ）の 文章（ぶんしょう）をここに入力（にゅうりょく）してください。';

// jsdom does not implement scrollIntoView, which the results section calls on conversion.
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe('NihonParenthesesToFuriganaPage', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('fills the textarea with the sample file when "Load Sample" is clicked', () => {
    process.env.NODE_ENV = ENV.DEV;
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: 'Load Sample' }));

    expect(screen.getByPlaceholderText(PLACEHOLDER)).toHaveValue(testInfoParentheses);
  });

  it('hides the "Load Sample" button outside of dev', () => {
    process.env.NODE_ENV = ENV.PROD;
    renderComponent();

    expect(screen.queryByRole('button', { name: 'Load Sample' })).not.toBeInTheDocument();
  });

  it('converts parenthetical text into ruby-stylized furigana', () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER), { target: { value: '誰（だれ）にも見（み）せない' } });
    fireEvent.click(screen.getByRole('button', { name: 'Convert to Furigana' }));

    const rubyEls = screen.getAllByText('誰');
    expect(rubyEls.length).toBeGreaterThan(0);
    expect(screen.getByText('だれ')).toBeInTheDocument();
  });
});
