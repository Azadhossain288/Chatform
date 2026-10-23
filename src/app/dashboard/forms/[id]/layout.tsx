import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { StatusBadge } from '@/components/ui/Badge';
import { FormNav } from '@/components/dashboard/FormNav';
import { PublishButton } from '@/components/dashboard/PublishButton';
import type { FormStatus } from '@/types';

export default async function FormLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { data: form } = await createClient()
    .from('forms')
    .select('id, title, status')
    .eq('id', params.id)
    .maybeSingle();

  if (!form) notFound();

  return (
    <div>
      <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-800">
        Back to all forms
      </Link>
      <div className="mb-6 mt-2 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate font-serif text-3xl font-semibold">{form.title}</h1>
          <div className="mt-2">
            <StatusBadge status={form.status as FormStatus} />
          </div>
        </div>
        <PublishButton formId={form.id} published={form.status === 'published'} />
      </div>
      <FormNav formId={form.id} />
      <div className="mt-6">{children}</div>
    </div>
  );
}