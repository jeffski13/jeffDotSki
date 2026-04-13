import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const Kuroshiro = require('kuroshiro').default;
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputDir = path.join(__dirname, 'input');
const outputDir = path.join(__dirname, 'output');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const kuroshiro = new Kuroshiro();
await kuroshiro.init(new KuromojiAnalyzer());

const inputFiles = fs.readdirSync(inputDir).filter(f => f.endsWith('.json'));

for (const filename of inputFiles) {
  const inputPath = path.join(inputDir, filename);
  const outputPath = path.join(outputDir, filename);

  const raw = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  const bookName = await kuroshiro.convert(raw.bookName, { to: 'hiragana' });

  const contents = await Promise.all(
    raw.contents.map(async (chapter) => ({
      ...chapter,
      verses: await Promise.all(
        chapter.verses.map(async (verse) => ({
          ...verse,
          text: await kuroshiro.convert(verse.text, { to: 'hiragana' }),
        }))
      ),
    }))
  );

  const output = {
    bookName,
    bookNameEnglish: raw.bookNameEnglish,
    contents,
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');
  console.log(`Converted: ${filename}`);
}

console.log('Done.');
