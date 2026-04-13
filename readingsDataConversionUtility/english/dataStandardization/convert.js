import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const inputDir = path.join(__dirname, 'input');
const outputDir = path.join(__dirname, 'output');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const inputFiles = fs.readdirSync(inputDir).filter(f => f.endsWith('.json'));

for (const filename of inputFiles) {
  const bookName = path.basename(filename, '.json');
  const inputPath = path.join(inputDir, filename);
  const outputPath = path.join(outputDir, filename);

  const raw = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  const contents = Object.entries(raw).map(([chapterKey, verses]) => ({
    chapter: parseInt(chapterKey, 10),
    verses: Object.entries(verses).map(([verseKey, text]) => ({
      verseNumber: parseInt(verseKey, 10),
      text,
    })),
  }));

  const output = {
    bookNameEnglish: bookName,
    contents,
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');
  console.log(`Converted: ${filename}`);
}

console.log('Done.');