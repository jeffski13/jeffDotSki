import { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import './styles.css';
import { DISPLAY_OPTIONS, DEFAULT_ORDER, DEFAULT_ENABLED, DEFAULT_SPLIT_ON_KUTEN, readingsSettingsStoreImpl, type RowKey } from './readingsSettings';

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
import MatthewJpKanjiKana from './raw/jpkanjikana/Matthew.json';
import MarkJpKanjiKana from './raw/jpkanjikana/Mark.json';
import LukeJpKanjiKana from './raw/jpkanjikana/Luke.json';
import JohnJpKanjiKana from './raw/jpkanjikana/John.json';

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

const JP_KANJI_KANA_DATA: Record<Book, RawBook> = {
  Matthew: MatthewJpKanjiKana,
  Mark: MarkJpKanjiKana,
  Luke: LukeJpKanjiKana,
  John: JohnJpKanjiKana,
};

interface Verse {
  number: number;
  japanese: string;
  japaneseKanjiKana: string;
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
  const jpKanjiKanaChapter = JP_KANJI_KANA_DATA[book].contents.find((c) => c.chapter === chapter);

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
      japaneseKanjiKana: jpKanjiKanaChapter?.verses[i]?.text.trim() ?? jpVerse.text.trim(),
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
  const savedSettings = readingsSettingsStoreImpl.getSettings();
  const [book, setBook] = useState<Book>((savedSettings.lastBook as Book) ?? 'John');
  const [chapter, setChapter] = useState<string>(savedSettings.lastChapter ?? '1');
  const [startVerse, setStartVerse] = useState<string>('1');
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [toggledVerses, setToggledVerses] = useState<Set<number>>(new Set());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [displayOrder, setDisplayOrder] = useState<RowKey[]>(savedSettings.order);
  const [displayEnabled, setDisplayEnabled] = useState<Record<RowKey, boolean>>(savedSettings.enabled);
  const [splitOnKuten, setSplitOnKuten] = useState<boolean>(savedSettings.splitOnKuten ?? DEFAULT_SPLIT_ON_KUTEN);
  const dragSrc = useRef<RowKey | null>(null);

  useEffect(() => {
    readingsSettingsStoreImpl.saveSettings({ order: displayOrder, enabled: displayEnabled, splitOnKuten, lastBook: book, lastChapter: chapter });
  }, [displayOrder, displayEnabled, splitOnKuten, book, chapter]);

  useEffect(() => {
    if (savedSettings.lastBook && savedSettings.lastChapter) {
      handleSearch();
    }
  }, []);

  const handleResetSettings = () => {
    setDisplayOrder(DEFAULT_ORDER);
    setDisplayEnabled(DEFAULT_ENABLED);
    setSplitOnKuten(DEFAULT_SPLIT_ON_KUTEN);
    setBook('John');
    setChapter('1');
  };

  const renderJpText = (text: string): React.ReactNode => {
    if (!splitOnKuten) return text;
    return text.split('。').reduce<React.ReactNode[]>((acc, part, i, arr) => {
      if (i < arr.length - 1) {
        acc.push(part + '。');
        acc.push(<br key={i} />);
      } else if (part) {
        acc.push(part);
      }
      return acc;
    }, []);
  };

  const toggleEnabled = (key: RowKey) =>
    setDisplayEnabled((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleDragStart = (key: RowKey) => { dragSrc.current = key; };

  const handleDrop = (targetKey: RowKey) => {
    const src = dragSrc.current;
    if (!src || src === targetKey) return;
    setDisplayOrder((prev) => {
      const next = [...prev];
      const srcIdx = next.indexOf(src);
      const tgtIdx = next.indexOf(targetKey);
      next.splice(srcIdx, 1);
      next.splice(tgtIdx, 0, src);
      return next;
    });
    dragSrc.current = null;
  };

  const toggleVerse = (verseNumber: number) => {
    setToggledVerses((prev) => {
      const next = new Set(prev);
      if (next.has(verseNumber)) {
        next.delete(verseNumber);
      } else {
        next.add(verseNumber);
      }
      return next;
    });
  };

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
              <Form.Label className="readingsNihonDe-label">Book (書)</Form.Label>
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

          <Col xs={5} sm={3} md={2} className="readingsNihonDe-control-col">
            <Form.Group>
              <Form.Label className="readingsNihonDe-label">Chapter (章)</Form.Label>
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

          <Col xs={5} sm={3} md={2} className="readingsNihonDe-control-col">
            <Form.Group>
              <Form.Label className="readingsNihonDe-label">Verse (節)</Form.Label>
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
              {loading ? <Spinner animation="border" size="sm" /> : 'Read (読む)'}
            </Button>
          </Col>

          <Col xs={12} sm={2} md={2} className="readingsNihonDe-control-col readingsNihonDe-btn-col readingsNihonDe-settings-col">
            <button
              className="readingsNihonDe-settings-toggle"
              onClick={() => setSettingsOpen((o) => !o)}
              aria-expanded={settingsOpen}
            >
              <span>Settings</span>
              <span className="readingsNihonDe-settings-caret">{settingsOpen ? '▲' : '▼'}</span>
            </button>
            <button
              className="readingsNihonDe-settings-reset"
              onClick={() => setConfirmResetOpen(true)}
              title="Reset settings"
              aria-label="Reset settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
            </button>
          </Col>

          {settingsOpen && (
            <Col xs={12} className="readingsNihonDe-settings-row">
              <div className="readingsNihonDe-settings-panel">
                <p className="readingsNihonDe-settings-hint">
                  Toggle rows on/off and drag to reorder.
                </p>
                <ul className="readingsNihonDe-settings-list">
                  {displayOrder.map((key) => {
                    const opt = DISPLAY_OPTIONS.find((o) => o.key === key)!;
                    return (
                      <li
                        key={key}
                        className="readingsNihonDe-settings-item"
                        draggable
                        onDragStart={() => handleDragStart(key)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(key)}
                      >
                        <span className="readingsNihonDe-settings-drag-handle">⠿</span>
                        <span className={`verse-tag ${opt.tagClass}`}>{opt.tagText}</span>
                        <span className="readingsNihonDe-settings-label">{opt.label}</span>
                        <Form.Check
                          type="switch"
                          id={`display-toggle-${key}`}
                          checked={displayEnabled[key]}
                          onChange={() => toggleEnabled(key)}
                          className="readingsNihonDe-settings-switch"
                        />
                      </li>
                    );
                  })}
                </ul>
                <div className="readingsNihonDe-settings-extra">
                  <Form.Check
                    type="checkbox"
                    id="split-on-kuten"
                    label='New lines after Japanese periods'
                    checked={splitOnKuten}
                    onChange={() => setSplitOnKuten((prev) => !prev)}
                  />
                </div>
              </div>
            </Col>
          )}
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

            {displayOrder.map((key) => {
              if (!displayEnabled[key]) return null;
              if (key === 'english') return (
                <div key="english" className="readingsNihonDe-verse-row">
                  <span className="verse-tag verse-tag--en">EN</span>
                  <span className="readingsNihonDe-verse-text readingsNihonDe-english">
                    {verse.english}
                  </span>
                </div>
              );
              if (key === 'japanese') return (
                <div key="japanese" className="readingsNihonDe-verse-row">
                  <span className="verse-tag verse-tag--kanji">漢字</span>
                  <span className="readingsNihonDe-verse-text readingsNihonDe-japanese">
                    {renderJpText(verse.japanese)}
                  </span>
                </div>
              );
              if (key === 'toggle') return (
                <div key="toggle" className="readingsNihonDe-verse-row">
                  <button
                    className="readingsNihonDe-toggle-btn"
                    onClick={() => toggleVerse(verse.number)}
                    title="Toggle kanji+kana reading"
                    aria-label="Toggle kanji+kana reading"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                      <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                    </svg>
                  </button>
                  <span className="readingsNihonDe-verse-text readingsNihonDe-toggle-text">
                    {renderJpText(toggledVerses.has(verse.number) ? verse.japaneseKanjiKana : verse.japanese)}
                  </span>
                </div>
              );
              if (key === 'kanaOnly') return (
                <div key="kanaOnly" className="readingsNihonDe-verse-row">
                  <span className="verse-tag verse-tag--kana">かな</span>
                  <span className="readingsNihonDe-verse-text readingsNihonDe-kana">
                    {renderJpText(verse.japaneseKanaOnly)}
                  </span>
                </div>
              );
              if (key === 'kanjiKana') return (
                <div key="kanjiKana" className="readingsNihonDe-verse-row">
                  <span className="verse-tag verse-tag--kanjikana">両方</span>
                  <span className="readingsNihonDe-verse-text readingsNihonDe-kanjikana">
                    {renderJpText(verse.japaneseKanjiKana)}
                  </span>
                </div>
              );
              return null;
            })}

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

      <Modal show={confirmResetOpen} onHide={() => setConfirmResetOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reset Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>Reset book, chapter, and all display settings to defaults?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmResetOpen(false)}>No</Button>
          <Button variant="danger" onClick={() => { handleResetSettings(); setConfirmResetOpen(false); }}>Yes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
