import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { FormBuilder } from '@/components/builder/FormBuilder';
import type { Question } from '@/types';

export default async function BuilderPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: form } = await supabase
    .from('forms')
    .select('title, welcome_message, completion_message, theme_color')
    .eq('id', params.id)
    .maybeSingle();
  if (!form) notFound();

  const { data: questions } = await supabase
    .from('questions')
    .select('id, type, label, options, required')
    .eq('form_id', params.id)
    .order('position');

  return <FormBuilder formId={params.id} initialSettings={form} initialQuestions={(questions ?? []) as Question[]} />;
}