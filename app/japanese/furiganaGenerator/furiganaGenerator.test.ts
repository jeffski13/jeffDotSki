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

  it('gives each occurrence of a repeated word its own casing, in order', () => {
    expect(romajiToHiragana('bay BAY', 'Bay BAY')).toBe('Bay BAY');
    expect(romajiToHiragana('BAY bay', 'BAY Bay')).toBe('BAY Bay');
  });

  it('keeps an all-caps English word from the kanji line as-is', () => {
    expect(romajiToHiragana('coffee wo nomu', 'COFFEEを飲む')).toBe('COFFEEをのむ');
  });

  it('keeps a lowercase English word from the kanji line as-is even when romaji is uppercase', () => {
    expect(romajiToHiragana('COFFEE wo nomu', 'coffeeを飲む')).toBe('coffeeをのむ');
  });

  it('drops leftover non-hiragana characters instead of leaving them stray in the reading', () => {
    // "Ah," has no kanji-line English counterpart, so it goes through kana conversion: the lone
    // "h" (no following vowel) and the comma (converted to "、") don't map to hiragana at all.
    expect(romajiToHiragana('Ah, ah anata wo otte')).toBe('あああなたをおって');
  });

  it('reads "dzu" as づ rather than as an unconvertible "d" plus ず', () => {
    expect(romajiToHiragana('tsudzuiteta')).toBe('つづいてた');
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

  it('leaves katakana untouched instead of wrapping it with its hiragana reading', () => {
    expect(buildFurigana('ナイフ', 'ないふ')).toBe('ナイフ');
  });

  it('leaves katakana untouched alongside kanji that still gets a reading', () => {
    expect(buildFurigana('見えないナイフ', 'みえないないふ')).toBe('見（み）えないナイフ');
  });

  it('leaves the topic particle は untouched instead of misreading it as part of the next kanji', () => {
    expect(buildFurigana('あなたは消えた', 'あなたわきえた')).toBe('あなたは消（き）えた');
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

  it('keeps katakana in the output instead of giving it a furigana reading', () => {
    const lines = buildFuriganaLines('見えないナイフ', 'mienai naifu');

    expect(lines).toEqual([
      { kanji: '見えないナイフ', hiragana: 'みえないないふ', furigana: '見（み）えないナイフ' },
    ]);
  });

  it('discards a furigana reading built from leftover junk instead of showing it verbatim', () => {
    const lines = buildFuriganaLines('ああ あなたを追って', 'Ah, ah anata wo otte');

    expect(lines).toEqual([
      { kanji: 'ああ あなたを追って', hiragana: 'あああなたをおって', furigana: 'ああ あなたを追（お）って' },
    ]);
  });

  it('does not give an existing づ its own furigana reading when the romaji spells it "dzu"', () => {
    const lines = buildFuriganaLines('素直になれば つづいてた愛', 'Sunao ni nareba tsudzuiteta ai');

    expect(lines).toEqual([
      {
        kanji: '素直になれば つづいてた愛',
        hiragana: 'すなおになればつづいてたあい',
        furigana: '素直（すなお）になれば つづいてた愛（あい）',
      },
    ]);
  });
});
