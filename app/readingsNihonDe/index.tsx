import { useState } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import './styles.css';

import MatthewEn from './raw/en/Matthew.json';
import MarkEn from './raw/en/Mark.json';
import LukeEn from './raw/en/Luke.json';
import JohnEn from './raw/en/John.json';
import MatthewJp from './raw/jp/Matthew.json';
import MarkJp from './raw/jp/Mark.json';
import LukeJp from './raw/jp/Luke.json';
import JohnJp from './raw/jp/John.json';
import MatthewJpKana from './raw/jpkana/Matthew.json';
import MarkJpKana from './raw/jpkana/Mark.json';
import LukeJpKana from './raw/jpkana/Luke.json';
import JohnJpKana from './raw/jpkana/John.json';

type Book = 'Matthew' | 'Mark' | 'Luke' | 'John';

interface RawVerse {
  verseNumber: number;
  text: string;
}

interface RawChapter {
  chapter: number;
  verses: RawVerse[];
}

interface RawBook {
  contents: RawChapter[];
}

const EN_DATA: Record<Book, RawBook> = {
  Matthew: MatthewEn,
  Mark: MarkEn,
  Luke: LukeEn,
  John: JohnEn,
};

const JP_DATA: Record<Book, RawBook> = {
  Matthew: MatthewJp,
  Mark: MarkJp,
  Luke: LukeJp,
  John: JohnJp,
};

const JP_KANA_DATA: Record<Book, RawBook> = {
  Matthew: MatthewJpKana,
  Mark: MarkJpKana,
  Luke: LukeJpKana,
  John: JohnJpKana,
};

interface Verse {
  number: number;
  japanese: string;
  kanjiWithHiraganaKatakana: string;
  japaneseKanaOnly: string;
  english: string;
}

function fetchChapterVerses(
  book: Book,
  chapter: number,
  startVerse: number
): Verse[] {
  const jpChapter = JP_DATA[book].contents.find((c) => c.chapter === chapter);
  const enChapter = EN_DATA[book].contents.find((c) => c.chapter === chapter);
  const jpKanaChapter = JP_KANA_DATA[book].contents.find((c) => c.chapter === chapter);

  if (!jpChapter || !enChapter) return [];

  const results: Verse[] = [];

  for (let i = startVerse - 1; i < jpChapter.verses.length; i++) {
    const jpVerse = jpChapter.verses[i];
    const enVerse = enChapter.verses[i];
    const jpKanaVerse = jpKanaChapter?.verses[i];
    if (!jpVerse || !enVerse) break;

    results.push({
      number: jpVerse.verseNumber,
      japanese: jpVerse.text.trim(),
      kanjiWithHiraganaKatakana: jpVerse.text.trim(),
      japaneseKanaOnly: jpKanaVerse?.text.trim() ?? jpVerse.text.trim(),
      english: enVerse.text.trim(),
    });
  }

  return results;
}

const BOOKS: Book[] = ['Matthew', 'Mark', 'Luke', 'John'];

const BOOK_JAPANESE: Record<Book, string> = {
  Matthew: 'マタイ',
  Mark: 'マルコ',
  Luke: 'ルカ',
  John: 'ヨハネ',
};

export default function ReadingsNihonDe() {
  const [book, setBook] = useState<Book>('John');
  const [chapter, setChapter] = useState<string>('1');
  const [startVerse, setStartVerse] = useState<string>('1');
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const chapterNum = parseInt(chapter, 10);
    const verseNum = parseInt(startVerse, 10);

    if (isNaN(chapterNum) || chapterNum < 1) {
      setError('Please enter a valid chapter number.');
      return;
    }
    if (isNaN(verseNum) || verseNum < 1) {
      setError('Please enter a valid starting verse number.');
      return;
    }

    setLoading(true);
    setError(null);
    setVerses([]);
    setSearched(true);

    try {
      const results = await fetchChapterVerses(book, chapterNum, verseNum);
      if (results.length === 0) {
        setError('No verses found for the given passage.');
      } else {
        setVerses(results);
      }
    } catch {
      setError('Could not load the passage. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const chapterNum = parseInt(chapter, 10);
  const verseNum = parseInt(startVerse, 10);
  const hasPassage = verses.length > 0;

  return (
    <div className="readingsNihonDe-wrapper">
      <Container>
        <Row className="readingsNihonDe-header">
          <Col xs={12}>
            <h1 className="readingsNihonDe-title">
              日本語で聖書 <span className="readingsNihonDe-subtitle">Bible in Japanese</span>
            </h1>
          </Col>
        </Row>

        <Row className="readingsNihonDe-controls">
          <Col xs={12} sm={4} md={3} className="readingsNihonDe-control-col">
            <Form.Group>
              <Form.Label className="readingsNihonDe-label">Book / 書</Form.Label>
              <Form.Select
                value={book}
                onChange={(e) => setBook(e.target.value as Book)}
                className="readingsNihonDe-select"
              >
                {BOOKS.map((b) => (
                  <option key={b} value={b}>
                    {b} ({BOOK_JAPANESE[b]})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xs={6} sm={3} md={2} className="readingsNihonDe-control-col">
            <Form.Group>
              <Form.Label className="readingsNihonDe-label">Chapter / 章</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="readingsNihonDe-input"
                placeholder="e.g. 3"
              />
            </Form.Group>
          </Col>

          <Col xs={6} sm={3} md={2} className="readingsNihonDe-control-col">
            <Form.Group>
              <Form.Label className="readingsNihonDe-label">From Verse / 節</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={startVerse}
                onChange={(e) => setStartVerse(e.target.value)}
                className="readingsNihonDe-input"
                placeholder="e.g. 1"
              />
            </Form.Group>
          </Col>

          <Col xs={12} sm={2} md={2} className="readingsNihonDe-control-col readingsNihonDe-btn-col">
            <Button
              variant="primary"
              onClick={handleSearch}
              disabled={loading}
              className="readingsNihonDe-btn"
            >
              {loading ? <Spinner animation="border" size="sm" /> : '読む / Read'}
            </Button>
          </Col>
        </Row>

        {error && (
          <Row>
            <Col xs={12}>
              <Alert variant="danger" className="mt-3">{error}</Alert>
            </Col>
          </Row>
        )}

        {hasPassage && (
          <Row className="readingsNihonDe-passage-header">
            <Col xs={12}>
              <h2 className="readingsNihonDe-passage-title">
                {BOOK_JAPANESE[book]} {chapterNum}:{verseNum}–
                {verses[verses.length - 1].number}
                <span className="readingsNihonDe-passage-title-en">
                  {' '}({book} {chapterNum}:{verseNum}–{verses[verses.length - 1].number})
                </span>
              </h2>
            </Col>
          </Row>
        )}

        {verses.map((verse) => (
          <div key={verse.number} className="readingsNihonDe-verse-block">
            <div className="readingsNihonDe-verse-number">{verse.number}</div>

            <div className="readingsNihonDe-verse-row">
              <span className="verse-tag verse-tag--en">EN</span>
              <span className="readingsNihonDe-verse-text readingsNihonDe-english">
                {verse.english}
              </span>
            </div>

            <div className="readingsNihonDe-verse-row">
              <span className="verse-tag verse-tag--kanji">漢字</span>
              <span className="readingsNihonDe-verse-text readingsNihonDe-japanese">
                {verse.japanese}
              </span>
            </div>

            <div className="readingsNihonDe-verse-row">
              <span className="verse-tag verse-tag--kana">かな</span>
              <span className="readingsNihonDe-verse-text readingsNihonDe-kana">
                {verse.japaneseKanaOnly}
              </span>
            </div>

          </div>
        ))}

        {searched && !loading && !error && verses.length === 0 && (
          <Row>
            <Col xs={12}>
              <Alert variant="info" className="mt-3">No verses found.</Alert>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}
