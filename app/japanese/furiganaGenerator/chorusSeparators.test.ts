/// <reference types="vitest/globals" />
import { applyChorusSeparators } from './chorusSeparators';
import { CHORUS_SEPARATORS_URL } from './apiRoutes';

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

describe('applyChorusSeparators', () => {
  it('posts the trimmed kanji lines to the chorus separator service and returns the transformed text', async () => {
    fetchMock.mockResolvedValue(jsonResponse(['【サビ】', '誰にも見せない']));

    const text = await applyChorusSeparators('  【サビ】  \n誰にも見せない');

    expect(fetchMock).toHaveBeenCalledWith(CHORUS_SEPARATORS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(['【サビ】', '誰にも見せない']),
    });
    expect(text).toBe('【サビ】\n誰にも見せない');
  });

  it('sends only non-blank lines to the service, but keeps blank lines in the returned text', async () => {
    fetchMock.mockResolvedValue(jsonResponse(['誰にも見せない', '今日は良い天気です']));

    const text = await applyChorusSeparators('  誰にも見せない  \n\n今日は良い天気です\n   ');

    expect(fetchMock).toHaveBeenCalledWith(
      CHORUS_SEPARATORS_URL,
      expect.objectContaining({ body: JSON.stringify(['誰にも見せない', '今日は良い天気です']) }),
    );
    expect(text).toBe('誰にも見せない\n\n今日は良い天気です\n');
  });

  it('returns the input unchanged for blank input without calling the service', async () => {
    const text = await applyChorusSeparators('   \n  ');

    expect(text).toBe('   \n  ');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('throws when the service responds with a non-ok status', async () => {
    fetchMock.mockResolvedValue(jsonResponse(null, false, 500));

    await expect(applyChorusSeparators('誰にも見せない')).rejects.toThrow(
      'Chorus separator service request failed: 500 Error',
    );
  });
});
