import type { FormStatus } from '@/types';

export function StatusBadge({ status }: { status: FormStatus }) {
  const published = status === 'published';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        published ? 'bg-teal-50 text-teal-800' : 'bg-slate-100 text-slate-600'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${published ? 'bg-teal-600' : 'bg-slate-400'}`} />
      {published ? 'Published' : 'Draft'}
    </span>
  );
}