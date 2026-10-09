import { ENV, getEnv } from '../../infra/env';
import type { Word } from './wordsLogic';

// In dev, relative path is proxied to the local furigana service by vite.config.ts,
// so requests stay same-origin and the browser never sends a CORS preflight. Firebase
// Hosting has no such proxy, so prod talks to the Cloud Run service directly.
export const getWordsToLearnUrl = (env: string): string =>
  env === ENV.PROD
    ? 'https://jeffdotskifuriganaserver-176879653026.us-east1.run.app/wordsToLearn'
    : '/wordsToLearn';

export const WORDS_TO_LEARN_URL = getWordsToLearnUrl(getEnv());

interface WordsResponse {
  words: Word[];
}

async function readWords(response: Response): Promise<Word[]> {
  if (!response.ok) {
    throw new Error(`Words to learn request failed: ${response.status} ${response.statusText}`);
  }
  const data: WordsResponse = await response.json();
  return data.words;
}

export async function fetchWords(): Promise<Word[]> {
  return readWords(await fetch(WORDS_TO_LEARN_URL));
}

// Sends locally changed words; the server merges them and returns the full list.
export async function pushWords(words: Word[]): Promise<Word[]> {
  return readWords(
    await fetch(WORDS_TO_LEARN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ words }),
    }),
  );
}
