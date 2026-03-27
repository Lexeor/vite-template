import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import type { Page } from '../../types';

export default function PageForm() {
  const { slug } = useParams();
  const isEdit = !!slug;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    meta_title: '',
    meta_description: '',
    is_published: false,
    order: '0',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      apiFetch(`/pages/${slug}/`).then(r => r.json()).then((p: Page) => {
        setForm({
          title: p.title,
          slug: p.slug,
          content: p.content,
          meta_title: p.meta_title,
          meta_description: p.meta_description,
          is_published: p.is_published,
          order: String(p.order),
        });
      });
    }
  }, [slug]);

  function set(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body = { ...form, order: parseInt(form.order) };
      const res = isEdit
        ? await apiFetch(`/pages/${slug}/`, { method: 'PATCH', body: JSON.stringify(body) })
        : await apiFetch('/pages/', { method: 'POST', body: JSON.stringify(body) });
      if (!res.ok) throw new Error(JSON.stringify(await res.json()));
      navigate('/admin/pages');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/pages')} className="text-foreground/50 hover:text-foreground transition-colors">
          ← Назад
        </button>
        <h2 className="text-xl font-semibold text-foreground">
          {isEdit ? 'Редактировать страницу' : 'Новая страница'}
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

        <div className="grid grid-cols-2 gap-4">
          <Field label="Порядок">
            <input type="number" className={inputCls} value={form.order} onChange={e => set('order', e.target.value)} />
          </Field>
          <Field label="Статус">
            <select className={inputCls} value={form.is_published ? 'true' : 'false'} onChange={e => set('is_published', e.target.value === 'true')}>
              <option value="false">Черновик</option>
              <option value="true">Опубликована</option>
            </select>
          </Field>
        </div>

        <Field label="Содержание">
          <textarea className={inputCls} rows={8} value={form.content} onChange={e => set('content', e.target.value)} />
        </Field>

        <Field label="Meta заголовок">
          <input className={inputCls} value={form.meta_title} onChange={e => set('meta_title', e.target.value)} />
        </Field>

        <Field label="Meta описание">
          <textarea className={inputCls} rows={3} value={form.meta_description} onChange={e => set('meta_description', e.target.value)} />
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
