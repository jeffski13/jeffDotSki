import { furiganaToHiragana, type FuriganaLine } from './furiganaGenerator';
import { FURIGANA_TRANSFORMATION_URL } from './apiRoutes';

export async function buildFuriganaLinesFromKanji(kanjiText: string): Promise<FuriganaLine[]> {
  const kanjiLines = kanjiText.split('\n').map((line) => line.trim());
  const nonBlankLines = kanjiLines.filter((line) => line.length > 0);

  if (nonBlankLines.length === 0) return [];

  const response = await fetch(FURIGANA_TRANSFORMATION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nonBlankLines),
  });

  if (!response.ok) {
    throw new Error(`Furigana service request failed: ${response.status} ${response.statusText}`);
  }

  // The service returns one already-built furigana line (e.g. "誰（だれ）にも見（み）せない")
  // per non-blank kanji line sent, in the same order - not a FuriganaLine object. Blank lines
  // are reinserted here (rather than sent to the service) so line breaks in the input, including
  // blank stanza breaks, are preserved in the output.
  const furiganaLines: string[] = await response.json();
  let nonBlankIndex = 0;
  return kanjiLines.map((kanji) => {
    if (kanji.length === 0) return { kanji: '', hiragana: '', furigana: '' };
    const furigana = furiganaLines[nonBlankIndex] ?? '';
    nonBlankIndex++;
    return { kanji, hiragana: furiganaToHiragana(furigana), furigana };
  });
}
