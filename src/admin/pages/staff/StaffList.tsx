import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import type { Employee, PaginatedResponse } from '../../types';

export default function StaffList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/staff/').then(r => r.json()).then((d: PaginatedResponse<Employee>) => {
      setEmployees(d.results);
      setLoading(false);
    });
  }, []);

  async function handleDelete(id: number) {
    if (!confirm('Удалить сотрудника?')) return;
    await apiFetch(`/staff/${id}/`, { method: 'DELETE' });
    setEmployees(prev => prev.filter(e => e.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Сотрудники</h2>
        <Link
          to="/admin/staff/new"
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Добавить сотрудника
        </Link>
      </div>

      {loading ? (
        <div className="text-foreground/50 text-sm">Загрузка...</div>
      ) : employees.length === 0 ? (
        <div className="text-center py-16 text-foreground/50">Сотрудников пока нет</div>
      ) : (
        <div className="bg-background rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-elevated">
                <th className="text-left px-4 py-3 font-medium text-foreground/60">Имя</th>
                <th className="text-left px-4 py-3 font-medium text-foreground/60">Должность</th>
                <th className="text-left px-4 py-3 font-medium text-foreground/60">Порядок</th>
                <th className="text-left px-4 py-3 font-medium text-foreground/60">Статус</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-surface transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center text-sm font-bold text-primary-500 flex-shrink-0">
                      {emp.photo
                        ? <img src={emp.photo} alt={emp.name} className="w-full h-full object-cover rounded-lg" />
                        : emp.name.charAt(0)
                      }
                    </div>
                    {emp.name}
                  </td>
                  <td className="px-4 py-3 text-foreground/50">{emp.title}</td>
                  <td className="px-4 py-3 text-foreground/50">{emp.order}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      emp.is_active
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-50 text-gray-500'
                    }`}>
                      {emp.is_active ? 'Активен' : 'Скрыт'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex justify-end gap-2">
                    <Link
                      to={`/admin/staff/${emp.id}/edit`}
                      className="px-3 py-1 text-xs font-medium text-foreground/60 bg-surface rounded-md hover:bg-surface-elevated transition-colors"
                    >
                      Редактировать
                    </Link>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
