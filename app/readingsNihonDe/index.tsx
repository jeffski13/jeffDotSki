import { useState, useRef, useEffect } from 'react';
import { version } from '../../package.json';
import { Container, Row, Col, Form, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import './styles.css';
import { DISPLAY_OPTIONS, DEFAULT_ORDER, DEFAULT_ENABLED, DEFAULT_SPLIT_ON_KUTEN, DEFAULT_TOGGLE_KANJI_KANA, DEFAULT_TOGGLE_FURIGANA, DEFAULT_SPLIT_ENGLISH_DIALOGUE, DEFAULT_SPLIT_JP_DIALOGUE, ROWKEYS, readingsSettingsStoreImpl, type RowKey } from './readingsSettings';
import bookMapping from './japaneseBookNameMapping.json';

type Book = string;

// JP filename = English book name with spaces removed (e.g. "Song of Solomon" → "SongofSolomon")
function toJpFilename(englishName: string): Book {
  return englishName.replace(/\s+/g, '');
}

const BOOKS: Book[] = bookMapping.map((b) => toJpFilename(b.bookNameEnglish));
const OT_BOOKS = BOOKS.slice(0, 39);
const NT_BOOKS = BOOKS.slice(39);

const BOOK_JAPANESE: Record<Book, string> = Object.fromEntries(
  bookMapping.map((b) => [toJpFilename(b.bookNameEnglish), b.originalBookName])
);

const BOOK_ENGLISH_DISPLAY: Record<Book, string> = Object.fromEntries(
  bookMapping.map((b) => [toJpFilename(b.bookNameEnglish), b.bookNameEnglish])
);

// Douay-Rheims EN filenames that differ from the standard JP filenames
const EN_FILE_MAP: Record<string, string> = {
  '1Samuel': '1Kings',
  '2Samuel': '2Kings',
  '1Kings': '3Kings',
  '2Kings': '4Kings',
  '1Chronicles': '1Paralipomenon',
  '2Chronicles': '2Paralipomenon',
  'Ezra': '1Esdras',
  'Nehemiah': '2Esdras',
  'Joshua': 'Josue',
  'Isaiah': 'Isaias',
  'Jeremiah': 'Jeremias',
  'Ezekiel': 'Ezechiel',
  'Hosea': 'Osee',
  'Obadiah': 'Abdias',
  'Jonah': 'Jonas',
  'Micah': 'Micheas',
  'Habakkuk': 'Habacuc',
  'Zephaniah': 'Sophonias',
  'Haggai': 'Aggeus',
  'Zechariah': 'Zacharias',
  'Malachi': 'Malachias',
  'SongofSolomon': 'Canticles',
  'Revelation': 'Apocalypse',
};

const JP_MODULES = import.meta.glob('./raw/jp/*.json');
const EN_MODULES = import.meta.glob('./raw/en/*.json');
const JP_KANA_MODULES = import.meta.glob('./raw/jpkana/*.json');
const JP_KANJI_KANA_MODULES = import.meta.glob('./raw/jpkanjikana/*.json');

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

function FuriganaToggleIcon() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.1em', lineHeight: 1 }}>
      <ruby style={{ fontSize: '0.95em' }}>振<rt style={{ fontSize: '0.55em' }}>ふ</rt></ruby>
      <svg viewBox="0 0 20 18" width="0.7em" height="0.7em" fill="currentColor" aria-hidden="true" style={{ marginBottom: '0.1em' }}>
        <polygon points="0,2 12,2 12,5 0,5" />
        <polygon points="10,-1 20,3.5 10,8" />
        <polygon points="8,13 8,16 20,16 20,13" />
        <polygon points="10,10 0,14.5 10,19" />
      </svg>
      <span style={{ fontSize: '0.95em' }}>振</span>
    </span>
  );
}

interface Verse {
  number: number;
  japanese: string;
  japaneseKanjiKana: string;
  japaneseKanaOnly: string;
  english: string;
}

const bookDataCache = new Map<string, RawBook>();

async function loadBookData(modules: Record<string, () => Promise<unknown>>, path: string): Promise<RawBook> {
  if (bookDataCache.has(path)) return bookDataCache.get(path)!;
  const mod = await modules[path]() as { default: RawBook };
  bookDataCache.set(path, mod.default);
  return mod.default;
}

async function fetchChapterVerses(
  book: Book,
  chapter: number,
  startVerse: number
): Promise<Verse[]> {
  const enFile = EN_FILE_MAP[book] ?? book;
  const [jpData, enData, jpKanaData, jpKanjiKanaData] = await Promise.all([
    loadBookData(JP_MODULES, `./raw/jp/${book}.json`),
    loadBookData(EN_MODULES, `./raw/en/${enFile}.json`),
    loadBookData(JP_KANA_MODULES, `./raw/jpkana/${book}.json`),
    loadBookData(JP_KANJI_KANA_MODULES, `./raw/jpkanjikana/${book}.json`),
  ]);

  const jpChapter = jpData.contents.find((c) => c.chapter === chapter);
  const enChapter = enData.contents.find((c) => c.chapter === chapter);
  const jpKanaChapter = jpKanaData.contents.find((c) => c.chapter === chapter);
  const jpKanjiKanaChapter = jpKanjiKanaData.contents.find((c) => c.chapter === chapter);

  if (!jpChapter || !enChapter) return [];

  const results: Verse[] = [];

  for (let i = startVerse - 1; i < jpChapter.verses.length; i++) {
    const jpVerse = jpChapter.verses[i];
    const enVerse = enChapter.verses[i];
    const jpKanaVerse = jpKanaChapter?.verses[i];
    if (!jpVerse || !enVerse) break;

    const cleanJp = (t: string) => t.trim().replace(/¶/g, '');
    results.push({
      number: jpVerse.verseNumber,
      japanese: cleanJp(jpVerse.text),
      japaneseKanjiKana: cleanJp(jpKanjiKanaChapter?.verses[i]?.text ?? jpVerse.text),
      japaneseKanaOnly: cleanJp(jpKanaVerse?.text ?? jpVerse.text),
      english: enVerse.text.trim().replace(/\*/g, ''),
    });
  }

  return results;
}

export default function ReadingsNihonDe() {
  const savedSettings = readingsSettingsStoreImpl.getSettings();
  const [book, setBook] = useState<Book>((savedSettings.lastBook as Book) ?? 'John');
  const [chapter, setChapter] = useState<string>(savedSettings.lastChapter ?? '1');
  const [startVerse, setStartVerse] = useState<string>('1');
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [passageBook, setPassageBook] = useState<Book>(book);
  const [passageChapter, setPassageChapter] = useState<number>(parseInt(chapter, 10));
  const [passageStartVerse, setPassageStartVerse] = useState<number>(parseInt(startVerse, 10));
  const [toggledVerses, setToggledVerses] = useState<Set<number>>(new Set());
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [displayOrder, setDisplayOrder] = useState<RowKey[]>(savedSettings.order);
  const [displayEnabled, setDisplayEnabled] = useState<Record<RowKey, boolean>>(savedSettings.enabled);
  const [splitOnKuten, setSplitOnKuten] = useState<boolean>(savedSettings.splitOnKuten ?? DEFAULT_SPLIT_ON_KUTEN);
  const [defaultToggleKanjiKana, setDefaultToggleKanjiKana] = useState<boolean>(savedSettings.defaultToggleKanjiKana ?? DEFAULT_TOGGLE_KANJI_KANA);
  const [defaultToggleFurigana, setDefaultToggleFurigana] = useState<boolean>(savedSettings.defaultToggleFurigana ?? DEFAULT_TOGGLE_FURIGANA);
  const [toggledFuriganaVerses, setToggledFuriganaVerses] = useState<Set<number>>(new Set());
  const [splitEnglishDialogue, setSplitEnglishDialogue] = useState<boolean>(savedSettings.splitEnglishDialogue ?? DEFAULT_SPLIT_ENGLISH_DIALOGUE);
  const [splitJpDialogue, setSplitJpDialogue] = useState<Record<RowKey, boolean>>(savedSettings.splitJpDialogue ?? DEFAULT_SPLIT_JP_DIALOGUE);
  const dragSrc = useRef<RowKey | null>(null);
  const touchDragSrc = useRef<RowKey | null>(null);
  const [dragIndicator, setDragIndicator] = useState<{ key: RowKey; position: 'before' | 'after' } | null>(null);

  useEffect(() => {
    readingsSettingsStoreImpl.saveSettings({ order: displayOrder, enabled: displayEnabled, splitOnKuten, defaultToggleKanjiKana, defaultToggleFurigana, splitEnglishDialogue, splitJpDialogue, lastBook: book, lastChapter: chapter });
  }, [displayOrder, displayEnabled, splitOnKuten, defaultToggleKanjiKana, defaultToggleFurigana, splitEnglishDialogue, splitJpDialogue, book, chapter]);

  useEffect(() => {
    if (savedSettings.lastBook && savedSettings.lastChapter) {
      handleSearch();
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleResetSettings = () => {
    setDisplayOrder(DEFAULT_ORDER);
    setDisplayEnabled(DEFAULT_ENABLED);
    setSplitOnKuten(DEFAULT_SPLIT_ON_KUTEN);
    setDefaultToggleKanjiKana(DEFAULT_TOGGLE_KANJI_KANA);
    setDefaultToggleFurigana(DEFAULT_TOGGLE_FURIGANA);
    setSplitEnglishDialogue(DEFAULT_SPLIT_ENGLISH_DIALOGUE);
    setSplitJpDialogue(DEFAULT_SPLIT_JP_DIALOGUE);
    setBook('John');
    setChapter('1');
  };

  const renderJpText = (text: string, dialogueSplit = false): React.ReactNode => {
    const applyKuten = (t: string): React.ReactNode[] => {
      if (!splitOnKuten) return [t];
      return t.split('。').reduce<React.ReactNode[]>((acc, part, i, arr) => {
        if (i < arr.length - 1) {
          acc.push(part + '。');
          acc.push(<br key={`k${i}`} />);
        } else if (part) {
          acc.push(part);
        }
        return acc;
      }, []);
    };

    if (!dialogueSplit) return applyKuten(text);

    const parts = text.split(/(「[^」]*」)/);
    return parts.reduce<React.ReactNode[]>((acc, part, i) => {
      if (!part) return acc;
      const isDialogue = /^「[^」]*」$/.test(part);
      if (isDialogue && i > 0) acc.push(<br key={`d${i}`} />);
      acc.push(...applyKuten(part));
      if (isDialogue && i < parts.length - 1) acc.push(<br key={`da${i}`} />);
      return acc;
    }, []);
  };

  const renderFurigana = (text: string, dialogueSplit = false): React.ReactNode => {
    const applyKutenToPlain = (t: string, keyPrefix: string): React.ReactNode[] => {
      if (!splitOnKuten) return [t];
      return t.split('。').reduce<React.ReactNode[]>((acc, part, i, arr) => {
        if (i < arr.length - 1) {
          acc.push(part + '。');
          acc.push(<br key={`${keyPrefix}-k${i}`} />);
        } else if (part) {
          acc.push(part);
        }
        return acc;
      }, []);
    };

    const parseAndRender = (t: string, keyPrefix: string): React.ReactNode[] => {
      const nodes: React.ReactNode[] = [];
      const regex = /([\u4E00-\u9FFF\u3400-\u4DBF\u3005]+)\(([^)]+)\)/g;
      let lastIndex = 0;
      let tokenIdx = 0;
      let match;
      while ((match = regex.exec(t)) !== null) {
        if (match.index > lastIndex) {
          applyKutenToPlain(t.slice(lastIndex, match.index), `${keyPrefix}-p${tokenIdx}`).forEach((n) => nodes.push(n));
          tokenIdx++;
        }
        nodes.push(<ruby key={`${keyPrefix}-ruby${tokenIdx}`}>{match[1]}<rt>{match[2]}</rt></ruby>);
        tokenIdx++;
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < t.length) {
        applyKutenToPlain(t.slice(lastIndex), `${keyPrefix}-p${tokenIdx}`).forEach((n) => nodes.push(n));
      }
      return nodes;
    };

    if (!dialogueSplit) return parseAndRender(text, 'fur');

    const parts = text.split(/(「[^」]*」)/);
    return parts.reduce<React.ReactNode[]>((acc, part, i) => {
      if (!part) return acc;
      const isDialogue = /^「[^」]*」$/.test(part);
      if (isDialogue && i > 0) acc.push(<br key={`fd${i}`} />);
      acc.push(...parseAndRender(part, `fur-${i}`));
      if (isDialogue && i < parts.length - 1) acc.push(<br key={`fda${i}`} />);
      return acc;
    }, []);
  };

  const renderEnText = (text: string): React.ReactNode => {
    if (!splitEnglishDialogue) return text;
    const parts = text.split(/("[^"]*")/);
    return parts.reduce<React.ReactNode[]>((acc, part, i) => {
      if (!part) return acc;
      const isDialogue = /^"[^"]*"$/.test(part);
      if (isDialogue && i > 0) acc.push(<br key={`d${i}`} />);
      acc.push(part);
      if (isDialogue && i < parts.length - 1) acc.push(<br key={`da${i}`} />);
      return acc;
    }, []);
  };

  const toggleEnabled = (key: RowKey) =>
    setDisplayEnabled((prev) => ({ ...prev, [key]: !prev[key] }));

  const reorder = (src: RowKey, target: RowKey, position: 'before' | 'after' = 'before') => {
    if (src === target) return;
    setDisplayOrder((prev) => {
      const next = [...prev];
      const srcIdx = next.indexOf(src);
      next.splice(srcIdx, 1);
      const tgtIdx = next.indexOf(target);
      next.splice(position === 'before' ? tgtIdx : tgtIdx + 1, 0, src);
      return next;
    });
  };

  const handleDragStart = (key: RowKey, e: React.DragEvent) => {
    dragSrc.current = key;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (key: RowKey, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!dragSrc.current || dragSrc.current === key) {
      setDragIndicator(null);
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const position = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
    setDragIndicator((prev) =>
      prev?.key === key && prev?.position === position ? prev : { key, position }
    );
  };

  const handleDragEnd = () => {
    dragSrc.current = null;
    setDragIndicator(null);
  };

  const handleDrop = (targetKey: RowKey, e: React.DragEvent) => {
    e.preventDefault();
    if (dragSrc.current) reorder(dragSrc.current, targetKey, dragIndicator?.position ?? 'before');
    dragSrc.current = null;
    setDragIndicator(null);
  };

  const handleTouchStart = (key: RowKey) => {
    touchDragSrc.current = key;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchDragSrc.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const item = el?.closest('[data-drag-key]') as HTMLElement | null;
    if (item?.dataset.dragKey) {
      const key = item.dataset.dragKey as RowKey;
      const rect = item.getBoundingClientRect();
      const position = touch.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
      setDragIndicator((prev) =>
        prev?.key === key && prev?.position === position ? prev : { key, position }
      );
    }
  };

  const handleTouchEnd = () => {
    const src = touchDragSrc.current;
    const indicator = dragIndicator;
    touchDragSrc.current = null;
    setDragIndicator(null);
    if (src && indicator) reorder(src, indicator.key, indicator.position);
  };

  const toggleFuriganaVerse = (verseNumber: number) => {
    setToggledFuriganaVerses((prev) => {
      const next = new Set(prev);
      if (next.has(verseNumber)) {
        next.delete(verseNumber);
      } else {
        next.add(verseNumber);
      }
      return next;
    });
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
    setPassageBook(book);
    setPassageChapter(chapterNum);
    setPassageStartVerse(verseNum);

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

  const hasPassage = verses.length > 0;

  return (
    <div className="readingsNihonDe-wrapper">
      <Container>
        <Row className="readingsNihonDe-header align-items-center">
          <Col>
            <h1 className="readingsNihonDe-title">
              日本語で聖書 <span className="readingsNihonDe-subtitle">Japanese and English Translations</span>
            </h1>
          </Col>
          <Col xs="auto">
            <span className="readingsNihonDe-version">v{version}</span>
          </Col>
        </Row>

        <Row className="readingsNihonDe-controls">
          <Col xs={12} sm={4} md={3} className="readingsNihonDe-control-col">
            <Form.Group>
              <Form.Label className="readingsNihonDe-label">書 (Book)</Form.Label>
              <Form.Select
                value={book}
                onChange={(e) => setBook(e.target.value as Book)}
                className="readingsNihonDe-select"
              >
                <optgroup label="Old Testament">
                  {OT_BOOKS.map((b) => (
                    <option key={b} value={b}>
                      {BOOK_ENGLISH_DISPLAY[b]} ({BOOK_JAPANESE[b]})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="New Testament">
                  {NT_BOOKS.map((b) => (
                    <option key={b} value={b}>
                      {BOOK_ENGLISH_DISPLAY[b]} ({BOOK_JAPANESE[b]})
                    </option>
                  ))}
                </optgroup>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xs={5} sm={4} md={2} className="readingsNihonDe-control-col">
            <Form.Group>
              <Form.Label className="readingsNihonDe-label">章 (Chapter)</Form.Label>
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

          <Col xs={5} sm={4} md={2} className="readingsNihonDe-control-col">
            <Form.Group>
              <Form.Label className="readingsNihonDe-label">節 (Verse)</Form.Label>
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

          <Col xs={12} sm={4} md={2} className="readingsNihonDe-control-col readingsNihonDe-btn-col">
            <Button
              variant="primary"
              onClick={handleSearch}
              disabled={loading}
              className="readingsNihonDe-btn"
            >
              {loading ? <Spinner animation="border" size="sm" /> : '読む (Read)'}
            </Button>
          </Col>

          <Col xs={12} sm={4} md={2} className="readingsNihonDe-control-col readingsNihonDe-btn-col readingsNihonDe-settings-col">
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
                        data-drag-key={key}
                        className={`readingsNihonDe-settings-item-group${dragIndicator?.key === key ? ` readingsNihonDe-settings-item-group--drop-${dragIndicator.position}` : ''}`}
                        onDragOver={(e) => handleDragOver(key, e)}
                        onDrop={(e) => handleDrop(key, e)}
                      >
                        <div
                          className="readingsNihonDe-settings-item"
                          draggable
                          onDragStart={(e) => handleDragStart(key, e)}
                          onDragEnd={handleDragEnd}
                        >
                          <span
                            className="readingsNihonDe-settings-drag-handle"
                            onTouchStart={() => handleTouchStart(key)}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                          >⠿</span>
                          <span className={`verse-tag ${opt.tagClass}`}>
                            {key === ROWKEYS.TOGGLE_FURIGANA ? (
                              <FuriganaToggleIcon />
                            ) : opt.tagText}
                          </span>
                          <span className="readingsNihonDe-settings-label">{opt.label}</span>
                          <Form.Check
                            type="switch"
                            id={`display-toggle-${key}`}
                            checked={displayEnabled[key]}
                            onChange={() => toggleEnabled(key)}
                            className="readingsNihonDe-settings-switch"
                          />
                        </div>
                        {key === ROWKEYS.ENGLISH && displayEnabled[ROWKEYS.ENGLISH] && (
                          <div className="readingsNihonDe-settings-sub">
                            <Form.Check
                              type="checkbox"
                              id="split-english-dialogue"
                              label='New lines around dialogue ("...")'
                              checked={splitEnglishDialogue}
                              onChange={() => setSplitEnglishDialogue((prev) => !prev)}
                            />
                          </div>
                        )}
                        {key === ROWKEYS.TOGGLE_KANA && displayEnabled[ROWKEYS.TOGGLE_KANA] && (
                          <div className="readingsNihonDe-settings-sub">
                            <Form.Check
                              type="checkbox"
                              id="default-toggle-kanji-kana"
                              label="Defaults to Kanji and Kana"
                              checked={defaultToggleKanjiKana}
                              onChange={() => setDefaultToggleKanjiKana((prev) => !prev)}
                            />
                            <Form.Check
                              type="checkbox"
                              id={`split-jp-dialogue-${ROWKEYS.TOGGLE_KANA}`}
                              label="New lines around dialogue (「...」)"
                              checked={splitJpDialogue[ROWKEYS.TOGGLE_KANA]}
                              onChange={() => setSplitJpDialogue((prev) => ({ ...prev, [ROWKEYS.TOGGLE_KANA]: !prev[ROWKEYS.TOGGLE_KANA] }))}
                            />
                          </div>
                        )}
                        {key === ROWKEYS.TOGGLE_FURIGANA && displayEnabled[ROWKEYS.TOGGLE_FURIGANA] && (
                          <div className="readingsNihonDe-settings-sub">
                            <Form.Check
                              type="checkbox"
                              id="default-toggle-furigana"
                              label="Defaults to Furigana"
                              checked={defaultToggleFurigana}
                              onChange={() => setDefaultToggleFurigana((prev) => !prev)}
                            />
                            <Form.Check
                              type="checkbox"
                              id="split-jp-dialogue-toggle-furigana"
                              label="New lines around dialogue (「...」)"
                              checked={splitJpDialogue[ROWKEYS.TOGGLE_FURIGANA]}
                              onChange={() => setSplitJpDialogue((prev) => ({ ...prev, [ROWKEYS.TOGGLE_FURIGANA]: !prev[ROWKEYS.TOGGLE_FURIGANA] }))}
                            />
                          </div>
                        )}
                        {(key === ROWKEYS.JAPANESE || key === ROWKEYS.KANA_ONLY || key === ROWKEYS.KANJI_KANA || key === ROWKEYS.FURIGANA) && displayEnabled[key] && (
                          <div className="readingsNihonDe-settings-sub">
                            <Form.Check
                              type="checkbox"
                              id={`split-jp-dialogue-${key}`}
                              label="New lines around dialogue (「...」)"
                              checked={splitJpDialogue[key]}
                              onChange={() => setSplitJpDialogue((prev) => ({ ...prev, [key]: !prev[key] }))}
                            />
                          </div>
                        )}
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
                {BOOK_JAPANESE[passageBook]} {passageChapter}:{passageStartVerse}–
                {verses[verses.length - 1].number}
                <span className="readingsNihonDe-passage-title-en">
                  {' '}({BOOK_ENGLISH_DISPLAY[passageBook]} {passageChapter}:{passageStartVerse}–{verses[verses.length - 1].number})
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
              const opt = DISPLAY_OPTIONS.find((o) => o.key === key)!;
              if (key === ROWKEYS.ENGLISH) return (
                <div key={ROWKEYS.ENGLISH} className="readingsNihonDe-verse-row">
                  <span className={`verse-tag ${opt.tagClass}`}>{opt.tagText}</span>
                  <span className="readingsNihonDe-verse-text readingsNihonDe-english">
                    {renderEnText(verse.english)}
                  </span>
                </div>
              );
              if (key === ROWKEYS.JAPANESE) return (
                <div key={ROWKEYS.JAPANESE} className="readingsNihonDe-verse-row">
                  <span className={`verse-tag ${opt.tagClass}`}>{opt.tagText}</span>
                  <span className="readingsNihonDe-verse-text readingsNihonDe-japanese">
                    {renderJpText(verse.japanese, splitJpDialogue[ROWKEYS.JAPANESE])}
                  </span>
                </div>
              );
              if (key === ROWKEYS.TOGGLE_KANA) return (
                <div key={ROWKEYS.TOGGLE_KANA} className="readingsNihonDe-verse-row">
                  <div
                    className="readingsNihonDe-toggle-btn-col"
                    onClick={() => toggleVerse(verse.number)}
                    title="Toggle kanji+kana reading"
                    aria-label="Toggle kanji+kana reading"
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggleVerse(verse.number)}
                  >
                    <span className="verse-tag verse-tag--toggle">
                      {opt.tagText}
                    </span>
                  </div>
                  <span className="readingsNihonDe-verse-text readingsNihonDe-toggle-text">
                    {renderJpText(toggledVerses.has(verse.number) ? (defaultToggleKanjiKana ? verse.japanese : verse.japaneseKanjiKana) : (defaultToggleKanjiKana ? verse.japaneseKanjiKana : verse.japanese), splitJpDialogue[ROWKEYS.TOGGLE_KANA])}
                  </span>
                </div>
              );
              if (key === ROWKEYS.TOGGLE_FURIGANA) return (
                <div key={ROWKEYS.TOGGLE_FURIGANA} className="readingsNihonDe-verse-row">
                  <div
                    className="readingsNihonDe-toggle-btn-col"
                    onClick={() => toggleFuriganaVerse(verse.number)}
                    title="Toggle kanji / furigana"
                    aria-label="Toggle kanji / furigana"
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggleFuriganaVerse(verse.number)}
                  >
                    <span className="verse-tag verse-tag--toggle-furigana">
                      <FuriganaToggleIcon />
                    </span>
                  </div>
                  <span className={`readingsNihonDe-verse-text readingsNihonDe-toggle-furigana-text${toggledFuriganaVerses.has(verse.number) !== defaultToggleFurigana ? '' : ' readingsNihonDe-furigana-rt-hidden'}`}>
                    {renderFurigana(verse.japaneseKanjiKana, splitJpDialogue[ROWKEYS.TOGGLE_FURIGANA])}
                  </span>
                </div>
              );
              if (key === ROWKEYS.KANA_ONLY) return (
                <div key={ROWKEYS.KANA_ONLY} className="readingsNihonDe-verse-row">
                  <span className={`verse-tag ${opt.tagClass}`}>{opt.tagText}</span>
                  <span className="readingsNihonDe-verse-text readingsNihonDe-kana">
                    {renderJpText(verse.japaneseKanaOnly, splitJpDialogue[ROWKEYS.KANA_ONLY])}
                  </span>
                </div>
              );
              if (key === ROWKEYS.KANJI_KANA) return (
                <div key={ROWKEYS.KANJI_KANA} className="readingsNihonDe-verse-row">
                  <span className={`verse-tag ${opt.tagClass}`}>{opt.tagText}</span>
                  <span className="readingsNihonDe-verse-text readingsNihonDe-kanjikana">
                    {renderJpText(verse.japaneseKanjiKana, splitJpDialogue[ROWKEYS.KANJI_KANA])}
                  </span>
                </div>
              );
              if (key === ROWKEYS.FURIGANA) return (
                <div key={ROWKEYS.FURIGANA} className="readingsNihonDe-verse-row">
                  <span className={`verse-tag ${opt.tagClass}`}>{opt.tagText}</span>
                  <span className="readingsNihonDe-verse-text readingsNihonDe-furigana">
                    {renderFurigana(verse.japaneseKanjiKana, splitJpDialogue[ROWKEYS.FURIGANA])}
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

      {showScrollTop && (
        <button
          className="readingsNihonDe-scroll-top"
          onClick={() => window.scrollTo({ top: 0 })}
          aria-label="Scroll to top"
        >
          ▲
        </button>
      )}

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
