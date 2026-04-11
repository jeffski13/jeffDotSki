import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node extractBookNames.js <input-file.json>");
  process.exit(1);
}

const inputPath = path.join(__dirname, "input", args[0]);
const outputPath = path.join(
  __dirname,
  "output",
  args[0].replace(".json", "_bookNames.json")
);

const raw = fs.readFileSync(inputPath, "utf8");
const data = JSON.parse(raw);

const seen = new Set();
const pairs = [];

for (const verse of data.verses) {
  const key = `${verse.book}:${verse.book_name}`;
  if (!seen.has(key)) {
    seen.add(key);
    pairs.push({ book: verse.book, book_name: verse.book_name });
  }
}

pairs.sort((a, b) => a.book - b.book);

const output = pairs.map(({ book, book_name }, index) => ({
  originalBook: book,
  originalBookName: book_name,
  bookOrderNumber: index + 1,
}));

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf8");

console.log(`Wrote ${output.length} book entries to ${outputPath}`);
