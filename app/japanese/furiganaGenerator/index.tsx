import { useState, Fragment } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './styles.css';

export default function FuriganaGeneratorPage() {
  const [kanjiText, setKanjiText] = useState('');
  const [romajiText, setRomajiText] = useState('');
  const [convertedLines, setConvertedLines] = useState<Array<{ kanji: string; romaji: string }> | null>(null);

  const handleConvert = () => {
    const kanjiLines = kanjiText.split('\n').map((l) => l.trim());
    const romajiLines = romajiText.split('\n').map((l) => l.trim());
    const lineCount = Math.max(kanjiLines.length, romajiLines.length);

    const lines = Array.from({ length: lineCount }, (_, i) => ({
      kanji: kanjiLines[i] ?? '',
      romaji: romajiLines[i] ?? '',
    })).filter((line) => line.kanji.length > 0 || line.romaji.length > 0);

    setConvertedLines(lines);
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
            {convertedLines.map((line, i) => (
              <Fragment key={i}>
                <ruby className="furiganaGenerator_ruby">
                  {line.kanji}
                  <rt>{line.romaji}</rt>
                </ruby>
                <br />
              </Fragment>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
