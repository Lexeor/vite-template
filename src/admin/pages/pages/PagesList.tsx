import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import type { Page, PaginatedResponse } from '../../types';

export default function PagesList() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/pages/').then(r => r.json()).then((d: PaginatedResponse<Page>) => {
      setPages(d.results);
      setLoading(false);
    });
  }, []);

  async function handleDelete(slug: string) {
    if (!confirm('Удалить страницу?')) return;
    await apiFetch(`/pages/${slug}/`, { method: 'DELETE' });
    setPages(prev => prev.filter(p => p.slug !== slug));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Страницы</h2>
        <Link
          to="/admin/pages/new"
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Добавить страницу
        </Link>
      </div>

      {loading ? (
        <div className="text-foreground/50 text-sm">Загрузка...</div>
      ) : pages.length === 0 ? (
        <div className="text-center py-16 text-foreground/50">Страниц пока нет</div>
      ) : (
        <div className="bg-background rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 font-medium text-foreground/60">Заголовок</th>
                <th className="text-left px-4 py-3 font-medium text-foreground/60">Slug</th>
                <th className="text-left px-4 py-3 font-medium text-foreground/60">Порядок</th>
                <th className="text-left px-4 py-3 font-medium text-foreground/60">Статус</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pages.map(page => (
                <tr key={page.id} className="hover:bg-surface transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{page.title}</td>
                  <td className="px-4 py-3 text-foreground/50 font-mono text-xs">{page.slug}</td>
                  <td className="px-4 py-3 text-foreground/50">{page.order}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      page.is_published
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    }`}>
                      {page.is_published ? 'Опубликована' : 'Черновик'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex justify-end gap-2">
                    <Link
                      to={`/admin/pages/${page.slug}/edit`}
                      className="px-3 py-1 text-xs font-medium text-foreground/60 border border-border rounded-md hover:bg-surface transition-colors"
                    >
                      Редактировать
                    </Link>
                    <button
                      onClick={() => handleDelete(page.slug)}
                      className="px-3 py-1 text-xs font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
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
