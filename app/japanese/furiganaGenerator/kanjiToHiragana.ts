import type { FuriganaLine } from './furiganaGenerator';
import { FURIGANA_TRANSFORMATION_URL } from './apiRoutes';

export async function buildFuriganaLinesFromKanji(kanjiText: string): Promise<FuriganaLine[]> {
  const kanjiLines = kanjiText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (kanjiLines.length === 0) return [];

  const response = await fetch(FURIGANA_TRANSFORMATION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kanji: kanjiLines }),
  });

  if (!response.ok) {
    throw new Error(`Furigana service request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<FuriganaLine[]>;
}
