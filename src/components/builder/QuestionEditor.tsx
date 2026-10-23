import type { Question } from '@/types';
import { Button } from '@/components/ui/Button';
import { TYPE_LABELS } from './QuestionTypePicker';

interface Props {
  question: Question;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onChange: (patch: Partial<Question>) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}

export function QuestionEditor({ question, index, isFirst, isLast, onChange, onMove, onRemove }: Props) {
  const labelId = `q-label-${question.id}`;

  return (
    <li className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm text-slate-500">
          Question {index + 1} <span className="mx-1">-</span>
          <span className="font-medium text-slate-700">{TYPE_LABELS[question.type]}</span>
        </p>
        <div className="flex gap-1">
          <Button variant="ghost" className="px-2 py-1" onClick={() => onMove(-1)} disabled={isFirst} aria-label="Move up">
            Up
          </Button>
          <Button variant="ghost" className="px-2 py-1" onClick={() => onMove(1)} disabled={isLast} aria-label="Move down">
            Down
          </Button>
          <Button variant="danger" className="px-2 py-1" onClick={onRemove} aria-label="Delete question">
            Delete
          </Button>
        </div>
      </div>

      <label htmlFor={labelId} className="mb-1 block text-sm font-medium text-slate-700">
        What should the bot ask?
      </label>
      <input
        id={labelId}
        value={question.label}
        onChange={(e) => onChange({ label: e.target.value })}
        maxLength={200}
        placeholder="e.g. What is your name?"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none"
      />

      {question.type === 'choice' && (
        <div className="mt-3">
          <label htmlFor={`${labelId}-opts`} className="mb-1 block text-sm font-medium text-slate-700">
            Answer buttons (one per line, at least 2)
          </label>
          <textarea
            id={`${labelId}-opts`}
            rows={4}
            value={(question.options ?? []).join('\n')}
            onChange={(e) => onChange({ options: e.target.value.split('\n') })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none"
          />
        </div>
      )}

      {question.type === 'yesno' && (
        <p className="mt-2 text-xs text-slate-500">Visitors will see two buttons: Yes and No.</p>
      )}
      {question.type === 'email' && (
        <p className="mt-2 text-xs text-slate-500">The email address is checked before the chat moves on.</p>
      )}

      <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={question.required}
          onChange={(e) => onChange({ required: e.target.checked })}
          className="h-4 w-4 accent-teal-700"
        />
        Required
      </label>
    </li>
  );
}