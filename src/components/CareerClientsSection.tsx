import { useEffect, useState } from 'react';

const API = 'http://localhost:8000/api';

interface Company {
  id: number;
  name: string;
  logo: string | null;
}

function CompanyCard({ company }: { company: Company }) {
  return (
    <div
      className="group bg-white rounded-xl flex items-center justify-center p-5 flex-shrink-0"
      style={{ width: 190, height: 190 }}
    >
      {company.logo ? (
        <img
          src={company.logo}
          alt={company.name}
          className="max-w-[75%] max-h-[55%] object-contain grayscale transition-[filter] duration-500 ease-out group-hover:grayscale-0"
          draggable={false}
        />
      ) : (
        <span
          className="text-[13px] font-medium text-center leading-snug px-2 text-foreground/30 transition-colors duration-500 group-hover:text-foreground/70">
          {company.name}
        </span>
      )}
    </div>
  );
}

interface ScrollColumnProps {
  companies: Company[];
  direction: 'up' | 'down';
  duration: number;
}

function ScrollColumn({ companies, direction, duration }: ScrollColumnProps) {
  if (companies.length === 0) return null;
  const doubled = [...companies, ...companies];

  return (
    <div className="overflow-hidden flex-shrink-0" style={{ width: 190 }}>
      <div
        className="flex flex-col gap-3"
        style={{
          animation: `career-scroll-${direction} ${duration}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {doubled.map((c, i) => (
          <CompanyCard key={`${c.id}-${i}`} company={c} />
        ))}
      </div>
    </div>
  );
}

export default function CareerClientsSection() {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    fetch(`${API}/clients/`)
      .then(r => r.json())
      .then(d => setCompanies(Array.isArray(d) ? d : (d.results ?? [])));
  }, []);

  const col1 = companies.filter((_, i) => i % 2 === 0);
  const col2 = companies.filter((_, i) => i % 2 === 1);
  const duration1 = Math.max(5, col1.length * 1.35);
  const duration2 = Math.max(6, col2.length * 1.55);

  return (
    <>
      <style>{`
        @keyframes career-scroll-up {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        @keyframes career-scroll-down {
          from { transform: translateY(-50%); }
          to   { transform: translateY(0); }
        }
      `}</style>

      <div className="bg-background rounded-3xl overflow-hidden" style={{ height: 440 }}>
        <div className="grid grid-cols-2 gap-8 p-10 h-full">

          {/* Left — hardcoded */}
          <div className="flex flex-col justify-between h-full">
            <h2 className="text-[40px] font-[350] tracking-tight leading-[1.1] text-foreground">
              Создаем{' '}
              <span className="text-primary-500">IT-решения</span>
              {', '}которые помогают бизнесу лучше понимать своих клиентов
            </h2>
            <p className="text-sm text-foreground/50 leading-relaxed max-w-xs">
              Под управлением продуктов HFLabs ~ 3 млрд клиентских записей в банках, страховых, ретейле и
              телеком-компаниях.
            </p>
          </div>

          {/* Right — two scrolling columns with mask fade */}
          <div
            className="flex gap-3 h-full overflow-hidden justify-center"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
            }}
          >
            <ScrollColumn companies={col1} direction="up" duration={duration1} />
            <ScrollColumn companies={col2} direction="down" duration={duration2} />
          </div>

        </div>
      </div>
    </>
  );
}
