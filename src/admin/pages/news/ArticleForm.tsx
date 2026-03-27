import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import type { Article, Category } from '../../types';

export default function ArticleForm() {
  const { slug } = useParams();
  const isEdit = !!slug;
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    status: 'draft',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/news/categories/').then(r => r.json()).then(d => setCategories(d.results ?? d));
    if (isEdit) {
      apiFetch(`/news/articles/${slug}/`).then(r => r.json()).then((a: Article) => {
        setForm({
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt,
          content: a.content,
          category: a.category?.id?.toString() ?? '',
          status: a.status,
        });
      });
    }
  }, [slug]);

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body = {
        ...form,
        category: form.category ? parseInt(form.category) : null,
      };
      const res = isEdit
        ? await apiFetch(`/news/articles/${slug}/`, { method: 'PATCH', body: JSON.stringify(body) })
        : await apiFetch('/news/articles/', { method: 'POST', body: JSON.stringify(body) });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(JSON.stringify(data));
      }
      navigate('/admin/news');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/news')} className="text-foreground/50 hover:text-foreground transition-colors">
          ← Назад
        </button>
        <h2 className="text-xl font-semibold text-foreground">
          {isEdit ? 'Редактировать статью' : 'Новая статья'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-background rounded-xl border border-border p-6 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
        )}

        <Field label="Заголовок">
          <input className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} required />
        </Field>

        <Field label="Slug (URL)">
          <input className={inputCls} value={form.slug} onChange={e => set('slug', e.target.value)} required />
        </Field>

        <Field label="Категория">
          <select className={inputCls} value={form.category} onChange={e => set('category', e.target.value)}>
            <option value="">— без категории —</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>

        <Field label="Статус">
          <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="draft">Черновик</option>
            <option value="published">Опубликован</option>
          </select>
        </Field>

        <Field label="Краткое описание">
          <textarea className={inputCls} rows={3} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} />
        </Field>

        <Field label="Содержание">
          <textarea className={inputCls} rows={8} value={form.content} onChange={e => set('content', e.target.value)} />
        </Field>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls = 'w-full px-3 py-2.5 rounded-lg border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground/70 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
