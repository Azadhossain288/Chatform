import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ResponseTable } from '@/components/dashboard/ResponseTable';
import type { Question, ResponseRow } from '@/types';

export default async function ResponsesPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: form } = await supabase.from('forms').select('id').eq('id', params.id).maybeSingle();
  if (!form) notFound();

  const { data: questions } = await supabase
    .from('questions')
    .select('id, type, label, options, required')
    .eq('form_id', params.id)
    .order('position');

  const { data: responses } = await supabase
    .from('responses')
    .select('id, submitted_at, answers(question_id, value)')
    .eq('form_id', params.id)
    .order('submitted_at', { ascending: false });

  const rows = (responses ?? []) as ResponseRow[];

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-slate-900">
        {rows.length} {rows.length === 1 ? 'response' : 'responses'}
      </h2>
      <ResponseTable questions={(questions ?? []) as Question[]} responses={rows} />
    </div>
  );
}