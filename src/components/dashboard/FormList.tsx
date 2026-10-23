'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { FormSummary } from '@/types';
import { Button, buttonClass } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { PublishButton } from './PublishButton';

export function FormList({ forms }: { forms: FormSummary[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function remove(form: FormSummary) {
    if (!confirm(`Delete "${form.title}" and all of its responses? This cannot be undone.`)) return;
    setDeletingId(form.id);
    setError(null);
    try {
      const res = await fetch(`/api/forms/${form.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError(`Could not delete "${form.title}". Try again.`);
    } finally {
      setDeletingId(null);
    }
  }

  if (forms.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="font-medium text-slate-900">You have no forms yet</p>
        <p className="mt-1 text-sm text-slate-500">Create your first form and add it to your website in a few minutes.</p>
        <Link href="/dashboard/forms/new" className={buttonClass('primary', 'mt-4')}>
          Create a form
        </Link>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <p role="alert" className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
        {forms.map((form) => (
          <li key={form.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/dashboard/forms/${form.id}`} className="truncate font-medium text-slate-900 hover:underline">
                  {form.title}
                </Link>
                <StatusBadge status={form.status} />
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {form.response_count} {form.response_count === 1 ? 'response' : 'responses'} - created{' '}
                {form.created_at.slice(0, 10)}
                {form.status === 'published' && (
                  <>
                    {' '}
                    -{' '}
                    <Link href={`/f/${form.slug}`} target="_blank" className="text-teal-700 underline">
                      public link
                    </Link>
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-start gap-2">
              <Link href={`/dashboard/forms/${form.id}`} className={buttonClass('secondary')}>
                Edit
              </Link>
              <Link href={`/dashboard/forms/${form.id}/responses`} className={buttonClass('secondary')}>
                Responses
              </Link>
              <PublishButton formId={form.id} published={form.status === 'published'} />
              <Button variant="danger" onClick={() => remove(form)} disabled={deletingId === form.id}>
                {deletingId === form.id ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}