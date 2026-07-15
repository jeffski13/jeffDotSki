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

function extractEnglishWords(text: string): string[] {
  return text.match(ENGLISH_WORD_REGEX) ?? [];
}

// wanakana passes through anything it can't map to kana (a lone consonant with no following
// vowel, punctuation it converts to a full-width equivalent like "、"). Stripping everything
// outside the hiragana block turns that leftover junk into nothing rather than letting it
// throw off the character alignment against the kanji line.
function toHiraganaOnly(romajiPart: string): string {
  return toHiragana(romajiPart.replace(/-/g, ' ')).replace(NOT_HIRAGANA_REGEX, '');
}

// English words that appear (case-insensitively) in the kanji line are kept exactly as
// written there rather than being run through the romaji-to-kana converter, which otherwise
// mangles them character by character (e.g. "Bay" -> "Ba(ば)y").
//
// Matches are consumed in the order they appear in the kanji line, so if the same word shows
// up more than once with different casing (e.g. "Bay BAY"), each romaji occurrence picks up
// the casing of its corresponding kanji occurrence instead of every match collapsing to one.
export function romajiToHiragana(romajiLine: string, kanjiLine = ''): string {
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
    return toHiraganaOnly(romajiLine);
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
      return toHiraganaOnly(part);
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

function charsMatch(comparisonChar: string, hiraganaChar: string): boolean {
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
  const lcsLength: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      lcsLength[i][j] = charsMatch(comparisonLine[i - 1], hiraganaLine[j - 1])
        ? lcsLength[i - 1][j - 1] + 1
        : Math.max(lcsLength[i - 1][j], lcsLength[i][j - 1]);
    }
  }

  const ops: DiffOp[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (charsMatch(comparisonLine[i - 1], hiraganaLine[j - 1])) {
      ops.push({ type: 'common', char: kanjiLine[i - 1] });
      i--;
      j--;
    } else if (lcsLength[i - 1][j] >= lcsLength[i][j - 1]) {
      ops.push({ type: 'kanjiOnly', char: kanjiLine[i - 1] });
      i--;
    } else {
      ops.push({ type: 'hiraganaOnly', char: hiraganaLine[j - 1] });
      j--;
    }
  }
  while (i > 0) {
    ops.push({ type: 'kanjiOnly', char: kanjiLine[--i] });
  }
  while (j > 0) {
    ops.push({ type: 'hiraganaOnly', char: hiraganaLine[--j] });
  }

  return ops.reverse();
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
      result += kanjiBuffer + (hiraganaBuffer ? `（${hiraganaBuffer}）` : '');
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
    const hiragana = romajiToHiragana(romajiLines[i] ?? '', kanji);
    return { kanji, hiragana, furigana: buildFurigana(kanji, hiragana) };
  }).filter((line) => line.kanji.length > 0 || line.hiragana.length > 0);
}
