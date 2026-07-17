import { toHiragana } from 'wanakana';

export interface FuriganaLine {
  kanji: string;
  hiragana: string;
  furigana: string;
}

type DiffOp =
  | { type: 'common'; char: string }
  | { type: 'kanjiOnly'; char: string }
  | { type: 'hiraganaOnly'; char: string };

const ENGLISH_WORD_REGEX = /[A-Za-z]+/g;
const NOT_HIRAGANA_REGEX = /[^ぁ-ゖ]/g;
const NOT_HIRAGANA_OR_SPACE_REGEX = /[^ぁ-ゖ ]/g;

function extractEnglishWords(text: string): string[] {
  return text.match(ENGLISH_WORD_REGEX) ?? [];
}

// "dzu" is a common (if non-standard) Hepburn spelling of づ, used to distinguish it from ず
// when romanizing. wanakana only recognizes "du" for づ, so "dzu" falls through as an
// unconvertible "d" followed by "zu" -> ず, which then fails to line up with the づ already
// present in the kanji line and gets misread as a kanji needing its own furigana reading.
function normalizeDzu(romajiPart: string): string {
  return romajiPart.replace(/dzu/gi, 'du');
}

// wanakana passes through anything it can't map to kana (a lone consonant with no following
// vowel, punctuation it converts to a full-width equivalent like "、"). Stripping everything
// outside the hiragana block turns that leftover junk into nothing rather than letting it
// throw off the character alignment against the kanji line.
function toHiraganaOnly(romajiPart: string): string {
  return toHiragana(normalizeDzu(romajiPart).replace(/-/g, ' ')).replace(NOT_HIRAGANA_REGEX, '');
}

// Same conversion as toHiraganaOnly, but keeps the spaces between romaji words instead of
// stripping them. Those spaces mark word boundaries that don't otherwise survive into the
// hiragana reading, which buildFurigana needs to split a run of several adjacent kanji (e.g.
// "今頃" or "頃 愛") into one furigana reading per kanji instead of lumping them into one.
function toHiraganaWithSpaces(romajiPart: string): string {
  return toHiragana(normalizeDzu(romajiPart).replace(/-/g, ' ')).replace(NOT_HIRAGANA_OR_SPACE_REGEX, '');
}

// English words that appear (case-insensitively) in the kanji line are kept exactly as
// written there rather than being run through the romaji-to-kana converter, which otherwise
// mangles them character by character (e.g. "Bay" -> "Ba(ば)y").
//
// Matches are consumed in the order they appear in the kanji line, so if the same word shows
// up more than once with different casing (e.g. "Bay BAY"), each romaji occurrence picks up
// the casing of its corresponding kanji occurrence instead of every match collapsing to one.
export function romajiToHiragana(romajiLine: string, kanjiLine = '', preserveSpaces = false): string {
  const convert = preserveSpaces ? toHiraganaWithSpaces : toHiraganaOnly;
  const preservedWordQueues = new Map<string, string[]>();
  for (const word of extractEnglishWords(kanjiLine)) {
    const key = word.toLowerCase();
    const queue = preservedWordQueues.get(key);
    if (queue) {
      queue.push(word);
    } else {
      preservedWordQueues.set(key, [word]);
    }
  }

  if (preservedWordQueues.size === 0) {
    return convert(romajiLine);
  }

  const parts = romajiLine.split(new RegExp(`(${ENGLISH_WORD_REGEX.source})`, 'g'));
  const resolvedWords = parts.map((part) => {
    if (!/^[A-Za-z]+$/.test(part)) return null;
    const queue = preservedWordQueues.get(part.toLowerCase());
    return queue && queue.length > 0 ? queue.shift()! : null;
  });

  return parts
    .map((part, i) => {
      if (resolvedWords[i] !== null) {
        return resolvedWords[i];
      }
      const sandwichedBetweenPreservedWords = resolvedWords[i - 1] != null && resolvedWords[i + 1] != null;
      if (sandwichedBetweenPreservedWords) {
        return part;
      }
      return convert(part);
    })
    .join('');
}

// Katakana and hiragana share the same code point offset (katakana - 0x60 = hiragana) across
// the range they have in common; ー (the prolonged sound mark) and a few rare extended
// katakana letters fall outside it and are left as-is.
function katakanaToHiragana(char: string): string {
  const code = char.charCodeAt(0);
  return code >= 0x30a1 && code <= 0x30f6 ? String.fromCharCode(code - 0x60) : char;
}

// The topic particle は is romanized after how it's written ("ha") but romaji is transcribed
// after how it's pronounced ("wa"), so its romaji-derived kana (わ) never literally matches
// は itself even though は is already correct, unwrapped hiragana. Letting は also match わ
// during comparison lets it line up as "common" like any other kana instead of being misread
// as a kanji needing a furigana reading. へ and を have the same written-vs-pronounced quirk
// but are left alone here: unlike わ (which only ever comes from は), お and え are also the
// literal readings of real kana/kanji, so treating them as interchangeable with を/へ is prone
// to matching the wrong occurrence when both spellings appear in the same line.
const PARTICLE_PRONUNCIATIONS: Record<string, string> = { は: 'わ' };

// A space in the kanji line is a literal, meaningful character (a phrase break in the source
// lyrics), while a space in the hiragana line is just a word-boundary marker introduced by
// romajiToHiragana(..., true) for splitting adjacent kanji runs (see buildFurigana). The two
// are unrelated, and the kanji line only ever has a handful of spaces against the hiragana
// line's many - letting them match as "common" risks anchoring the single kanji-side space to
// the wrong one of several hiragana-side candidates. Spaces are left to always fall through as
// kanjiOnly/hiraganaOnly instead.
function charsMatch(comparisonChar: string, hiraganaChar: string): boolean {
  if (comparisonChar === ' ' || hiraganaChar === ' ') return false;
  return comparisonChar === hiraganaChar || PARTICLE_PRONUNCIATIONS[comparisonChar] === hiraganaChar;
}

// Katakana in the kanji line (e.g. "ナイフ") won't literally match the hiragana reading
// derived from romaji (e.g. "ないふ") since they're different code points despite being the
// same sound. Comparing against a katakana-to-hiragana-normalized copy of the kanji line -
// while still emitting the original character - lets katakana line up as "common" so it
// passes through unwrapped instead of getting a redundant furigana reading. This only touches
// katakana code points, so kanji, hiragana, and any preserved English text are left untouched.
function diffChars(kanjiLine: string, hiraganaLine: string): DiffOp[] {
  // Built by code unit (not code point) so its length always matches kanjiLine.length - the
  // indexing below relies on kanjiLine[i] and comparisonLine[i] staying in lockstep.
  let comparisonLine = '';
  for (let k = 0; k < kanjiLine.length; k++) {
    comparisonLine += katakanaToHiragana(kanjiLine[k]);
  }
  const m = kanjiLine.length;
  const n = hiraganaLine.length;

  // suffixLcsLength[i][j] holds the LCS length of the remaining suffixes
  // comparisonLine[i:] and hiraganaLine[j:], built back-to-front so the reconstruction below can
  // walk forward.
  const suffixLcsLength: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      suffixLcsLength[i][j] = charsMatch(comparisonLine[i], hiraganaLine[j])
        ? suffixLcsLength[i + 1][j + 1] + 1
        : Math.max(suffixLcsLength[i + 1][j], suffixLcsLength[i][j + 1]);
    }
  }

  // Reconstructing front-to-back (rather than the more common back-to-front traceback) matters
  // when the same kana appears more than once, e.g. は's pronunciation わ colliding with a literal
  // わ elsewhere on the hiragana line (「海は笑い」 vs "umi wa warai" has one わ for the topic
  // particle and another as the first kana of 笑 ("warai")). A back-to-front traceback greedily
  // pairs は with whichever わ sits closest to the end of the line, which can steal the わ another
  // word's reading needs and misattribute it. Walking forward instead pairs は with the first
  // available わ, matching the order the words actually appear in.
  const ops: DiffOp[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (charsMatch(comparisonLine[i], hiraganaLine[j]) && suffixLcsLength[i][j] === suffixLcsLength[i + 1][j + 1] + 1) {
      ops.push({ type: 'common', char: kanjiLine[i] });
      i++;
      j++;
    } else if (suffixLcsLength[i + 1][j] >= suffixLcsLength[i][j + 1]) {
      ops.push({ type: 'kanjiOnly', char: kanjiLine[i] });
      i++;
    } else {
      ops.push({ type: 'hiraganaOnly', char: hiraganaLine[j] });
      j++;
    }
  }
  while (i < m) {
    ops.push({ type: 'kanjiOnly', char: kanjiLine[i++] });
  }
  while (j < n) {
    ops.push({ type: 'hiraganaOnly', char: hiraganaLine[j++] });
  }

  return ops;
}

// A run of several adjacent kanji with no okurigana between them (e.g. a two-kanji compound)
// normally shares one combined furigana reading, built from whatever hiragana the diff couldn't
// otherwise place. But when hiraganaBuffer carries word-boundary spaces (from
// romajiToHiragana(..., true)) and the number of hiragana words lines up exactly with the number
// of kanji characters in the run, each kanji almost certainly has its own one-word reading rather
// than one shared reading, so give each its own furigana instead of lumping them together. A
// space literally present in the kanji line (a phrase break in the source lyrics, not a
// word-boundary marker) rides along with whichever kanji character precedes it either way.
function renderKanjiHiraganaBuffer(kanjiBuffer: string, hiraganaBuffer: string): string {
  const words = hiraganaBuffer.split(/\s+/).filter(Boolean);
  const kanjiCharCount = [...kanjiBuffer].filter((char) => char !== ' ').length;

  if (kanjiCharCount <= 1 || words.length !== kanjiCharCount) {
    const reading = words.join('');
    return kanjiBuffer + (reading ? `（${reading}）` : '');
  }

  const leadingSpaces = kanjiBuffer.match(/^ +/)?.[0] ?? '';
  const segments = kanjiBuffer.slice(leadingSpaces.length).match(/[^ ] */g) ?? [];
  return leadingSpaces + segments.map((segment, i) => `${segment}（${words[i]}）`).join('');
}

// 1. Diff the kanji line against its full hiragana reading - matching characters are the
//    hiragana already present in the kanji line (kept as-is, "in common").
// 2. Whatever's left on the kanji side are the kanji characters; whatever's left on the
//    hiragana side is their reading - pair them up and wrap the reading in parentheses.
// 3. The common hiragana from step 1 is interleaved back in as we walk the diff in order.
export function buildFurigana(kanjiLine: string, hiraganaLine: string): string {
  const ops = diffChars(kanjiLine, hiraganaLine);

  let result = '';
  let kanjiBuffer = '';
  let hiraganaBuffer = '';

  const flush = () => {
    if (kanjiBuffer || hiraganaBuffer) {
      result += renderKanjiHiraganaBuffer(kanjiBuffer, hiraganaBuffer);
      kanjiBuffer = '';
      hiraganaBuffer = '';
    }
  };

  for (const op of ops) {
    if (op.type === 'common') {
      flush();
      result += op.char;
    } else if (op.type === 'kanjiOnly') {
      kanjiBuffer += op.char;
    } else {
      hiraganaBuffer += op.char;
    }
  }
  flush();

  return result;
}

export function buildFuriganaLines(kanjiText: string, romajiText: string): FuriganaLine[] {
  const kanjiLines = kanjiText.split('\n').map((l) => l.trim());
  const romajiLines = romajiText.split('\n').map((l) => l.trim());
  const lineCount = Math.max(kanjiLines.length, romajiLines.length);

  return Array.from({ length: lineCount }, (_, i) => {
    const kanji = kanjiLines[i] ?? '';
    const romaji = romajiLines[i] ?? '';
    const hiragana = romajiToHiragana(romaji, kanji);
    // The word-boundary spaces this preserves (on top of whatever romajiToHiragana(romaji, kanji)
    // already keeps, like a shared English phrase) are only needed for splitting adjacent kanji
    // runs in buildFurigana - the reported hiragana reading above keeps its established shape.
    const segmentedHiragana = romajiToHiragana(romaji, kanji, true);
    return { kanji, hiragana, furigana: buildFurigana(kanji, segmentedHiragana) };
  }).filter((line) => line.kanji.length > 0 || line.hiragana.length > 0);
}
