import React from 'react';

export function renderEnText(text: string, splitEnglishDialogue: boolean, splitEnglishOnPeriod: boolean): React.ReactNode {
  if (!splitEnglishDialogue && !splitEnglishOnPeriod) return text;

  const applyDialogueSplit = (t: string, keyPrefix: string): React.ReactNode[] => {
    if (!splitEnglishDialogue) return [t];
    const parts = t.split(/("[^"]*")/);
    return parts.reduce<React.ReactNode[]>((acc, part, i) => {
      if (!part) return acc;
      const isDialogue = /^"[^"]*"$/.test(part);
      if (isDialogue && acc.length > 0) acc.push(<br key={`${keyPrefix}d${i}`} />);
      acc.push(part);
      if (isDialogue && i < parts.length - 1) {
        const nextPart = parts[i + 1] ?? '';
        if (!nextPart.startsWith('.') && !nextPart.startsWith(',')) acc.push(<br key={`${keyPrefix}da${i}`} />);
      }
      return acc;
    }, []);
  };

  if (!splitEnglishOnPeriod) return applyDialogueSplit(text, '');

  const sentences = text.split(/(?<=[.?!]) /);
  return sentences.reduce<React.ReactNode[]>((acc, sentence, i) => {
    if (i > 0) acc.push(<br key={`ps${i}`} />);
    acc.push(...applyDialogueSplit(sentence, `s${i}-`));
    return acc;
  }, []);
}
