import { useState } from 'react';
import './anchor-link.css';

interface AnchorLinkProps {
  targetId: string;
  isDarkMode?: boolean;
}

export default function AnchorLink({ targetId, isDarkMode = false }: AnchorLinkProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const url = window.location.origin + window.location.pathname + window.location.search + `#${targetId}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // fallback: try prompt so user can copy manually
      // eslint-disable-next-line no-alert
      window.prompt('Copy this link', window.location.href + `#${targetId}`);
    }
  };

  
  let source = "/images/aboutMeSection/link-icon-light-mode.png";
  if(isDarkMode) {
    source = "/images/aboutMeSection/link-icon-dark-mode.png";
  }

  return (
    <button
      type="button"
      className="anchor-link"
      aria-label={`Copy link to ${targetId}`}
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy link'}
    >
      {copied ? (
        <span className="anchor-link-copied">✓</span>
      ) : (
        <img className="anchor-link-icon" src={source} />
      )}
    </button>
  );
}
