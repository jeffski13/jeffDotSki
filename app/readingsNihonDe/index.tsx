import { useState } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import './styles.css';

type Book = 'Matthew' | 'Mark' | 'Luke' | 'John';

const BOOK_NUMBER: Record<Book, number> = {
  Matthew: 40,
  Mark: 41,
  Luke: 42,
  John: 43,
};

interface Verse {
  number: number;
  japanese: string;
  kanaOnly: string;
  english: string;
}

interface GetBibleVerse {
  verse: number;
  text: string;
}

interface GetBibleChapter {
  verses: Record<string, GetBibleVerse>;
}

async function fetchChapterVerses(
  book: Book,
  chapter: number,
  startVerse: number
): Promise<Verse[]> {
  const bookNum = BOOK_NUMBER[book];

  const headers = { 'Access-Control-Allow-Origin': '*' };

  const [jaResponse, enResponse] = await Promise.all([
    fetch(`https://api.getbible.net/v2/kougo/${bookNum}/${chapter}.json`, { headers }),
    fetch(`https://api.getbible.net/v2/kjv/${bookNum}/${chapter}.json`, { headers }),
  ]);

  if (!jaResponse.ok || !enResponse.ok) {
    throw new Error('Failed to fetch Bible passages.');
  }

  const jaData: GetBibleChapter = await jaResponse.json();
  const enData: GetBibleChapter = await enResponse.json();

  const jaVerses = Object.values(jaData.verses);
  const enVerses = Object.values(enData.verses);

  const results: Verse[] = [];

  for (let i = startVerse - 1; i < jaVerses.length; i++) {
    const jaVerse = jaVerses[i];
    const enVerse = enVerses[i];
    if (!jaVerse || !enVerse) break;

    results.push({
      number: jaVerse.verse,
      japanese: jaVerse.text.trim(),
      kanaOnly: jaVerse.text.trim(),
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
  const [chapter, setChapter] = useState<string>('3');
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
              <div className="readingsNihonDe-translation-legend">
                <span className="legend-tag legend-kanji">漢字</span> Japanese with Kanji &nbsp;
                <span className="legend-tag legend-kana">かな</span> Hiragana / Katakana &nbsp;
                <span className="legend-tag legend-en">EN</span> English (KJV)
              </div>
            </Col>
          </Row>
        )}

        {verses.map((verse) => (
          <div key={verse.number} className="readingsNihonDe-verse-block">
            <div className="readingsNihonDe-verse-number">{verse.number}</div>

            <div className="readingsNihonDe-verse-row">
              <span className="verse-tag verse-tag--kanji">漢字</span>
              <span className="readingsNihonDe-verse-text readingsNihonDe-japanese">
                {verse.japanese}
              </span>
            </div>

            <div className="readingsNihonDe-verse-row">
              <span className="verse-tag verse-tag--kana">かな</span>
              <span className="readingsNihonDe-verse-text readingsNihonDe-kana">
                {verse.kanaOnly}
              </span>
            </div>

            <div className="readingsNihonDe-verse-row">
              <span className="verse-tag verse-tag--en">EN</span>
              <span className="readingsNihonDe-verse-text readingsNihonDe-english">
                {verse.english}
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
