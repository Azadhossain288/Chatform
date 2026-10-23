'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { FormSettings, Question } from '@/types';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import { Button } from '@/components/ui/Button';
import { QuestionList } from './QuestionList';
import { QuestionTypePicker } from './QuestionTypePicker';
import { ThemeSettings } from './ThemeSettings';

interface Props {
  formId: string;
  initialSettings: FormSettings;
  initialQuestions: Question[];
}

export function FormBuilder({ formId, initialSettings, initialQuestions }: Props) {
  const router = useRouter();
  const [settings, setSettings] = useState<FormSettings>(initialSettings);
  const { questions, add, update, move, remove } = useFormBuilder(initialQuestions);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  async function save() {
    setMessage(null);

    if (questions.some((q) => !q.label.trim())) {
      setMessage({ type: 'error', text: 'Every question needs a label before you can save.' });
      return;
    }

    const payload = {
      ...settings,
      questions: questions.map((q) => ({
        id: q.id,
        type: q.type,
        label: q.label.trim(),
        options: q.type === 'choice' ? (q.options ?? []).map((o) => o.trim()).filter(Boolean) : null,
        required: q.required,
      })),
    };

    setSaving(true);
    try {
      const res = await fetch(`/api/forms/${formId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error ?? 'Could not save the form.' });
      } else {
        setMessage({ type: 'ok', text: 'Saved. Open the Preview tab to try it.' });
        router.refresh();
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Check your connection and try again.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <ThemeSettings value={settings} onChange={(patch) => setSettings((s) => ({ ...s, ...patch }))} />

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900">Questions</h2>
        <QuestionList questions={questions} onChange={update} onMove={move} onRemove={remove} />
        <QuestionTypePicker onAdd={add} />
      </section>

      <div className="sticky bottom-0 -mx-4 flex items-center gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <Button onClick={save} disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </Button>
        {message && (
          <p role="status" className={`text-sm ${message.type === 'ok' ? 'text-teal-700' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}