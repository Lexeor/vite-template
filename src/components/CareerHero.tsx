import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const API = 'http://localhost:8000/api';
const INTERVAL = 10_000;

interface Testimonial {
  id: number;
  photo: string | null;
  quote: string;
  name: string;
  tenure: string;
  order: number;
}

export default function CareerHero() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0); // 0–1
  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    fetch(`${API}/staff/testimonials/`)
      .then(r => r.json())
      .then(d => setItems(Array.isArray(d) ? d : (d.results ?? [])));
  }, []);

  // Reset and start progress animation whenever idx or items change
  useEffect(() => {
    if (items.length <= 1) return;

    clearTimeout(timerRef.current);
    cancelAnimationFrame(rafRef.current);
    setProgress(0);
    startRef.current = performance.now();

    function tick(now: number) {
      const elapsed = now - startRef.current;
      setProgress(Math.min(elapsed / INTERVAL, 1));
      if (elapsed < INTERVAL) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    timerRef.current = setTimeout(() => {
      setIdx(i => (i + 1) % items.length);
    }, INTERVAL);

    return () => {
      clearTimeout(timerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [idx, items.length]);

  const goTo = (i: number) => setIdx(i);
  const prev = () => setIdx(i => (i - 1 + items.length) % items.length);
  const next = () => setIdx(i => (i + 1) % items.length);
  const t = items[idx] ?? null;

  return (
    <div className="relative bg-background rounded-3xl overflow-hidden" style={{ minHeight: 520 }}>

      {/* Hero photo */}
      {t?.photo && (
        <img
          key={t.id}
          src={t.photo}
          alt={t.name}
          className="absolute bottom-0 left-1/2 -translate-x-1/3 h-full w-auto object-cover object-top"
        />
      )}

      {/* Left — hardcoded content */}
      <div className="absolute top-10 left-10 z-10 max-w-[260px]">
        <h1 className="text-[64px] font-[350] tracking-tight leading-[1.02] text-foreground">
          Работа<br />в HFLabs
        </h1>
        <p className="mt-5 text-base text-foreground/60 leading-relaxed">
          Делаем классные продукты<br />с классными людьми
        </p>
        <button
          onClick={() => document.getElementById('vacancies')?.scrollIntoView({ behavior: 'smooth' })}
          className="mt-6 inline-flex items-center px-6 py-3 bg-foreground text-background text-sm font-medium rounded-xl hover:bg-foreground/80 transition-colors"
        >
          Вакансии
        </button>
      </div>

      {/* Quote card — bottom right */}
      {t && (
        <div className="absolute bottom-8 right-8 z-10 bg-white rounded-2xl p-6 w-72"
             style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.05)' }}>

          {/* Progress bars */}
          {items.length > 1 && (
            <div className="flex gap-1.5 mb-4">
              {items.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => goTo(i)}
                  className="relative h-0.5 flex-1 bg-foreground/10 rounded-full overflow-hidden"
                  aria-label={`Отзыв ${i + 1}`}
                >
                  <span
                    className="absolute inset-y-0 left-0 bg-primary-500 rounded-full"
                    style={{
                      width: i < idx ? '100%' : i === idx ? `${progress * 100}%` : '0%',
                      transition: i === idx ? 'none' : undefined,
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Single bar when only one item */}
          {items.length === 1 && (
            <div className="w-7 h-0.5 bg-primary-500 mb-4" />
          )}

          <p className="text-[17px] font-[350] text-foreground leading-snug">«{t.quote}»</p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-foreground/50">
              {t.name}{t.tenure ? ` / ${t.tenure}` : ''}
            </span>
            {items.length > 1 && (
              <div className="flex items-center gap-0.5">
                <button
                  onClick={prev}
                  className="w-8 h-8 flex items-center justify-center text-primary-500 hover:text-primary-600 transition-colors text-2xl leading-none"
                  aria-label="Предыдущий"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  onClick={next}
                  className="w-8 h-8 flex items-center justify-center text-primary-500 hover:text-primary-600 transition-colors text-2xl leading-none"
                  aria-label="Следующий"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
