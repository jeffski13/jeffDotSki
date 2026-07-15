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

function extractEnglishWords(text: string): string[] {
  return text.match(ENGLISH_WORD_REGEX) ?? [];
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
    return toHiragana(romajiLine.replace(/-/g, ' ')).replace(/\s+/g, '');
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
      return toHiragana(part.replace(/-/g, ' ')).replace(/\s+/g, '');
    })
    .join('');
}

function diffChars(kanjiLine: string, hiraganaLine: string): DiffOp[] {
  const m = kanjiLine.length;
  const n = hiraganaLine.length;
  const lcsLength: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      lcsLength[i][j] = kanjiLine[i - 1] === hiraganaLine[j - 1]
        ? lcsLength[i - 1][j - 1] + 1
        : Math.max(lcsLength[i - 1][j], lcsLength[i][j - 1]);
    }
  }

  const ops: DiffOp[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (kanjiLine[i - 1] === hiraganaLine[j - 1]) {
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
