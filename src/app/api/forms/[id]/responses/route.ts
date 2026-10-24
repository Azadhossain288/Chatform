import { NextResponse } from 'next/server';
import { notFoundJson, requireUser, unauthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/forms/:id/responses -> amar form er shob submission (notun age)
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { supabase, user } = await requireUser();
  if (!user) return unauthorized();

  const { data: form } = await supabase.from('forms').select('id').eq('id', params.id).maybeSingle();
  if (!form) return notFoundJson();

  const { data, error } = await supabase
    .from('responses')
    .select('id, submitted_at, answers(question_id, value)')
    .eq('form_id', params.id)
    .order('submitted_at', { ascending: false });

  if (error) return NextResponse.json({ error: 'Could not load responses.' }, { status: 500 });
  return NextResponse.json(data ?? []);
}