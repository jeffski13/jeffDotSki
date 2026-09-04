import { useState, useEffect } from 'react';
import './scrollTopButton.css';

// Tracks whether the page has been scrolled past `threshold`, for showing/hiding a "back to top" control.
export function useShowScrollTop(threshold: number = 300): boolean {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return show;
}

type ScrollTopButtonProps = {
  onClick?: () => void;
  floating?: boolean;
  className?: string;
};

export function ScrollTopButton({ onClick, floating = false, className }: ScrollTopButtonProps) {
  const classes = ['scroll-top-btn', floating && 'scroll-top-btn--floating', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      onClick={onClick ?? (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
      aria-label="Scroll to top"
    >
      ▲
    </button>
  );
}
