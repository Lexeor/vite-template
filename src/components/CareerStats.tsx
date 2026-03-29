import { useEffect, useState } from 'react';

const API = 'http://localhost:8000/api';

interface Stat {
  id: number;
  value: string;
  label: string;
  is_primary: boolean;
  order: number;
}

export default function CareerStats() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    fetch(`${API}/pages/career-stats/`)
      .then(r => r.json())
      .then(d => setStats(Array.isArray(d) ? d : (d.results ?? [])));
  }, []);

  if (stats.length === 0) return null;

  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}>
      {stats.map(stat => (
        <div
          key={stat.id}
          className="rounded-2xl p-8 flex flex-col justify-between"
          style={{
            minHeight: 200,
            background: stat.is_primary ? 'var(--color-primary-500, #e61e1e)' : 'var(--color-background, #ededf2)',
          }}
        >
          <p
            className="font-[350] tracking-tight leading-none"
            style={{
              fontSize: 'clamp(48px, 5vw, 72px)',
              color: stat.is_primary ? '#fff' : 'var(--color-primary-500, #e61e1e)',
            }}
          >
            {stat.value}
          </p>
          <p
            className="text-sm leading-snug mt-6"
            style={{ color: stat.is_primary ? 'rgba(255,255,255,0.75)' : 'var(--color-foreground-muted, rgba(17,17,20,0.45))' }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
