import { useState, useEffect, useRef, Fragment } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { buildFuriganaLines, type FuriganaLine } from './furiganaGenerator';
import { buildFuriganaLinesFromKanji } from './kanjiToHiragana';
import { downloadLyricsSongFile } from './exportLyricsSong';
import { renderFuriganaText } from '../shared/furiganaRuby';
import { ENV, getEnv } from '../../infra/env';
import testInfoKanji from './testInfoKanji.txt?raw';
import testInfoRomaji from './testInfoRomaji.txt?raw';
import testInfoKanjiOnly from './testInfoKanjiOnly.txt?raw';
import './styles.css';

export default function FuriganaGeneratorPage() {
  const [title, setTitle] = useState('');
  const [kanjiText, setKanjiText] = useState('');
  const [romajiText, setRomajiText] = useState('');
  const [convertedLines, setConvertedLines] = useState<FuriganaLine[] | null>(null);
  const [copied, setCopied] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (convertedLines && convertedLines.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [convertedLines]);

  const handleConvert = async () => {
    setErrorMessage(null);
    // No romaji reading supplied - derive the hiragana reading straight from the kanji instead
    // and feed it through the same furigana pipeline as if it had come from the Romaji box.
    if (romajiText.trim().length === 0) {
      setIsConverting(true);
      try {
        setConvertedLines(await buildFuriganaLinesFromKanji(kanjiText));
      } catch {
        setErrorMessage('Something went wrong generating furigana. Please try again.');
      } finally {
        setIsConverting(false);
      }
      return;
    }
    setConvertedLines(buildFuriganaLines(kanjiText, romajiText));
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
          <span className="furiganaGenerator_title-jp">ふりがなジェネレーター</span>
          <span className="furiganaGenerator_title-en">Furigana Generator</span>
        </h1>
        <p className="furiganaGenerator_subtitle">
          Enter Japanese text and its romaji reading (line by line) to generate furigana. Leave
          Romaji blank to have the reading generated from the kanji automatically.
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
                placeholder="漢字の文章をここに入力してください。"
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
                placeholder="Enter the romaji reading here, matching each kanji line. Leave blank to auto-generate from the kanji."
              />
            </Form.Group>
          </Col>
        </Row>

        <Button
          className="furiganaGenerator_convert-btn"
          onClick={handleConvert}
          disabled={isConverting || (kanjiText.trim().length === 0 && romajiText.trim().length === 0)}
        >
          {isConverting ? 'Converting…' : 'Generate Furigana'}
        </Button>

        {errorMessage && (
          <p className="furiganaGenerator_error" role="alert">
            {errorMessage}
          </p>
        )}

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

        {convertedLines && convertedLines.length > 0 && (
          <div className="furiganaGenerator_output" ref={resultsRef}>
            <Row className="furiganaGenerator_output-row">
              <Col xs={12} md={6} className="furiganaGenerator_output-col">
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
              </Col>
              <Col xs={12} md={6} className="furiganaGenerator_output-col furiganaRuby_output">
                {renderFuriganaText(convertedLines.map((line) => line.furigana).join('\n'), 'output')}
              </Col>
            </Row>
          </div>
        )}
      </Container>
    </div>
  );
}
