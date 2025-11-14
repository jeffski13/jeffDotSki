import { useState } from 'react';
import './anchor-link.css';

interface AnchorLinkProps {
  targetId: string;
}

export default function AnchorLink({ targetId }: AnchorLinkProps) {
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
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="anchor-link-icon">
          <path d="M3.9 12a3.9 3.9 0 0 1 3.9-3.9h3a.75.75 0 0 1 0 1.5h-3A2.4 2.4 0 0 0 4.4 12c0 1.32 1.08 2.4 2.4 2.4h3a.75.75 0 0 1 0 1.5h-3A3.9 3.9 0 0 1 3.9 12zm16.2 0a3.9 3.9 0 0 1-3.9 3.9h-3a.75.75 0 0 1 0-1.5h3a2.4 2.4 0 0 0 2.4-2.4c0-1.32-1.08-2.4-2.4-2.4h-3a.75.75 0 0 1 0-1.5h3a3.9 3.9 0 0 1 3.9 3.9z" />
        </svg>
      )}
    </button>
  );
}
