import { Fragment, type ReactNode } from 'react';
import './furiganaRuby.css';

// The kanji group and its trailing space (if any, from a literal phrase-break space that landed
// between adjacent kanji and their shared furigana - see buildFurigana) are captured separately
// so the space can be rendered outside the <ruby> element instead of swallowed into it.
const KANJI_FURIGANA_REGEX = /([一-鿿㐀-䶿々]+)( *)[(（]([^)）]+)[)）]/g;

export function FuriganaToggleIcon() {
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

function parseFuriganaLine(line: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let tokenIdx = 0;
  let match: RegExpExecArray | null;
  KANJI_FURIGANA_REGEX.lastIndex = 0;
  while ((match = KANJI_FURIGANA_REGEX.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<span key={`${keyPrefix}-t${tokenIdx}`}>{line.slice(lastIndex, match.index)}</span>);
      tokenIdx++;
    }
    nodes.push(<ruby key={`${keyPrefix}-r${tokenIdx}`}>{match[1]}<rt>{match[3]}</rt></ruby>);
    tokenIdx++;
    if (match[2]) {
      nodes.push(<span key={`${keyPrefix}-t${tokenIdx}`}>{match[2]}</span>);
      tokenIdx++;
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < line.length) {
    nodes.push(<span key={`${keyPrefix}-t${tokenIdx}`}>{line.slice(lastIndex)}</span>);
  }
  return nodes;
}

// Renders text containing 漢字（かんじ）-style furigana as stylized <ruby> markup, one <br>
// per line break so multi-line input keeps its original line breaks in the output.
export function renderFuriganaText(text: string, keyPrefix: string): ReactNode {
  const lines = text.split('\n');
  return lines.map((line, i) => (
    <Fragment key={`${keyPrefix}-line${i}`}>
      {parseFuriganaLine(line, `${keyPrefix}-line${i}`)}
      {i < lines.length - 1 && <br className="furiganaRuby_linebreak" />}
    </Fragment>
  ));
}
