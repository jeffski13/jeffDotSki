import { romajiToHiragana, buildFurigana, buildFuriganaLines } from './furiganaGenerator';

describe('romajiToHiragana', () => {
  it('converts romaji to hiragana', () => {
    expect(romajiToHiragana('dare nimo misenai')).toBe('だれにもみせない');
  });

  it('treats hyphens as word breaks rather than long-vowel marks', () => {
    expect(romajiToHiragana('hito-shirezu')).toBe('ひとしれず');
  });

  it('leaves an English word untouched when it also appears in the kanji line', () => {
    expect(romajiToHiragana('hiekitta kiss', '冷えきったKiss')).toBe('ひえきったKiss');
  });

  it('matches English words case-insensitively but keeps the kanji line casing', () => {
    expect(romajiToHiragana('tasogare no bay city', '黄昏のBay City')).toBe('たそがれのBay City');
  });

  it('still converts normally when the kanji line has no English words', () => {
    expect(romajiToHiragana('kaze ga kooru wa', '風が凍るわ')).toBe('かぜがこおるわ');
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

  it('keeps an English phrase shared by both lines unchanged instead of mangling it letter by letter', () => {
    const lines = buildFuriganaLines('黄昏のBay City', 'Tasogare no bay city');

    expect(lines).toEqual([
      { kanji: '黄昏のBay City', hiragana: 'たそがれのBay City', furigana: '黄昏（たそがれ）のBay City' },
    ]);
  });
});
