import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { validateAnswer } from '@/lib/validations/response';
import type { Question } from '@/types';

export const dynamic = 'force-dynamic';

const bodySchema = z.object({ answers: z.record(z.string(), z.string()) });

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });

  const admin = createAdminClient();

  const { data: form } = await admin
    .from('forms')
    .select('id')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .maybeSingle();
  if (!form) return NextResponse.json({ error: 'Form not found.' }, { status: 404 });

  const { data: questions } = await admin
    .from('questions')
    .select('id, type, label, options, required')
    .eq('form_id', form.id);

  const errors: Record<string, string> = {};
  const rows: { question_id: string; value: string }[] = [];
  for (const q of (questions ?? []) as Question[]) {
    const value = (parsed.data.answers[q.id] ?? '').trim();
    const problem = validateAnswer(q, value);
    if (problem) errors[q.id] = problem;
    else rows.push({ question_id: q.id, value });
  }
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: 'Some answers are not valid.', errors }, { status: 422 });
  }

  const { data: response, error } = await admin.from('responses').insert({ form_id: form.id }).select('id').single();
  if (error || !response) return NextResponse.json({ error: 'Could not save your response.' }, { status: 500 });

  if (rows.length > 0) {
    const { error: answersError } = await admin
      .from('answers')
      .insert(rows.map((r) => ({ ...r, response_id: response.id })));
    if (answersError) {
      await admin.from('responses').delete().eq('id', response.id);
      return NextResponse.json({ error: 'Could not save your response.' }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}