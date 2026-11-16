import { useMemo } from "react";
import { Container } from "react-bootstrap";
import orderOfMass from "./order_of_mass";
import { useTextSize } from "../shared/textSizeControl";
import { useShowScrollTop, ScrollTopButton } from "../shared/scrollTopButton";
import { usePersistedBooleanSettings } from "../shared/persistedSettings";
import { renderFuriganaText } from "../shared/furiganaRuby";
import { furiganaToKanji } from "../shared/furiganaText";
import { ParallelTextControls, ParallelTextView, isSeparatorLine, zipLines, type ParallelTextChannel } from "../shared/parallelText";
import "./styles.css";

export const DISPLAY_SETTINGS_KEY = "massOrder.displaySettings";
export const FONT_SIZE_KEY = "massOrder.fontSize";

const DEFAULT_DISPLAY_SETTINGS = {
  showFurigana: true,
  showJp: false,
  showEnglish: true,
  lineByLine: false,
};

const sections = orderOfMass.furigana.map((subsections, s) =>
  subsections.map((furigana, sub) => zipLines({ furigana, english: orderOfMass.english[s][sub] })),
);
type Line = (typeof sections)[number][number][number];
const isSeparator = (line: Line) => isSeparatorLine(line.furigana) || isSeparatorLine(line.english);

export default function MassOrderPage() {
  const [displaySettings, setDisplaySettings] = usePersistedBooleanSettings(DISPLAY_SETTINGS_KEY, DEFAULT_DISPLAY_SETTINGS);
  const { showFurigana, showJp, showEnglish, lineByLine } = displaySettings;
  const [fontSize, setFontSize] = useTextSize(FONT_SIZE_KEY);
  const showScrollTop = useShowScrollTop();

  const setSetting = (key: keyof typeof DEFAULT_DISPLAY_SETTINGS) => (checked: boolean) =>
    setDisplaySettings((prev) => ({ ...prev, [key]: checked }));

  const enabledChannels = useMemo(() => {
    const channels: ParallelTextChannel<Line>[] = [];
    if (showFurigana) {
      channels.push({ key: "furigana", render: (line, idx) => renderFuriganaText(line.furigana, `furigana-${idx}`) });
    }
    if (showJp) {
      channels.push({ key: "jp", render: (line) => furiganaToKanji(line.furigana) });
    }
    if (showEnglish) {
      channels.push({ key: "english", render: (line) => line.english });
    }
    return channels;
  }, [showFurigana, showJp, showEnglish]);

  return (
    <div id="japanese-mass-order">
      <Container fluid>
        <ParallelTextControls
          leading={
            <h1 className="mass-order-title">
              <span lang="ja">ミサの式次第</span> <span className="mass-order-title-en">Order of Mass</span>
            </h1>
          }
          options={[
            { id: "show-furigana", label: "Furigana", checked: showFurigana, onChange: setSetting("showFurigana") },
            { id: "show-jp", label: "Japanese", checked: showJp, onChange: setSetting("showJp") },
            { id: "show-english", label: "English", checked: showEnglish, onChange: setSetting("showEnglish") },
            { id: "line-by-line", label: "Line by line", checked: lineByLine, onChange: setSetting("lineByLine") },
          ]}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
        />
        {sections.map((subsections, s) => (
          <section key={s} className="mass-order-section">
            {subsections.map((lines, sub) => (
              <ParallelTextView
                key={sub}
                lines={lines}
                channels={enabledChannels}
                lineByLine={lineByLine}
                fontSize={fontSize}
                isSeparator={isSeparator}
              />
            ))}
          </section>
        ))}
      </Container>

      {showScrollTop && <ScrollTopButton floating />}
    </div>
  );
}
