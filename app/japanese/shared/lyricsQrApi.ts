import { ENV, getEnv } from '../../infra/env';

// In dev, relative path is proxied to the local furigana service by vite.config.ts,
// so requests stay same-origin and the browser never sends a CORS preflight. Firebase
// Hosting has no such proxy, so prod talks to the Cloud Run service directly.
export const getLyricsQRUrl = (env: string): string =>
  env === ENV.PROD
    ? 'https://jeffdotskifuriganaserver-176879653026.us-east1.run.app/lyricsQR'
    : '/lyricsQR';

export const LYRICS_QR_URL = getLyricsQRUrl(getEnv());

interface LyricsQRGetResponse {
  url: string;
}

export async function fetchLyricsRedirectUrl(): Promise<string> {
  const response = await fetch(LYRICS_QR_URL);

  if (!response.ok) {
    throw new Error(`Lyrics QR service request failed: ${response.status} ${response.statusText}`);
  }

  const data: LyricsQRGetResponse = await response.json();
  return data.url;
}

export class LyricsQrUpdateForbiddenError extends Error {}

export async function updateLyricsUrl(updateKey: string, url: string): Promise<void> {
  const response = await fetch(LYRICS_QR_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ updateKey, url }),
  });

  if (response.status === 403) {
    throw new LyricsQrUpdateForbiddenError('Update key is not valid.');
  }

  if (!response.ok) {
    throw new Error(`Lyrics QR update failed: ${response.status} ${response.statusText}`);
  }
}
