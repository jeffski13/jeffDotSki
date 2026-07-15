import { useState, Fragment } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { buildFuriganaLines, type FuriganaLine } from './furiganaGenerator';
import { renderFuriganaText } from '../shared/furiganaRuby';
import './styles.css';

export default function FuriganaGeneratorPage() {
  const [kanjiText, setKanjiText] = useState('');
  const [romajiText, setRomajiText] = useState('');
  const [convertedLines, setConvertedLines] = useState<FuriganaLine[] | null>(null);
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setConvertedLines(buildFuriganaLines(kanjiText, romajiText));
  };

  const handleCopy = () => {
    if (!convertedLines) return;
    navigator.clipboard.writeText(convertedLines.map((line) => line.furigana).join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="furiganaGenerator">
      <Container fluid className="furiganaGenerator_content">
        <h1 className="furiganaGenerator_title">
          <span className="furiganaGenerator_title-jp">ふりがなジェネレーター</span>
          <span className="furiganaGenerator_title-en">Furigana Generator</span>
        </h1>
        <p className="furiganaGenerator_subtitle">
          Enter Japanese text and its romaji reading (line by line) to generate furigana.
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
                placeholder="Enter the romaji reading here, matching each kanji line."
              />
            </Form.Group>
          </Col>
        </Row>

        <Button
          className="furiganaGenerator_convert-btn"
          onClick={handleConvert}
          disabled={kanjiText.trim().length === 0 && romajiText.trim().length === 0}
        >
          Generate Furigana
        </Button>

        {convertedLines && convertedLines.length > 0 && (
          <div className="furiganaGenerator_output">
            <Button
              variant="outline-secondary"
              size="sm"
              className="furiganaGenerator_copy-btn"
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Row className="furiganaGenerator_output-row">
              <Col xs={12} md={6} className="furiganaGenerator_output-col">
                {convertedLines.map((line, i) => (
                  <Fragment key={i}>
                    {line.furigana}
                    <br />
                  </Fragment>
                ))}
              </Col>
              <Col xs={12} md={6} className="furiganaGenerator_output-col furiganaRuby_output">
                {renderFuriganaText(convertedLines.map((line) => line.furigana).join('\n'), 'output')}
              </Col>
            </Row>
            <Button
              variant="outline-secondary"
              size="sm"
              className="furiganaGenerator_copy-btn"
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}
