import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import type { Article, PaginatedResponse } from '../../types';

export default function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await apiFetch('/news/articles/');
    const data: PaginatedResponse<Article> = await res.json();
    setArticles(data.results);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(slug: string) {
    if (!confirm('Удалить статью?')) return;
    await apiFetch(`/news/articles/${slug}/`, { method: 'DELETE' });
    setArticles(prev => prev.filter(a => a.slug !== slug));
  }

  const statusLabel: Record<string, string> = { draft: 'Черновик', published: 'Опубликован' };
  const statusColor: Record<string, string> = {
    draft: 'bg-yellow-50 text-yellow-700',
    published: 'bg-green-50 text-green-700',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Новости</h2>
        <Link
          to="/admin/news/new"
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Добавить статью
        </Link>
      </div>

      {loading ? (
        <div className="text-foreground/50 text-sm">Загрузка...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 text-foreground/50">Статей пока нет</div>
      ) : (
        <div className="bg-background rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-elevated">
                <th className="text-left px-4 py-3 font-medium text-foreground/60">Заголовок</th>
                <th className="text-left px-4 py-3 font-medium text-foreground/60">Категория</th>
                <th className="text-left px-4 py-3 font-medium text-foreground/60">Автор</th>
                <th className="text-left px-4 py-3 font-medium text-foreground/60">Статус</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id} className="hover:bg-surface transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{article.title}</td>
                  <td className="px-4 py-3 text-foreground/50">{article.category?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-foreground/50">{article.author_name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[article.status]}`}>
                      {statusLabel[article.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex justify-end gap-2">
                    <Link
                      to={`/admin/news/${article.slug}/edit`}
                      className="px-3 py-1 text-xs font-medium text-foreground/60 bg-surface rounded-md hover:bg-surface-elevated transition-colors"
                    >
                      Редактировать
                    </Link>
                    <button
                      onClick={() => handleDelete(article.slug)}
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
