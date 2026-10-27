import { useEffect } from 'react';

const VIEWPORT_FIT_COVER = 'viewport-fit=cover';

/**
 * Adds viewport-fit=cover to a viewport meta content string, unless a viewport-fit is already set.
 */
export function withViewportFitCover(content: string): string {
  if (/viewport-fit\s*=/.test(content)) return content;
  const trimmed = content.trim();
  return trimmed.length > 0 ? `${trimmed}, ${VIEWPORT_FIT_COVER}` : VIEWPORT_FIT_COVER;
}

/**
 * While mounted, lets the page draw under the iPhone notch and home indicator so the
 * env(safe-area-inset-*) values are non-zero when running as a Home Screen app.
 * Scoped to the page (instead of root) so the rest of the site keeps the default viewport.
 */
export function useViewportFitCover(doc: Document = document) {
  useEffect(() => {
    const meta = doc.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    if (!meta) return;
    const original = meta.content;
    meta.content = withViewportFitCover(original);
    return () => {
      meta.content = original;
    };
  }, [doc]);
}
