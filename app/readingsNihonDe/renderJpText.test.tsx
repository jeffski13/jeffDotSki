import { renderToStaticMarkup } from 'react-dom/server';
import { renderJpText } from './renderJpText';

const JOHN_10_7 = 'そこで、イエスはまた言われた、「よくよくあなたがたに言っておく。わたしは羊の門である。';
const JOHN_1_21 = 'そこで、彼らは問うた、「それでは、どなたなのですか、あなたはエリヤですか」。彼は「いや、そうではない」と言った。「では、あの預言者ですか」。彼は「いいえ」と答えた。';

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

  it('does not add a trailing line break after the final 。', () => {
    const html = renderToStaticMarkup(<>{renderJpText(JOHN_10_7, false, true)}</>);
    expect(html).not.toMatch(/<br\/>$/);
  });
});

describe('renderJpText – 」。 line break (John 1:21)', () => {
  it('breaks after 」。 when kuten is enabled and there is more text', () => {
    const html = renderToStaticMarkup(<>{renderJpText(JOHN_1_21, false, true)}</>);
    expect(html).toContain('エリヤですか」。<br/>');
    expect(html).toContain('預言者ですか」。<br/>');
  });

  it('does not add a trailing break after 」。 at the end of the verse', () => {
    const text = 'テスト「こんにちは」。';
    const html = renderToStaticMarkup(<>{renderJpText(text, false, true)}</>);
    expect(html).not.toMatch(/<br\/>$/);
  });

  it('breaks after 」。 with dialogue split enabled and kuten disabled', () => {
    const html = renderToStaticMarkup(<>{renderJpText(JOHN_1_21, true, false)}</>);
    // 「では、あの預言者ですか」。 should end with 。 and 彼は should follow on a new line
    expect(html).toContain('預言者ですか」。<br/>彼は');
  });

  it('breaks after 」。 with both dialogue split and kuten enabled', () => {
    const html = renderToStaticMarkup(<>{renderJpText(JOHN_1_21, true, true)}</>);
    expect(html).toContain('預言者ですか」。<br/>彼は');
  });

  it('keeps 」。 on the same line (no break between 」 and 。)', () => {
    const html = renderToStaticMarkup(<>{renderJpText(JOHN_1_21, true, false)}</>);
    expect(html).not.toContain('」<br/>。');
  });
});
