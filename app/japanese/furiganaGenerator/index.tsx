import { Container } from 'react-bootstrap';
import './styles.css';

export default function FuriganaGeneratorPage() {
  return (
    <div className="furiganaGenerator">
      <Container fluid className="furiganaGenerator_content">
        <h1 className="furiganaGenerator_title">
          <span className="furiganaGenerator_title-jp">ふりがなジェネレーター</span>
          <span className="furiganaGenerator_title-en">Furigana Generator</span>
        </h1>
        <p className="furiganaGenerator_subtitle">
          Coming soon.
        </p>
      </Container>
    </div>
  );
}
