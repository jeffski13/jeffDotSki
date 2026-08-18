import { useState, useEffect, useRef, Fragment } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { buildFuriganaLines, type FuriganaLine } from './furiganaGenerator';
import { buildFuriganaLinesFromKanji } from './kanjiToHiragana';
import { applyChorusSeparators } from './chorusSeparators';
import { downloadLyricsSongFile } from './exportLyricsSong';
import { renderFuriganaText } from '../shared/furiganaRuby';
import { ENV, getEnv } from '../../infra/env';
import testInfoKanji from './testInfoKanji.txt?raw';
import testInfoRomaji from './testInfoRomaji.txt?raw';
import testInfoKanjiOnly from './testInfoKanjiOnly.txt?raw';
import '../displayControls.css';
import './styles.css';

export const KANJI_PLACEHOLDER = "Ex：今日（きょう）は良（よ）かったです。";
export const ROMAJI_PLACEHOLDER = "Ex: Kyou wa yokatta desu.";

const DISPLAY_SETTINGS_KEY = 'furiganaGenerator.displaySettings';

type DisplaySettings = {
  showKanjiParentheses: boolean;
  showFuriganaResults: boolean;
};

const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  showKanjiParentheses: true,
  showFuriganaResults: true,
};

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
  const [useChorusSeparators, setUseChorusSeparators] = useState(false);
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>(loadDisplaySettings);
  const { showKanjiParentheses, showFuriganaResults } = displaySettings;
  const convertButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (convertedLines && convertedLines.length > 0) {
      convertButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [convertedLines]);

  useEffect(() => {
    window.localStorage.setItem(DISPLAY_SETTINGS_KEY, JSON.stringify(displaySettings));
  }, [displaySettings]);

  const handleConvert = async () => {
    setErrorMessage(null);
    setIsConverting(true);
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
    setRomajiText(testInfoRomaji);
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
          Enter Japanese text and its romaji reading (line by line) to generate furigana.
        </p>
        <p className="furiganaGenerator_subtitle">
          Leave Romaji blank to have the reading generated from the kanji automatically.
        </p>

        <Row className="furiganaGenerator_input-row">
          <Col xs={12} md={6}>
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
          <Col xs={12} md={6}>
            <Form.Group className="furiganaGenerator_input-group">
              <Form.Label className="furiganaGenerator_label">Romaji</Form.Label>
              <Form.Control
                as="textarea"
                className="furiganaGenerator_textarea"
                rows={8}
                value={romajiText}
                onChange={(e) => setRomajiText(e.target.value)}
                placeholder={ROMAJI_PLACEHOLDER}
              />
            </Form.Group>
          </Col>
        </Row>

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

        <hr className="japanese-controls-separator" />


        <Row className="mb-3 japanese-display-controls">
          <Col xs="auto">
            <Form.Check
              type="checkbox"
              id="show-kanji-parentheses"
              label="Kanji with parentheses"
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
              label="Furigana results"
              checked={showFuriganaResults}
              onChange={(e) =>
                setDisplaySettings((prev) => ({ ...prev, showFuriganaResults: e.target.checked }))
              }
            />
          </Col>
        </Row>

        {errorMessage && (
          <p className="furiganaGenerator_error" role="alert">
            {errorMessage}
          </p>
        )}

        {convertedLines && convertedLines.length > 0 && (
          <div className="furiganaGenerator_output">
            <Row id="furiganaGenerator_output" className="furiganaGenerator_output-row">
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
            <Button
              variant="outline-secondary"
              size="sm"
              className="furiganaGenerator_copy-btn"
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Form.Group className="furiganaGenerator_input-group">
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
