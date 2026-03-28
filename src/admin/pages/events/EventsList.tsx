import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import type { Event, PaginatedResponse } from '../../types';

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/events/').then(r => r.json()).then((d: PaginatedResponse<Event>) => {
      setEvents(d.results);
      setLoading(false);
    });
  }, []);

  async function handleDelete(slug: string) {
    if (!confirm('Удалить событие?')) return;
    await apiFetch(`/events/${slug}/`, { method: 'DELETE' });
    setEvents(prev => prev.filter(e => e.slug !== slug));
  }

  const statusLabel: Record<string, string> = { draft: 'Черновик', published: 'Опубликовано', archived: 'Архив' };
  const statusColor: Record<string, string> = {
    draft: 'bg-yellow-50 text-yellow-700',
    published: 'bg-green-50 text-green-700',
    archived: 'bg-gray-50 text-gray-600',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">События</h2>
        <Link
          to="/admin/events/new"
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Добавить событие
        </Link>
      </div>

      {loading ? (
        <div className="text-foreground/50 text-sm">Загрузка...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-foreground/50">Событий пока нет</div>
      ) : (
        <div className="bg-background rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-elevated">
                <th className="text-left px-4 py-3 font-medium text-foreground/60">Название</th>
                <th className="text-left px-4 py-3 font-medium text-foreground/60">Дата</th>
                <th className="text-left px-4 py-3 font-medium text-foreground/60">Место</th>
                <th className="text-left px-4 py-3 font-medium text-foreground/60">Статус</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id} className="hover:bg-surface transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{event.title}</td>
                  <td className="px-4 py-3 text-foreground/50">
                    {event.start_date ? new Date(event.start_date).toLocaleDateString('ru-RU') : '—'}
                  </td>
                  <td className="px-4 py-3 text-foreground/50">{event.location || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[event.status]}`}>
                      {statusLabel[event.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex justify-end gap-2">
                    <Link
                      to={`/admin/events/${event.slug}/edit`}
                      className="px-3 py-1 text-xs font-medium text-foreground/60 bg-surface rounded-md hover:bg-surface-elevated transition-colors"
                    >
                      Редактировать
                    </Link>
                    <button
                      onClick={() => handleDelete(event.slug)}
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
