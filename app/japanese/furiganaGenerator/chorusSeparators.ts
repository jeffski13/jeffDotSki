import { CHORUS_SEPARATORS_URL } from './apiRoutes';

export async function applyChorusSeparators(kanjiText: string): Promise<string> {
  const kanjiLines = kanjiText.split('\n').map((line) => line.trim());
  const nonBlankLines = kanjiLines.filter((line) => line.length > 0);

  if (nonBlankLines.length === 0) return kanjiText;

  const response = await fetch(CHORUS_SEPARATORS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nonBlankLines),
  });

  if (!response.ok) {
    throw new Error(`Chorus separator service request failed: ${response.status} ${response.statusText}`);
  }

  // Mirrors buildFuriganaLinesFromKanji: the service returns one transformed line per
  // non-blank line sent, in the same order. Blank lines are reinserted here rather than
  // sent to the service so line breaks in the input are preserved in the output.
  const separatedLines: string[] = await response.json();
  let nonBlankIndex = 0;
  return kanjiLines
    .map((kanji) => {
      if (kanji.length === 0) return '';
      const separated = separatedLines[nonBlankIndex] ?? kanji;
      nonBlankIndex++;
      return separated;
    })
    .join('\n');
}
