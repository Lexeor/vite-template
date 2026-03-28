import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../api/client';

interface Item {
  id: number;
  title: string;
  body: string;
  image: string | null;
  order: number;
}

type DraftItem = Omit<Item, 'id'> & { id: number | null; _key: string };

function newDraft(order: number): DraftItem {
  return { _key: crypto.randomUUID(), id: null, title: '', body: '', image: null, order };
}

// ── Single item card ──────────────────────────────────────────────────────────

interface ItemCardProps {
  item: DraftItem;
  index: number;
  total: number;
  endpoint: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onChange: (patch: Partial<DraftItem>) => void;
}

function ItemCard({ item, index, total, endpoint, onMoveUp, onMoveDown, onRemove, onChange }: ItemCardProps) {
  const [expanded, setExpanded] = useState(item.id === null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const stepNumber = String(index + 1).padStart(2, '0');

  async function save() {
    setSaving(true);
    const form = new FormData();
    form.append('title', item.title);
    form.append('body', item.body);
    form.append('order', String(item.order));
    if (fileRef.current?.files?.[0]) {
      form.append('image', fileRef.current.files[0]);
    } else if (item.image === null && item.id !== null) {
      form.append('image', '');
    }

    const url = item.id ? `${endpoint}${item.id}/` : endpoint;
    const res = await apiFetch(url, { method: item.id ? 'PATCH' : 'POST', body: form });
    const data: Item = await res.json();
    onChange({ id: data.id, image: data.image });
    setSaving(false);
    setSaved(true);
    setExpanded(false);
    setTimeout(() => setSaved(false), 2500);
  }

  async function remove(e: React.MouseEvent) {
    e.stopPropagation();
    if (item.id) await apiFetch(`${endpoint}${item.id}/`, { method: 'DELETE' });
    onRemove();
  }

  async function moveUp(e: React.MouseEvent) {
    e.stopPropagation();
    onMoveUp();
    if (item.id) {
      await apiFetch(`${endpoint}${item.id}/`, {
        method: 'PATCH', body: JSON.stringify({ order: item.order - 1 }),
      });
    }
  }

  async function moveDown(e: React.MouseEvent) {
    e.stopPropagation();
    onMoveDown();
    if (item.id) {
      await apiFetch(`${endpoint}${item.id}/`, {
        method: 'PATCH', body: JSON.stringify({ order: item.order + 1 }),
      });
    }
  }

  return (
    <div className="bg-background rounded-xl border border-border overflow-hidden">
      {/* Header row — clickable to expand */}
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-surface/60 transition-colors"
      >
        <span className="text-xs font-bold text-primary-500 tabular-nums w-6 flex-shrink-0">
          {stepNumber}
        </span>

        <p className="flex-1 text-sm font-medium text-foreground truncate min-w-0">
          {item.title || <span className="text-foreground/30 italic">Без заголовка</span>}
        </p>

        <div className="flex items-center gap-1 flex-shrink-0">
          {saved && <span className="text-xs text-primary-500 mr-1">✓</span>}

          {/* Reorder */}
          <span onClick={moveUp} role="button" aria-label="Вверх"
                className={`p-1 rounded transition-colors ${index === 0 ? 'opacity-0 pointer-events-none' : 'text-foreground/30 hover:text-foreground hover:bg-surface'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </span>
          <span onClick={moveDown} role="button" aria-label="Вниз"
                className={`p-1 rounded transition-colors ${index === total - 1 ? 'opacity-0 pointer-events-none' : 'text-foreground/30 hover:text-foreground hover:bg-surface'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>

          {/* Remove */}
          <span onClick={remove} role="button" aria-label="Удалить"
                className="p-1 rounded text-foreground/30 hover:text-red-500 hover:bg-red-50 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </span>

          {/* Chevron */}
          <span className={`p-1 text-foreground/30 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </div>
      </button>

      {/* Expanded form */}
      {expanded && (
        <div className="border-t border-border px-4 py-4 space-y-3 flex flex-col gap-2">

          {/* Image */}
          <div className="flex items-start gap-4">
            <div
              className="w-20 h-20 rounded-lg bg-surface border border-border flex-shrink-0 overflow-hidden flex items-center justify-center cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              {item.image
                ? <img src={item.image} alt="" className="w-full h-full object-cover" />
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                       strokeLinecap="round" strokeLinejoin="round" className="text-foreground/20">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              }
            </div>
            <div className="flex-1 space-y-1.5">
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                     onChange={e => {
                       const file = e.target.files?.[0];
                       if (file) onChange({ image: URL.createObjectURL(file) });
                     }}
              />
              <button onClick={() => fileRef.current?.click()}
                      className="text-xs text-foreground/50 hover:text-foreground transition-colors">
                {item.image ? 'Заменить изображение' : 'Загрузить изображение'}
              </button>
              {item.image && (
                <button onClick={() => {
                  onChange({ image: null });
                  if (fileRef.current) fileRef.current.value = '';
                }}
                        className="block text-xs text-red-400 hover:text-red-600 transition-colors">
                  Удалить
                </button>
              )}
            </div>
          </div>

          {/* Title */}
          <input
            type="text"
            value={item.title}
            onChange={e => onChange({ title: e.target.value })}
            placeholder="Заголовок..."
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:border-primary-500 transition-colors"
          />

          {/* Body */}
          <textarea
            value={item.body}
            onChange={e => onChange({ body: e.target.value })}
            placeholder="Описание (двойной перевод строки = новый абзац)..."
            rows={5}
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:border-primary-500 transition-colors resize-none"
          />

          {/* Actions */}
          <div className="flex items-center gap-2 justify-end">
            <button onClick={() => setExpanded(false)}
                    className="px-3 py-1.5 text-sm text-foreground/50 hover:text-foreground transition-colors">
              Отмена
            </button>
            <button onClick={save} disabled={saving || !item.title.trim()}
                    className="px-4 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60">
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main editor ───────────────────────────────────────────────────────────────

interface ItemsEditorProps {
  endpoint: string;
  addLabel?: string;
}

export default function ItemsEditor({ endpoint, addLabel = 'Добавить элемент' }: ItemsEditorProps) {
  const [items, setItems] = useState<DraftItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(endpoint)
      .then(r => r.json())
      .then((data: { results: Item[] }) => {
        setItems(data.results.map(p => ({ ...p, _key: String(p.id) })));
        setLoading(false);
      });
  }, [endpoint]);

  function update(key: string, patch: Partial<DraftItem>) {
    setItems(prev => prev.map(p => p._key === key ? { ...p, ...patch } : p));
  }

  function moveUp(index: number) {
    if (index === 0) return;
    setItems(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next.map((p, i) => ({ ...p, order: i }));
    });
  }

  function moveDown(index: number) {
    setItems(prev => {
      if (index === prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next.map((p, i) => ({ ...p, order: i }));
    });
  }

  function addNew() {
    setItems(prev => [...prev, newDraft(prev.length)]);
  }

  function remove(key: string) {
    setItems(prev => prev.filter(p => p._key !== key));
  }

  if (loading) return null;

  return (
    <div>
      <div className="space-y-2 mb-3">
        {items.map((item, index) => (
          <ItemCard
            key={item._key}
            item={item}
            index={index}
            total={items.length}
            endpoint={endpoint}
            onMoveUp={() => moveUp(index)}
            onMoveDown={() => moveDown(index)}
            onRemove={() => remove(item._key)}
            onChange={patch => update(item._key, patch)}
          />
        ))}
      </div>

      <button onClick={addNew}
              className="flex items-center gap-2 px-3 py-2 w-full rounded-xl border border-dashed border-border text-sm text-foreground/40 hover:text-foreground hover:border-foreground/20 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
             strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        {addLabel}
      </button>
    </div>
  );
}
