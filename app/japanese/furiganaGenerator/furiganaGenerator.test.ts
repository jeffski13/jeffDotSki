import { romajiToHiragana, buildFurigana, buildFuriganaLines } from './furiganaGenerator';

describe('romajiToHiragana', () => {
  it('converts romaji to hiragana', () => {
    expect(romajiToHiragana('dare nimo misenai')).toBe('だれにもみせない');
  });

  it('treats hyphens as word breaks rather than long-vowel marks', () => {
    expect(romajiToHiragana('hito-shirezu')).toBe('ひとしれず');
  });
});

describe('buildFurigana', () => {
  it('wraps kanji with their reading, leaving existing kana untouched', () => {
    expect(buildFurigana('誰にも見せない', 'だれにもみせない')).toBe('誰（だれ）にも見（み）せない');
  });

  it('wraps a single leading kanji chunk', () => {
    expect(buildFurigana('泪があった', 'なみだがあった')).toBe('泪（なみだ）があった');
  });

  it('returns the line unchanged when it is already all kana', () => {
    expect(buildFurigana('にほんご', 'にほんご')).toBe('にほんご');
  });
});

describe('buildFuriganaLines', () => {
  it('pairs kanji lines with the hiragana conversion and furigana of the matching romaji line', () => {
    const lines = buildFuriganaLines('誰にも見せない\n泪があった', 'dare nimo misenai\nnamida ga atta');

    expect(lines).toEqual([
      { kanji: '誰にも見せない', hiragana: 'だれにもみせない', furigana: '誰（だれ）にも見（み）せない' },
      { kanji: '泪があった', hiragana: 'なみだがあった', furigana: '泪（なみだ）があった' },
    ]);
  });

  it('drops empty lines when both kanji and romaji are blank', () => {
    const lines = buildFuriganaLines('誰にも見せない\n\n泪があった', 'dare nimo misenai\n\nnamida ga atta');

    expect(lines).toEqual([
      { kanji: '誰にも見せない', hiragana: 'だれにもみせない', furigana: '誰（だれ）にも見（み）せない' },
      { kanji: '泪があった', hiragana: 'なみだがあった', furigana: '泪（なみだ）があった' },
    ]);
  });
});
