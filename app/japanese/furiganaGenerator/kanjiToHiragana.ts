import { furiganaToHiragana, type FuriganaLine } from './furiganaGenerator';
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
    body: JSON.stringify(kanjiLines),
  });

  if (!response.ok) {
    throw new Error(`Furigana service request failed: ${response.status} ${response.statusText}`);
  }

  // The service returns one already-built furigana line (e.g. "誰（だれ）にも見（み）せない")
  // per kanji line sent, in the same order - not a FuriganaLine object.
  const furiganaLines: string[] = await response.json();
  return kanjiLines.map((kanji, i) => {
    const furigana = furiganaLines[i] ?? '';
    return { kanji, hiragana: furiganaToHiragana(furigana), furigana };
  });
}
