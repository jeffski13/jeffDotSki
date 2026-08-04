/// <reference types="vitest/globals" />
import { buildLyricsSongFileContent } from './exportLyricsSong';
import type { FuriganaLine } from './furiganaGenerator';

const convertedLines: FuriganaLine[] = [
  { kanji: '誰にも見せない', hiragana: 'だれにもみせない', furigana: '誰（だれ）にも見（み）せない' },
  { kanji: '泪があった', hiragana: 'なみだがあった', furigana: '泪（なみだ）があった' },
];

describe('buildLyricsSongFileContent', () => {
  it('builds a LyricsSong module without romaji when romajiText is blank', () => {
    const content = buildLyricsSongFileContent({
      title: '涙 (Namida)',
      kanjiText: '誰にも見せない\n泪があった',
      romajiText: '',
      convertedLines,
    });

    expect(content).toBe(
      `import type { LyricsSong } from "./types";

const lyrics: LyricsSong = {
  title: "涙 (Namida)",
  jp: [
    "誰にも見せない",
    "泪があった",
  ],
  furigana: [
    "誰（だれ）にも見（み）せない",
    "泪（なみだ）があった",
  ],
};

export default lyrics;
`,
    );
  });

  it('includes a romaji array, aligned with jp/furigana, when romajiText is present', () => {
    const content = buildLyricsSongFileContent({
      title: '涙',
      kanjiText: '誰にも見せない\n泪があった',
      romajiText: 'dare nimo misenai\nnamida ga atta',
      convertedLines,
    });

    expect(content).toContain(
      `  romaji: [
    "dare nimo misenai",
    "namida ga atta",
  ],`,
    );
  });

  it('keeps a blank line between kanji/romaji so the exported romaji stays aligned with convertedLines', () => {
    const content = buildLyricsSongFileContent({
      title: '涙',
      kanjiText: '誰にも見せない\n\n泪があった',
      romajiText: 'dare nimo misenai\n\nnamida ga atta',
      convertedLines: [
        { kanji: '誰にも見せない', hiragana: 'だれにもみせない', furigana: '誰（だれ）にも見（み）せない' },
        { kanji: '', hiragana: '', furigana: '' },
        { kanji: '泪があった', hiragana: 'なみだがあった', furigana: '泪（なみだ）があった' },
      ],
    });

    expect(content).toContain(
      `  romaji: [
    "dare nimo misenai",
    "",
    "namida ga atta",
  ],`,
    );
  });

  it('escapes double quotes and backslashes in the title', () => {
    const content = buildLyricsSongFileContent({
      title: 'A "great" song \\ remix',
      kanjiText: '誰にも見せない\n泪があった',
      romajiText: '',
      convertedLines,
    });

    expect(content).toContain('title: "A \\"great\\" song \\\\ remix",');
  });
});
