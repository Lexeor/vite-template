import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';

interface SiteSection {
  slug: string;
  eyebrow: string;
  title: string;
  body: string;
}

interface SectionEditorProps {
  slug: string;
  label?: string;
  withEyebrow?: boolean;
  eyebrowLabel?: string;
  titleLabel?: string;
  bodyLabel?: string;
}

export default function SectionEditor({
  slug,
  label = 'Блок страницы',
  withEyebrow = false,
  eyebrowLabel = 'Надпись над заголовком',
  titleLabel = 'Заголовок',
  bodyLabel = 'Описание',
}: SectionEditorProps) {
  const [eyebrow, setEyebrow] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/pages/sections/${slug}/`)
      .then(r => r.json() as Promise<SiteSection>)
      .then(data => {
        setEyebrow(data.eyebrow);
        setTitle(data.title);
        setBody(data.body);
        setLoading(false);
      });
  }, [slug]);

  async function save() {
    setSaving(true);
    setSaved(false);
    await apiFetch(`/pages/sections/${slug}/`, {
      method: 'PUT',
      body: JSON.stringify({ eyebrow, title, body }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) return null;

  return (
    <div className="bg-background rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest">
          {label}
        </p>
        <button
          onClick={save}
          disabled={saving}
          className="px-4 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
        >
          {saving ? 'Сохранение...' : saved ? '✓ Сохранено' : 'Сохранить'}
        </button>
      </div>

      <div className="space-y-3">
        {withEyebrow && (
          <div>
            <label className="block text-xs font-medium text-foreground/50 mb-1.5">
              {eyebrowLabel}
            </label>
            <input
              type="text"
              value={eyebrow}
              onChange={e => setEyebrow(e.target.value)}
              className="w-full px-3 py-2 bg-surface rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              placeholder="НАШИ ПРИНЦИПЫ"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-foreground/50 mb-1.5">
            {titleLabel}
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-surface rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            placeholder="Заголовок..."
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground/50 mb-1.5">
            {bodyLabel}
          </label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-surface rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors resize-none"
            placeholder="Текст..."
          />
        </div>
      </div>
    </div>
  );
}
