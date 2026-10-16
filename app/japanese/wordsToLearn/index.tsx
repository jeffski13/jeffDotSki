import { useEffect, useRef, useState } from 'react';
import { Container, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import {
  addWord,
  deleteWord,
  moveToBottomOfList,
  nextSortMode,
  reorderWord,
  sortDirection,
  visibleWords,
  type SortColumn,
  type SortMode,
  type Word,
  type WordList,
} from './wordsLogic';
import { useWordsToLearn, type SyncStatus, type WordsToLearnApi } from './useWordsToLearn';
import { wordsToLearnStoreImpl, type SortSettings, type WordsToLearnStore } from './wordsToLearnStore';
import { useLongPress } from './useLongPress';
import './styles.css';

export const NOTICE_MS = 3000;

const LIST_TITLES: Record<WordList, string> = {
  learning: 'Learning',
  wantToLearn: 'Want to Learn',
};

const OTHER_LIST: Record<WordList, WordList> = {
  learning: 'wantToLearn',
  wantToLearn: 'learning',
};

const COLUMN_LABELS: Record<SortColumn, string> = {
  romaji: '日本語',
  english: 'English',
};

interface ColumnHeadersProps {
  list: WordList;
  sortMode: SortMode;
  onSortChange: (mode: SortMode) => void;
}

function ColumnHeaders({ list, sortMode, onSortChange }: ColumnHeadersProps) {
  return (
    <div className="wordsToLearn-columns">
      {(Object.keys(COLUMN_LABELS) as SortColumn[]).map((column) => {
        const direction = sortDirection(sortMode, column);
        return (
          <button
            key={column}
            type="button"
            className={`wordsToLearn-column wordsToLearn-column-${column}${direction ? ' wordsToLearn-column-active' : ''}`}
            aria-label={`Sort ${LIST_TITLES[list]} by ${COLUMN_LABELS[column]}`}
            aria-pressed={direction !== null}
            onClick={() => onSortChange(nextSortMode(sortMode, column))}
          >
            {COLUMN_LABELS[column]}
            {direction && <span aria-hidden="true"> {direction === 'asc' ? '▲' : '▼'}</span>}
          </button>
        );
      })}
    </div>
  );
}

interface WordRowProps {
  word: Word;
  canReorder: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: -1 | 1) => void;
  onSwitchList: () => void;
  onLearned: () => void;
  onDelete: () => void;
}

function WordRow({ word, canReorder, isFirst, isLast, onMove, onSwitchList, onLearned, onDelete }: WordRowProps) {
  const longPress = useLongPress(onLearned);
  const switchLabel = word.list === 'learning' ? 'Move to Want to Learn' : 'Move to Learning';

  return (
    <li className="wordsToLearn-row" data-testid={`word-${word.id}`}>
      <div className="wordsToLearn-text" {...longPress}>
        <span className="wordsToLearn-romaji">{word.romaji}</span>
        <span className="wordsToLearn-english">{word.english}</span>
      </div>
      <div className="wordsToLearn-actions">
        {canReorder && (
          <>
            <Button size="sm" variant="outline-secondary" aria-label={`Move ${word.romaji} up`} disabled={isFirst} onClick={() => onMove(-1)}>↑</Button>
            <Button size="sm" variant="outline-secondary" aria-label={`Move ${word.romaji} down`} disabled={isLast} onClick={() => onMove(1)}>↓</Button>
          </>
        )}
        <Button size="sm" variant="outline-primary" aria-label={`${switchLabel}: ${word.romaji}`} title={switchLabel} onClick={onSwitchList}>
          →
        </Button>
        <Button size="sm" variant="outline-danger" aria-label={`Delete ${word.romaji}`} onClick={onDelete}>✕</Button>
      </div>
    </li>
  );
}

interface AddWordFormProps {
  list: WordList;
  onAdd: (romaji: string, english: string) => void;
}

function AddWordForm({ list, onAdd }: AddWordFormProps) {
  const [romaji, setRomaji] = useState('');
  const [english, setEnglish] = useState('');
  const canAdd = romaji.trim().length > 0 && english.trim().length > 0;

  return (
    <Form
      className="wordsToLearn-add"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canAdd) return;
        onAdd(romaji, english);
        setRomaji('');
        setEnglish('');
      }}
    >
      <InputGroup size="sm">
        <Form.Control aria-label={`${LIST_TITLES[list]} romaji`} placeholder="Romaji" value={romaji} onChange={(e) => setRomaji(e.target.value)} />
        <Form.Control aria-label={`${LIST_TITLES[list]} english`} placeholder="English" value={english} onChange={(e) => setEnglish(e.target.value)} />
        <Button type="submit" variant="primary" disabled={!canAdd} aria-label={`Add to ${LIST_TITLES[list]}`}>Add</Button>
      </InputGroup>
    </Form>
  );
}

interface WordSectionProps {
  list: WordList;
  words: Word[];
  query: string;
  sortMode: SortMode;
  onSortChange: (mode: SortMode) => void;
  change: (changeFn: (words: Word[]) => Word[]) => void;
  onNotice: (message: string) => void;
}

function WordSection({ list, words, query, sortMode, onSortChange, change, onNotice }: WordSectionProps) {
  const shown = visibleWords(words, list, sortMode, query);
  // reordering against a filtered or alphabetized view would be confusing
  const canReorder = sortMode === 'custom' && query.trim().length === 0;

  const handleLearned = (word: Word) => {
    change((all) => moveToBottomOfList(all, word.id, 'wantToLearn', Date.now()));
    navigator.vibrate?.(30);
    onNotice(`Moved "${word.romaji}" to the bottom of Want to Learn.`);
  };

  const handleDelete = (word: Word) => {
    if (window.confirm(`Delete "${word.romaji} - ${word.english}"?`)) {
      change((all) => deleteWord(all, word.id, Date.now()));
    }
  };

  return (
    <section className="wordsToLearn-section" aria-labelledby={`wordsToLearn-${list}-title`}>
      <div className="wordsToLearn-section-header">
        <h2 id={`wordsToLearn-${list}-title`} className="wordsToLearn-section-title">
          {LIST_TITLES[list]} <span className="wordsToLearn-count">({shown.length})</span>
        </h2>
      </div>

      <AddWordForm list={list} onAdd={(romaji, english) => change((all) => addWord(all, list, romaji, english, Date.now(), uuidv4()))} />

      {shown.length === 0 ? (
        <p className="wordsToLearn-empty">{query.trim() ? 'No matching words.' : 'No words yet.'}</p>
      ) : (
        <>
          <ColumnHeaders list={list} sortMode={sortMode} onSortChange={onSortChange} />
          <ul className="wordsToLearn-list">
            {shown.map((word, index) => (
              <WordRow
                key={word.id}
                word={word}
                canReorder={canReorder}
                isFirst={index === 0}
                isLast={index === shown.length - 1}
                onMove={(direction) => change((all) => reorderWord(all, word.id, direction, Date.now()))}
                onSwitchList={() => change((all) => moveToBottomOfList(all, word.id, OTHER_LIST[list], Date.now()))}
                onLearned={() => handleLearned(word)}
                onDelete={() => handleDelete(word)}
              />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function SyncStatusLine({ status, pendingCount }: { status: SyncStatus; pendingCount: number }) {
  if (status === 'offline') {
    return <Alert variant="warning" className="wordsToLearn-status">Offline — changes are saved on this device and will sync when you’re back online.</Alert>;
  }
  if (status === 'error') {
    return <Alert variant="warning" className="wordsToLearn-status">Couldn’t reach the server — changes are saved on this device and will sync later.</Alert>;
  }
  const text = status === 'syncing'
    ? 'Syncing…'
    : pendingCount > 0
      ? `${pendingCount} change${pendingCount === 1 ? '' : 's'} waiting to sync`
      : status === 'synced' ? 'All changes synced' : '';
  return <p className="wordsToLearn-sync" data-testid="wordsToLearn-sync">{text}</p>;
}

interface WordsToLearnPageProps {
  api?: WordsToLearnApi;
  store?: WordsToLearnStore;
}

export default function WordsToLearnPage({ api, store = wordsToLearnStoreImpl }: WordsToLearnPageProps) {
  const { words, pendingCount, status, change } = useWordsToLearn(api, store);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortSettings>(() => store.loadSort());
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
  }, []);

  const showNotice = (message: string) => {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    setNotice(message);
    noticeTimer.current = setTimeout(() => setNotice(null), NOTICE_MS);
  };

  const handleSortChange = (list: WordList, mode: SortMode) => {
    const next = { ...sort, [list]: mode };
    setSort(next);
    store.saveSort(next);
  };

  return (
    <div className="wordsToLearn-wrapper">
      <Container className="wordsToLearn-content">
        <h1 className="wordsToLearn-title">Words To Learn</h1>
        <p className="wordsToLearn-hint">Long-press a word once you’ve learned it to send it to the bottom of Want to Learn.</p>

        <Form.Control
          type="search"
          className="wordsToLearn-search"
          aria-label="Search words"
          placeholder="Search romaji or English…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <SyncStatusLine status={status} pendingCount={pendingCount} />
        {notice && <Alert variant="success" className="wordsToLearn-status">{notice}</Alert>}

        {(['learning', 'wantToLearn'] as WordList[]).map((list) => (
          <WordSection
            key={list}
            list={list}
            words={words}
            query={query}
            sortMode={sort[list]}
            onSortChange={(mode) => handleSortChange(list, mode)}
            change={change}
            onNotice={showNotice}
          />
        ))}
      </Container>
    </div>
  );
}
