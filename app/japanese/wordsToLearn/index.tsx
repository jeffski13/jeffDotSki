import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { Container, Form, Button, Alert, InputGroup, Modal, ListGroup } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import {
  addWord,
  deleteWord,
  editWord,
  moveToBottomOfList,
  moveToTopOfList,
  moveWordTo,
  moveWordToBottom,
  moveWordToTop,
  nextSortMode,
  sortDirection,
  visibleWords,
  type SortColumn,
  type SortMode,
  type Word,
  WORD_LISTS,
  type WordList,
} from './wordsLogic';
import { useWordsToLearn, type SyncStatus, type WordsToLearnApi } from './useWordsToLearn';
import { wordsToLearnStoreImpl, type SortSettings, type WordsToLearnStore } from './wordsToLearnStore';
import { lyricsQrUpdateKeyStoreImpl, type LyricsQrUpdateKeyStore } from '../shared/lyricsQrUpdateKeyStore';
import { useLongPress } from './useLongPress';
import { DRAG_HANDLE_ATTR, DRAG_ID_ATTR, useDragReorder } from './useDragReorder';
import './styles.css';

const LIST_TITLES: Record<WordList, string> = {
  learning: 'Learning',
  wantToLearn: 'Want to Learn',
  culture: 'Culture',
};

// target of Change List; Culture words go back to Want to Learn
const OTHER_LIST: Record<WordList, WordList> = {
  learning: 'wantToLearn',
  wantToLearn: 'learning',
  culture: 'wantToLearn',
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
      {/* invisible copy of a row's drag handle so the header columns line up with the word columns */}
      {canReorder && (
        <span className="wordsToLearn-drag-handle wordsToLearn-columns-spacer" aria-hidden="true">
          <GripIcon />
        </span>
      )}
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
        <Button size="sm" className="wordsToLearn-action-wide" tabIndex={-1}><EditIcon /></Button>
        <Button size="sm" tabIndex={-1}><ChangeListIcon /></Button>
        <Button size="sm" className="wordsToLearn-action-wide" tabIndex={-1}>✕</Button>
      </div>
    </div>
  );
}

interface WordRowProps {
  word: Word;
  canReorder: boolean;
  isFirst: boolean;
  isLast: boolean;
  isDragging: boolean;
  style: CSSProperties | undefined;
  onDragStart: (e: React.PointerEvent) => void;
  onMove: (direction: -1 | 1) => void;
  onEdit: () => void;
  onSwitchList: () => void;
  onLearned: () => void;
  onDelete: () => void;
}

function WordRow({ word, canReorder, isFirst, isLast, isDragging, style, onDragStart, onMove, onEdit, onSwitchList, onLearned, onDelete }: WordRowProps) {
  const longPress = useLongPress(onLearned, onEdit);
  const switchLabel = `Move to ${LIST_TITLES[OTHER_LIST[word.list]]}`;

  // arrow keys on the focused handle move the word without dragging
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const direction = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;
    if (!direction) return;
    e.preventDefault();
    if ((direction === -1 && !isFirst) || (direction === 1 && !isLast)) onMove(direction);
  };

  return (
    <li
      className={`wordsToLearn-row${canReorder ? ' wordsToLearn-row-draggable' : ''}${isDragging ? ' wordsToLearn-row-dragging' : ''}`}
      data-testid={`word-${word.id}`}
      style={style}
      {...(canReorder && { [DRAG_ID_ATTR]: word.id, onPointerDown: onDragStart })}
    >
      {canReorder && (
        <button
          type="button"
          className="wordsToLearn-drag-handle"
          {...{ [DRAG_HANDLE_ATTR]: '' }}
          aria-label={`Reorder ${word.romaji}`}
          title="Drag to reorder (or use the arrow keys)"
          onKeyDown={handleKeyDown}
        >
          <GripIcon />
        </button>
      )}
      <div className="wordsToLearn-text" {...longPress}>
        <span className="wordsToLearn-romaji">{word.romaji}</span>
        <span className="wordsToLearn-english">{word.english}</span>
      </div>
      <div className="wordsToLearn-actions">
        <Button size="sm" variant="outline-secondary" className="wordsToLearn-action-wide" aria-label={`Edit ${word.romaji}`} title="Edit" onClick={onEdit}>
          <EditIcon />
        </Button>
        <Button size="sm" variant="outline-primary" aria-label={`${switchLabel}: ${word.romaji}`} title={switchLabel} onClick={onSwitchList}>
          <ChangeListIcon />
        </Button>
        <Button size="sm" variant="outline-danger" className="wordsToLearn-action-wide" aria-label={`Delete ${word.romaji}`} onClick={onDelete}>✕</Button>
      </div>
    </li>
  );
}

interface AddWordFormProps {
  list: WordList;
  query: string;
  onAdd: (romaji: string, english: string) => void;
}

function GripIcon() {
  return (
    <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor" aria-hidden="true">
      {[3, 8, 13].flatMap((cy) => [3, 9].map((cx) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.5" />))}
    </svg>
  );
}

function ChangeListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      {/* down arrow (left): shaft bends from center leftward, then down */}
      <path d="M7.3 6.2H6.5Q4.5 6.2 4.5 8.2V11.5" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M1 11h7l-3.5 4.5z"/>
      {/* up arrow (right): shaft bends from center rightward, then up */}
      <path d="M8.7 9.8H9.5Q11.5 9.8 11.5 7.8V4.5" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 5h7l-3.5-4.5z"/>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
    </svg>
  );
}

function CopySearchButton({ field, query, onCopy }: { field: string; query: string; onCopy: (text: string) => void }) {
  const text = query.trim();
  return (
    <Button
      variant="outline-secondary"
      className="wordsToLearn-copy"
      aria-label={`Copy search into ${field}`}
      title={`Copy search into ${field}`}
      disabled={!text}
      onClick={() => onCopy(text)}
    >
      <CopyIcon />
      <span aria-hidden="true">→</span>
    </Button>
  );
}

function ClearFieldButton({ field, value, onClear }: { field: string; value: string; onClear: () => void }) {
  return (
    <Button
      variant="outline-secondary"
      className="wordsToLearn-clear"
      aria-label={`Clear ${field}`}
      title={`Clear ${field}`}
      disabled={!value}
      onClick={onClear}
    >
      ✕
    </Button>
  );
}

function AddWordForm({ list, query, onAdd }: AddWordFormProps) {
  // the form mounts each time + is pressed, so both fields start out with the current search
  const [romaji, setRomaji] = useState(() => query.trim());
  const [english, setEnglish] = useState(() => query.trim());
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
        <CopySearchButton field="romaji" query={query} onCopy={setRomaji} />
        <Form.Control autoFocus aria-label={`${LIST_TITLES[list]} romaji`} placeholder="Romaji" value={romaji} onChange={(e) => setRomaji(e.target.value)} />
        <ClearFieldButton field="romaji" value={romaji} onClear={() => setRomaji('')} />
        <CopySearchButton field="english" query={query} onCopy={setEnglish} />
        <Form.Control aria-label={`${LIST_TITLES[list]} english`} placeholder="English" value={english} onChange={(e) => setEnglish(e.target.value)} />
        <ClearFieldButton field="english" value={english} onClear={() => setEnglish('')} />
        <Button type="submit" variant="primary" disabled={!canAdd} aria-label={`Add to ${LIST_TITLES[list]}`}>Add</Button>
      </InputGroup>
    </Form>
  );
}

interface WordMenuProps {
  word: Word;
  startEditing: boolean;
  onClose: () => void;
  onEdit: (romaji: string, english: string) => void;
  onChangeList: () => void;
  // undefined for words already in Culture
  onAddToCulture?: () => void;
  // undefined while a column sort is active, since the custom order isn't visible then
  onMoveToTop?: () => void;
  onMoveToBottom?: () => void;
  onDelete: () => void;
}

function WordMenu({ word, startEditing, onClose, onEdit, onChangeList, onAddToCulture, onMoveToTop, onMoveToBottom, onDelete }: WordMenuProps) {
  const [editing, setEditing] = useState(startEditing);
  const [romaji, setRomaji] = useState(word.romaji);
  const [english, setEnglish] = useState(word.english);
  const canSave = romaji.trim().length > 0 && english.trim().length > 0;
  const otherList = LIST_TITLES[OTHER_LIST[word.list]];

  return (
    <Modal
      show
      centered
      size="sm"
      onHide={onClose}
      // returning focus to the word row must not scroll the page to wherever the row now is
      restoreFocusOptions={{ preventScroll: true }}
      className="wordsToLearn-menu"
      aria-labelledby="wordsToLearn-menu-title"
    >
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
          {onAddToCulture && <ListGroup.Item action onClick={onAddToCulture}>Add to {LIST_TITLES.culture}</ListGroup.Item>}
          {onMoveToTop && <ListGroup.Item action onClick={onMoveToTop}>Move to top of list</ListGroup.Item>}
          {onMoveToBottom && <ListGroup.Item action onClick={onMoveToBottom}>Move to bottom of list</ListGroup.Item>}
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
  const moveTo = (id: string, toIndex: number) => change((all) => moveWordTo(all, id, toIndex, Date.now()));
  const { listRef, draggingId, onPointerDown, rowStyle } = useDragReorder<HTMLUListElement>(shown.map((w) => w.id), moveTo);

  // the edit button opens the same menu, but straight into its edit form
  const [menu, setMenu] = useState<{ wordId: string; editing: boolean } | null>(null);
  const menuWord = shown.find((w) => w.id === menu?.wordId);
  const closeMenu = () => setMenu(null);

  // Moving a word to the top/bottom relocates its row; without this the browser's scroll
  // anchoring follows the moved row, so the page jumps instead of staying where it was.
  const keepScrollY = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (keepScrollY.current === null) return;
    // 'instant' overrides Bootstrap's smooth scroll-behavior so the page never visibly moves
    window.scrollTo({ top: keepScrollY.current, behavior: 'instant' });
    keepScrollY.current = null;
  }, [words]);
  const changeKeepingScroll = (changeFn: (words: Word[]) => Word[]) => {
    keepScrollY.current = window.scrollY;
    change(changeFn);
  };

  const handleLongPress = (word: Word) => {
    setMenu({ wordId: word.id, editing: false });
    navigator.vibrate?.(30);
  };

  // moving to Want to Learn or Culture puts the word at the top; moving to Learning, or out of
  // Culture, puts it at the bottom
  const moveToList = (word: Word, target: WordList) => {
    const moveFn = target === 'learning' || list === 'culture' ? moveToBottomOfList : moveToTopOfList;
    change((all) => moveFn(all, word.id, target, Date.now()));
  };
  const switchList = (word: Word) => moveToList(word, OTHER_LIST[list]);

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
          query={query}
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
        // while searching, the page shows a single "No matching words." only when every list is empty
        !query.trim() && <p className="wordsToLearn-empty">No words yet.</p>
      ) : (
        <>
          <ColumnHeaders list={list} sortMode={sortMode} canReorder={canReorder} onSortChange={onSortChange} />
          <ul className={`wordsToLearn-list${draggingId ? ' wordsToLearn-list-dragging' : ''}`} ref={listRef}>
            {shown.map((word, index) => (
              <WordRow
                key={word.id}
                word={word}
                canReorder={canReorder}
                isFirst={index === 0}
                isLast={index === shown.length - 1}
                isDragging={draggingId === word.id}
                style={rowStyle(word.id, index)}
                onDragStart={(e) => onPointerDown(e, word.id)}
                onMove={(direction) => moveTo(word.id, index + direction)}
                onEdit={() => setMenu({ wordId: word.id, editing: true })}
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
          startEditing={menu?.editing ?? false}
          onClose={closeMenu}
          onEdit={(romaji, english) => {
            change((all) => editWord(all, menuWord.id, romaji, english, Date.now()));
            closeMenu();
          }}
          onChangeList={() => {
            switchList(menuWord);
            closeMenu();
          }}
          {...(list !== 'culture' && {
            onAddToCulture: () => {
              moveToList(menuWord, 'culture');
              closeMenu();
            },
          })}
          {...(sortMode === 'custom' && {
            onMoveToTop: () => {
              changeKeepingScroll((all) => moveWordToTop(all, menuWord.id, Date.now()));
              closeMenu();
            },
            onMoveToBottom: () => {
              changeKeepingScroll((all) => moveWordToBottom(all, menuWord.id, Date.now()));
              closeMenu();
            },
          })}
          onDelete={() => {
            if (handleDelete(menuWord)) closeMenu();
          }}
        />
      )}
    </section>
  );
}

// Bootstrap Icons: exclamation-octagon-fill, exclamation-triangle-fill, arrow-repeat, check-circle-fill
const SYNC_STATUS_ICONS: Partial<Record<SyncStatus, { label: string; className: string; path: string }>> = {
  forbidden: {
    label: 'Sync error: update key is not valid',
    className: 'wordsToLearn-statusIcon-error',
    path: 'M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2',
  },
  error: {
    label: 'Sync warning: couldn’t reach the server',
    className: 'wordsToLearn-statusIcon-warning',
    path: 'M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2',
  },
  syncing: {
    label: 'Syncing',
    className: 'wordsToLearn-statusIcon-syncing',
    path: 'M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z',
  },
  synced: {
    label: 'All changes synced',
    className: 'wordsToLearn-statusIcon-success',
    path: 'M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z',
  },
};

function SyncStatusIcon({ status, pendingCount }: { status: SyncStatus; pendingCount: number }) {
  // 'synced' with changes still queued shows "N changes waiting to sync", not success
  const icon = status === 'synced' && pendingCount > 0 ? undefined : SYNC_STATUS_ICONS[status];
  if (!icon) return null;
  return (
    <span className={`wordsToLearn-statusIcon ${icon.className}`} role="img" aria-label={icon.label} title={icon.label}>
      <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d={icon.path} />
      </svg>
    </span>
  );
}

export const SYNC_TOAST_MS = 3000;

function syncToastText(status: SyncStatus, pendingCount: number): string {
  if (status === 'offline') return 'Offline — changes saved on this device';
  if (status === 'forbidden') return 'Update key is not valid';
  if (status === 'error') return 'Couldn’t reach the server';
  if (status === 'syncing') return 'Syncing…';
  if (pendingCount > 0) return `${pendingCount} change${pendingCount === 1 ? '' : 's'} waiting to sync`;
  return status === 'synced' ? 'All changes synced' : '';
}

// true while the element is on screen; assumes visible where IntersectionObserver is unavailable
function useIsOnScreen(ref: RefObject<HTMLElement | null>) {
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return onScreen;
}

// Briefly shows sync status changes at the top of the screen while the in-page status is scrolled out of view.
function SyncStatusToast({ status, pendingCount, statusOnScreen }: { status: SyncStatus; pendingCount: number; statusOnScreen: boolean }) {
  const text = syncToastText(status, pendingCount);
  const [shown, setShown] = useState(false);
  const lastText = useRef(text);

  useEffect(() => {
    if (text === lastText.current) return;
    lastText.current = text;
    if (statusOnScreen || !text) return;
    setShown(true);
    const timer = setTimeout(() => setShown(false), SYNC_TOAST_MS);
    return () => clearTimeout(timer);
  }, [text, statusOnScreen]);

  useEffect(() => {
    if (statusOnScreen) setShown(false);
  }, [statusOnScreen]);

  if (!shown || statusOnScreen || !text) return null;
  return (
    <div className="wordsToLearn-toast" role="status" data-testid="wordsToLearn-toast" onClick={() => setShown(false)}>
      <SyncStatusIcon status={status} pendingCount={pendingCount} />
      <span>{text}</span>
    </div>
  );
}

function SyncStatusLine({ status, pendingCount }: { status: SyncStatus; pendingCount: number }) {
  if (status === 'offline') {
    return <Alert variant="warning" className="wordsToLearn-status">Offline — changes are saved on this device and will sync when you’re back online.</Alert>;
  }
  if (status === 'forbidden') {
    return <Alert variant="danger" className="wordsToLearn-status">Update key is not valid — changes are saved on this device and will sync once a valid key is entered below.</Alert>;
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
  updateKeyStore?: LyricsQrUpdateKeyStore;
}

export default function WordsToLearnPage({
  api,
  store = wordsToLearnStoreImpl,
  updateKeyStore = lyricsQrUpdateKeyStoreImpl,
}: WordsToLearnPageProps) {
  const [updateKeyInput, setUpdateKeyInput] = useState('');
  // Same rule as the lyrics QR page: a typed key is only saved when it's actually used
  // to send changes, and a blank input falls back to the previously saved key.
  const getUpdateKey = useCallback(() => {
    if (updateKeyInput.trim().length > 0) {
      updateKeyStore.setUpdateKey(updateKeyInput);
    }
    return updateKeyStore.getUpdateKey();
  }, [updateKeyInput, updateKeyStore]);
  const { words, pendingCount, status, change, sync } = useWordsToLearn(api, store, getUpdateKey);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortSettings>(() => store.loadSort());
  const [adding, setAdding] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const statusOnScreen = useIsOnScreen(statusRef);

  const searching = query.trim().length > 0;
  const anyMatches = WORD_LISTS.some((list) => visibleWords(words, list, sort[list], query).length > 0);

  const handleSortChange = (list: WordList, mode: SortMode) => {
    const next = { ...sort, [list]: mode };
    setSort(next);
    store.saveSort(next);
  };

  return (
    // while searching, phones hide the list titles, column headers and sync message to fit more results
    <div className={`wordsToLearn-wrapper${searching ? ' wordsToLearn-searching' : ''}`} data-testid="wordsToLearn-wrapper">
      <Container className="wordsToLearn-content">
        <SyncStatusToast status={status} pendingCount={pendingCount} statusOnScreen={statusOnScreen} />

        <div ref={statusRef}>
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
            <SyncStatusIcon status={status} pendingCount={pendingCount} />
          </div>

          <SyncStatusLine status={status} pendingCount={pendingCount} />
        </div>

        {searching && !anyMatches && <p className="wordsToLearn-empty">No matching words.</p>}

        {WORD_LISTS.map((list) => (
          <WordSection
            key={list}
            list={list}
            words={words}
            query={query}
            sortMode={sort[list]}
            onSortChange={(mode) => handleSortChange(list, mode)}
            change={change}
            showAddForm={adding && list === 'learning'}
            onAdded={() => {
              setAdding(false);
              setQuery('');
            }}
          />
        ))}

        <Form
          className="wordsToLearn-updateKey"
          onSubmit={(e) => {
            e.preventDefault();
            void sync();
          }}
        >
          <Form.Group controlId="wordsToLearnUpdateKey">
            <Form.Label>Update Key</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                value={updateKeyInput}
                onChange={(e) => setUpdateKeyInput(e.target.value)}
                placeholder="Leave blank to reuse the saved key"
              />
              <Button type="submit" variant="outline-secondary" disabled={status === 'syncing'}>
                Sync
              </Button>
            </InputGroup>
          </Form.Group>
        </Form>
      </Container>
    </div>
  );
}
