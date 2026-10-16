import { useState } from 'react';
import { Container, Form, Button, Alert, InputGroup, Modal, ListGroup } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import {
  addWord,
  deleteWord,
  editWord,
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
  canReorder: boolean;
  onSortChange: (mode: SortMode) => void;
}

function ColumnHeaders({ list, sortMode, canReorder, onSortChange }: ColumnHeadersProps) {
  return (
    <div className="wordsToLearn-columns">
      <div className="wordsToLearn-columns-text">
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
      {/* invisible copy of a row's buttons so the header columns line up with the word columns */}
      <div className="wordsToLearn-actions wordsToLearn-columns-spacer" aria-hidden="true">
        {canReorder && (
          <>
            <Button size="sm" tabIndex={-1}>↑</Button>
            <Button size="sm" tabIndex={-1}>↓</Button>
          </>
        )}
        <Button size="sm" tabIndex={-1}>→</Button>
        <Button size="sm" tabIndex={-1}>✕</Button>
      </div>
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
        <Form.Control autoFocus aria-label={`${LIST_TITLES[list]} romaji`} placeholder="Romaji" value={romaji} onChange={(e) => setRomaji(e.target.value)} />
        <Form.Control aria-label={`${LIST_TITLES[list]} english`} placeholder="English" value={english} onChange={(e) => setEnglish(e.target.value)} />
        <Button type="submit" variant="primary" disabled={!canAdd} aria-label={`Add to ${LIST_TITLES[list]}`}>Add</Button>
      </InputGroup>
    </Form>
  );
}

interface WordMenuProps {
  word: Word;
  onClose: () => void;
  onEdit: (romaji: string, english: string) => void;
  onChangeList: () => void;
  onDelete: () => void;
}

function WordMenu({ word, onClose, onEdit, onChangeList, onDelete }: WordMenuProps) {
  const [editing, setEditing] = useState(false);
  const [romaji, setRomaji] = useState(word.romaji);
  const [english, setEnglish] = useState(word.english);
  const canSave = romaji.trim().length > 0 && english.trim().length > 0;
  const otherList = LIST_TITLES[OTHER_LIST[word.list]];

  return (
    <Modal show centered size="sm" onHide={onClose} className="wordsToLearn-menu" aria-labelledby="wordsToLearn-menu-title">
      <Modal.Header closeButton>
        <Modal.Title id="wordsToLearn-menu-title" className="wordsToLearn-menu-title">
          {word.romaji} - {word.english}
        </Modal.Title>
      </Modal.Header>
      {editing ? (
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            if (canSave) onEdit(romaji, english);
          }}
        >
          <Modal.Body>
            <Form.Group className="mb-2" controlId="wordsToLearn-edit-romaji">
              <Form.Label>Romaji</Form.Label>
              <Form.Control autoFocus value={romaji} onChange={(e) => setRomaji(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="wordsToLearn-edit-english">
              <Form.Label>English</Form.Label>
              <Form.Control value={english} onChange={(e) => setEnglish(e.target.value)} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={!canSave}>Save</Button>
          </Modal.Footer>
        </Form>
      ) : (
        <ListGroup variant="flush">
          <ListGroup.Item action onClick={() => setEditing(true)}>Edit</ListGroup.Item>
          <ListGroup.Item action onClick={onChangeList} title={`Move to ${otherList}`}>Change List</ListGroup.Item>
          <ListGroup.Item action onClick={onDelete} className="text-danger">Delete</ListGroup.Item>
        </ListGroup>
      )}
    </Modal>
  );
}

interface WordSectionProps {
  list: WordList;
  words: Word[];
  query: string;
  sortMode: SortMode;
  onSortChange: (mode: SortMode) => void;
  change: (changeFn: (words: Word[]) => Word[]) => void;
  showAddForm: boolean;
  onAdded: () => void;
}

function WordSection({ list, words, query, sortMode, onSortChange, change, showAddForm, onAdded }: WordSectionProps) {
  const shown = visibleWords(words, list, sortMode, query);
  // reordering against a filtered or alphabetized view would be confusing
  const canReorder = sortMode === 'custom' && query.trim().length === 0;

  const [menuWordId, setMenuWordId] = useState<string | null>(null);
  const menuWord = shown.find((w) => w.id === menuWordId);
  const closeMenu = () => setMenuWordId(null);

  const handleLongPress = (word: Word) => {
    setMenuWordId(word.id);
    navigator.vibrate?.(30);
  };

  const switchList = (word: Word) => change((all) => moveToBottomOfList(all, word.id, OTHER_LIST[list], Date.now()));

  const handleDelete = (word: Word) => {
    if (window.confirm(`Delete "${word.romaji} - ${word.english}"?`)) {
      change((all) => deleteWord(all, word.id, Date.now()));
      return true;
    }
    return false;
  };

  return (
    <section className="wordsToLearn-section" aria-labelledby={`wordsToLearn-${list}-title`}>
      {showAddForm && (
        <AddWordForm
          list={list}
          onAdd={(romaji, english) => {
            change((all) => addWord(all, list, romaji, english, Date.now(), uuidv4()));
            onAdded();
          }}
        />
      )}

      <div className="wordsToLearn-section-header">
        <h2 id={`wordsToLearn-${list}-title`} className="wordsToLearn-section-title">
          {LIST_TITLES[list]}
        </h2>
      </div>

      {shown.length === 0 ? (
        <p className="wordsToLearn-empty">{query.trim() ? 'No matching words.' : 'No words yet.'}</p>
      ) : (
        <>
          <ColumnHeaders list={list} sortMode={sortMode} canReorder={canReorder} onSortChange={onSortChange} />
          <ul className="wordsToLearn-list">
            {shown.map((word, index) => (
              <WordRow
                key={word.id}
                word={word}
                canReorder={canReorder}
                isFirst={index === 0}
                isLast={index === shown.length - 1}
                onMove={(direction) => change((all) => reorderWord(all, word.id, direction, Date.now()))}
                onSwitchList={() => switchList(word)}
                onLearned={() => handleLongPress(word)}
                onDelete={() => handleDelete(word)}
              />
            ))}
          </ul>
        </>
      )}

      {menuWord && (
        <WordMenu
          key={menuWord.id}
          word={menuWord}
          onClose={closeMenu}
          onEdit={(romaji, english) => {
            change((all) => editWord(all, menuWord.id, romaji, english, Date.now()));
            closeMenu();
          }}
          onChangeList={() => {
            switchList(menuWord);
            closeMenu();
          }}
          onDelete={() => {
            if (handleDelete(menuWord)) closeMenu();
          }}
        />
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
  const [adding, setAdding] = useState(false);

  const handleSortChange = (list: WordList, mode: SortMode) => {
    const next = { ...sort, [list]: mode };
    setSort(next);
    store.saveSort(next);
  };

  return (
    <div className="wordsToLearn-wrapper">
      <Container className="wordsToLearn-content">
        <h1 className="wordsToLearn-title">Words To Learn</h1>
        <p className="wordsToLearn-hint">Long-press a word to edit it, change its list or delete it.</p>

        <div className="wordsToLearn-search-row">
          <Form.Control
            type="search"
            className="wordsToLearn-search"
            aria-label="Search words"
            placeholder="Search romaji or English…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            variant="primary"
            className="wordsToLearn-new"
            aria-label="New word"
            aria-expanded={adding}
            onClick={() => setAdding((open) => !open)}
          >
            +
          </Button>
        </div>

        <SyncStatusLine status={status} pendingCount={pendingCount} />

        {(['learning', 'wantToLearn'] as WordList[]).map((list) => (
          <WordSection
            key={list}
            list={list}
            words={words}
            query={query}
            sortMode={sort[list]}
            onSortChange={(mode) => handleSortChange(list, mode)}
            change={change}
            showAddForm={adding && list === 'learning'}
            onAdded={() => setAdding(false)}
          />
        ))}
      </Container>
    </div>
  );
}
