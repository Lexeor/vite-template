import { useEffect, useState } from 'react';

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
  id: number;
  name: string;
  description: string;
  logo: string | null;
  industry: Industry | null;
  products: Product[];
  order: number;
}

interface SiteSection {
  eyebrow: string;
  title: string;
  body: string;
}

const API = 'http://localhost:8000/api';
const CONTAINER = 'max-w-[1280px] mx-auto px-4';

// ── Filter sidebar ─────────────────────────────────────────────────────────────

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-surface rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-base font-medium text-foreground">{label}</span>
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`text-foreground/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="px-5 pb-4 space-y-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group" onClick={onChange}>
      <span className={`w-4 h-4 flex-shrink-0 rounded border transition-colors ${checked ? 'bg-primary-500 border-primary-500' : 'border-border bg-background group-hover:border-primary-300'}`}>
        {checked && (
          <svg viewBox="0 0 12 12" fill="none" className="w-full h-full p-0.5">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors">{label}</span>
    </label>
  );
}

// ── Client card ────────────────────────────────────────────────────────────────

function ClientCard({ client }: { client: Client }) {
  return (
    <div className="bg-surface rounded-xl p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="h-10 flex items-center">
          {client.logo
            ? <img src={client.logo} alt={client.name} className="max-h-10 max-w-[160px] object-contain" />
            : <span className="text-lg font-semibold text-foreground">{client.name}</span>
          }
        </div>
        {client.products.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-end">
            {client.products.map(p => (
              <span key={p.id} className="px-3 py-1 rounded-lg bg-surface-elevated text-xs text-foreground/60 whitespace-nowrap">
                {p.name}
              </span>
            ))}
          </div>
        )}
      </div>
      {client.description && (
        <p className="text-sm text-foreground/60 leading-relaxed whitespace-pre-line">{client.description}</p>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [hero, setHero] = useState<SiteSection>({ eyebrow: '', title: '', body: '' });
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [selectedIndustries, setSelectedIndustries] = useState<Set<number>>(new Set());

  useEffect(() => {
    Promise.all([
      fetch(`${API}/clients/`).then(r => r.json()).then(d => d.results as Client[]),
      fetch(`${API}/clients/products/`).then(r => r.json()).then(d => d.results as Product[]),
      fetch(`${API}/clients/industries/`).then(r => r.json()).then(d => d.results as Industry[]),
      fetch(`${API}/pages/sections/clients/`).then(r => r.json() as Promise<SiteSection>),
    ]).then(([clientsData, productsData, industriesData, section]) => {
      setClients(clientsData);
      setProducts(productsData);
      setIndustries(industriesData);
      setHero(section);
      setLoading(false);
    });
  }, []);

  function toggle(set: Set<number>, id: number): Set<number> {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  }

  const filteredClients = clients.filter(c => {
    const productMatch = selectedProducts.size === 0 || c.products.some(p => selectedProducts.has(p.id));
    const industryMatch = selectedIndustries.size === 0 || (c.industry !== null && selectedIndustries.has(c.industry.id));
    return productMatch && industryMatch;
  });

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="w-full pt-28 pb-0 px-0">
        <div className={CONTAINER}>
          <div className="bg-surface p-6 grid grid-cols-1 md:grid-cols-2 min-h-64 rounded-xl">
            <p className="text-5xl font-[500] mb-2">{hero.title || 'Клиенты'}</p>
            {hero.body && <p className="text-foreground whitespace-pre-line">{hero.body}</p>}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="w-full py-6">
        <div className={CONTAINER}>
          {loading ? (
            <div className="flex items-center justify-center py-32 text-foreground/40">Загрузка...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 items-start">

              {/* Filters */}
              <div className="space-y-4 md:sticky md:top-20">
                {industries.length > 0 && (
                  <FilterSection label="Отрасли">
                    {industries.map(ind => (
                      <Checkbox
                        key={ind.id}
                        label={ind.name}
                        checked={selectedIndustries.has(ind.id)}
                        onChange={() => setSelectedIndustries(prev => toggle(prev, ind.id))}
                      />
                    ))}
                  </FilterSection>
                )}
                {products.length > 0 && (
                  <FilterSection label="Продукты">
                    {products.map(p => (
                      <Checkbox
                        key={p.id}
                        label={p.name}
                        checked={selectedProducts.has(p.id)}
                        onChange={() => setSelectedProducts(prev => toggle(prev, p.id))}
                      />
                    ))}
                  </FilterSection>
                )}
              </div>

              {/* Client list */}
              <div className="space-y-4">
                {filteredClients.length === 0 ? (
                  <div className="flex items-center justify-center py-32 text-foreground/40">
                    {clients.length === 0 ? 'Пока нет клиентов' : 'Нет клиентов с выбранными фильтрами'}
                  </div>
                ) : (
                  filteredClients.map(client => (
                    <ClientCard key={client.id} client={client} />
                  ))
                )}
              </div>

            </div>
          )}
        </div>
      </section>

    </div>
  );
}
