/// <reference types="vitest/globals" />
import { buildFuriganaLinesFromKanji } from './kanjiToHiragana';
import { FURIGANA_TRANSFORMATION_URL } from './apiRoutes';

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

describe('buildFuriganaLinesFromKanji', () => {
  it('posts the trimmed kanji text to the local furigana service and converts the furigana strings it returns', async () => {
    fetchMock.mockResolvedValue(jsonResponse(['誰（だれ）にも見（み）せない']));

    const lines = await buildFuriganaLinesFromKanji('  誰にも見せない  ');

    expect(fetchMock).toHaveBeenCalledWith(FURIGANA_TRANSFORMATION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(['誰にも見せない']),
    });
    expect(lines).toEqual([
      { kanji: '誰にも見せない', hiragana: 'だれにもみせない', furigana: '誰（だれ）にも見（み）せない' },
    ]);
  });

  it('sends only non-blank lines to the service, but keeps blank lines in the returned result', async () => {
    fetchMock.mockResolvedValue(jsonResponse(['誰（だれ）にも見（み）せない', '今日（きょう）は良（よ）い天気（てんき）です']));

    const lines = await buildFuriganaLinesFromKanji('  誰にも見せない  \n\n今日は良い天気です\n   ');

    expect(fetchMock).toHaveBeenCalledWith(
      FURIGANA_TRANSFORMATION_URL,
      expect.objectContaining({ body: JSON.stringify(['誰にも見せない', '今日は良い天気です']) }),
    );
    expect(lines).toEqual([
      { kanji: '誰にも見せない', hiragana: 'だれにもみせない', furigana: '誰（だれ）にも見（み）せない' },
      { kanji: '', hiragana: '', furigana: '' },
      { kanji: '今日は良い天気です', hiragana: 'きょうはよいてんきです', furigana: '今日（きょう）は良（よ）い天気（てんき）です' },
      { kanji: '', hiragana: '', furigana: '' },
    ]);
  });

  it('returns an empty array for blank input without calling the service', async () => {
    const lines = await buildFuriganaLinesFromKanji('   \n  ');

    expect(lines).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('throws when the service responds with a non-ok status', async () => {
    fetchMock.mockResolvedValue(jsonResponse(null, false, 500));

    await expect(buildFuriganaLinesFromKanji('誰にも見せない')).rejects.toThrow('Furigana service request failed: 500 Error');
  });
});
