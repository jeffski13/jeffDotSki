import React from 'react';

export function renderEnText(text: string, splitEnglishDialogue: boolean, splitEnglishOnPeriod: boolean): React.ReactNode {
  if (!splitEnglishDialogue && !splitEnglishOnPeriod) return text;

  if (!splitEnglishDialogue) {
    const sentences = text.split(/(?<=[.?!]) /);
    return sentences.reduce<React.ReactNode[]>((acc, sentence, i) => {
      if (i > 0) acc.push(<br key={`ps${i}`} />);
      acc.push(sentence);
      return acc;
    }, []);
  }

  // Split into narrative and dialogue blocks first (on full text), then apply sentence
  // splitting within each block. This avoids the sentence splitter breaking dialogue
  // in the middle, which would cause quote-pairing to go wrong.
  const parts = text.split(/("[^"]*")/);
  const nodes: React.ReactNode[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part) continue;

    const isDialogue = /^"[^"]*"$/.test(part);

    if (isDialogue) {
      if (splitEnglishOnPeriod) {
        // Split within dialogue on sentence boundaries, but keep ."  ?"  !" together
        // by not splitting when the punctuation is immediately followed by the closing "
        const sentences = part.split(/(?<=[.?!]) (?!")/);
        for (let j = 0; j < sentences.length; j++) {
          if (nodes.length > 0) nodes.push(<br key={`d${i}s${j}`} />);
          nodes.push(sentences[j]);
        }
      } else {
        if (nodes.length > 0) nodes.push(<br key={`d${i}`} />);
        nodes.push(part);
      }
    } else {
      const trimmed = part.trim();
      if (!trimmed) continue;

      if (splitEnglishOnPeriod) {
        const sentences = trimmed.split(/(?<=[.?!]) /);
        for (let j = 0; j < sentences.length; j++) {
          if (nodes.length > 0) nodes.push(<br key={`n${i}s${j}`} />);
          nodes.push(sentences[j]);
        }
      } else {
        if (nodes.length > 0) nodes.push(<br key={`n${i}`} />);
        nodes.push(trimmed);
      }
    }
  }

  return nodes;
}
