import { useState, useMemo, useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import type { LyricsSong } from "./src/types";
import { useTextSize, DEFAULT_MAX_FONT_SIZE } from "../shared/textSizeControl";
import { useShowScrollTop, ScrollTopButton } from "../shared/scrollTopButton";
import { usePersistedBooleanSettings } from "../shared/persistedSettings";
import { renderFuriganaText } from "../shared/furiganaRuby";
import { ParallelTextControls, ParallelTextView, isSeparatorLine, zipLines, type ParallelTextChannel } from "../shared/parallelText";
import senNoYoruWoKoete from "./src/senNoYoruWoKoete";
import tegami from "./src/tegami";
import stayWithMe from "./src/stayWithMe";
import eikouNoKakehashi from "./src/eikouNoKakehashi";
import itsuka from "./src/itsuka";
import HaikyouNoSofa from "./src/HaikyouNoSofa";
import bayCity from "./src/bayCity";
import land from "./src/land";
import nagareboshiKirari from "./src/nagareboshiKirari";
import departure from "./src/departure";
import naminoriJohnny from "./src/naminoriJohnny";
import reason from "./src/reason";
import aitai from "./src/aitai";
import countryroad from "./src/countryroad";
import './styles.css';

export const songs: LyricsSong[] = [
  aitai,
  bayCity,
  countryroad,
  departure,
  eikouNoKakehashi,
  HaikyouNoSofa,
  itsuka,
  land,
  nagareboshiKirari,
  naminoriJohnny,
  reason,
  senNoYoruWoKoete,
  stayWithMe,
  tegami
];

const DISPLAY_SETTINGS_KEY = "practiceNihongoLyrics.displaySettings";

const DEFAULT_DISPLAY_SETTINGS = {
  showJp: false,
  showFurigana: true,
  showRomaji: true,
  lineByLine: false,
};

const SELECTED_SONG_KEY = "practiceNihongoLyrics.selectedSongIndex";

function loadSelectedSongIndex(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(SELECTED_SONG_KEY);
    const parsed = raw === null ? NaN : Number(raw);
    return Number.isInteger(parsed) && parsed >= 0 && parsed < songs.length ? parsed : 0;
  } catch {
    return 0;
  }
}

const FONT_SIZE_KEY = "practiceNihongoLyrics.fontSize";
export const MAX_FONT_SIZE = DEFAULT_MAX_FONT_SIZE;

export default function WebPage() {
  const [selectedTitle, setSelectedTitle] = useState(() => songs[loadSelectedSongIndex()].title);
  const [displaySettings, setDisplaySettings] = usePersistedBooleanSettings(DISPLAY_SETTINGS_KEY, DEFAULT_DISPLAY_SETTINGS);
  const { showJp, showFurigana, showRomaji, lineByLine } = displaySettings;
  const [fontSize, setFontSize] = useTextSize(FONT_SIZE_KEY);
  const showScrollTop = useShowScrollTop();

  const setSetting = (key: keyof typeof DEFAULT_DISPLAY_SETTINGS) => (checked: boolean) =>
    setDisplaySettings((prev) => ({ ...prev, [key]: checked }));

  useEffect(() => {
    const idx = songs.findIndex((s) => s.title === selectedTitle);
    window.localStorage.setItem(SELECTED_SONG_KEY, String(idx >= 0 ? idx : 0));
  }, [selectedTitle]);

  const song = useMemo(
    () => songs.find((s) => s.title === selectedTitle) ?? songs[0],
    [selectedTitle]
  );

  const hasFurigana = !!song.furigana;

  const lines = useMemo(
    () => zipLines({ jp: song.jp, rom: song.romaji, furigana: song.furigana }),
    [song]
  );

  type Line = (typeof lines)[number];
  const enabledChannels = useMemo(() => {
    const channels: ParallelTextChannel<Line>[] = [];
    if (hasFurigana && showFurigana) {
      channels.push({ key: "furigana", render: (line, idx) => renderFuriganaText(line.furigana, `furigana-${idx}`) });
    }
    if (showJp) {
      channels.push({ key: "jp", render: (line) => line.jp });
    }
    if (showRomaji) {
      channels.push({ key: "romaji", render: (line) => line.rom });
    }
    return channels;
  }, [hasFurigana, showFurigana, showJp, showRomaji]);

  return (
    <div id="japanese-lyrics">
      <Container fluid >
        <ParallelTextControls
          leading={
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
          }
          options={[
            { id: "show-jp", label: "Japanese", checked: showJp, onChange: setSetting("showJp") },
            { id: "show-furigana", label: "Furigana", checked: showFurigana, disabled: !hasFurigana, onChange: setSetting("showFurigana") },
            { id: "show-romaji", label: "Romaji ", checked: showRomaji, onChange: setSetting("showRomaji") },
            { id: "line-by-line", label: "Line by line", checked: lineByLine, onChange: setSetting("lineByLine") },
          ]}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
        />
        <ParallelTextView
          lines={lines}
          channels={enabledChannels}
          lineByLine={lineByLine}
          fontSize={fontSize}
          isSeparator={(line) => isSeparatorLine(line.jp) || isSeparatorLine(line.rom)}
        />
        <footer className="lyrics-disclaimer">
          <p className="mb-0">
            <strong>Disclaimer:</strong> The song lyrics, translations, and transliterations on this
            page are reproduced solely for academic and educational purposes — specifically, to aid
            in the study of Japanese language reading and comprehension. All rights to the original
            lyrics remain the property of their respective songwriters, publishers, and copyright
            holders. No copyright infringement is intended, and this content is not authorized for
            commercial use or redistribution.
          </p>
        </footer>
      </Container>

      {showScrollTop && <ScrollTopButton floating />}
    </div>
  );
}
