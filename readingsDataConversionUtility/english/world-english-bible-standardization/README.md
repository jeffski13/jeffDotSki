sources from 
https://github.com/TehShrike/world-english-bible

## Conversion Script

`convert.js` converts the raw WEB source files in `input/` to the app's reading format and writes results to `output/`.

### Usage

```bash
node convert.js
```

### Input format (`input/*.json`)

Each file is an array of paragraph entries:

```json
[
  { "type": "paragraph start" },
  { "type": "paragraph text", "chapterNumber": 1, "verseNumber": 1, "sectionNumber": 1, "value": "..." },
  { "type": "paragraph end" }
]
```

A single verse may appear across multiple entries with incrementing `sectionNumber` values when it spans paragraph boundaries. The script concatenates these sections into one verse.

### Output format (`output/*.json`)

Each file matches the structure used in `app/readingsNihonDe/raw/en/`:

```json
{
  "bookName": "Matthew",
  "bookNameEnglish": "Matthew",
  "contents": [
    {
      "chapter": 1,
      "verses": [
        { "verseNumber": 1, "text": "The book of the genealogy of Jesus Christ..." }
      ]
    }
  ]
}
```

Output filenames use title-case with no spaces (e.g., `1Chronicles.json`, `SongOfSolomon.json`).

### Adding new books

Add an entry to `BOOK_NAME_MAP` in `convert.js` with the lowercase input filename key and the display name as the value.
