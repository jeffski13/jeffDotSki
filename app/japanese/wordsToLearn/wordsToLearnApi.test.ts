/// <reference types="vitest/globals" />
import { ENV } from '../../infra/env';
import { fetchWords, getWordsToLearnUrl, pushWords, WORDS_TO_LEARN_URL } from './wordsToLearnApi';
import type { Word } from './wordsLogic';

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

const jsonResponse = (body: unknown, ok = true, status = 200) => ({
  ok,
  status,
  statusText: ok ? 'OK' : 'Error',
  json: async () => body,
});

const words: Word[] = [
  { id: 'a', romaji: 'katsudou', english: 'activity', list: 'learning', order: 0, lastModified: 1, deleted: false },
];

beforeEach(() => {
  fetchMock.mockReset();
});

describe('getWordsToLearnUrl', () => {
  it('points at the Cloud Run service in prod', () => {
    expect(getWordsToLearnUrl(ENV.PROD)).toBe('https://jeffdotskifuriganaserver-176879653026.us-east1.run.app/wordsToLearn');
  });

  it('uses the relative, vite-proxied path otherwise', () => {
    expect(getWordsToLearnUrl(ENV.DEV)).toBe('/wordsToLearn');
    expect(getWordsToLearnUrl('test')).toBe('/wordsToLearn');
  });
});

describe('fetchWords', () => {
  it('returns the words from the JSON response', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ words }));

    expect(await fetchWords()).toEqual(words);
    expect(fetchMock).toHaveBeenCalledWith(WORDS_TO_LEARN_URL);
  });

  it('throws on a non-ok status', async () => {
    fetchMock.mockResolvedValue(jsonResponse(null, false, 500));

    await expect(fetchWords()).rejects.toThrow('Words to learn request failed: 500 Error');
  });
});

describe('pushWords', () => {
  it('posts the changed words and returns the merged list', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ words }));

    expect(await pushWords(words)).toEqual(words);
    expect(fetchMock).toHaveBeenCalledWith(WORDS_TO_LEARN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ words }),
    });
  });

  it('throws on a non-ok status', async () => {
    fetchMock.mockResolvedValue(jsonResponse(null, false, 400));

    await expect(pushWords(words)).rejects.toThrow('Words to learn request failed: 400 Error');
  });
});
