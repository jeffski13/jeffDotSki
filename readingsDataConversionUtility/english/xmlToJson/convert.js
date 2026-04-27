#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BOOK_NAMES = {
  'Gen':    'Genesis',
  'Exod':   'Exodus',
  'Lev':    'Leviticus',
  'Num':    'Numbers',
  'Deut':   'Deuteronomy',
  'Josh':   'Joshua',
  'Judg':   'Judges',
  'Ruth':   'Ruth',
  '1Sam':   '1 Samuel',
  '2Sam':   '2 Samuel',
  '1Kgs':   '1 Kings',
  '2Kgs':   '2 Kings',
  '1Chr':   '1 Chronicles',
  '2Chr':   '2 Chronicles',
  'Ezra':   'Ezra',
  'Neh':    'Nehemiah',
  'Esth':   'Esther',
  'Job':    'Job',
  'Ps':     'Psalms',
  'Prov':   'Proverbs',
  'Eccl':   'Ecclesiastes',
  'Song':   'Song of Solomon',
  'Isa':    'Isaiah',
  'Jer':    'Jeremiah',
  'Lam':    'Lamentations',
  'Ezek':   'Ezekiel',
  'Dan':    'Daniel',
  'Hos':    'Hosea',
  'Joel':   'Joel',
  'Amos':   'Amos',
  'Obad':   'Obadiah',
  'Jonah':  'Jonah',
  'Mic':    'Micah',
  'Nah':    'Nahum',
  'Hab':    'Habakkuk',
  'Zeph':   'Zephaniah',
  'Hag':    'Haggai',
  'Zech':   'Zechariah',
  'Mal':    'Malachi',
  'Matt':   'Matthew',
  'Mark':   'Mark',
  'Luke':   'Luke',
  'John':   'John',
  'Acts':   'Acts',
  'Rom':    'Romans',
  '1Cor':   '1 Corinthians',
  '2Cor':   '2 Corinthians',
  'Gal':    'Galatians',
  'Eph':    'Ephesians',
  'Phil':   'Philippians',
  'Col':    'Colossians',
  '1Thess': '1 Thessalonians',
  '2Thess': '2 Thessalonians',
  '1Tim':   '1 Timothy',
  '2Tim':   '2 Timothy',
  'Titus':  'Titus',
  'Phlm':   'Philemon',
  'Heb':    'Hebrews',
  'Jas':    'James',
  '1Pet':   '1 Peter',
  '2Pet':   '2 Peter',
  '1John':  '1 John',
  '2John':  '2 John',
  '3John':  '3 John',
  'Jude':   'Jude',
  'Rev':    'Revelation',
};

const inputPath = path.join(__dirname, 'input', 'rsv.xml');
const outputDir = path.join(__dirname, 'output');

const xml = fs.readFileSync(inputPath, 'utf8');
const lines = xml.split('\n');

const bookDivRegex = /<div type='book' osisID='([^']+)'>/;
const chapterRegex = /<chapter osisID='[^.]+\.(\d+)'>/;
const verseRegex = /<verse osisID='[^.]+\.[^.]+\.(\d+)'>(.*?)<\/verse>/;

const books = {};
const bookOrder = [];
let currentBook = null;
let currentChapter = null;

for (const line of lines) {
  const trimmed = line.trim();
  let match;

  if ((match = bookDivRegex.exec(trimmed))) {
    currentBook = match[1];
    books[currentBook] = {};
    bookOrder.push(currentBook);
    currentChapter = null;
  } else if ((match = chapterRegex.exec(trimmed))) {
    currentChapter = parseInt(match[1], 10);
    if (currentBook) {
      books[currentBook][currentChapter] = [];
    }
  } else if ((match = verseRegex.exec(trimmed))) {
    const verseNum = parseInt(match[1], 10);
    const text = match[2];
    if (currentBook && currentChapter !== null) {
      books[currentBook][currentChapter].push({ verseNumber: verseNum, text });
    }
  }
}

for (const osisId of bookOrder) {
  const bookName = BOOK_NAMES[osisId];
  if (!bookName) {
    console.warn(`Skipping unknown book ID: ${osisId}`);
    continue;
  }

  const chapterData = books[osisId];
  const contents = Object.keys(chapterData)
    .map(Number)
    .sort((a, b) => a - b)
    .map(chapterNum => ({
      chapter: chapterNum,
      verses: chapterData[chapterNum],
    }));

  const output = {
    bookName,
    bookNameEnglish: bookName,
    contents,
  };

  const fileName = bookName.replace(/ /g, '') + '.json';
  const outputPath = path.join(outputDir, fileName);
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`Written: ${fileName}`);
}

console.log(`\nDone. ${bookOrder.length} books converted.`);
