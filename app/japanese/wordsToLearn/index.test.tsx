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

const addTo = (name: 'Learning', romaji: string, english: string) => {
  fireEvent.click(screen.getByRole('button', { name: 'New word' }));
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

  it('shows the new word form only after the plus button is clicked, and hides it after adding', async () => {
    const { api } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));
    const plus = screen.getByRole('button', { name: 'New word' });

    expect(screen.queryByRole('button', { name: 'Add to Learning' })).not.toBeInTheDocument();
    fireEvent.click(plus);
    expect(plus).toHaveAttribute('aria-expanded', 'true');
    expect(within(section('Learning')).getByRole('button', { name: 'Add to Learning' })).toBeInTheDocument();
    expect(within(section('Want to Learn')).queryByRole('button', { name: 'Add to Want to Learn' })).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Learning romaji'), { target: { value: 'tanki' } });
    fireEvent.change(screen.getByLabelText('Learning english'), { target: { value: 'short term' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add to Learning' }));

    expect(romajiIn('Learning')).toEqual(['katsudou', 'shouhin', 'tanki']);
    expect(screen.queryByRole('button', { name: 'Add to Learning' })).not.toBeInTheDocument();
    expect(plus).toHaveAttribute('aria-expanded', 'false');
  });

  it('copies the search text into the romaji or english input', async () => {
    const { api } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));
    fireEvent.click(screen.getByRole('button', { name: 'New word' }));

    expect(screen.getByRole('button', { name: 'Copy search into romaji' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Copy search into english' })).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Search words'), { target: { value: '  tanki ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Copy search into romaji' }));
    expect(screen.getByLabelText('Learning romaji')).toHaveValue('tanki');
    expect(screen.getByLabelText('Learning english')).toHaveValue('');

    fireEvent.change(screen.getByLabelText('Search words'), { target: { value: 'short term' } });
    fireEvent.click(screen.getByRole('button', { name: 'Copy search into english' }));
    expect(screen.getByLabelText('Learning english')).toHaveValue('short term');
    expect(screen.getByLabelText('Learning romaji')).toHaveValue('tanki');
  });

  it('hides the new word form when the plus button is clicked again', async () => {
    const { api } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));

    fireEvent.click(screen.getByRole('button', { name: 'New word' }));
    fireEvent.click(screen.getByRole('button', { name: 'New word' }));
    expect(screen.queryByRole('button', { name: 'Add to Learning' })).not.toBeInTheDocument();
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

  it('sorts each list independently by clicking column headers and remembers the choice', async () => {
    const { api } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Want to Learn')).toHaveLength(2));
    const wantJapanese = screen.getByRole('button', { name: 'Sort Want to Learn by 日本語' });

    fireEvent.click(wantJapanese);
    expect(romajiIn('Want to Learn')).toEqual(['Akiraka ni', 'kaisoku']);
    expect(wantJapanese).toHaveAttribute('aria-pressed', 'true');
    expect(romajiIn('Learning')).toEqual(['katsudou', 'shouhin']);
    expect(wordsToLearnStoreImpl.loadSort()).toEqual({ learning: 'custom', wantToLearn: 'romaji' });

    fireEvent.click(wantJapanese);
    expect(romajiIn('Want to Learn')).toEqual(['kaisoku', 'Akiraka ni']);
    expect(wordsToLearnStoreImpl.loadSort()).toEqual({ learning: 'custom', wantToLearn: 'romajiDesc' });

    fireEvent.click(wantJapanese);
    expect(wantJapanese).toHaveAttribute('aria-pressed', 'false');
    expect(wordsToLearnStoreImpl.loadSort()).toEqual({ learning: 'custom', wantToLearn: 'custom' });

    fireEvent.click(screen.getByRole('button', { name: 'Sort Learning by English' }));
    expect(romajiIn('Learning')).toEqual(['katsudou', 'shouhin']);
    fireEvent.click(screen.getByRole('button', { name: 'Sort Learning by English' }));
    expect(romajiIn('Learning')).toEqual(['shouhin', 'katsudou']);
  });

  it('hides drag handles while a column sort is active', async () => {
    const { api } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));

    fireEvent.click(screen.getByRole('button', { name: 'Sort Learning by English' }));
    expect(screen.queryByRole('button', { name: 'Reorder shouhin' })).not.toBeInTheDocument();
  });

  it('only shows drag handles in custom order without a search', async () => {
    const { api } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));

    expect(screen.getByRole('button', { name: 'Reorder shouhin' })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Search words'), { target: { value: 'shou' } });
    expect(screen.queryByRole('button', { name: 'Reorder shouhin' })).not.toBeInTheDocument();
  });

  it('reorders a word by dragging its handle', async () => {
    const { api } = createFakeApi([
      ...SERVER_WORDS,
      word({ id: 'l3', romaji: 'futsuka yoi', english: 'hangover', order: 2 }),
    ]);
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toEqual(['katsudou', 'shouhin', 'futsuka yoi']));

    // jsdom has no layout, so give each row a 40px-tall box in list order
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      const rows = Array.from(this.parentElement?.children ?? []);
      const top = rows.indexOf(this) * 40;
      return { top, bottom: top + 40, height: 40, left: 0, right: 0, width: 0, x: 0, y: top, toJSON: () => ({}) };
    });

    const handle = screen.getByRole('button', { name: 'Reorder katsudou' });
    fireEvent.pointerDown(handle, { button: 0, clientY: 20 });
    fireEvent.pointerMove(window, { clientY: 70 });
    expect(screen.getByTestId('word-l1')).toHaveClass('wordsToLearn-row-dragging');
    expect(screen.getByTestId('word-l1')).toHaveStyle({ transform: 'translateY(50px)' });
    expect(screen.getByTestId('word-l2')).toHaveStyle({ transform: 'translateY(-40px)' });

    fireEvent.pointerMove(window, { clientY: 110 });
    fireEvent.pointerUp(window, { clientY: 110 });
    expect(romajiIn('Learning')).toEqual(['shouhin', 'futsuka yoi', 'katsudou']);
    expect(screen.getByTestId('word-l1')).not.toHaveClass('wordsToLearn-row-dragging');
  });

  it('does not reorder when a drag is cancelled', async () => {
    const { api } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      const top = Array.from(this.parentElement?.children ?? []).indexOf(this) * 40;
      return { top, bottom: top + 40, height: 40, left: 0, right: 0, width: 0, x: 0, y: top, toJSON: () => ({}) };
    });

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Reorder katsudou' }), { button: 0, clientY: 20 });
    fireEvent.pointerMove(window, { clientY: 70 });
    fireEvent.pointerCancel(window, { clientY: 70 });
    expect(romajiIn('Learning')).toEqual(['katsudou', 'shouhin']);
  });

  it('moves a word with the arrow keys on its handle', async () => {
    const { api } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));

    fireEvent.keyDown(screen.getByRole('button', { name: 'Reorder katsudou' }), { key: 'ArrowUp' });
    expect(romajiIn('Learning')).toEqual(['katsudou', 'shouhin']);
    fireEvent.keyDown(screen.getByRole('button', { name: 'Reorder katsudou' }), { key: 'ArrowDown' });
    expect(romajiIn('Learning')).toEqual(['shouhin', 'katsudou']);
  });

  it('adds, reorders, moves and deletes words, then syncs the changes to the server', async () => {
    const { api, server } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));

    addTo('Learning', 'futsuka yoi', 'hangover');
    expect(romajiIn('Learning')).toEqual(['katsudou', 'shouhin', 'futsuka yoi']);

    fireEvent.keyDown(screen.getByRole('button', { name: 'Reorder futsuka yoi' }), { key: 'ArrowUp' });
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

  const longPress = (text: string) => {
    vi.useFakeTimers();
    fireEvent.pointerDown(screen.getByText(text), { button: 0, clientX: 0, clientY: 0 });
    act(() => {
      vi.advanceTimersByTime(LONG_PRESS_MS);
    });
    vi.useRealTimers();
  };

  const menu = () => screen.getByRole('dialog');

  it('long-pressing a word opens a menu with Edit, Change List and Delete', async () => {
    const { api } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));

    longPress('katsudou');

    expect(within(menu()).getByText('katsudou - activity')).toBeInTheDocument();
    expect(within(menu()).getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(within(menu()).getByRole('button', { name: 'Change List' })).toBeInTheDocument();
    expect(within(menu()).getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(romajiIn('Learning')).toEqual(['katsudou', 'shouhin']);
  });

  it('right-clicking a word opens the same menu', async () => {
    const { api } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));

    fireEvent.contextMenu(screen.getByText('shouhin'));

    expect(within(menu()).getByText('shouhin - stuff')).toBeInTheDocument();
    expect(within(menu()).getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('edits a word from the menu and syncs the change', async () => {
    const { api, server } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Want to Learn')).toHaveLength(2));

    longPress('kaisoku');
    fireEvent.click(within(menu()).getByRole('button', { name: 'Edit' }));
    expect(within(menu()).getByLabelText('Romaji')).toHaveValue('kaisoku');
    fireEvent.change(within(menu()).getByLabelText('Romaji'), { target: { value: 'kaisoku densha' } });
    fireEvent.change(within(menu()).getByLabelText('English'), { target: { value: 'rapid train' } });
    fireEvent.click(within(menu()).getByRole('button', { name: 'Save' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(romajiIn('Want to Learn')).toEqual(['kaisoku densha', 'Akiraka ni']);
    expect(screen.getByText('rapid train')).toBeInTheDocument();
    await waitFor(() => expect(server.words.find((w) => w.id === 'w1')?.english).toBe('rapid train'), { timeout: SYNC_DEBOUNCE_MS + 1000 });
  });

  it('the edit button on a row opens the edit form directly and saves the change', async () => {
    const { api, server } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));

    fireEvent.click(screen.getByRole('button', { name: 'Edit shouhin' }));
    expect(within(menu()).queryByRole('button', { name: 'Change List' })).not.toBeInTheDocument();
    expect(within(menu()).getByLabelText('Romaji')).toHaveValue('shouhin');
    expect(within(menu()).getByLabelText('English')).toHaveValue('stuff');
    fireEvent.change(within(menu()).getByLabelText('English'), { target: { value: 'goods' } });
    fireEvent.click(within(menu()).getByRole('button', { name: 'Save' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('goods')).toBeInTheDocument();
    await waitFor(() => expect(server.words.find((w) => w.id === 'l2')?.english).toBe('goods'), { timeout: SYNC_DEBOUNCE_MS + 1000 });

    // long-pressing afterwards still opens the full menu, not the edit form
    longPress('katsudou');
    expect(within(menu()).getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('does not save an edit with an empty field, and cancel leaves the word unchanged', async () => {
    const { api } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));

    longPress('shouhin');
    fireEvent.click(within(menu()).getByRole('button', { name: 'Edit' }));
    fireEvent.change(within(menu()).getByLabelText('English'), { target: { value: '  ' } });
    expect(within(menu()).getByRole('button', { name: 'Save' })).toBeDisabled();
    fireEvent.click(within(menu()).getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('stuff')).toBeInTheDocument();
  });

  it('Change List moves a Learning word to the bottom of Want to Learn and back', async () => {
    const { api } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));

    longPress('katsudou');
    fireEvent.click(within(menu()).getByRole('button', { name: 'Change List' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(romajiIn('Learning')).toEqual(['shouhin']);
    expect(romajiIn('Want to Learn')).toEqual(['kaisoku', 'Akiraka ni', 'katsudou']);

    longPress('kaisoku');
    fireEvent.click(within(menu()).getByRole('button', { name: 'Change List' }));
    expect(romajiIn('Learning')).toEqual(['shouhin', 'kaisoku']);
  });

  it('moves a word to the top or bottom of its list from the menu and syncs the change', async () => {
    const { api, server } = createFakeApi([
      ...SERVER_WORDS,
      word({ id: 'l3', romaji: 'jitensha', english: 'bicycle', order: 2 }),
    ]);
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(3));

    longPress('jitensha');
    fireEvent.click(within(menu()).getByRole('button', { name: 'Move to top of list' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(romajiIn('Learning')).toEqual(['jitensha', 'katsudou', 'shouhin']);

    longPress('katsudou');
    fireEvent.click(within(menu()).getByRole('button', { name: 'Move to bottom of list' }));
    expect(romajiIn('Learning')).toEqual(['jitensha', 'shouhin', 'katsudou']);
    expect(romajiIn('Want to Learn')).toEqual(['kaisoku', 'Akiraka ni']);

    await waitFor(
      () => expect(server.words.filter((w) => w.list === 'learning').sort((a, b) => a.order - b.order).map((w) => w.id)).toEqual(['l3', 'l2', 'l1']),
      { timeout: SYNC_DEBOUNCE_MS + 1000 },
    );
  });

  it('moves to the top of the whole list even while searching', async () => {
    const { api } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));

    fireEvent.change(screen.getByLabelText('Search words'), { target: { value: 'shouhin' } });
    longPress('shouhin');
    fireEvent.click(within(menu()).getByRole('button', { name: 'Move to top of list' }));
    fireEvent.change(screen.getByLabelText('Search words'), { target: { value: '' } });
    expect(romajiIn('Learning')).toEqual(['shouhin', 'katsudou']);
  });

  it('hides the move to top/bottom options while a column sort is active', async () => {
    const { api } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));

    fireEvent.click(screen.getByRole('button', { name: 'Sort Learning by English' }));
    longPress('shouhin');
    expect(within(menu()).getByRole('button', { name: 'Change List' })).toBeInTheDocument();
    expect(within(menu()).queryByRole('button', { name: 'Move to top of list' })).not.toBeInTheDocument();
    expect(within(menu()).queryByRole('button', { name: 'Move to bottom of list' })).not.toBeInTheDocument();
  });

  it('Delete in the menu asks for confirmation before deleting', async () => {
    const { api } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));

    vi.mocked(window.confirm).mockReturnValueOnce(false);
    longPress('katsudou');
    fireEvent.click(within(menu()).getByRole('button', { name: 'Delete' }));
    expect(romajiIn('Learning')).toEqual(['katsudou', 'shouhin']);
    expect(menu()).toBeInTheDocument();

    fireEvent.click(within(menu()).getByRole('button', { name: 'Delete' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(romajiIn('Learning')).toEqual(['shouhin']);
  });

  it('keeps working offline and uploads the queued changes when back online', async () => {
    const { api, server } = createFakeApi();
    render(<WordsToLearnPage api={api} />);
    await waitFor(() => expect(romajiIn('Learning')).toHaveLength(2));

    goOffline();
    expect(screen.getByText(/Offline — changes are saved on this device/)).toBeInTheDocument();

    addTo('Learning', 'kyoudai', 'siblings');
    fireEvent.click(screen.getByRole('button', { name: 'Move to Want to Learn: shouhin' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete katsudou' }));
    expect(romajiIn('Learning')).toEqual(['kyoudai']);
    expect(romajiIn('Want to Learn')).toEqual(['kaisoku', 'Akiraka ni', 'shouhin']);

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
