import type { FormSettings } from '@/types';

interface Props {
  value: FormSettings;
  onChange: (patch: Partial<FormSettings>) => void;
}

const field = 'w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none';

export function ThemeSettings({ value, onChange }: Props) {
  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-base font-semibold text-slate-900">Form settings</h2>

      <div>
        <label htmlFor="f-title" className="mb-1 block text-sm font-medium text-slate-700">
          Form title
        </label>
        <input id="f-title" value={value.title} maxLength={120} onChange={(e) => onChange({ title: e.target.value })} className={field} />
      </div>

      <div>
        <label htmlFor="f-welcome" className="mb-1 block text-sm font-medium text-slate-700">
          Welcome message
        </label>
        <textarea
          id="f-welcome"
          rows={2}
          maxLength={300}
          value={value.welcome_message}
          onChange={(e) => onChange({ welcome_message: e.target.value })}
          className={field}
        />
      </div>

      <div>
        <label htmlFor="f-done" className="mb-1 block text-sm font-medium text-slate-700">
          Completion message
        </label>
        <textarea
          id="f-done"
          rows={2}
          maxLength={300}
          value={value.completion_message}
          onChange={(e) => onChange({ completion_message: e.target.value })}
          className={field}
        />
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="f-color" className="text-sm font-medium text-slate-700">
          Widget color
        </label>
        <input
          id="f-color"
          type="color"
          value={value.theme_color}
          onChange={(e) => onChange({ theme_color: e.target.value })}
          className="h-9 w-14 cursor-pointer rounded border border-slate-300 bg-white p-1"
        />
        <code className="text-xs text-slate-500">{value.theme_color}</code>
      </div>
    </section>
  );
}