import { renderToStaticMarkup } from 'react-dom/server';
import { renderJpText } from './renderJpText';

const JOHN_10_7 = 'そこで、イエスはまた言われた、「よくよくあなたがたに言っておく。わたしは羊の門である。';

describe('renderJpText – John 10:7', () => {
  it('puts the opening 「 on a new line when dialogueSplit is enabled', () => {
    const html = renderToStaticMarkup(<>{renderJpText(JOHN_10_7, true, false)}</>);
    const [before, after] = html.split('<br/>');
    expect(before).toBe('そこで、イエスはまた言われた、');
    expect(after).toContain('「よくよくあなたがたに言っておく。わたしは羊の門である。');
  });

  it('does not insert a line break before 「 when dialogueSplit is disabled', () => {
    const html = renderToStaticMarkup(<>{renderJpText(JOHN_10_7, false, false)}</>);
    expect(html).not.toContain('<br/>');
    expect(html).toBe(JOHN_10_7);
  });

  it('inserts line breaks after each 。 when splitOnKuten is enabled', () => {
    const html = renderToStaticMarkup(<>{renderJpText(JOHN_10_7, false, true)}</>);
    expect(html).toContain('言っておく。<br/>');
  });

  it('inserts both a dialogue break and kuten breaks when both options are enabled', () => {
    const html = renderToStaticMarkup(<>{renderJpText(JOHN_10_7, true, true)}</>);
    expect(html).toMatch(/^そこで、イエスはまた言われた、<br\/>/);
    expect(html).toContain('「よくよくあなたがたに言っておく。<br/>わたしは羊の門である。');
  });
});
