import { useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {jp, romaji} from './src/senNoYoruWoKoete';

export default function HomePage() {
  const jpLines = useMemo(
    () => jp,
    []
  );

  const romajiLines = useMemo(
    () => romaji,
    []
  );

  const maxLen = Math.max(jpLines.length, romajiLines.length);
  const pairs = Array.from({ length: maxLen }, (_, i) => ({
    jp: jpLines[i] ?? "",
    rom: romajiLines[i] ?? "",
  }));

  return (
    <div className="homePage">
      <Container fluid className="homePage_aboutJeff">
        {pairs.map((line, idx) => (
          <Row key={idx} className="lyric-pair">
            <Col xs={6}>
              <p>{line.jp}</p>
            </Col>
            <Col xs={6}>
              <p>{line.rom}</p>
            </Col>
          </Row>
        ))}
        <Row>
          <Col xs={12}>
            <p>source: https://www.animesonglyrics.com/bleach/sen-no-yoru-wo-koete</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}