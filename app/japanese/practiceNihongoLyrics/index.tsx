import { useState, useMemo, Fragment } from "react";
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

const KANJI_FURIGANA_REGEX = /([一-鿿㐀-䶿々]+)[(（]([^)）]+)[)）]/g;

function renderFurigana(line: string, keyPrefix: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let tokenIdx = 0;
  let match: RegExpExecArray | null;
  KANJI_FURIGANA_REGEX.lastIndex = 0;
  while ((match = KANJI_FURIGANA_REGEX.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<Fragment key={`${keyPrefix}-t${tokenIdx}`}>{line.slice(lastIndex, match.index)}</Fragment>);
      tokenIdx++;
    }
    nodes.push(<ruby key={`${keyPrefix}-r${tokenIdx}`}>{match[1]}<rt>{match[2]}</rt></ruby>);
    tokenIdx++;
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < line.length) {
    nodes.push(<Fragment key={`${keyPrefix}-t${tokenIdx}`}>{line.slice(lastIndex)}</Fragment>);
  }
  return nodes;
}

export default function WebPage() {
  const [selectedTitle, setSelectedTitle] = useState(songs[0].title);

  const song = useMemo(
    () => songs.find((s) => s.title === selectedTitle) ?? songs[0],
    [selectedTitle]
  );

  const hasFurigana = !!song.furigana;

  const pairs = useMemo(
    () =>
      Array.from(
        { length: Math.max(song.jp.length, song.romaji.length, song.furigana?.length ?? 0) },
        (_, i) => ({ jp: song.jp[i] ?? "", rom: song.romaji[i] ?? "", furigana: song.furigana?.[i] ?? "" })
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
              <Col xs={6} md={hasFurigana ? 4 : 6}>
                <p className={isSeparator ? "lyric-separator" : undefined}>{line.jp}</p>
              </Col>
              {hasFurigana && (
                <Col xs={6} md={4}>
                  <p className={isSeparator ? "lyric-separator" : undefined}>
                    {renderFurigana(line.furigana, `furigana-${idx}`)}
                  </p>
                </Col>
              )}
              <Col xs={6} md={hasFurigana ? 4 : 6}>
                <p className={isSeparator ? "lyric-separator" : undefined}>{line.rom}</p>
              </Col>
            </Row>
          );
        })}
      </Container>
    </div>
  );
}
