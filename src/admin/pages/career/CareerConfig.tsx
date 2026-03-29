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
          <span onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }} role="button"
                className={`p-1 rounded transition-colors ${index === 0 ? 'opacity-0 pointer-events-none' : 'text-foreground/30 hover:text-foreground hover:bg-surface'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
          </span>
          <span onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }} role="button"
                className={`p-1 rounded transition-colors ${index === total - 1 ? 'opacity-0 pointer-events-none' : 'text-foreground/30 hover:text-foreground hover:bg-surface'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </span>
          <span onClick={remove} role="button"
                className="p-1 rounded text-foreground/30 hover:text-red-500 hover:bg-red-50 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </span>
          <span className={`p-1 text-foreground/30 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </span>
        </div>
      </button>

      {expanded && (
        <div className="flex flex-col gap-3 border-t border-border px-4 py-4">
          <div className="flex items-start gap-4">
            <div
              className="w-20 h-20 rounded-xl bg-surface border border-border flex-shrink-0 overflow-hidden flex items-center justify-center cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              {item.photo
                ? <img src={item.photo} alt="" className="w-full h-full object-cover" />
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
                       const f = e.target.files?.[0];
                       if (f) onChange({ photo: URL.createObjectURL(f) });
                     }} />
              <button onClick={() => fileRef.current?.click()}
                      className="text-xs text-foreground/50 hover:text-foreground transition-colors">
                {item.photo ? 'Заменить фото' : 'Загрузить фото'}
              </button>
              {item.photo && (
                <button onClick={() => {
                  onChange({ photo: null });
                  if (fileRef.current) fileRef.current.value = '';
                }}
                        className="block text-xs text-red-400 hover:text-red-600 transition-colors">Удалить</button>
              )}
            </div>
          </div>

          <textarea value={item.quote} onChange={e => onChange({ quote: e.target.value })}
                    placeholder="Цитата сотрудника..." rows={3}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:border-primary-500 transition-colors resize-none" />

          <div className="flex gap-3">
            <input type="text" value={item.name} onChange={e => onChange({ name: e.target.value })}
                   placeholder="Имя сотрудника..."
                   className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:border-primary-500 transition-colors" />
            <input type="text" value={item.tenure} onChange={e => onChange({ tenure: e.target.value })}
                   placeholder="Стаж (напр. 3 года в Лабсе)"
                   className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:border-primary-500 transition-colors" />
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button onClick={() => setExpanded(false)}
                    className="px-3 py-1.5 text-sm text-foreground/50 hover:text-foreground transition-colors">Отмена
            </button>
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

// ── Career Stats ──────────────────────────────────────────────────────────────

interface CareerStat {
  id: number | null;
  value: string;
  label: string;
  is_primary: boolean;
  order: number;
  _key: string;
}

function newStat(order: number): CareerStat {
  return { _key: crypto.randomUUID(), id: null, value: '', label: '', is_primary: false, order };
}

interface StatCardProps {
  stat: CareerStat;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onChange: (patch: Partial<CareerStat>) => void;
}

function StatCard({ stat, index, total, onMoveUp, onMoveDown, onRemove, onChange }: StatCardProps) {
  const [expanded, setExpanded] = useState(stat.id === null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    const url = stat.id ? `/pages/career-stats/${stat.id}/` : '/pages/career-stats/';
    const res = await apiFetch(url, {
      method: stat.id ? 'PATCH' : 'POST',
      body: JSON.stringify({ value: stat.value, label: stat.label, is_primary: stat.is_primary, order: stat.order }),
    });
    const data = await res.json();
    onChange({ id: data.id });
    setSaving(false);
    setSaved(true);
    setExpanded(false);
    setTimeout(() => setSaved(false), 2500);
  }

  async function remove(e: React.MouseEvent) {
    e.stopPropagation();
    if (stat.id) await apiFetch(`/pages/career-stats/${stat.id}/`, { method: 'DELETE' });
    onRemove();
  }

  return (
    <div className="bg-background rounded-xl overflow-hidden">
      <button type="button" onClick={() => setExpanded(e => !e)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-surface/60 transition-colors">
        {/* Mini preview */}
        <div
          className="h-8 w-12 rounded-lg flex-shrink-0 flex items-center justify-center"
          style={{ background: stat.is_primary ? '#e61e1e' : 'var(--color-surface-elevated, #ededf2)' }}
        >
          <span className="text-xs font-semibold truncate px-1"
                style={{ color: stat.is_primary ? '#fff' : '#e61e1e' }}>
            {stat.value || '—'}
          </span>
        </div>
        <span className="text-sm font-medium text-foreground truncate flex-1 min-w-0">
          {stat.label || <span className="text-foreground/30 italic">Без подписи</span>}
        </span>
        {stat.is_primary && (
          <span className="text-xs text-primary-500 font-medium mr-1 flex-shrink-0">акцент</span>
        )}
        <div className="flex items-center gap-1 flex-shrink-0">
          {saved && <span className="text-xs text-primary-500 mr-1">✓</span>}
          <span onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }} role="button"
                className={`p-1 rounded transition-colors ${index === 0 ? 'opacity-0 pointer-events-none' : 'text-foreground/30 hover:text-foreground hover:bg-surface'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
          </span>
          <span onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }} role="button"
                className={`p-1 rounded transition-colors ${index === total - 1 ? 'opacity-0 pointer-events-none' : 'text-foreground/30 hover:text-foreground hover:bg-surface'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </span>
          <span onClick={remove} role="button"
                className="p-1 rounded text-foreground/30 hover:text-red-500 hover:bg-red-50 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </span>
          <span className={`p-1 text-foreground/30 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </span>
        </div>
      </button>

      {expanded && (
        <div className="flex flex-col gap-3 border-t border-border px-4 py-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-foreground/40 uppercase tracking-wider mb-1.5 block">Значение</label>
              <input type="text" value={stat.value} onChange={e => onChange({ value: e.target.value })}
                     placeholder=">150"
                     className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:border-primary-500 transition-colors" />
            </div>
            <div className="flex-[2]">
              <label className="text-xs text-foreground/40 uppercase tracking-wider mb-1.5 block">Подпись</label>
              <input type="text" value={stat.label} onChange={e => onChange({ label: e.target.value })}
                     placeholder="сотрудников"
                     className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:border-primary-500 transition-colors" />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => onChange({ is_primary: !stat.is_primary })}
              className={`w-10 h-6 rounded-full transition-colors relative flex-shrink-0 ${stat.is_primary ? 'bg-primary-500' : 'bg-surface-elevated'}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${stat.is_primary ? 'left-5' : 'left-1'}`} />
            </div>
            <span className="text-sm text-foreground/70">Акцентная карточка (красный фон)</span>
          </label>

          <div className="flex items-center gap-2 justify-end">
            <button onClick={() => setExpanded(false)}
                    className="px-3 py-1.5 text-sm text-foreground/50 hover:text-foreground transition-colors">Отмена
            </button>
            <button onClick={save} disabled={saving || !stat.value.trim() || !stat.label.trim()}
                    className="px-4 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60">
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatsSection() {
  const [stats, setStats] = useState<CareerStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/pages/career-stats/')
      .then(r => r.json())
      .then(d => {
        const list: CareerStat[] = Array.isArray(d) ? d : (d.results ?? []);
        setStats(list.map(s => ({ ...s, _key: String(s.id) })));
        setLoading(false);
      });
  }, []);

  function update(key: string, patch: Partial<CareerStat>) {
    setStats(prev => prev.map(s => s._key === key ? { ...s, ...patch } : s));
  }

  function moveUp(index: number) {
    if (index === 0) return;
    setStats(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next.map((s, i) => ({ ...s, order: i }));
    });
  }

  function moveDown(index: number) {
    setStats(prev => {
      if (index === prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next.map((s, i) => ({ ...s, order: i }));
    });
  }

  if (loading) return null;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Цифры</h2>
        <p className="text-sm text-foreground/50 mt-0.5">Карточки в секции «HFLabs в цифрах»</p>
      </div>
      <div className="space-y-2">
        {stats.map((stat, index) => (
          <StatCard
            key={stat._key}
            stat={stat}
            index={index}
            total={stats.length}
            onMoveUp={() => moveUp(index)}
            onMoveDown={() => moveDown(index)}
            onRemove={() => setStats(prev => prev.filter(s => s._key !== stat._key))}
            onChange={patch => update(stat._key, patch)}
          />
        ))}
      </div>
      <button
        onClick={() => setStats(prev => [...prev, newStat(prev.length)])}
        className="flex items-center gap-2 px-3 py-2 w-full rounded-xl border border-dashed border-border text-sm text-foreground/40 hover:text-foreground hover:border-foreground/20 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
             strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Добавить карточку
      </button>
    </div>
  );
}

// ── Career Polaroids ──────────────────────────────────────────────────────────

interface CareerPolaroid {
  slot: number;
  photo: string | null;
  caption: string;
}

const SLOT_COUNT = 10;

function PolaroidSlot({ polaroid, onChange }: {
  polaroid: CareerPolaroid;
  onChange: (patch: Partial<CareerPolaroid>) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function save() {
    setSaving(true);
    const form = new FormData();
    form.append('caption', polaroid.caption);
    if (fileRef.current?.files?.[0]) {
      form.append('photo', fileRef.current.files[0]);
    } else if (polaroid.photo === null) {
      form.append('photo', '');
    }
    const res = await apiFetch(`/pages/career-polaroids/${polaroid.slot}/`, { method: 'PATCH', body: form });
    const data = await res.json();
    onChange({ photo: data.photo });
    setSaving(false);
    setSaved(true);
    setExpanded(false);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="bg-background rounded-xl overflow-hidden">
      <button type="button" onClick={() => setExpanded(e => !e)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-surface/60 transition-colors">
        {/* Mini polaroid preview */}
        <div className="w-8 h-10 bg-white flex-shrink-0 rounded flex flex-col overflow-hidden"
             style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.1)', padding: '2px 2px 6px' }}>
          {polaroid.photo
            ? <img src={polaroid.photo} alt="" className="w-full flex-1 object-cover" />
            : <div className="w-full flex-1 bg-surface-elevated" />
          }
        </div>
        <span className="text-sm font-medium text-foreground/50">#{polaroid.slot}</span>
        <span className="text-sm text-foreground truncate flex-1 min-w-0">
          {polaroid.caption || <span className="text-foreground/30 italic">Без подписи</span>}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          {saved && <span className="text-xs text-primary-500 mr-1">✓</span>}
          <span className={`p-1 text-foreground/30 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </span>
        </div>
      </button>

      {expanded && (
        <div className="flex flex-col gap-3 border-t border-border px-4 py-4">
          <div className="flex items-start gap-4">
            <div
              className="w-20 h-24 rounded-lg bg-surface border border-border flex-shrink-0 overflow-hidden flex items-center justify-center cursor-pointer"
              onClick={() => fileRef.current?.click()}>
              {polaroid.photo
                ? <img src={polaroid.photo} alt="" className="w-full h-full object-cover" />
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
                       const f = e.target.files?.[0];
                       if (f) onChange({ photo: URL.createObjectURL(f) });
                     }} />
              <button onClick={() => fileRef.current?.click()}
                      className="text-xs text-foreground/50 hover:text-foreground transition-colors">
                {polaroid.photo ? 'Заменить фото' : 'Загрузить фото'}
              </button>
              {polaroid.photo && (
                <button onClick={() => {
                  onChange({ photo: null });
                  if (fileRef.current) fileRef.current.value = '';
                }}
                        className="block text-xs text-red-400 hover:text-red-600 transition-colors">Удалить</button>
              )}
            </div>
          </div>

          <input type="text" value={polaroid.caption} onChange={e => onChange({ caption: e.target.value })}
                 placeholder="Подпись на Polaroid..."
                 className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:border-primary-500 transition-colors" />

          <div className="flex items-center gap-2 justify-end">
            <button onClick={() => setExpanded(false)}
                    className="px-3 py-1.5 text-sm text-foreground/50 hover:text-foreground transition-colors">Отмена
            </button>
            <button onClick={save} disabled={saving}
                    className="px-4 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60">
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PolaroidsSection() {
  const [polaroids, setPolaroids] = useState<CareerPolaroid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/pages/career-polaroids/')
      .then(r => r.json())
      .then(d => {
        const list: CareerPolaroid[] = Array.isArray(d) ? d : (d.results ?? []);
        // Ensure all SLOT_COUNT slots present (backend guarantees, but safety net)
        const map = new Map(list.map(p => [p.slot, p]));
        const full = Array.from({ length: SLOT_COUNT }, (_, i) => map.get(i + 1) ?? {
          slot: i + 1,
          photo: null,
          caption: '',
        });
        setPolaroids(full);
        setLoading(false);
      });
  }, []);

  function update(slot: number, patch: Partial<CareerPolaroid>) {
    setPolaroids(prev => prev.map(p => p.slot === slot ? { ...p, ...patch } : p));
  }

  if (loading) return null;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Polaroids</h2>
        <p className="text-sm text-foreground/50 mt-0.5">
          Ровно {SLOT_COUNT} слотов — порядок и количество фиксированы анимацией
        </p>
      </div>
      <div className="space-y-2">
        {polaroids.map(p => (
          <PolaroidSlot key={p.slot} polaroid={p} onChange={patch => update(p.slot, patch)} />
        ))}
      </div>
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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
             strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Добавить отзыв
      </button>

      <div className="border-t border-border pt-6">
        <StatsSection />
      </div>

      <div className="border-t border-border pt-6">
        <PolaroidsSection />
      </div>
    </div>
  );
}
