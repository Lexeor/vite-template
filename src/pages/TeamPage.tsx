import EmployeeCard from '@/components/EmployeeCard.tsx';
import SectionHeader from '@/components/SectionHeader.tsx';
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

export default function TeamPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [aboutEmployees, setAboutEmployees] = useState<Employee[]>([]);
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
    ]).then(([team, group, section, aboutSection]) => {
      setEmployees(team);
      setAboutEmployees(group);
      setHero(section);
      setAbout(aboutSection);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background pt-23 pb-16 rounded-xl">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-0">

        {/* Header panel */}
        <div className="bg-surface p-4 grid grid-cols-1 md:grid-cols-2 min-h-64 mb-4 rounded-xl">
          <p className="text-5xl font-[500] mb-2">{hero.title || 'Команда'}</p>
          {hero.body && <p className="text-foreground">{hero.body}</p>}
        </div>

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

      {/* About section */}
      {(about.eyebrow || about.title || about.body || aboutEmployees.length > 0) && (
        <section className="bg-surface mt-4">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-0 py-24 space-y-12">
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
