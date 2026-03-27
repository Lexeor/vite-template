import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import type { Event } from '../../types';

export default function EventForm() {
  const { slug } = useParams();
  const isEdit = !!slug;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    start_date: '',
    end_date: '',
    location: '',
    status: 'draft',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      apiFetch(`/events/${slug}/`).then(r => r.json()).then((e: Event) => {
        setForm({
          title: e.title,
          slug: e.slug,
          description: e.description,
          content: e.content,
          start_date: e.start_date?.slice(0, 10) ?? '',
          end_date: e.end_date?.slice(0, 10) ?? '',
          location: e.location,
          status: e.status,
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
      const res = isEdit
        ? await apiFetch(`/events/${slug}/`, { method: 'PATCH', body: JSON.stringify(form) })
        : await apiFetch('/events/', { method: 'POST', body: JSON.stringify(form) });
      if (!res.ok) throw new Error(JSON.stringify(await res.json()));
      navigate('/admin/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/events')} className="text-foreground/50 hover:text-foreground transition-colors">
          ← Назад
        </button>
        <h2 className="text-xl font-semibold text-foreground">
          {isEdit ? 'Редактировать событие' : 'Новое событие'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-background rounded-xl border border-border p-6 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
        )}

        <Field label="Название">
          <input className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} required />
        </Field>

        <Field label="Slug (URL)">
          <input className={inputCls} value={form.slug} onChange={e => set('slug', e.target.value)} required />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Дата начала">
            <input type="date" className={inputCls} value={form.start_date} onChange={e => set('start_date', e.target.value)} />
          </Field>
          <Field label="Дата окончания">
            <input type="date" className={inputCls} value={form.end_date} onChange={e => set('end_date', e.target.value)} />
          </Field>
        </div>

        <Field label="Место проведения">
          <input className={inputCls} value={form.location} onChange={e => set('location', e.target.value)} />
        </Field>

        <Field label="Статус">
          <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="draft">Черновик</option>
            <option value="published">Опубликовано</option>
            <option value="archived">Архив</option>
          </select>
        </Field>

        <Field label="Описание">
          <textarea className={inputCls} rows={3} value={form.description} onChange={e => set('description', e.target.value)} />
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
