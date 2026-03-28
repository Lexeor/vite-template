import EmployeeCard from '@/components/EmployeeCard.tsx';
import SectionHeader from '@/components/SectionHeader.tsx';
import type { StepItem } from '@/components/StickySteps.tsx';
import StickySteps from '@/components/StickySteps.tsx';
import { useEffect, useState } from 'react';


interface Employee {
  id: number;
  name: string;
  title: string;
  description: string;
  photo: string | null;
}

interface SiteSection {
  eyebrow: string;
  title: string;
  body: string;
}

const API = 'http://localhost:8000/api';
const CONTAINER = 'max-w-[1280px] mx-auto px-4';

export default function TeamPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [aboutEmployees, setAboutEmployees] = useState<Employee[]>([]);
  const [principles, setPrinciples] = useState<StepItem[]>([]);
  const [hero, setHero] = useState<SiteSection>({ eyebrow: '', title: '', body: '' });
  const [about, setAbout] = useState<SiteSection>({ eyebrow: '', title: '', body: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/staff/team/`)
        .then(r => r.json())
        .then((data: { employee: Employee }[]) => data.map(m => m.employee)),
      fetch(`${API}/staff/groups/team-about/`)
        .then(r => r.json())
        .then((data: { employee: Employee }[]) => data.map(m => m.employee)),
      fetch(`${API}/pages/sections/team/`).then(r => r.json() as Promise<SiteSection>),
      fetch(`${API}/pages/sections/team-about/`).then(r => r.json() as Promise<SiteSection>),
      fetch(`${API}/pages/principles/`)
        .then(r => r.json())
        .then((d: { results: { id: number; title: string; body: string; image: string | null }[] }) => d.results),
    ]).then(([team, group, section, aboutSection, principlesData]) => {
      setEmployees(team);
      setAboutEmployees(group);
      setHero(section);
      setAbout(aboutSection);
      setPrinciples(principlesData.map((p, i) => ({
        id: p.id,
        stepNumber: String(i + 1).padStart(2, '0'),
        title: p.title,
        body: p.body,
        image: p.image,
      })));
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="w-full pt-28 pb-0 px-0">
        <div className={CONTAINER}>
          <div className="bg-surface p-6 grid grid-cols-1 md:grid-cols-2 min-h-64 rounded-xl">
            <p className="text-5xl font-[500] mb-2">{hero.title || 'Команда'}</p>
            {hero.body && <p className="text-foreground whitespace-pre-line">{hero.body}</p>}
          </div>
        </div>
      </section>

      {/* Team grid */}
      <section className="w-full py-6">
        <div className={CONTAINER}>
          {loading ? (
            <div className="flex items-center justify-center py-32 text-foreground/40">Загрузка...</div>
          ) : employees.length === 0 ? (
            <div className="flex items-center justify-center py-32 text-foreground/40">Пока никого нет</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {employees.map(emp => (
                <EmployeeCard
                  key={emp.id}
                  name={emp.name}
                  title={emp.title}
                  description={emp.description}
                  photo={emp.photo}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Principles — sticky scroll */}
      {principles.length > 0 && (
        <section className="w-full bg-surface mt-4">
          <div className={CONTAINER}>
            <div className="py-16 flex justify-center">
              <SectionHeader
                eyebrow="Наши принципы"
                title="Решаем проблемы клиентов и не боимся сложных вызовов"
              />
            </div>
            <StickySteps items={principles} />
          </div>
        </section>
      )}

      {/* About section */}
      {(about.eyebrow || about.title || about.body || aboutEmployees.length > 0) && (
        <section className="w-full bg-background mt-4">
          <div className={`${CONTAINER} py-24 space-y-12`}>
            {(about.eyebrow || about.title || about.body) && (
              <div className="flex justify-center">
                <SectionHeader
                  eyebrow={about.eyebrow}
                  title={about.title}
                  subtitle={about.body}
                />
              </div>
            )}
            {aboutEmployees.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aboutEmployees.map(emp => (
                  <EmployeeCard
                    key={emp.id}
                    name={emp.name}
                    title={emp.title}
                    description={emp.description}
                    photo={emp.photo}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

    </div>
  );
}
