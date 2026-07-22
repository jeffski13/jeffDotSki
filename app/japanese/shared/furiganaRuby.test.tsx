/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render } from '@testing-library/react';
import { renderFuriganaText } from './furiganaRuby';

describe('renderFuriganaText', () => {
  it('wraps a kanji（reading）run in ruby markup', () => {
    const { container } = render(<>{renderFuriganaText('誰（だれ）にも見（み）せない', 'k')}</>);

    const rubyEls = container.querySelectorAll('ruby');
    expect(rubyEls).toHaveLength(2);
    expect(rubyEls[0].textContent).toContain('誰');
    expect(rubyEls[0].querySelector('rt')?.textContent).toBe('だれ');
  });

  it('still renders ruby markup when a literal space sits between the kanji and its reading', () => {
    // buildFurigana can leave a literal lyric-line space between a kanji and its own reading,
    // e.g. "頃 （ごろ）" from "今（いま）頃 （ごろ）愛（あい）". The kanji and the paren aren't
    // adjacent, so the ruby markup must still attach the reading to 頃 and keep the space as
    // its own separate, unstyled text node rather than leaving the whole run as plain text.
    const { container } = render(<>{renderFuriganaText('今（いま）頃 （ごろ）愛（あい）', 'k')}</>);

    const rubyEls = container.querySelectorAll('ruby');
    expect(rubyEls).toHaveLength(3);
    expect(rubyEls[1].firstChild?.textContent).toBe('頃');
    expect(rubyEls[1].querySelector('rt')?.textContent).toBe('ごろ');

    // The literal space between 頃's ruby and 愛's ruby must survive as its own text node.
    expect(container.textContent?.replace(/いま|ごろ|あい/g, '')).toBe('今頃 愛');
  });
});
