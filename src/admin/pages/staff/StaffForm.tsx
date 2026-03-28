import { useEffect, useRef, useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import type { Employee } from '../../types';

export default function StaffForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    order: '0',
    is_active: true,
  });
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      apiFetch(`/staff/${id}/`).then(r => r.json()).then((e: Employee) => {
        setForm({
          name: e.name,
          title: e.title,
          description: e.description,
          order: String(e.order),
          is_active: e.is_active,
        });
        setCurrentPhoto(e.photo);
      });
    }
  }, [id]);

  function set(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  }

  function handleRemovePhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    setCurrentPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body = new FormData();
      body.append('name', form.name);
      body.append('title', form.title);
      body.append('description', form.description);
      body.append('order', form.order);
      body.append('is_active', String(form.is_active));
      if (photoFile) {
        body.append('photo', photoFile);
      } else if (currentPhoto === null && isEdit) {
        // явно сбрасываем фото
        body.append('photo', '');
      }

      const res = isEdit
        ? await apiFetch(`/staff/${id}/`, { method: 'PATCH', body })
        : await apiFetch('/staff/', { method: 'POST', body });
      if (!res.ok) throw new Error(JSON.stringify(await res.json()));
      navigate('/admin/staff');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  }

  const preview = photoPreview ?? currentPhoto;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/staff')} className="text-foreground/50 hover:text-foreground transition-colors">
          ← Назад
        </button>
        <h2 className="text-xl font-semibold text-foreground">
          {isEdit ? 'Редактировать сотрудника' : 'Новый сотрудник'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-background rounded-xl p-6 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
        )}

        {/* Photo upload */}
        <Field label="Фотография">
          <div className="flex items-center gap-4">
            {/* Preview */}
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface flex-shrink-0">
              {preview ? (
                <img src={preview} alt="Превью" className="w-full h-full object-cover object-top" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-foreground/20">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-xs font-medium bg-surface rounded-lg text-foreground/70 hover:bg-surface-elevated transition-colors"
              >
                {preview ? 'Заменить' : 'Загрузить фото'}
              </button>
              {preview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Удалить фото
                </button>
              )}
              <p className="text-xs text-foreground/40">JPG, PNG · до 5 МБ</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </Field>

        <Field label="Имя">
          <input className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} required />
        </Field>

        <Field label="Должность">
          <input className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} required />
        </Field>

        <Field label="Описание">
          <textarea className={inputCls} rows={4} value={form.description} onChange={e => set('description', e.target.value)} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Порядок">
            <input type="number" className={inputCls} value={form.order} onChange={e => set('order', e.target.value)} />
          </Field>
          <Field label="Статус">
            <select className={inputCls} value={form.is_active ? 'true' : 'false'} onChange={e => set('is_active', e.target.value === 'true')}>
              <option value="true">Активен</option>
              <option value="false">Скрыт</option>
            </select>
          </Field>
        </div>

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

const inputCls = 'w-full px-3 py-2.5 rounded-lg bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground/70 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
