import { toHiragana } from 'wanakana';

export interface FuriganaLine {
  kanji: string;
  hiragana: string;
}

export function romajiToHiragana(romajiLine: string): string {
  return toHiragana(romajiLine.replace(/-/g, ' ')).replace(/\s+/g, '');
}

export function buildFuriganaLines(kanjiText: string, romajiText: string): FuriganaLine[] {
  const kanjiLines = kanjiText.split('\n').map((l) => l.trim());
  const romajiLines = romajiText.split('\n').map((l) => l.trim());
  const lineCount = Math.max(kanjiLines.length, romajiLines.length);

  return Array.from({ length: lineCount }, (_, i) => ({
    kanji: kanjiLines[i] ?? '',
    hiragana: romajiToHiragana(romajiLines[i] ?? ''),
  })).filter((line) => line.kanji.length > 0 || line.hiragana.length > 0);
}
