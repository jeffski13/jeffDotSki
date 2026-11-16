/// <reference types="vitest/globals" />
import { furiganaToKanji, furiganaToHiragana } from './furiganaText';

describe('furiganaToKanji', () => {
  it('drops the parenthesized reading but keeps the kanji', () => {
    expect(furiganaToKanji('今日（きょう）は良（よ）かったです。')).toBe('今日は良かったです。');
  });

  it('leaves non-furigana text untouched', () => {
    expect(furiganaToKanji('シーズン・オフの海（うみ）は笑（わら）い')).toBe('シーズン・オフの海は笑い');
  });

  it('keeps a literal space between adjacent kanji runs and their shared reading', () => {
    expect(furiganaToKanji('今（いま）頃 （ごろ）愛（あい）が痛（いた）いの')).toBe('今頃 愛が痛いの');
  });

  it('is a no-op on plain text with no furigana groups', () => {
    expect(furiganaToKanji('just text')).toBe('just text');
  });
});

describe('furiganaToHiragana', () => {
  it('replaces each kanji group with its reading', () => {
    expect(furiganaToHiragana('今日（きょう）は良（よ）かったです。')).toBe('きょうはよかったです。');
  });

  it('leaves text inside parentheses that do not follow kanji alone', () => {
    expect(furiganaToHiragana('（死者（ししゃ）のためのミサでは）')).toBe('（ししゃのためのミサでは）');
  });
});
