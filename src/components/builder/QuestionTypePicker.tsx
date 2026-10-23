import type { QuestionType } from '@/types';
import { Button } from '@/components/ui/Button';

export const TYPE_LABELS: Record<QuestionType, string> = {
  text: 'Short text',
  email: 'Email',
  choice: 'Multiple choice',
  yesno: 'Yes / No',
};

export function QuestionTypePicker({ onAdd }: { onAdd: (type: QuestionType) => void }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-700">Add a question</p>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(TYPE_LABELS) as QuestionType[]).map((type) => (
          <Button key={type} variant="secondary" onClick={() => onAdd(type)}>
            + {TYPE_LABELS[type]}
          </Button>
        ))}
      </div>
    </div>
  );
}