import { useState, useMemo } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import type { LyricsSong } from "./src/types";
import senNoYoruWoKoete from "./src/senNoYoruWoKoete";
import tegami from "./src/tegami";
import stayWithMe from "./src/stayWithMe";
import eikouNoKakehashi from "./src/eikouNoKakehashi";
import itsuka from "./src/itsuka";
import HaikyouNoSofa from "./src/HaikyouNoSofa";
import './styles.css';

export const songs: LyricsSong[] = [senNoYoruWoKoete, tegami, stayWithMe, eikouNoKakehashi, itsuka, HaikyouNoSofa];

export default function WebPage() {
  const [selectedTitle, setSelectedTitle] = useState(songs[0].title);

  const song = useMemo(
    () => songs.find((s) => s.title === selectedTitle) ?? songs[0],
    [selectedTitle]
  );

  const pairs = useMemo(
    () =>
      Array.from(
        { length: Math.max(song.jp.length, song.romaji.length) },
        (_, i) => ({ jp: song.jp[i] ?? "", rom: song.romaji[i] ?? "" })
      ),
    [song]
  );

  return (
    <div id="japanese-lyrics">
      <Container fluid >
        <Row className="mb-3">
          <Col xs={12} md={6}>
            <Form.Select
              value={selectedTitle}
              onChange={(e) => setSelectedTitle(e.target.value)}
            >
              {songs.map((s) => (
                <option key={s.title} value={s.title}>
                  {s.title}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        {pairs.map((line, idx) => {
          const isSeparator = line.jp.startsWith("---") || line.rom.startsWith("---");
          return (
            <Row key={idx} className="lyric-pair">
              <Col xs={6}>
                <p className={isSeparator ? "lyric-separator" : undefined}>{line.jp}</p>
              </Col>
              <Col xs={6}>
                <p className={isSeparator ? "lyric-separator" : undefined}>{line.rom}</p>
              </Col>
            </Row>
          );
        })}
      </Container>
    </div>
  );
}
