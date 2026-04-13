import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node groupBooks.js <input-file.json>");
  process.exit(1);
}

const inputPath = path.join(__dirname, "input", args[0]);
const mappingPath = path.join(__dirname, "input", "japaneseBookNameMapping.json");
const outputDir = path.join(__dirname, "output");

const raw = fs.readFileSync(inputPath, "utf8");
const data = JSON.parse(raw);

const mapping = JSON.parse(fs.readFileSync(mappingPath, "utf8"));
const mappingByBookNumber = {};
for (const entry of mapping) {
  mappingByBookNumber[entry.originalBook] = entry;
}

// Group verses by book, then chapter
const books = {};
for (const verse of data.verses) {
  const bookNum = verse.book;
  if (!books[bookNum]) {
    books[bookNum] = {};
  }
  if (!books[bookNum][verse.chapter]) {
    books[bookNum][verse.chapter] = [];
  }
  books[bookNum][verse.chapter].push({ verseNumber: verse.verse, text: verse.text });
}

let filesWritten = 0;

for (const [bookNum, chapters] of Object.entries(books)) {
  const mapEntry = mappingByBookNumber[Number(bookNum)];
  if (!mapEntry) {
    console.warn(`No mapping found for book number ${bookNum}, skipping.`);
    continue;
  }

  const contents = Object.entries(chapters)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([chapter, verses]) => ({
      chapter: Number(chapter),
      verses: verses.sort((a, b) => a.verseNumber - b.verseNumber),
    }));

  const output = {
    bookName: mapEntry.originalBookName,
    bookNameEnglish: mapEntry.bookNameEnglish,
    contents,
  };

  const fileName = mapEntry.bookNameEnglish.replace(/\s+/g, "") + ".json";
  const outputPath = path.join(outputDir, fileName);
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf8");
  filesWritten++;
}

console.log(`Wrote ${filesWritten} book files to ${outputDir}`);