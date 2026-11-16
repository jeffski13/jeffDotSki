const KANJI_REGEX = /[一-鿿㐀-䶿々\u{20000}-\u{2FA1F}]/u;
const HIRAGANA_REGEX = /[ぁ-ゖゝゞ]/;

export const isKanji = (ch: string | undefined): boolean => !!ch && KANJI_REGEX.test(ch);
export const isHiragana = (ch: string | undefined): boolean => !!ch && HIRAGANA_REGEX.test(ch);

/**
 * Given a line of text and the index of a tapped character, returns the
 * [start, end) bounds of the "word" to highlight, or null if the tapped
 * character is not kanji.
 *
 * The word is the run of kanji containing the tapped character, followed by
 * any hiragana immediately after it (e.g. 探して, 明日を).
 */
export function findWordBounds(text: string, index: number): [number, number] | null {
  const chars = Array.from(text);
  // Convert the UTF-16 index into a code point index so surrogate-pair kanji work.
  let cpIndex = 0;
  for (let u = 0; cpIndex < chars.length && u + chars[cpIndex].length <= index; cpIndex++) {
    u += chars[cpIndex].length;
  }
  if (!isKanji(chars[cpIndex])) return null;

  let start = cpIndex;
  while (start > 0 && isKanji(chars[start - 1])) start--;
  let end = cpIndex + 1;
  while (end < chars.length && isKanji(chars[end])) end++;
  while (end < chars.length && isHiragana(chars[end])) end++;

  const toUnits = (cp: number) => chars.slice(0, cp).join("").length;
  return [toUnits(start), toUnits(end)];
}

type TextPos = { node: Text; offset: number };

/**
 * Collects the selectable text nodes of `container` (skipping furigana <rt>
 * readings) so ruby-annotated lines are treated as their base text.
 */
function collectTextNodes(container: Node): Text[] {
  const nodes: Text[] = [];
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      nodes.push(node as Text);
      return;
    }
    if (node.nodeName === "RT" || node.nodeName === "RP") return;
    node.childNodes.forEach(walk);
  };
  walk(container);
  return nodes;
}

/**
 * Selects the word around the tapped position (`node`/`offset`) inside
 * `container`. Returns true if a selection was made.
 */
export function selectWordAt(container: Node, node: Node, offset: number): boolean {
  const textNodes = collectTextNodes(container);
  const nodeIdx = textNodes.indexOf(node as Text);
  if (nodeIdx === -1) return false;

  const starts: number[] = [];
  let text = "";
  for (const t of textNodes) {
    starts.push(text.length);
    text += t.data;
  }

  // The caret lands between characters; treat it as the character to its right,
  // unless it's at the very end of the node.
  const clamped = Math.min(offset, Math.max(textNodes[nodeIdx].data.length - 1, 0));
  const bounds = findWordBounds(text, starts[nodeIdx] + clamped);
  if (!bounds) return false;

  const toPos = (flat: number, preferEnd: boolean): TextPos => {
    for (let i = 0; i < textNodes.length; i++) {
      const len = textNodes[i].data.length;
      const local = flat - starts[i];
      if (local < len || (preferEnd && local === len) || i === textNodes.length - 1) {
        return { node: textNodes[i], offset: Math.min(local, len) };
      }
    }
    return { node: textNodes[0], offset: 0 };
  };

  const start = toPos(bounds[0], false);
  const end = toPos(bounds[1], true);
  const doc = container.ownerDocument ?? document;
  const selection = doc.getSelection();
  if (!selection) return false;
  const range = doc.createRange();
  range.setStart(start.node, start.offset);
  range.setEnd(end.node, end.offset);
  selection.removeAllRanges();
  selection.addRange(range);
  return true;
}

/**
 * Returns the text node and the index of the character under the given
 * viewport point, if any.
 */
export function charFromPoint(doc: Document, x: number, y: number): { node: Node; offset: number } | null {
  const anyDoc = doc as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };
  let caret: { node: Node; offset: number } | null = null;
  if (anyDoc.caretPositionFromPoint) {
    const pos = anyDoc.caretPositionFromPoint(x, y);
    caret = pos ? { node: pos.offsetNode, offset: pos.offset } : null;
  } else if (anyDoc.caretRangeFromPoint) {
    const range = anyDoc.caretRangeFromPoint(x, y);
    caret = range ? { node: range.startContainer, offset: range.startOffset } : null;
  }
  if (!caret || caret.node.nodeType !== Node.TEXT_NODE) return null;

  // The caret snaps to the nearest character boundary, even when the point is
  // in empty space past the end of a line. Only accept a character whose box
  // actually contains the point: the one after the caret, or (when tapping the
  // right half of a character) the one before it.
  const { node, offset } = caret;
  const containsPoint = (charIdx: number): boolean => {
    if (charIdx < 0 || charIdx >= (node as Text).data.length) return false;
    const range = doc.createRange();
    range.setStart(node, charIdx);
    range.setEnd(node, charIdx + 1);
    const rect = range.getBoundingClientRect?.();
    return !!rect && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };
  if (containsPoint(offset)) return { node, offset };
  if (containsPoint(offset - 1)) return { node, offset: offset - 1 };
  return null;
}
