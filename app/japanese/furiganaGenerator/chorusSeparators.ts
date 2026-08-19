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

  // The service echoes each non-blank line sent back in order, but may also insert extra
  // section-marker lines (e.g. "-----") between them at chorus/verse boundaries - the
  // response is NOT guaranteed to be one-to-one with the lines sent. Walk it and only
  // reinsert an original blank line when a response line matches the next expected
  // original line; any other response line is a marker and is passed straight through
  // without consuming a slot, so it can't push later real lines out of the array.
  const separatedLines: string[] = await response.json();
  const outputLines: string[] = [];
  let kanjiIndex = 0;
  let nonBlankIndex = 0;

  for (const line of separatedLines) {
    if (line === nonBlankLines[nonBlankIndex]) {
      while (kanjiLines[kanjiIndex]?.length === 0) {
        outputLines.push('');
        kanjiIndex++;
      }
      kanjiIndex++;
      nonBlankIndex++;
    }
    outputLines.push(line);
  }
  while (kanjiIndex < kanjiLines.length) {
    outputLines.push('');
    kanjiIndex++;
  }

  return outputLines.join('\n');
}
