import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../../api/client';

interface Testimonial {
  id: number | null;
  photo: string | null;
  quote: string;
  name: string;
  tenure: string;
  order: number;
  _key: string;
}

function newTestimonial(order: number): Testimonial {
  return { _key: crypto.randomUUID(), id: null, photo: null, quote: '', name: '', tenure: '', order };
}

// ── Card ───────────────────────────────────────────────────────────────────────

interface CardProps {
  item: Testimonial;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onChange: (patch: Partial<Testimonial>) => void;
}

function TestimonialCard({ item, index, total, onMoveUp, onMoveDown, onRemove, onChange }: CardProps) {
  const [expanded, setExpanded] = useState(item.id === null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function save() {
    setSaving(true);
    const form = new FormData();
    form.append('quote', item.quote);
    form.append('name', item.name);
    form.append('tenure', item.tenure);
    form.append('order', String(item.order));
    if (fileRef.current?.files?.[0]) {
      form.append('photo', fileRef.current.files[0]);
    } else if (item.photo === null && item.id !== null) {
      form.append('photo', '');
    }
    const url = item.id ? `/staff/testimonials/${item.id}/` : '/staff/testimonials/';
    const res = await apiFetch(url, { method: item.id ? 'PATCH' : 'POST', body: form });
    const data = await res.json();
    onChange({ id: data.id, photo: data.photo });
    setSaving(false);
    setSaved(true);
    setExpanded(false);
    setTimeout(() => setSaved(false), 2500);
  }

  async function remove(e: React.MouseEvent) {
    e.stopPropagation();
    if (item.id) await apiFetch(`/staff/testimonials/${item.id}/`, { method: 'DELETE' });
    onRemove();
  }

  const label = item.name || <span className="text-foreground/30 italic">Без имени</span>;

  return (
    <div className="bg-background rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-surface/60 transition-colors"
      >
        {item.photo
          ? <img src={item.photo} alt="" className="h-8 w-8 rounded-full object-cover flex-shrink-0" />
          : <div className="h-8 w-8 rounded-full bg-surface-elevated flex-shrink-0" />
        }
        <span className="text-sm font-medium text-foreground truncate flex-1 min-w-0">{label}</span>
        {item.quote && (
          <span className="text-xs text-foreground/40 truncate max-w-[200px] hidden sm:block">
            {item.quote.slice(0, 60)}{item.quote.length > 60 ? '…' : ''}
          </span>
        )}

        <div className="flex items-center gap-1 flex-shrink-0">
          {saved && <span className="text-xs text-primary-500 mr-1">✓</span>}
          <span onClick={(e) => { e.stopPropagation(); onMoveUp(); }} role="button"
                className={`p-1 rounded transition-colors ${index === 0 ? 'opacity-0 pointer-events-none' : 'text-foreground/30 hover:text-foreground hover:bg-surface'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
          </span>
          <span onClick={(e) => { e.stopPropagation(); onMoveDown(); }} role="button"
                className={`p-1 rounded transition-colors ${index === total - 1 ? 'opacity-0 pointer-events-none' : 'text-foreground/30 hover:text-foreground hover:bg-surface'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </span>
          <span onClick={remove} role="button"
                className="p-1 rounded text-foreground/30 hover:text-red-500 hover:bg-red-50 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </span>
          <span className={`p-1 text-foreground/30 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </span>
        </div>
      </button>

      {expanded && (
        <div className="flex flex-col gap-3 border-t border-border px-4 py-4">
          {/* Photo */}
          <div className="flex items-start gap-4">
            <div
              className="w-20 h-20 rounded-xl bg-surface border border-border flex-shrink-0 overflow-hidden flex items-center justify-center cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              {item.photo
                ? <img src={item.photo} alt="" className="w-full h-full object-cover" />
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/20">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              }
            </div>
            <div className="flex-1 space-y-1.5">
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                     onChange={e => {
                       const f = e.target.files?.[0];
                       if (f) onChange({ photo: URL.createObjectURL(f) });
                     }} />
              <button onClick={() => fileRef.current?.click()}
                      className="text-xs text-foreground/50 hover:text-foreground transition-colors">
                {item.photo ? 'Заменить фото' : 'Загрузить фото'}
              </button>
              {item.photo && (
                <button onClick={() => { onChange({ photo: null }); if (fileRef.current) fileRef.current.value = ''; }}
                        className="block text-xs text-red-400 hover:text-red-600 transition-colors">Удалить</button>
              )}
            </div>
          </div>

          {/* Quote */}
          <textarea value={item.quote} onChange={e => onChange({ quote: e.target.value })}
                    placeholder="Цитата сотрудника..." rows={3}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:border-primary-500 transition-colors resize-none" />

          {/* Name + Tenure */}
          <div className="flex gap-3">
            <input type="text" value={item.name} onChange={e => onChange({ name: e.target.value })}
                   placeholder="Имя сотрудника..."
                   className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:border-primary-500 transition-colors" />
            <input type="text" value={item.tenure} onChange={e => onChange({ tenure: e.target.value })}
                   placeholder="Стаж (напр. 3 года в Лабсе)"
                   className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:border-primary-500 transition-colors" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 justify-end">
            <button onClick={() => setExpanded(false)}
                    className="px-3 py-1.5 text-sm text-foreground/50 hover:text-foreground transition-colors">Отмена</button>
            <button onClick={save} disabled={saving || !item.name.trim() || !item.quote.trim()}
                    className="px-4 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60">
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function CareerConfig() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/staff/testimonials/')
      .then(r => r.json())
      .then(d => {
        const list: Testimonial[] = Array.isArray(d) ? d : (d.results ?? []);
        setItems(list.map(t => ({ ...t, _key: String(t.id) })));
        setLoading(false);
      });
  }, []);

  function update(key: string, patch: Partial<Testimonial>) {
    setItems(prev => prev.map(t => t._key === key ? { ...t, ...patch } : t));
  }

  function moveUp(index: number) {
    if (index === 0) return;
    setItems(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next.map((t, i) => ({ ...t, order: i }));
    });
  }

  function moveDown(index: number) {
    setItems(prev => {
      if (index === prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next.map((t, i) => ({ ...t, order: i }));
    });
  }

  if (loading) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Страница «Карьера»</h1>
        <p className="text-sm text-foreground/50 mt-1">Отзывы сотрудников в шапке страницы</p>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <TestimonialCard
            key={item._key}
            item={item}
            index={index}
            total={items.length}
            onMoveUp={() => moveUp(index)}
            onMoveDown={() => moveDown(index)}
            onRemove={() => setItems(prev => prev.filter(t => t._key !== item._key))}
            onChange={patch => update(item._key, patch)}
          />
        ))}
      </div>

      <button
        onClick={() => setItems(prev => [...prev, newTestimonial(prev.length)])}
        className="flex items-center gap-2 px-3 py-2 w-full rounded-xl border border-dashed border-border text-sm text-foreground/40 hover:text-foreground hover:border-foreground/20 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Добавить отзыв
      </button>
    </div>
  );
}
