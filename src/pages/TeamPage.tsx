import EmployeeCard from '@/components/EmployeeCard.tsx';
import { useEffect, useState } from 'react';

interface Employee {
  id: number;
  name: string;
  title: string;
  description: string;
  photo: string | null;
}

async function fetchEmployees(): Promise<Employee[]> {
  const res = await fetch('http://localhost:8000/api/staff/');
  const data = await res.json();
  return data.results ?? data;
}

export default function TeamPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees().then(data => {
      setEmployees(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background pt-23 pb-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-0">

        {/* Header panel */}
        <div className="bg-surface p-4 grid grid-cols-1 md:grid-cols-2 min-h-64 mb-4 rounded-xl">
          <p className="text-5xl font-[500] mb-2">Команда</p>
          <h1 className="text-foreground">
            Мы разные, но нас объединяет желание создавать качественные продукты и менять мир к лучшему.
            Всегда отвечаем за результат и стремимся сделать свою работу так, чтобы о ней рассказывали ещё долгие годы.
          </h1>
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
    </div>
  );
}
