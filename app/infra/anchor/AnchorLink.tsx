import { useState } from 'react';
import './anchor-link.css';

interface AnchorLinkProps {
  targetId: string;
  isDarkMode?: boolean;
  animationTime?: number;
  isWindowLocationAvailable?: boolean;
}

export default function AnchorLink({ targetId, isDarkMode = false, animationTime = 1500, isWindowLocationAvailable = true }: AnchorLinkProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      setCopied(true);
      if (isWindowLocationAvailable) {
        const url = window.location.origin + window.location.pathname + window.location.search + `#${targetId}`;
        await navigator.clipboard.writeText(url);
      }
      setTimeout(() => {
        setCopied(false);
      }, animationTime);
    } catch (e) {
      // fallback: try prompt so user can copy manually
      // eslint-disable-next-line no-alert
      window.prompt('Copy this link', window.location.href + `#${targetId}`);
    }
  };


  let sourceLinkIcon = "/images/aboutMeSection/link-icon-light-mode.png";
  let sourceCopiedIcon = "/images/aboutMeSection/copied-icon-light-mode.png";
  if (isDarkMode) {
    sourceLinkIcon = "/images/aboutMeSection/link-icon-dark-mode.png";
    sourceCopiedIcon = "/images/aboutMeSection/copied-icon-dark-mode.png";
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
        <img className="anchor-link-icon" src={sourceCopiedIcon} alt="Copied Successfully Icon" />
      ) : (
        <img className="anchor-link-icon" src={sourceLinkIcon} alt="Copy Link Icon" />
      )}
    </button>
  );
}

/**
 * navigates to the indicated anchor
 * @param locationHash string
 */
export const navigateToAnchor = (locationHash: string | undefined, isTestEnv: boolean) => {
  if(!isTestEnv) {
    // Scroll to the element with the ID from the fragment identifier
    if (locationHash) {
      const element = document.querySelector(location.hash)
      if (element) {
        const timeMsForContentToLoadIn = 100;
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, timeMsForContentToLoadIn);
      }
    }
  }
}