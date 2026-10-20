/// <reference types="vitest/globals" />
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import WordsToLearnPage from './index';
import { StrictMode } from 'react';
import { wordsToLearnStoreImpl } from './wordsToLearnStore';
import type { Word } from './wordsLogic';
const word = (o: Partial<Word> = {}): Word => ({ id: 'a', romaji: 'katsudou', english: 'activity', list: 'learning', order: 0, lastModified: 100, deleted: false, ...o });
const W = [word({ id: 'l1' }), word({ id: 'l2', romaji: 'shouhin', order: 1 }), word({ id: 'w1', romaji: 'kaisoku', list: 'wantToLearn' })];
const romajiIn = (n: string) => Array.from(screen.getByRole('region', { name: new RegExp(`^${n}`) }).querySelectorAll('.wordsToLearn-romaji')).map((e) => e.textContent);
const addTo = (romaji: string, english: string) => {
  fireEvent.click(screen.getByRole('button', { name: 'New word' }));
  const r = screen.getByRole('region', { name: /^Learning/ });
  fireEvent.change(within(r).getByLabelText('Learning romaji'), { target: { value: romaji } });
  fireEvent.change(within(r).getByLabelText('Learning english'), { target: { value: english } });
  fireEvent.click(within(r).getByRole('button', { name: 'Add to Learning' }));
};
it('offline from start', async () => {
  localStorage.clear();
  wordsToLearnStoreImpl.saveWords({ words: W, dirtyIds: [] });
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
  const api = { fetchWords: vi.fn().mockRejectedValue(new TypeError('Failed to fetch')), pushWords: vi.fn().mockRejectedValue(new TypeError('Failed to fetch')) };
  render(<StrictMode><WordsToLearnPage api={api} /></StrictMode>);
  await act(async () => { await new Promise((r) => setTimeout(r, 10)); });
  addTo('kyoudai', 'siblings');
  console.log(romajiIn('Learning'), romajiIn('Want to Learn'));
  await act(async () => { await new Promise((r) => setTimeout(r, 1000)); });
  console.log(romajiIn('Learning'), romajiIn('Want to Learn'));
});

it('online then offline strict', async () => {
  localStorage.clear();
  let online = true;
  vi.spyOn(navigator, 'onLine', 'get').mockImplementation(() => online);
  const api = { fetchWords: vi.fn(async () => W), pushWords: vi.fn() };
  render(<StrictMode><WordsToLearnPage api={api} /></StrictMode>);
  await act(async () => { await new Promise((r) => setTimeout(r, 50)); });
  console.log('before', romajiIn('Learning'));
  online = false; act(() => { window.dispatchEvent(new Event('offline')); });
  addTo('kyoudai', 'siblings');
  console.log('after', romajiIn('Learning'), localStorage.getItem('wordsToLearn.words')?.length);
  await act(async () => { await new Promise((r) => setTimeout(r, 1000)); });
  console.log('later', romajiIn('Learning'));
});
