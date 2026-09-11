/// <reference types="vitest/globals" />
import { ENV } from '../../infra/env';
import {
  getLyricsQRUrl,
  LYRICS_QR_URL,
  fetchLyricsRedirectUrl,
  updateLyricsUrl,
  LyricsQrUpdateForbiddenError,
} from './lyricsQrApi';

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

const jsonResponse = (body: unknown, ok = true, status = 200) => ({
  ok,
  status,
  statusText: ok ? 'OK' : 'Error',
  json: async () => body,
});

beforeEach(() => {
  fetchMock.mockReset();
});

describe('getLyricsQRUrl', () => {
  it('points at the Cloud Run furigana service in prod', () => {
    expect(getLyricsQRUrl(ENV.PROD)).toBe(
      'https://jeffdotskifuriganaserver-176879653026.us-east1.run.app/lyricsQR',
    );
  });

  it('uses the relative, vite-proxied path in dev', () => {
    expect(getLyricsQRUrl(ENV.DEV)).toBe('/lyricsQR');
  });

  it('falls back to the relative path for any other environment', () => {
    expect(getLyricsQRUrl('test')).toBe('/lyricsQR');
  });
});

describe('fetchLyricsRedirectUrl', () => {
  it('returns the url from the JSON response', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ url: 'https://example.com/lyrics' }));

    const url = await fetchLyricsRedirectUrl();

    expect(fetchMock).toHaveBeenCalledWith(LYRICS_QR_URL);
    expect(url).toBe('https://example.com/lyrics');
  });

  it('throws when the service responds with a non-ok status', async () => {
    fetchMock.mockResolvedValue(jsonResponse(null, false, 500));

    await expect(fetchLyricsRedirectUrl()).rejects.toThrow('Lyrics QR service request failed: 500 Error');
  });
});

describe('updateLyricsUrl', () => {
  it('posts the update key and url as JSON', async () => {
    fetchMock.mockResolvedValue(jsonResponse(null));

    await updateLyricsUrl('secret', 'https://example.com/lyrics');

    expect(fetchMock).toHaveBeenCalledWith(LYRICS_QR_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updateKey: 'secret', url: 'https://example.com/lyrics' }),
    });
  });

  it('throws a LyricsQrUpdateForbiddenError when the server responds with 403', async () => {
    fetchMock.mockResolvedValue(jsonResponse(null, false, 403));

    await expect(updateLyricsUrl('wrong', 'https://example.com/lyrics')).rejects.toBeInstanceOf(
      LyricsQrUpdateForbiddenError,
    );
  });

  it('throws a generic error for other non-ok statuses', async () => {
    fetchMock.mockResolvedValue(jsonResponse(null, false, 500));

    await expect(updateLyricsUrl('secret', 'https://example.com/lyrics')).rejects.toThrow(
      'Lyrics QR update failed: 500 Error',
    );
  });
});
