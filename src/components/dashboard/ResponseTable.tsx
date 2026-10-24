
import type { Question, ResponseRow } from '@/types';
import { LocalTime } from '@/components/ui/LocalTime';

export function ResponseTable({ questions, responses }: { questions: Question[]; responses: ResponseRow[] }) {
  if (responses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="font-medium text-slate-900">No responses yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Publish the form and share the link or embed the widget. New submissions show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
          <tr>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Submitted</th>
            {questions.map((q) => (
              <th key={q.id} className="px-4 py-3 font-medium">
                {q.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {responses.map((r) => {
            const byQuestion = new Map(r.answers.map((a) => [a.question_id, a.value]));
            return (
              <tr key={r.id} className="align-top">
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                  <LocalTime iso={r.submitted_at} />
                </td>
                {questions.map((q) => (
                  <td key={q.id} className="max-w-[280px] break-words px-4 py-3 text-slate-900">
                    {byQuestion.get(q.id) || <span className="text-slate-400">-</span>}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}