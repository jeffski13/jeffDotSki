import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const INPUT_DIR = path.join(__dirname, 'input');
const OUTPUT_DIR = path.join(__dirname, 'output');

const BOOK_NAME_MAP = {
  'genesis': 'Genesis',
  'exodus': 'Exodus',
  'leviticus': 'Leviticus',
  'numbers': 'Numbers',
  'deuteronomy': 'Deuteronomy',
  'joshua': 'Joshua',
  'judges': 'Judges',
  'ruth': 'Ruth',
  '1samuel': '1 Samuel',
  '2samuel': '2 Samuel',
  '1kings': '1 Kings',
  '2kings': '2 Kings',
  '1chronicles': '1 Chronicles',
  '2chronicles': '2 Chronicles',
  'ezra': 'Ezra',
  'nehemiah': 'Nehemiah',
  'esther': 'Esther',
  'job': 'Job',
  'psalms': 'Psalms',
  'proverbs': 'Proverbs',
  'ecclesiastes': 'Ecclesiastes',
  'songofsolomon': 'Song of Solomon',
  'isaiah': 'Isaiah',
  'jeremiah': 'Jeremiah',
  'lamentations': 'Lamentations',
  'ezekiel': 'Ezekiel',
  'daniel': 'Daniel',
  'hosea': 'Hosea',
  'joel': 'Joel',
  'amos': 'Amos',
  'obadiah': 'Obadiah',
  'jonah': 'Jonah',
  'micah': 'Micah',
  'nahum': 'Nahum',
  'habakkuk': 'Habakkuk',
  'zephaniah': 'Zephaniah',
  'haggai': 'Haggai',
  'zechariah': 'Zechariah',
  'malachi': 'Malachi',
  'matthew': 'Matthew',
  'mark': 'Mark',
  'luke': 'Luke',
  'john': 'John',
  'acts': 'Acts',
  'romans': 'Romans',
  '1corinthians': '1 Corinthians',
  '2corinthians': '2 Corinthians',
  'galatians': 'Galatians',
  'ephesians': 'Ephesians',
  'philippians': 'Philippians',
  'colossians': 'Colossians',
  '1thessalonians': '1 Thessalonians',
  '2thessalonians': '2 Thessalonians',
  '1timothy': '1 Timothy',
  '2timothy': '2 Timothy',
  'titus': 'Titus',
  'philemon': 'Philemon',
  'hebrews': 'Hebrews',
  'james': 'James',
  '1peter': '1 Peter',
  '2peter': '2 Peter',
  '1john': '1 John',
  '2john': '2 John',
  '3john': '3 John',
  'jude': 'Jude',
  'revelation': 'Revelation',
};

function convertBook(inputPath, bookKey) {
  const bookName = BOOK_NAME_MAP[bookKey];
  if (!bookName) {
    console.warn(`No book name mapping for: ${bookKey} — skipping`);
    return;
  }

  const raw = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  // Collect verse sections grouped by chapter+verse, preserving order
  const chapterMap = new Map();

  for (const entry of raw) {
    if (entry.type !== 'paragraph text') continue;

    const { chapterNumber, verseNumber, value } = entry;

    if (!chapterMap.has(chapterNumber)) {
      chapterMap.set(chapterNumber, new Map());
    }
    const verseMap = chapterMap.get(chapterNumber);

    const trimmed = value.trim();
    if (verseMap.has(verseNumber)) {
      verseMap.set(verseNumber, verseMap.get(verseNumber) + ' ' + trimmed);
    } else {
      verseMap.set(verseNumber, trimmed);
    }
  }

  const contents = [];
  for (const [chapterNum, verseMap] of chapterMap) {
    const verses = [];
    for (const [verseNum, text] of verseMap) {
      verses.push({ verseNumber: verseNum, text });
    }
    contents.push({ chapter: chapterNum, verses });
  }

  return { bookName, bookNameEnglish: bookName, contents };
}

function run() {
  const inputFiles = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.json'));

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let converted = 0;
  let skipped = 0;

  for (const file of inputFiles) {
    const bookKey = path.basename(file, '.json');
    const inputPath = path.join(INPUT_DIR, file);

    const result = convertBook(inputPath, bookKey);
    if (!result) {
      skipped++;
      continue;
    }

    const outputFilename = result.bookName.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join('') + '.json';
    const outputPath = path.join(OUTPUT_DIR, outputFilename);
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log(`✓ ${file} → ${outputFilename}`);
    converted++;
  }

  console.log(`\nDone: ${converted} converted, ${skipped} skipped.`);
}

run();
