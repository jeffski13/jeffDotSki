import { romajiToHiragana, buildFuriganaLines } from './furiganaGenerator';

describe('romajiToHiragana', () => {
  it('converts romaji to hiragana', () => {
    expect(romajiToHiragana('dare nimo misenai')).toBe('だれにもみせない');
  });

  it('treats hyphens as word breaks rather than long-vowel marks', () => {
    expect(romajiToHiragana('hito-shirezu')).toBe('ひとしれず');
  });
});

describe('buildFuriganaLines', () => {
  it('pairs kanji lines with the hiragana conversion of the matching romaji line', () => {
    const lines = buildFuriganaLines('誰にも見せない\n泪があった', 'dare nimo misenai\nnamida ga atta');

    expect(lines).toEqual([
      { kanji: '誰にも見せない', hiragana: 'だれにもみせない' },
      { kanji: '泪があった', hiragana: 'なみだがあった' },
    ]);
  });

  it('drops empty lines when both kanji and romaji are blank', () => {
    const lines = buildFuriganaLines('誰にも見せない\n\n泪があった', 'dare nimo misenai\n\nnamida ga atta');

    expect(lines).toEqual([
      { kanji: '誰にも見せない', hiragana: 'だれにもみせない' },
      { kanji: '泪があった', hiragana: 'なみだがあった' },
    ]);
  });
});
