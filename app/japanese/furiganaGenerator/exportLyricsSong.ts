import type { FuriganaLine } from './furiganaGenerator';

export interface LyricsSongExportInput {
  title: string;
  kanjiText: string;
  romajiText: string;
  convertedLines: FuriganaLine[];
}

function escapeForTsString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function formatStringArray(lines: string[]): string {
  return `[\n${lines.map((line) => `    "${escapeForTsString(line)}",`).join('\n')}\n  ]`;
}

// Mirrors the line-up/filter logic buildFuriganaLines uses internally (pairing kanji and romaji
// lines by index and dropping lines where both sides are blank) so the exported romaji array
// stays aligned with jp/furigana, which are derived from convertedLines.
function alignedRomajiLines(kanjiText: string, romajiText: string): string[] {
  const kanjiLines = kanjiText.split('\n').map((line) => line.trim());
  const romajiLines = romajiText.split('\n').map((line) => line.trim());
  const lineCount = Math.max(kanjiLines.length, romajiLines.length);

  return Array.from({ length: lineCount }, (_, i) => romajiLines[i] ?? '').filter(
    (_, i) => (kanjiLines[i] ?? '').length > 0 || (romajiLines[i] ?? '').length > 0,
  );
}

export function buildLyricsSongFileContent({ title, kanjiText, romajiText, convertedLines }: LyricsSongExportInput): string {
  const jp = convertedLines.map((line) => line.kanji);
  const furigana = convertedLines.map((line) => line.furigana);

  const fields = [
    `  title: "${escapeForTsString(title)}",`,
    `  jp: ${formatStringArray(jp)},`,
    `  furigana: ${formatStringArray(furigana)},`,
  ];

  if (romajiText.trim().length > 0) {
    fields.push(`  romaji: ${formatStringArray(alignedRomajiLines(kanjiText, romajiText))},`);
  }

  return `import type { LyricsSong } from "./types";\n\nconst lyrics: LyricsSong = {\n${fields.join('\n')}\n};\n\nexport default lyrics;\n`;
}

function slugify(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug || 'lyrics';
}

export function downloadLyricsSongFile(input: LyricsSongExportInput): void {
  const content = buildLyricsSongFileContent(input);
  const blob = new Blob([content], { type: 'text/typescript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slugify(input.title)}.ts`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
