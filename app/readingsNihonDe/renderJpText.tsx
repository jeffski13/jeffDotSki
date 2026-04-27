import React from 'react';

export function renderJpText(text: string, dialogueSplit: boolean, splitOnKuten: boolean): React.ReactNode {
  const applyKuten = (t: string): React.ReactNode[] => {
    if (!splitOnKuten) return [t];
    return t.split('。').reduce<React.ReactNode[]>((acc, part, i, arr) => {
      if (i < arr.length - 1) {
        acc.push(part + '。');
        if (!part.endsWith('」') && !arr[i + 1].startsWith('〕')) acc.push(<br key={`k${i}`} />);
      } else if (part) {
        acc.push(part);
      }
      return acc;
    }, []);
  };

  if (!dialogueSplit) return applyKuten(text);

  const parts = text.split(/(「[^」]*」|「[^」]*)/);
  return parts.reduce<React.ReactNode[]>((acc, part, i) => {
    if (!part) return acc;
    const isDialogue = /^「/.test(part);
    if (isDialogue && acc.length > 0) acc.push(<br key={`d${i}`} />);
    acc.push(...applyKuten(part));
    if (isDialogue && i < parts.length - 1) {
      const nextPart = parts[i + 1] ?? '';
      if (!nextPart.startsWith('。') && !nextPart.startsWith('、')) acc.push(<br key={`da${i}`} />);
    }
    return acc;
  }, []);
}
