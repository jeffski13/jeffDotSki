import { useState, useEffect } from 'react';

const useTypewriter = (text, speed = 100) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const wordList = text.split(' ');
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < (wordList.length)) {
        setDisplayText(wordList.slice(0, i + 1).join(' '));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => {
      clearInterval(typingInterval);
    };
  }, [text, speed]);

  return displayText;
};

interface TypewriterProps {
  text: string;
  isInstantTextRender?: boolean;
}

export default function Typewriter({text, isInstantTextRender = false}: TypewriterProps) {
  //testability
  if(isInstantTextRender) {
    return <span>{text}</span>;
  }

  const displayedText = useTypewriter(text);
  return <span>{displayedText}</span>;
};