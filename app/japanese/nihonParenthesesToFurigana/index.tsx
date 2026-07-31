import { useEffect, useRef, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { FuriganaToggleIcon, renderFuriganaText } from '../shared/furiganaRuby';
import { ENV, getEnv } from '../../infra/env';
import testInfoParentheses from './testInfoParentheses.txt?raw';
import './styles.css';

export const PLACEHOLDER = 'Ex：今日（きょう）は良（よ）かったです。';

export default function NihonParenthesesToFuriganaPage() {
  const [inputText, setInputText] = useState('');
  const [convertedParagraphs, setConvertedParagraphs] = useState<string[] | null>(null);
  const [furiganaVisible, setFuriganaVisible] = useState(true);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const handleConvert = () => {
    const paragraphs = inputText
      .split(/\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    setConvertedParagraphs(paragraphs);
  };

  const handleLoadSample = () => {
    setInputText(testInfoParentheses);
  };

  useEffect(() => {
    if (convertedParagraphs && convertedParagraphs.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [convertedParagraphs]);

  return (
    <div className="nihonParenthesesToFurigana">
      <Container fluid className="nihonParenthesesToFurigana_content">
        <h1 className="nihonParenthesesToFurigana_title">
          <span className="nihonParenthesesToFurigana_title-en">Parentheses to Furigana</span>
        </h1>
        <p className="nihonParenthesesToFurigana_subtitle">
          漢字（かんじ） → <ruby>漢字<rt>かんじ</rt></ruby>
        </p>

        <Form.Group className="nihonParenthesesToFurigana_input-group">
          <Form.Control
            as="textarea"
            className="nihonParenthesesToFurigana_textarea"
            rows={12}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={PLACEHOLDER}
          />
        </Form.Group>

        <Button
          className="nihonParenthesesToFurigana_convert-btn"
          onClick={handleConvert}
          disabled={inputText.trim().length === 0}
        >
          Convert to Furigana
        </Button>

        {getEnv() === ENV.DEV && (
          <Button
            variant="outline-secondary"
            className="nihonParenthesesToFurigana_sample-btn"
            onClick={handleLoadSample}
          >
            Load Sample
          </Button>
        )}

        {convertedParagraphs && convertedParagraphs.length > 0 && (
          <div className="furiganaRuby_output-row" ref={resultsRef}>
            <div
              className="furiganaRuby_toggle-btn-col"
              onClick={() => setFuriganaVisible((v) => !v)}
              title="Toggle furigana"
              aria-label="Toggle furigana"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setFuriganaVisible((v) => !v)}
            >
              <span className="furiganaRuby_toggle-tag">
                <FuriganaToggleIcon />
              </span>
            </div>
            <div className={`nihonParenthesesToFurigana_output furiganaRuby_output${furiganaVisible ? '' : ' furiganaRuby_rt-hidden'}`}>
              {convertedParagraphs.map((paragraph, i) => (
                <p key={i} className="nihonParenthesesToFurigana_paragraph">
                  {renderFuriganaText(paragraph, `p${i}`)}
                </p>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
