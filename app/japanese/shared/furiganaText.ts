// Matches the same 漢字（かんじ）groups as furiganaRuby's rendering regex, but collapses each
// one down to just its reading, dropping the kanji and parentheses so a furigana-annotated
// line reduces to its plain hiragana reading.
const KANJI_FURIGANA_GROUP_REGEX = /[一-鿿㐀-䶿々]+ *[(（]([^)）]+)[)）]/g;

export function furiganaToHiragana(furiganaLine: string): string {
  return furiganaLine.replace(KANJI_FURIGANA_GROUP_REGEX, '$1');
}

// Same match as KANJI_FURIGANA_GROUP_REGEX, but captures the kanji (plus any trailing space
// before the parentheses, see buildFurigana) instead of the reading, so a hand-edited furigana
// line can be reduced back down to its plain kanji form for FuriganaLine.kanji.
const KANJI_FURIGANA_KANJI_GROUP_REGEX = /([一-鿿㐀-䶿々]+ *)[(（][^)）]+[)）]/g;

export function furiganaToKanji(furiganaLine: string): string {
  return furiganaLine.replace(KANJI_FURIGANA_KANJI_GROUP_REGEX, '$1');
}
