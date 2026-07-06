import { useState, Fragment } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import './styles.css';

const KANJI_FURIGANA_REGEX = /([一-鿿㐀-䶿々]+)[(（]([^)）]+)[)）]/g;

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

function parseFuriganaLine(line: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let tokenIdx = 0;
  let match: RegExpExecArray | null;
  KANJI_FURIGANA_REGEX.lastIndex = 0;
  while ((match = KANJI_FURIGANA_REGEX.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<span key={`${keyPrefix}-t${tokenIdx}`}>{line.slice(lastIndex, match.index)}</span>);
      tokenIdx++;
    }
    nodes.push(<ruby key={`${keyPrefix}-r${tokenIdx}`}>{match[1]}<rt>{match[2]}</rt></ruby>);
    tokenIdx++;
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < line.length) {
    nodes.push(<span key={`${keyPrefix}-t${tokenIdx}`}>{line.slice(lastIndex)}</span>);
  }
  return nodes;
}

function renderFuriganaParagraph(paragraph: string, keyPrefix: string): React.ReactNode {
  const lines = paragraph.split('\n');
  return lines.map((line, i) => (
    <Fragment key={`${keyPrefix}-line${i}`}>
      {parseFuriganaLine(line, `${keyPrefix}-line${i}`)}
      {i < lines.length - 1 && <br className="nihonParenthesesToFurigana_linebreak" />}
    </Fragment>
  ));
}

export default function NihonParenthesesToFuriganaPage() {
  const [inputText, setInputText] = useState('');
  const [convertedParagraphs, setConvertedParagraphs] = useState<string[] | null>(null);
  const [furiganaVisible, setFuriganaVisible] = useState(true);

  const handleConvert = () => {
    const paragraphs = inputText
      .split(/\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    setConvertedParagraphs(paragraphs);
  };

  return (
    <div className="nihonParenthesesToFurigana">
      <Container fluid className="nihonParenthesesToFurigana_content">
        <h1 className="nihonParenthesesToFurigana_title">
          <span className="nihonParenthesesToFurigana_title-jp">括弧からふりがな</span>
          <span className="nihonParenthesesToFurigana_title-en">Parentheses to Furigana</span>
        </h1>
        <p className="nihonParenthesesToFurigana_subtitle">
          Paste Japanese text using the 漢字（かんじ）or 漢字(かんじ) parentheses format below to render it as furigana.
        </p>

        <Form.Group className="nihonParenthesesToFurigana_input-group">
          <Form.Control
            as="textarea"
            className="nihonParenthesesToFurigana_textarea"
            rows={12}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="漢字（かんじ）の 文章（ぶんしょう）をここに入力（にゅうりょく）してください。"
          />
        </Form.Group>

        <Button
          className="nihonParenthesesToFurigana_convert-btn"
          onClick={handleConvert}
          disabled={inputText.trim().length === 0}
        >
          Convert to Furigana
        </Button>

        {convertedParagraphs && convertedParagraphs.length > 0 && (
          <div className="nihonParenthesesToFurigana_output-row">
            <div
              className="nihonParenthesesToFurigana_toggle-btn-col"
              onClick={() => setFuriganaVisible((v) => !v)}
              title="Toggle furigana"
              aria-label="Toggle furigana"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setFuriganaVisible((v) => !v)}
            >
              <span className="nihonParenthesesToFurigana_toggle-tag">
                <FuriganaToggleIcon />
              </span>
            </div>
            <div className={`nihonParenthesesToFurigana_output${furiganaVisible ? '' : ' nihonParenthesesToFurigana_rt-hidden'}`}>
              {convertedParagraphs.map((paragraph, i) => (
                <p key={i} className="nihonParenthesesToFurigana_paragraph">
                  {renderFuriganaParagraph(paragraph, `p${i}`)}
                </p>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
