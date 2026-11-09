/// <reference types="vitest/globals" />
import { charFromPoint, findWordBounds, selectWordAt } from './wordSelect';

const LINE = '明日を探して来たんだろう';
const wordAt = (text: string, ch: string, occurrence = 0) => {
  let idx = -1;
  for (let i = 0; i <= occurrence; i++) idx = text.indexOf(ch, idx + 1);
  const bounds = findWordBounds(text, idx);
  return bounds ? text.slice(bounds[0], bounds[1]) : null;
};

describe('findWordBounds', () => {
  it('selects the kanji plus trailing hiragana', () => {
    expect(wordAt(LINE, '探')).toBe('探して');
  });

  it('includes adjacent kanji to the left', () => {
    expect(wordAt(LINE, '日')).toBe('明日を');
  });

  it('includes adjacent kanji to the right when tapping the first kanji of a compound', () => {
    expect(wordAt(LINE, '明')).toBe('明日を');
  });

  it('stops trailing hiragana at the next kanji', () => {
    expect(wordAt(LINE, '来')).toBe('来たんだろう');
  });

  it('does not include katakana, punctuation or spaces', () => {
    expect(wordAt('夢みたヒカリ', '夢')).toBe('夢みた');
    expect(wordAt('言葉、それ', '葉')).toBe('言葉');
    expect(wordAt('心 ここに', '心')).toBe('心');
  });

  it('treats 々 as kanji', () => {
    expect(wordAt('人々は', '々')).toBe('人々は');
    expect(wordAt('人々は', '人')).toBe('人々は');
  });

  it('returns null for non-kanji characters', () => {
    expect(findWordBounds(LINE, LINE.indexOf('を'))).toBeNull();
    expect(findWordBounds('カタカナ', 0)).toBeNull();
    expect(findWordBounds('romaji', 2)).toBeNull();
    expect(findWordBounds('', 0)).toBeNull();
  });

  it('handles surrogate-pair kanji', () => {
    const text = 'a𠮷野家で';
    const bounds = findWordBounds(text, text.indexOf('野'))!;
    expect(text.slice(bounds[0], bounds[1])).toBe('𠮷野家で');
  });
});

describe('selectWordAt', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    window.getSelection()?.removeAllRanges();
  });

  it('selects the word in a plain text line', () => {
    const p = document.createElement('p');
    p.textContent = LINE;
    document.body.appendChild(p);

    expect(selectWordAt(p, p.firstChild!, LINE.indexOf('探'))).toBe(true);
    expect(window.getSelection()!.toString()).toBe('探して');
  });

  it('ignores furigana readings and spans ruby elements', () => {
    const p = document.createElement('p');
    p.innerHTML = '<ruby>明日<rt>あした</rt></ruby>を<ruby>探<rt>さが</rt></ruby>して';
    document.body.appendChild(p);

    const ashita = p.querySelector('ruby')!.firstChild!;
    expect(selectWordAt(p, ashita, 1)).toBe(true);
    const range = window.getSelection()!.getRangeAt(0);
    expect(range.startContainer).toBe(ashita);
    expect(range.startOffset).toBe(0);
    expect(range.endContainer.textContent).toBe('を');
    expect(range.endOffset).toBe(1);

    const saga = p.querySelectorAll('ruby')[1].firstChild!;
    expect(selectWordAt(p, saga, 0)).toBe(true);
    const range2 = window.getSelection()!.getRangeAt(0);
    expect(range2.startContainer).toBe(saga);
    expect(range2.endContainer.textContent).toBe('して');
    expect(range2.endOffset).toBe(2);
  });

  it('does nothing when tapping a non-kanji character', () => {
    const p = document.createElement('p');
    p.textContent = LINE;
    document.body.appendChild(p);

    expect(selectWordAt(p, p.firstChild!, LINE.indexOf('を'))).toBe(false);
    expect(window.getSelection()!.isCollapsed).toBe(true);
  });

  it('does nothing when tapping furigana text', () => {
    const p = document.createElement('p');
    p.innerHTML = '<ruby>探<rt>さが</rt></ruby>して';
    document.body.appendChild(p);

    expect(selectWordAt(p, p.querySelector('rt')!.firstChild!, 0)).toBe(false);
  });
});

describe('charFromPoint', () => {
  // Lay out '明日を' as three 10x10 boxes starting at x=0; the line ends at x=30.
  const CHAR_WIDTH = 10;
  let text: Text;
  let caretOffset: number;
  let originalRect: typeof Range.prototype.getBoundingClientRect;

  beforeEach(() => {
    const p = document.createElement('p');
    p.textContent = '明日を';
    document.body.appendChild(p);
    text = p.firstChild as Text;
    (document as any).caretRangeFromPoint = () => {
      const r = document.createRange();
      r.setStart(text, caretOffset);
      return r;
    };
    originalRect = Range.prototype.getBoundingClientRect;
    Range.prototype.getBoundingClientRect = function (this: Range) {
      const left = this.startOffset * CHAR_WIDTH;
      return { left, right: left + CHAR_WIDTH, top: 0, bottom: 10 } as DOMRect;
    };
  });

  afterEach(() => {
    delete (document as any).caretRangeFromPoint;
    Range.prototype.getBoundingClientRect = originalRect;
    document.body.innerHTML = '';
  });

  it('returns the character when tapping its left half', () => {
    caretOffset = 1;
    expect(charFromPoint(document, 12, 5)).toEqual({ node: text, offset: 1 });
  });

  it('returns the character when tapping its right half', () => {
    caretOffset = 2;
    expect(charFromPoint(document, 18, 5)).toEqual({ node: text, offset: 1 });
  });

  it('returns null when tapping empty space to the right of the line', () => {
    caretOffset = 3;
    expect(charFromPoint(document, 80, 5)).toBeNull();
  });

  it('returns null when tapping below the line', () => {
    caretOffset = 1;
    expect(charFromPoint(document, 12, 40)).toBeNull();
  });
});
