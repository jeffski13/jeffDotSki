import { useEffect } from 'react';

// iOS Safari fires `pagehide` when a tab is merely backgrounded during
// app-switching/multitasking, not just on real navigation. That trips
// react-router's <ScrollRestoration />, which hands scroll control back to
// the browser on `pagehide` and only reclaims it on a route change — so
// returning to the tab lands back at the top even though app state (which
// lives in memory, untouched) is preserved. Save/restore the scroll position
// ourselves across the hide/show cycle to compensate.
export function useBackgroundScrollRestore() {
  useEffect(() => {
    let savedScrollY: number | null = null;

    const handleHide = () => {
      savedScrollY = window.scrollY;
    };

    const handleShow = () => {
      if (savedScrollY !== null && savedScrollY !== 0 && window.scrollY === 0) {
        window.scrollTo(0, savedScrollY);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleHide();
      } else {
        handleShow();
      }
    };

    window.addEventListener('pagehide', handleHide);
    window.addEventListener('pageshow', handleShow);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pagehide', handleHide);
      window.removeEventListener('pageshow', handleShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}
