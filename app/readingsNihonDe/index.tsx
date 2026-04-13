import { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
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
  const [book, setBook] = useState<Book>('John');
  const [chapter, setChapter] = useState<string>('1');
  const [startVerse, setStartVerse] = useState<string>('1');
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [toggledVerses, setToggledVerses] = useState<Set<number>>(new Set());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const savedSettings = readingsSettingsStoreImpl.getSettings();
  const [displayOrder, setDisplayOrder] = useState<RowKey[]>(savedSettings.order);
  const [displayEnabled, setDisplayEnabled] = useState<Record<RowKey, boolean>>(savedSettings.enabled);
  const [splitOnKuten, setSplitOnKuten] = useState<boolean>(savedSettings.splitOnKuten ?? DEFAULT_SPLIT_ON_KUTEN);
  const dragSrc = useRef<RowKey | null>(null);

  useEffect(() => {
    readingsSettingsStoreImpl.saveSettings({ order: displayOrder, enabled: displayEnabled, splitOnKuten });
  }, [displayOrder, displayEnabled, splitOnKuten]);

  const handleResetSettings = () => {
    setDisplayOrder(DEFAULT_ORDER);
    setDisplayEnabled(DEFAULT_ENABLED);
    setSplitOnKuten(DEFAULT_SPLIT_ON_KUTEN);
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
              <Form.Label className="readingsNihonDe-label">Verse / 節</Form.Label>
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

          <Col xs={12} sm={2} md={2} className="readingsNihonDe-control-col readingsNihonDe-btn-col">
            <button
              className="readingsNihonDe-settings-toggle"
              onClick={() => setSettingsOpen((o) => !o)}
              aria-expanded={settingsOpen}
            >
              <span>Settings</span>
              <span className="readingsNihonDe-settings-caret">{settingsOpen ? '▲' : '▼'}</span>
            </button>
          </Col>

          {settingsOpen && (
            <Col xs={12} className="readingsNihonDe-settings-row">
              <div className="readingsNihonDe-settings-panel">
                <div className="readingsNihonDe-settings-hint-row">
                  <p className="readingsNihonDe-settings-hint">
                    Toggle rows on/off and drag to reorder.
                  </p>
                  <Button
                    variant="danger"
                    size="sm"
                    className="readingsNihonDe-settings-reset"
                    onClick={handleResetSettings}
                  >
                    Reset
                  </Button>
                </div>
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
                    label='Split sentences at 。'
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
                <div
                  key="toggle"
                  className="readingsNihonDe-verse-row readingsNihonDe-verse-row--toggle"
                  onClick={() => toggleVerse(verse.number)}
                  title="Click to toggle kanji+kana reading"
                >
                  <span className="verse-tag verse-tag--toggle">調整</span>
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
    </div>
  );
}
