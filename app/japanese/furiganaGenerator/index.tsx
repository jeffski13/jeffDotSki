import { useState, useEffect, useRef, Fragment } from 'react';
import { Container, Row, Col, Form, Button, Collapse } from 'react-bootstrap';
import { buildFuriganaLines, furiganaToHiragana, furiganaToKanji, type FuriganaLine } from './furiganaGenerator';
import { buildFuriganaLinesFromKanji } from './kanjiToHiragana';
import { applyChorusSeparators } from './chorusSeparators';
import { downloadLyricsSongFile } from './exportLyricsSong';
import { renderFuriganaText } from '../shared/furiganaRuby';
import { useTextSize, TextSizeControl } from '../shared/textSizeControl';
import { ENV, getEnv } from '../../infra/env';
import testInfoKanji from './testInfoKanji.txt?raw';
import testInfoKanjiOnly from './testInfoKanjiOnly.txt?raw';
import '../displayControls.css';
import './styles.css';

export const KANJI_PLACEHOLDER = "Ex：今日（きょう）は良（よ）かったです。";
export const ROMAJI_PLACEHOLDER = "Ex: Kyou wa yokatta desu.";

const DISPLAY_SETTINGS_KEY = 'furiganaGenerator.displaySettings';
const USE_CHORUS_SEPARATORS_KEY = 'furiganaGenerator.useChorusSeparators';
const FONT_SIZE_KEY = 'furiganaGenerator.fontSize';

type DisplaySettings = {
  showKanjiParentheses: boolean;
  showFuriganaResults: boolean;
};

const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  showKanjiParentheses: true,
  showFuriganaResults: true,
};

function loadUseChorusSeparators(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(USE_CHORUS_SEPARATORS_KEY) === 'true';
}

function loadDisplaySettings(): DisplaySettings {
  if (typeof window === 'undefined') return DEFAULT_DISPLAY_SETTINGS;
  try {
    const raw = window.localStorage.getItem(DISPLAY_SETTINGS_KEY);
    if (!raw) return DEFAULT_DISPLAY_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      showKanjiParentheses:
        typeof parsed.showKanjiParentheses === 'boolean'
          ? parsed.showKanjiParentheses
          : DEFAULT_DISPLAY_SETTINGS.showKanjiParentheses,
      showFuriganaResults:
        typeof parsed.showFuriganaResults === 'boolean'
          ? parsed.showFuriganaResults
          : DEFAULT_DISPLAY_SETTINGS.showFuriganaResults,
    };
  } catch {
    return DEFAULT_DISPLAY_SETTINGS;
  }
}

export default function FuriganaGeneratorPage() {
  const [title, setTitle] = useState('');
  const [kanjiText, setKanjiText] = useState('');
  const [romajiText, setRomajiText] = useState('');
  const [convertedLines, setConvertedLines] = useState<FuriganaLine[] | null>(null);
  const [copied, setCopied] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [useChorusSeparators, setUseChorusSeparators] = useState(loadUseChorusSeparators);
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>(loadDisplaySettings);
  const { showKanjiParentheses, showFuriganaResults } = displaySettings;
  const [fontSize, setFontSize] = useTextSize(FONT_SIZE_KEY);
  const convertButtonRef = useRef<HTMLButtonElement>(null);
  const editModeButtonRef = useRef<HTMLButtonElement>(null);
  const displayControlsRef = useRef<HTMLDivElement>(null);
  const [isControlsFixed, setIsControlsFixed] = useState(false);
  const [controlsHeight, setControlsHeight] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const dragSrc = useRef<number | null>(null);
  const touchDragSrc = useRef<number | null>(null);
  const [dragIndicator, setDragIndicator] = useState<{ index: number; position: 'before' | 'after' } | null>(null);
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
  const [editingLineIndex, setEditingLineIndex] = useState<number | null>(null);
  const [editingLineText, setEditingLineText] = useState('');
  const shouldScrollToResults = useRef(false);
  const [showRomaji, setShowRomaji] = useState(false);

  useEffect(() => {
    if (!isEditMode) {
      setActiveRowIndex(null);
      setEditingLineIndex(null);
    }
  }, [isEditMode]);

  useEffect(() => {
    if (shouldScrollToResults.current && convertedLines && convertedLines.length > 0) {
      convertButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    shouldScrollToResults.current = false;
  }, [convertedLines]);

  useEffect(() => {
    window.localStorage.setItem(DISPLAY_SETTINGS_KEY, JSON.stringify(displaySettings));
  }, [displaySettings]);

  useEffect(() => {
    window.localStorage.setItem(USE_CHORUS_SEPARATORS_KEY, String(useChorusSeparators));
  }, [useChorusSeparators]);

  const hasResults = !!convertedLines && convertedLines.length > 0;
  const fixedThresholdRef = useRef(0);
  const isControlsFixedRef = useRef(false);

  useEffect(() => {
    isControlsFixedRef.current = isControlsFixed;
  }, [isControlsFixed]);

  useEffect(() => {
    const updateThreshold = () => {
      // While fixed, the button renders inside the bottom bar, not its normal
      // in-flow spot — measuring it then would corrupt the threshold, so skip.
      if (isControlsFixedRef.current) return;
      const button = editModeButtonRef.current;
      if (!button) return;
      fixedThresholdRef.current = button.getBoundingClientRect().bottom + window.scrollY;
    };

    const handleScroll = () => {
      setIsControlsFixed(hasResults && window.scrollY > fixedThresholdRef.current);
    };

    if (!hasResults) {
      handleScroll();
      return;
    }

    updateThreshold();
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateThreshold);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateThreshold);
    };
  }, [hasResults, isEditMode]);

  useEffect(() => {
    const node = displayControlsRef.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      setControlsHeight(entry.contentRect.height);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const reorderLines = (srcIndex: number, targetIndex: number, position: 'before' | 'after') => {
    if (srcIndex === targetIndex) return;
    setConvertedLines((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      const [moved] = next.splice(srcIndex, 1);
      let insertAt = targetIndex;
      if (srcIndex < targetIndex) insertAt -= 1;
      if (position === 'after') insertAt += 1;
      next.splice(Math.max(0, Math.min(next.length, insertAt)), 0, moved);
      return next;
    });
    setActiveRowIndex(null);
    setEditingLineIndex(null);
  };

  const duplicateLine = (index: number) => {
    setConvertedLines((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      next.splice(index + 1, 0, { ...prev[index] });
      return next;
    });
    setActiveRowIndex(null);
    setEditingLineIndex(null);
  };

  const deleteLine = (index: number) => {
    setConvertedLines((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
    setActiveRowIndex(null);
    setEditingLineIndex(null);
  };

  const handleRowTap = (index: number) => {
    setActiveRowIndex((prev) => (prev === index ? null : index));
  };

  // Commits a hand-edited line's parentheses-form text back into the line's kanji/hiragana/
  // furigana fields, keeping all three in sync (see furiganaToKanji/furiganaToHiragana) rather
  // than leaving kanji/hiragana stale against a furigana field the user just rewrote.
  const commitLineEdit = (index: number, text: string) => {
    setConvertedLines((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      next[index] = { kanji: furiganaToKanji(text), hiragana: furiganaToHiragana(text), furigana: text };
      return next;
    });
  };

  const startEditingLine = (index: number) => {
    if (editingLineIndex !== null && editingLineIndex !== index) {
      commitLineEdit(editingLineIndex, editingLineText);
    }
    setEditingLineIndex(index);
    setEditingLineText(convertedLines?.[index]?.furigana ?? '');
  };

  const finishEditingLine = () => {
    if (editingLineIndex === null) return;
    commitLineEdit(editingLineIndex, editingLineText);
    setEditingLineIndex(null);
  };

  const handleDragStart = (index: number, e: React.DragEvent) => {
    dragSrc.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragSrc.current === null || dragSrc.current === index) {
      setDragIndicator(null);
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const position = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
    setDragIndicator((prev) => (prev?.index === index && prev?.position === position ? prev : { index, position }));
  };

  const handleDragEnd = () => {
    dragSrc.current = null;
    setDragIndicator(null);
  };

  const handleDrop = (targetIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    if (dragSrc.current !== null) reorderLines(dragSrc.current, targetIndex, dragIndicator?.position ?? 'before');
    dragSrc.current = null;
    setDragIndicator(null);
  };

  const handleTouchStart = (index: number) => {
    touchDragSrc.current = index;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchDragSrc.current === null) return;
    e.preventDefault();
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const item = el?.closest('[data-drag-index]') as HTMLElement | null;
    if (item?.dataset.dragIndex) {
      const index = Number(item.dataset.dragIndex);
      const rect = item.getBoundingClientRect();
      const position = touch.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
      setDragIndicator((prev) => (prev?.index === index && prev?.position === position ? prev : { index, position }));
    }
  };

  const handleTouchEnd = () => {
    const src = touchDragSrc.current;
    const indicator = dragIndicator;
    touchDragSrc.current = null;
    setDragIndicator(null);
    if (src !== null && indicator) reorderLines(src, indicator.index, indicator.position);
  };

  const handleConvert = async () => {
    setErrorMessage(null);
    setIsConverting(true);
    setIsEditMode(false);
    shouldScrollToResults.current = true;
    try {
      const effectiveKanjiText = useChorusSeparators ? await applyChorusSeparators(kanjiText) : kanjiText;
      // No romaji reading supplied - derive the hiragana reading straight from the kanji instead
      // and feed it through the same furigana pipeline as if it had come from the Romaji box.
      if (romajiText.trim().length === 0) {
        setConvertedLines(await buildFuriganaLinesFromKanji(effectiveKanjiText));
      } else {
        setConvertedLines(buildFuriganaLines(effectiveKanjiText, romajiText));
      }
    } catch {
      setErrorMessage('Something went wrong generating furigana. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleLoadSample = () => {
    setKanjiText(testInfoKanji);
    setRomajiText('');
  };

  const handleLoadKanjiOnlySample = () => {
    setKanjiText(testInfoKanjiOnly);
    setRomajiText('');
  };

  const handleCopy = () => {
    if (!convertedLines) return;
    navigator.clipboard.writeText(convertedLines.map((line) => line.furigana).join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    if (!convertedLines || convertedLines.length === 0) return;
    downloadLyricsSongFile({ title, kanjiText, romajiText, convertedLines });
  };

  return (
    <div className="furiganaGenerator">
      <Container fluid className="furiganaGenerator_content">
        <h1 className="furiganaGenerator_title">
          <span className="furiganaGenerator_title-en">Furigana Generator</span>
        </h1>
        <p className="furiganaGenerator_subtitle">
          Enter Japanese Text
        </p>

        <Row className="furiganaGenerator_input-row">
          <Col xs={12}>
            <Form.Group className="furiganaGenerator_input-group">
              <Form.Label className="furiganaGenerator_label">Kanji</Form.Label>
              <Form.Control
                as="textarea"
                className="furiganaGenerator_textarea"
                rows={8}
                value={kanjiText}
                onChange={(e) => setKanjiText(e.target.value)}
                placeholder={KANJI_PLACEHOLDER}
              />
            </Form.Group>
          </Col>
          <Col xs={12}>
            <Form.Group className="furiganaGenerator_input-group">
              <button
                type="button"
                className="furiganaGenerator_label furiganaGenerator_romaji-toggle"
                onClick={() => setShowRomaji((prev) => !prev)}
                aria-expanded={showRomaji}
                aria-controls="furiganaGenerator_romaji-collapse"
              >
                Romaji (optional)
                <span className="furiganaGenerator_romaji-toggle-caret" aria-hidden="true">
                  {showRomaji ? '▲' : '▼'}
                </span>
              </button>
              <Collapse in={showRomaji}>
                <div id="furiganaGenerator_romaji-collapse">
                  <Form.Control
                    as="textarea"
                    className="furiganaGenerator_textarea"
                    rows={8}
                    value={romajiText}
                    onChange={(e) => setRomajiText(e.target.value)}
                    placeholder={ROMAJI_PLACEHOLDER}
                  />
                </div>
              </Collapse>
            </Form.Group>
          </Col>
        </Row>

        <div className="furiganaGenerator_controls">
          <Button
            ref={convertButtonRef}
            className="furiganaGenerator_convert-btn"
            onClick={handleConvert}
            disabled={isConverting || (kanjiText.trim().length === 0 && romajiText.trim().length === 0)}
          >
            {isConverting ? 'Converting…' : 'Generate Furigana'}
          </Button>

          <Form.Check
            type="checkbox"
            id="use-chorus-separators"
            className="furiganaGenerator_chorus-separators-check"
            label="Chorus Separators"
            checked={useChorusSeparators}
            onChange={(e) => setUseChorusSeparators(e.target.checked)}
          />

          {getEnv() === ENV.DEV && (
            <Button variant="outline-secondary" className="furiganaGenerator_sample-btn" onClick={handleLoadSample}>
              Load Sample
            </Button>
          )}

          {getEnv() === ENV.DEV && (
            <Button
              variant="outline-secondary"
              className="furiganaGenerator_sample-btn"
              onClick={handleLoadKanjiOnlySample}
            >
              Load Kanji-Only Sample
            </Button>
          )}
        </div>

        <hr className="japanese-controls-divider" />


        <Row
          ref={displayControlsRef}
          id="results-display-controls"
          className={`japanese-display-controls${
            isControlsFixed ? ' furiganaGenerator_display-controls--fixed' : ' mb-3'
          }`}
        >
          <Col xs="auto">
            <Form.Check
              type="checkbox"
              id="show-kanji-parentheses"
              className="furiganaGenerator_display-check"
              label="Kanji 振(ふ)"
              checked={showKanjiParentheses}
              onChange={(e) =>
                setDisplaySettings((prev) => ({ ...prev, showKanjiParentheses: e.target.checked }))
              }
            />
          </Col>
          <Col xs="auto">
            <Form.Check
              type="checkbox"
              id="show-furigana-results"
              className="furiganaGenerator_display-check"
              label={
                <>
                  Furigana <ruby>振<rt>ふ</rt></ruby>
                </>
              }
              checked={showFuriganaResults}
              onChange={(e) =>
                setDisplaySettings((prev) => ({ ...prev, showFuriganaResults: e.target.checked }))
              }
            />
          </Col>
          {hasResults && (
            <Col xs="auto">
              <Button
                ref={editModeButtonRef}
                id="results-edit-mode-button"
                variant={isEditMode ? 'primary' : 'outline-secondary'}
                size="sm"
                className="furiganaGenerator_edit-toggle-btn"
                onClick={() => {
                  if (editingLineIndex !== null) commitLineEdit(editingLineIndex, editingLineText);
                  setIsEditMode((prev) => !prev);
                }}
                aria-pressed={isEditMode}
                aria-label={isEditMode ? 'Done editing line order' : 'Edit line order'}
                title={isEditMode ? 'Done editing line order' : 'Edit line order'}
              >
                {isEditMode ? (
                  <svg
                    className="furiganaGenerator_edit-toggle-check"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M9.55 18 3.85 12.3l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4Z"
                    />
                  </svg>
                ) : (
                  '✎'
                )}
              </Button>
            </Col>
          )}
          {hasResults && !isEditMode && (
            <Col xs="auto" className="ms-auto">
              <TextSizeControl fontSize={fontSize} onChange={setFontSize} />
            </Col>
          )}
        </Row>
        {isControlsFixed && <div style={{ height: controlsHeight }} aria-hidden="true" />}

        {errorMessage && (
          <p className="furiganaGenerator_error" role="alert">
            {errorMessage}
          </p>
        )}

        {convertedLines && convertedLines.length > 0 && (
          <div className="furiganaGenerator_output">
            {isEditMode ? (
              <ul className="furiganaGenerator_edit-list">
                {convertedLines.map((line, i) => (
                  <li
                    key={i}
                    data-drag-index={i}
                    className={`furiganaGenerator_edit-row${
                      dragIndicator?.index === i ? ` furiganaGenerator_edit-row--drop-${dragIndicator.position}` : ''
                    }${activeRowIndex === i || editingLineIndex === i ? ' furiganaGenerator_edit-row--active' : ''}`}
                    onDragOver={(e) => handleDragOver(i, e)}
                    onDrop={(e) => handleDrop(i, e)}
                  >
                    <div
                      className="furiganaGenerator_edit-row-content"
                      draggable={editingLineIndex !== i}
                      onDragStart={(e) => handleDragStart(i, e)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleRowTap(i)}
                    >
                      <span
                        className="furiganaGenerator_edit-drag-handle"
                        onTouchStart={() => handleTouchStart(i)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        aria-hidden="true"
                      >
                        ⠿
                      </span>
                      {editingLineIndex === i ? (
                        <Form.Control
                          type="text"
                          autoFocus
                          className="furiganaGenerator_edit-row-line-input"
                          value={editingLineText}
                          onChange={(e) => setEditingLineText(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              finishEditingLine();
                            }
                          }}
                        />
                      ) : (
                        <>
                          {showKanjiParentheses && (
                            <span className="furiganaGenerator_edit-row-kanji">{line.furigana}</span>
                          )}
                          {showFuriganaResults && (
                            <span className="furiganaGenerator_edit-row-ruby furiganaRuby_output">
                              {renderFuriganaText(line.furigana, `edit-${i}`)}
                            </span>
                          )}
                        </>
                      )}
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="furiganaGenerator_edit-row-action furiganaGenerator_edit-line-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (editingLineIndex === i) {
                            finishEditingLine();
                          } else {
                            startEditingLine(i);
                          }
                        }}
                        aria-label={editingLineIndex === i ? 'Save line' : 'Edit line'}
                        title={editingLineIndex === i ? 'Save line' : 'Edit line'}
                      >
                        {editingLineIndex === i ? (
                          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                            <path
                              fill="currentColor"
                              d="M9.55 18 3.85 12.3l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4Z"
                            />
                          </svg>
                        ) : (
                          '✎'
                        )}
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="furiganaGenerator_edit-row-action furiganaGenerator_edit-duplicate-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateLine(i);
                        }}
                        aria-label="Duplicate line"
                        title="Duplicate line"
                      >
                        ⧉
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="furiganaGenerator_edit-row-action furiganaGenerator_edit-delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteLine(i);
                        }}
                        aria-label="Delete line"
                        title="Delete line"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                          <path
                            fill="currentColor"
                            d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10Zm-7 10h2V8h-2Zm4 0h2V8h-2ZM7 6v13Z"
                          />
                        </svg>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Row id="furiganaGenerator_output" className="furiganaGenerator_output-row" style={{ fontSize: `${fontSize}px` }}>
                {showKanjiParentheses && (
                  <Col
                    xs={12}
                    md={showFuriganaResults ? 6 : 12}
                    className="furiganaGenerator_output-col"
                  >
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="furiganaGenerator_copy-btn"
                      onClick={handleCopy}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                    {convertedLines.map((line, i) => (
                      <Fragment key={i}>
                        {line.furigana}
                        <br />
                      </Fragment>
                    ))}
                  </Col>
                )}
                {showFuriganaResults && (
                  <Col
                    xs={12}
                    md={showKanjiParentheses ? 6 : 12}
                    className="furiganaGenerator_output-col furiganaRuby_output"
                  >
                    {renderFuriganaText(convertedLines.map((line) => line.furigana).join('\n'), 'output')}
                  </Col>
                )}
              </Row>
            )}
            <Button
              variant="outline-secondary"
              size="sm"
              className="furiganaGenerator_copy-btn"
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>

            <hr className="japanese-controls-divider" />

            <Form.Group className="furiganaGenerator_input-group furiganaGenerator_title-group">
              <Form.Label className="furiganaGenerator_label">Title</Form.Label>
              <Form.Control
                type="text"
                className="furiganaGenerator_title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Song title, used for the exported file"
              />
            </Form.Group>
            <Button
              variant="outline-secondary"
              size="sm"
              className="furiganaGenerator_export-btn"
              onClick={handleExport}
            >
              Export .ts
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}
