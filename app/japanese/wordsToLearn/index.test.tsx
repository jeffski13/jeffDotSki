/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import WordsToLearnPage from './index';
import { LONG_PRESS_MS } from './useLongPress';
import { SYNC_DEBOUNCE_MS, type WordsToLearnApi } from './useWordsToLearn';
import { mergeWords, type Word } from './wordsLogic';
import { wordsToLearnStoreImpl } from './wordsToLearnStore';

// jsdom has no PointerEvent, so without this button/clientX are dropped from the events
if (!window.PointerEvent) {
  window.PointerEvent = class extends MouseEvent {} as typeof PointerEvent;
}

const word = (overrides: Partial<Word> = {}): Word => ({
  id: 'a',
  romaji: 'katsudou',
  english: 'activity',
  list: 'learning',
  order: 0,
  lastModified: 100,
  deleted: false,
  ...overrides,
});

const SERVER_WORDS: Word[] = [
  word({ id: 'l1', romaji: 'katsudou', english: 'activity', order: 0 }),
  word({ id: 'l2', romaji: 'shouhin', english: 'stuff', order: 1 }),
  word({ id: 'w1', romaji: 'kaisoku', english: 'rapid', list: 'wantToLearn', order: 0 }),
  word({ id: 'w2', romaji: 'Akiraka ni', english: 'obviously', list: 'wantToLearn', order: 1 }),
];

// In-memory fake of the server that merges like the real one.
const createFakeApi = (initial: Word[] = SERVER_WORDS) => {
  const server = { words: [...initial] };
  const api: WordsToLearnApi = {
    fetchWords: vi.fn(async () => server.words),
    pushWords: vi.fn(async (incoming: Word[]) => {
      server.words = mergeWords(server.words, incoming);
      return server.words;
    }),
  };
  return { api, server };
};

let online = true;

beforeEach(() => {
  localStorage.clear();
  online = true;
  vi.spyOn(navigator, 'onLine', 'get').mockImplementation(() => online);
  vi.spyOn(window, 'confirm').mockReturnValue(true);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

const section = (name: 'Learning' | 'Want to Learn') =>
  screen.getByRole('region', { name: new RegExp(`^${name}`) });

const romajiIn = (name: 'Learning' | 'Want to Learn') =>
  Array.from(section(name).querySelectorAll('.wordsToLearn-romaji')).map((el) => el.textContent);

const goOffline = () => {
  online = false;
  act(() => {
    window.dispatchEvent(new Event('offline'));
  });
};

const addTo = (name: 'Learning' | 'Want to Learn', romaji: string, english: string) => {
  const region = section(name);
  fireEvent.change(within(region).getByLabelText(`${name} romaji`), { target: { value: romaji } });
  fireEvent.change(within(region).getByLabelText(`${name} english`), { target: { value: english } });
  fireEvent.click(within(region).getByRole('button', { name: `Add to ${name}` }));
};

describe('WordsToLearnPage', () => {
  it('loads words from the server into the two separate lists', async () => {
    const { api } = createFakeApi();
    render(<WordsToLearnPage api={api} />);

    await waitFor(() => expect(romajiIn('Learning')).toEqual(['katsudou', 'shouhin']));
    expect(romajiIn('Want to Learn')).toEqual(['kaisoku', 'Akiraka ni']);
    expect(screen.getByTestId('wordsToLearn-sync')).toHaveTextContent('All changes synced');
  });

  it('shows locally cached words immediately and when the server is unreachable', async () => {
    wordsToLearnStoreImpl.saveWords({ words: SERVER_WORDS, dirtyIds: [] });
    const api: WordsToLearnApi = {
      fetchWords: vi.fn().mockRejectedValue(new Error('down')),
      pushWords: vi.fn(),
    };
    render(<WordsToLearnPage api={api} />);

    expect(romajiIn('Learning')).toEqual(['katsudou', 'shouhin']);
    expect(await screen.findByText(/Couldn’t reach the server/)).toBeInTheDocument();
  });

  it('filters both lists with the search bar', async () => {
    const { api } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));

    fireEvent.change(screen.getByLabelText('Search words'), { target: { value: 'STUFF' } });

    expect(romajiIn('Learning')).toEqual(['shouhin']);
    expect(romajiIn('Want to Learn')).toEqual([]);
    expect(within(section('Want to Learn')).getByText('No matching words.')).toBeInTheDocument();
  });

  it('sorts each list independently and remembers the choice', async () => {
    const { api } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Want to Learn')).toHaveLength(2));

    fireEvent.change(screen.getByLabelText('Want to Learn sort order'), { target: { value: 'romaji' } });

    expect(romajiIn('Want to Learn')).toEqual(['Akiraka ni', 'kaisoku']);
    expect(romajiIn('Learning')).toEqual(['katsudou', 'shouhin']);
    expect(wordsToLearnStoreImpl.loadSort()).toEqual({ learning: 'custom', wantToLearn: 'romaji' });

    fireEvent.change(screen.getByLabelText('Learning sort order'), { target: { value: 'english' } });
    expect(romajiIn('Learning')).toEqual(['katsudou', 'shouhin']);
  });

  it('only shows reorder buttons in custom order without a search', async () => {
    const { api } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));

    expect(screen.getByRole('button', { name: 'Move shouhin up' })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Search words'), { target: { value: 'shou' } });
    expect(screen.queryByRole('button', { name: 'Move shouhin up' })).not.toBeInTheDocument();
  });

  it('adds, reorders, moves and deletes words, then syncs the changes to the server', async () => {
    const { api, server } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));

    addTo('Learning', 'futsuka yoi', 'hangover');
    expect(romajiIn('Learning')).toEqual(['katsudou', 'shouhin', 'futsuka yoi']);

    fireEvent.click(screen.getByRole('button', { name: 'Move futsuka yoi up' }));
    expect(romajiIn('Learning')).toEqual(['katsudou', 'futsuka yoi', 'shouhin']);

    fireEvent.click(screen.getByRole('button', { name: 'Move to Learning: kaisoku' }));
    expect(romajiIn('Learning')).toEqual(['katsudou', 'futsuka yoi', 'shouhin', 'kaisoku']);

    fireEvent.click(screen.getByRole('button', { name: 'Delete katsudou' }));
    expect(romajiIn('Learning')).toEqual(['futsuka yoi', 'shouhin', 'kaisoku']);

    await waitFor(() => expect(api.pushWords).toHaveBeenCalled(), { timeout: SYNC_DEBOUNCE_MS + 1000 });
    await waitFor(() => expect(screen.getByTestId('wordsToLearn-sync')).toHaveTextContent('All changes synced'));
    expect(server.words.find((w) => w.id === 'l1')?.deleted).toBe(true);
    expect(server.words.find((w) => w.id === 'w1')?.list).toBe('learning');
    expect(server.words.some((w) => w.romaji === 'futsuka yoi')).toBe(true);
  });

  it('does not delete when the confirmation is cancelled', async () => {
    vi.mocked(window.confirm).mockReturnValue(false);
    const { api } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));

    fireEvent.click(screen.getByRole('button', { name: 'Delete katsudou' }));

    expect(romajiIn('Learning')).toEqual(['katsudou', 'shouhin']);
  });

  it('long-pressing a word sends it to the bottom of Want to Learn', async () => {
    const { api } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));

    vi.useFakeTimers();
    fireEvent.pointerDown(screen.getByText('katsudou'), { button: 0, clientX: 0, clientY: 0 });
    act(() => {
      vi.advanceTimersByTime(LONG_PRESS_MS);
    });

    expect(romajiIn('Learning')).toEqual(['shouhin']);
    expect(romajiIn('Want to Learn')).toEqual(['kaisoku', 'Akiraka ni', 'katsudou']);
    expect(screen.getByText('Moved "katsudou" to the bottom of Want to Learn.')).toBeInTheDocument();
  });

  it('keeps working offline and uploads the queued changes when back online', async () => {
    const { api, server } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));

    goOffline();
    expect(screen.getByText(/Offline — changes are saved on this device/)).toBeInTheDocument();

    addTo('Want to Learn', 'kyoudai', 'siblings');
    fireEvent.click(screen.getByRole('button', { name: 'Move to Want to Learn: shouhin' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete katsudou' }));
    expect(romajiIn('Want to Learn')).toEqual(['kaisoku', 'Akiraka ni', 'kyoudai', 'shouhin']);

    // the changes survive a reload while still offline
    expect(wordsToLearnStoreImpl.loadWords().dirtyIds).toHaveLength(3);
    await new Promise((resolve) => setTimeout(resolve, SYNC_DEBOUNCE_MS + 50));
    expect(api.pushWords).not.toHaveBeenCalled();

    online = true;
    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    await waitFor(() => expect(api.pushWords).toHaveBeenCalledTimes(1));
    expect(vi.mocked(api.pushWords).mock.calls[0][0]).toHaveLength(3);
    await waitFor(() => expect(wordsToLearnStoreImpl.loadWords().dirtyIds).toEqual([]));
    expect(server.words.some((w) => w.romaji === 'kyoudai')).toBe(true);
  });

  it('keeps words added on another device alongside words added offline (additive merge)', async () => {
    const { api, server } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));

    goOffline();
    addTo('Learning', 'tanki', 'short term');
    // meanwhile another device adds the same word
    server.words = [...server.words, word({ id: 'otherDevice', romaji: 'tanki', english: 'short term', order: 2, lastModified: 150 })];

    online = true;
    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    await waitFor(() => expect(romajiIn('Learning').filter((r) => r === 'tanki')).toHaveLength(2));
  });
});
