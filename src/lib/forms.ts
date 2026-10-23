import type { SupabaseClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';
import type { FormSummary, PublicForm, Question } from '@/types';

type SummaryRow = Omit<FormSummary, 'response_count'> & { responses: { count: number }[] | null };

// Logged-in user er shob form, response sonkha shoho (RLS er karone shudhu nijer ta)
export async function getFormsWithCounts(supabase: SupabaseClient): Promise<FormSummary[]> {
  const { data, error } = await supabase
    .from('forms')
    .select('id, title, slug, status, created_at, responses(count)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return ((data ?? []) as SummaryRow[]).map(({ responses, ...form }) => ({
    ...form,
    response_count: responses?.[0]?.count ?? 0,
  }));
}

// Slug diye published form. Draft ba bhul slug hole null
export async function getPublicForm(slug: string): Promise<PublicForm | null> {
  const admin = createAdminClient();

  const { data: form } = await admin
    .from('forms')
    .select('id, slug, title, welcome_message, completion_message, theme_color')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (!form) return null;

  const { data: questions } = await admin
    .from('questions')
    .select('id, type, label, options, required')
    .eq('form_id', form.id)
    .order('position');

  return {
    slug: form.slug,
    title: form.title,
    welcome_message: form.welcome_message,
    completion_message: form.completion_message,
    theme_color: form.theme_color,
    questions: (questions ?? []) as Question[],
  };
}