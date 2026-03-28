import type { Employee } from '../types';

interface EmployeeSelectorProps {
  label?: string;
  selected: Employee[];
  available: Employee[];
  onSelectedChange: (employees: Employee[]) => void;
  onAvailableChange: (employees: Employee[]) => void;
  emptySelectedText?: string;
  emptyAvailableText?: string;
}

export default function EmployeeSelector({
  label,
  selected,
  available,
  onSelectedChange,
  onAvailableChange,
  emptySelectedText = 'Никого не выбрано',
  emptyAvailableText = 'Все сотрудники добавлены',
}: EmployeeSelectorProps) {
  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...selected];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onSelectedChange(next);
  }

  function moveDown(index: number) {
    if (index === selected.length - 1) return;
    const next = [...selected];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onSelectedChange(next);
  }

  function add(emp: Employee) {
    onSelectedChange([...selected, emp]);
    onAvailableChange(available.filter(e => e.id !== emp.id));
  }

  function remove(emp: Employee) {
    onSelectedChange(selected.filter(e => e.id !== emp.id));
    onAvailableChange([...available, emp].sort((a, b) => a.order - b.order));
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-6">
        {/* Selected — ordered */}
        <div>
          <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-3">
            Выбрано · {selected.length}
          </p>
          {selected.length === 0 ? (
            <div
              className="flex items-center justify-center h-32 rounded-xl border border-dashed border-border text-sm text-foreground/30">
              {emptySelectedText}
            </div>
          ) : (
            <div className="space-y-2">
              {selected.map((emp, index) => (
                <div key={emp.id}
                     className="flex items-center gap-3 bg-background rounded-xl px-3 py-2.5">
                  <div className="w-8 h-8 rounded-lg bg-surface flex-shrink-0 overflow-hidden">
                    {emp.photo
                      ? <img src={emp.photo} alt={emp.name} className="w-full h-full object-cover" />
                      : <div
                        className="w-full h-full flex items-center justify-center text-xs font-bold text-primary-500">{emp.name.charAt(0)}</div>
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{emp.name}</p>
                    <p className="text-xs text-foreground/40 truncate">{emp.title}</p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-1 rounded text-foreground/30 hover:text-foreground hover:bg-surface disabled:opacity-0 transition-colors"
                      aria-label="Вверх"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 15l-6-6-6 6" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === selected.length - 1}
                      className="p-1 rounded text-foreground/30 hover:text-foreground hover:bg-surface disabled:opacity-0 transition-colors"
                      aria-label="Вниз"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <button
                      onClick={() => remove(emp)}
                      className="p-1 rounded text-foreground/30 hover:text-red-500 hover:bg-red-50 transition-colors ml-1"
                      aria-label="Убрать"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available */}
        <div>
          <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-3">
            Доступные · {available.length}
          </p>
          {available.length === 0 ? (
            <div
              className="flex items-center justify-center h-32 rounded-xl border border-dashed border-border text-sm text-foreground/30">
              {emptyAvailableText}
            </div>
          ) : (
            <div className="space-y-2">
              {available.map(emp => (
                <div key={emp.id}
                     className="flex items-center gap-3 bg-background rounded-xl px-3 py-2.5">
                  <div className="w-8 h-8 rounded-lg bg-surface flex-shrink-0 overflow-hidden">
                    {emp.photo
                      ? <img src={emp.photo} alt={emp.name} className="w-full h-full object-cover" />
                      : <div
                        className="w-full h-full flex items-center justify-center text-xs font-bold text-primary-500">{emp.name.charAt(0)}</div>
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{emp.name}</p>
                    <p className="text-xs text-foreground/40 truncate">{emp.title}</p>
                  </div>

                  <button
                    onClick={() => add(emp)}
                    className="p-1 rounded text-foreground/30 hover:text-primary-500 hover:bg-primary-50 transition-colors"
                    aria-label="Добавить"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                         strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
