import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';
import EmployeeSelector from '../../components/EmployeeSelector';
import HeroBlockEditor from '../../components/HeroBlockEditor';
import type { Employee, TeamMember } from '../../types';

export default function TeamConfig() {
  const [selected, setSelected] = useState<Employee[]>([]);
  const [available, setAvailable] = useState<Employee[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [selected2, setSelected2] = useState<Employee[]>([]);
  const [available2, setAvailable2] = useState<Employee[]>([]);
  const [saving2, setSaving2] = useState(false);
  const [saved2, setSaved2] = useState(false);

  useEffect(() => {
    Promise.all([
      apiFetch('/staff/team/').then(r => r.json()) as Promise<TeamMember[]>,
      apiFetch('/staff/groups/team-about/').then(r => r.json()) as Promise<TeamMember[]>,
      apiFetch('/staff/').then(r => r.json()).then(d => d.results as Employee[]),
    ]).then(([members, groupMembers, allEmployees]) => {
      const selectedIds = new Set(members.map(m => m.employee.id));
      setSelected(members.map(m => m.employee));
      setAvailable(allEmployees.filter(e => !selectedIds.has(e.id)));

      const selected2Ids = new Set(groupMembers.map(m => m.employee.id));
      setSelected2(groupMembers.map(m => m.employee));
      setAvailable2(allEmployees.filter(e => !selected2Ids.has(e.id)));
    });
  }, []);

  async function save() {
    setSaving(true);
    setSaved(false);
    await apiFetch('/staff/team/', {
      method: 'PUT',
      body: JSON.stringify(selected.map(e => ({ employee_id: e.id }))),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function save2() {
    setSaving2(true);
    setSaved2(false);
    await apiFetch('/staff/groups/team-about/', {
      method: 'PUT',
      body: JSON.stringify(selected2.map(e => ({ employee_id: e.id }))),
    });
    setSaving2(false);
    setSaved2(true);
    setTimeout(() => setSaved2(false), 2500);
  }

  return (
    <div className="space-y-8">
      <HeroBlockEditor slug="team" />

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Состав команды</h2>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
          >
            {saving ? 'Сохранение...' : saved ? '✓ Сохранено' : 'Сохранить'}
          </button>
        </div>
        <EmployeeSelector
          label="Состав команды"
          selected={selected}
          available={available}
          onSelectedChange={setSelected}
          onAvailableChange={setAvailable}
        />
      </div>

      <HeroBlockEditor slug="team-about" withEyebrow titleLabel="Заголовок секции" bodyLabel="Подзаголовок" />

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Сотрудники секции</h2>
          <button
            onClick={save2}
            disabled={saving2}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
          >
            {saving2 ? 'Сохранение...' : saved2 ? '✓ Сохранено' : 'Сохранить'}
          </button>
        </div>
        <EmployeeSelector
          label="Сотрудники секции"
          selected={selected2}
          available={available2}
          onSelectedChange={setSelected2}
          onAvailableChange={setAvailable2}
        />
      </div>
    </div>
  );
}
