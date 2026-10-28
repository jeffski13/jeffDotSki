/// <reference types="vitest/globals" />
import { renderHook } from '@testing-library/react';
import { useViewportFitCover, withViewportFitCover } from './useViewportFitCover';

describe('withViewportFitCover', () => {
  it('appends viewport-fit=cover to existing content', () => {
    expect(withViewportFitCover('width=device-width, initial-scale=1')).toBe(
      'width=device-width, initial-scale=1, viewport-fit=cover',
    );
  });

  it('returns just viewport-fit=cover for empty content', () => {
    expect(withViewportFitCover('  ')).toBe('viewport-fit=cover');
  });

  it('leaves an existing viewport-fit untouched', () => {
    expect(withViewportFitCover('width=device-width, viewport-fit=contain')).toBe(
      'width=device-width, viewport-fit=contain',
    );
  });
});

describe('useViewportFitCover', () => {
  let meta: HTMLMetaElement;

  beforeEach(() => {
    meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1';
    document.head.appendChild(meta);
  });

  afterEach(() => {
    meta.remove();
  });

  it('adds viewport-fit=cover while mounted and restores the original on unmount', () => {
    const { unmount } = renderHook(() => useViewportFitCover());
    expect(meta.content).toBe('width=device-width, initial-scale=1, viewport-fit=cover');

    unmount();
    expect(meta.content).toBe('width=device-width, initial-scale=1');
  });

  it('does nothing when there is no viewport meta', () => {
    meta.remove();
    expect(() => renderHook(() => useViewportFitCover()).unmount()).not.toThrow();
  });
});
