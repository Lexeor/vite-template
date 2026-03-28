import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../../api/client';
import HeroBlockEditor from '../../components/HeroBlockEditor';

interface Product {
  id: number;
  name: string;
  slug: string;
}

interface Industry {
  id: number;
  name: string;
  slug: string;
}

interface Client {
  id: number | null;
  name: string;
  description: string;
  logo: string | null;
  industry: Industry | null;
  products: Product[];
  order: number;
  _key: string;
}

function newClient(order: number): Client {
  return { _key: crypto.randomUUID(), id: null, name: '', description: '', logo: null, industry: null, products: [], order };
}

// ── Client card ────────────────────────────────────────────────────────────────

interface ClientCardProps {
  client: Client;
  index: number;
  total: number;
  allProducts: Product[];
  allIndustries: Industry[];
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onChange: (patch: Partial<Client>) => void;
}

function ClientCard({ client, index, total, allProducts, allIndustries, onMoveUp, onMoveDown, onRemove, onChange }: ClientCardProps) {
  const [expanded, setExpanded] = useState(client.id === null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function save() {
    setSaving(true);
    const form = new FormData();
    form.append('name', client.name);
    form.append('description', client.description);
    form.append('order', String(client.order));
    if (client.industry) form.append('industry_id', String(client.industry.id));
    else form.append('industry_id', '');
    client.products.forEach(p => form.append('product_ids', String(p.id)));
    if (fileRef.current?.files?.[0]) {
      form.append('logo', fileRef.current.files[0]);
    } else if (client.logo === null && client.id !== null) {
      form.append('logo', '');
    }

    const url = client.id ? `/clients/${client.id}/` : '/clients/';
    const res = await apiFetch(url, { method: client.id ? 'PATCH' : 'POST', body: form });
    const data = await res.json();
    onChange({ id: data.id, logo: data.logo });
    setSaving(false);
    setSaved(true);
    setExpanded(false);
    setTimeout(() => setSaved(false), 2500);
  }

  async function remove(e: React.MouseEvent) {
    e.stopPropagation();
    if (client.id) await apiFetch(`/clients/${client.id}/`, { method: 'DELETE' });
    onRemove();
  }

  function toggleProduct(product: Product) {
    const has = client.products.some(p => p.id === product.id);
    onChange({ products: has ? client.products.filter(p => p.id !== product.id) : [...client.products, product] });
  }

  return (
    <div className="bg-background rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-surface/60 transition-colors"
      >
        {client.logo
          ? <img src={client.logo} alt="" className="h-6 max-w-[80px] object-contain flex-shrink-0" />
          : <span className="text-sm font-medium text-foreground truncate flex-1 min-w-0">
              {client.name || <span className="text-foreground/30 italic">Без названия</span>}
            </span>
        }
        {client.logo && (
          <span className="text-sm font-medium text-foreground truncate flex-1 min-w-0">{client.name}</span>
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

      {/* Form */}
      {expanded && (
        <div className="flex flex-col gap-2 border-t border-border px-4 py-4">
          {/* Logo */}
          <div className="flex items-start gap-4">
            <div
              className="w-20 h-14 rounded-lg bg-surface border border-border flex-shrink-0 overflow-hidden flex items-center justify-center cursor-pointer px-2"
              onClick={() => fileRef.current?.click()}
            >
              {client.logo
                ? <img src={client.logo} alt="" className="max-w-full max-h-full object-contain" />
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
                       if (f) onChange({ logo: URL.createObjectURL(f) });
                     }} />
              <button onClick={() => fileRef.current?.click()}
                      className="text-xs text-foreground/50 hover:text-foreground transition-colors">
                {client.logo ? 'Заменить логотип' : 'Загрузить логотип'}
              </button>
              {client.logo && (
                <button onClick={() => {
                  onChange({ logo: null });
                  if (fileRef.current) fileRef.current.value = '';
                }}
                        className="block text-xs text-red-400 hover:text-red-600 transition-colors">Удалить</button>
              )}
            </div>
          </div>

          {/* Name */}
          <input type="text" value={client.name} onChange={e => onChange({ name: e.target.value })}
                 placeholder="Название клиента..."
                 className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:border-primary-500 transition-colors" />

          {/* Description */}
          <textarea value={client.description} onChange={e => onChange({ description: e.target.value })}
                    placeholder="Описание..." rows={4}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:border-primary-500 transition-colors resize-none" />

          {/* Industry */}
          {allIndustries.length > 0 && (
            <div>
              <p className="text-xs text-foreground/40 uppercase tracking-wider mb-2">Отрасль</p>
              <div className="flex flex-wrap gap-2">
                {allIndustries.map(ind => {
                  const active = client.industry?.id === ind.id;
                  return (
                    <button key={ind.id}
                            onClick={() => onChange({ industry: active ? null : ind })}
                            className={`px-3 py-1 rounded-lg text-xs transition-colors ${active ? 'bg-primary-500 text-white' : 'bg-surface border border-border text-foreground/60 hover:border-primary-300'}`}>
                      {ind.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Products */}
          {allProducts.length > 0 && (
            <div>
              <p className="text-xs text-foreground/40 uppercase tracking-wider mb-2">Продукты</p>
              <div className="flex flex-wrap gap-2">
                {allProducts.map(p => {
                  const active = client.products.some(cp => cp.id === p.id);
                  return (
                    <button key={p.id} onClick={() => toggleProduct(p)}
                            className={`px-3 py-1 rounded-lg text-xs transition-colors ${active ? 'bg-primary-500 text-white' : 'bg-surface border border-border text-foreground/60 hover:border-primary-300'}`}>
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 justify-end">
            <button onClick={() => setExpanded(false)}
                    className="px-3 py-1.5 text-sm text-foreground/50 hover:text-foreground transition-colors">Отмена
            </button>
            <button onClick={save} disabled={saving || !client.name.trim()}
                    className="px-4 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60">
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function ClientsConfig() {
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch('/clients/').then(r => r.json()).then(d => d.results),
      apiFetch('/clients/products/').then(r => r.json()).then(d => d.results),
      apiFetch('/clients/industries/').then(r => r.json()).then(d => d.results),
    ]).then(([clientsData, productsData, industriesData]) => {
      setClients(clientsData.map((c: Client) => ({ ...c, _key: String(c.id) })));
      setProducts(productsData);
      setIndustries(industriesData);
      setLoading(false);
    });
  }, []);

  function update(key: string, patch: Partial<Client>) {
    setClients(prev => prev.map(c => c._key === key ? { ...c, ...patch } : c));
  }

  function moveUp(index: number) {
    if (index === 0) return;
    setClients(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next.map((c, i) => ({ ...c, order: i }));
    });
  }

  function moveDown(index: number) {
    setClients(prev => {
      if (index === prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next.map((c, i) => ({ ...c, order: i }));
    });
  }

  if (loading) return null;

  return (
    <div className="space-y-6">
      <HeroBlockEditor slug="clients" titleLabel="Заголовок страницы" bodyLabel="Подзаголовок / описание" />

      <div className="space-y-2 mb-3">
        {clients.map((client, index) => (
          <ClientCard
            key={client._key}
            client={client}
            index={index}
            total={clients.length}
            allProducts={products}
            allIndustries={industries}
            onMoveUp={() => moveUp(index)}
            onMoveDown={() => moveDown(index)}
            onRemove={() => setClients(prev => prev.filter(c => c._key !== client._key))}
            onChange={patch => update(client._key, patch)}
          />
        ))}
      </div>

      <button
        onClick={() => setClients(prev => [...prev, newClient(prev.length)])}
        className="flex items-center gap-2 px-3 py-2 w-full rounded-xl border border-dashed border-border text-sm text-foreground/40 hover:text-foreground hover:border-foreground/20 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
             strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Добавить клиента
      </button>
    </div>
  );
}
