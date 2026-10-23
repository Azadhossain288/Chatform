import type { Question } from '@/types';
import { QuestionEditor } from './QuestionEditor';

interface Props {
  questions: Question[];
  onChange: (id: string, patch: Partial<Question>) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onRemove: (id: string) => void;
}

export function QuestionList({ questions, onChange, onMove, onRemove }: Props) {
  if (questions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
        No questions yet. Add your first question below.
      </div>
    );
  }

  return (
    <ol className="space-y-3">
      {questions.map((q, i) => (
        <QuestionEditor
          key={q.id}
          question={q}
          index={i}
          isFirst={i === 0}
          isLast={i === questions.length - 1}
          onChange={(patch) => onChange(q.id, patch)}
          onMove={(dir) => onMove(q.id, dir)}
          onRemove={() => onRemove(q.id)}
        />
      ))}
    </ol>
  );
}