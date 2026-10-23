import { NextResponse } from 'next/server';
import { notFoundJson, requireUser, unauthorized } from '@/lib/auth';
import { formUpdateSchema } from '@/lib/validations/form';

export const dynamic = 'force-dynamic';

type Ctx = { params: { id: string } };

// GET /api/forms/:id -> form + questions (shudhu owner, RLS er karone)
export async function GET(_req: Request, { params }: Ctx) {
  const { supabase, user } = await requireUser();
  if (!user) return unauthorized();

  const { data: form } = await supabase.from('forms').select('*').eq('id', params.id).maybeSingle();
  if (!form) return notFoundJson();

  const { data: questions } = await supabase
    .from('questions')
    .select('id, type, label, options, required, position')
    .eq('form_id', params.id)
    .order('position');

  return NextResponse.json({ ...form, questions: questions ?? [] });
}

// PATCH /api/forms/:id -> settings + pura question list save
export async function PATCH(req: Request, { params }: Ctx) {
  const { supabase, user } = await requireUser();
  if (!user) return unauthorized();

  const parsed = formUpdateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { questions, ...settings } = parsed.data;

  const { data: updated } = await supabase
    .from('forms')
    .update(settings)
    .eq('id', params.id)
    .select('id')
    .maybeSingle();
  if (!updated) return notFoundJson();

  // Builder e ar nai emon question gulo muche fela
  const { data: existing } = await supabase.from('questions').select('id').eq('form_id', params.id);
  const keep = new Set(questions.map((q) => q.id));
  const toDelete = (existing ?? []).map((q: { id: string }) => q.id).filter((id: string) => !keep.has(id));
  if (toDelete.length > 0) {
    const { error } = await supabase.from('questions').delete().in('id', toDelete);
    if (error) return NextResponse.json({ error: 'Could not remove deleted questions.' }, { status: 500 });
  }

  // id diye upsert, tai purono question er answer thake
  if (questions.length > 0) {
    const { error } = await supabase.from('questions').upsert(
      questions.map((q, position) => ({
        id: q.id,
        form_id: params.id,
        type: q.type,
        label: q.label,
        options: q.type === 'choice' ? q.options : null,
        required: q.required,
        position,
      }))
    );
    if (error) return NextResponse.json({ error: 'Could not save the questions.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// DELETE /api/forms/:id -> form, question, response shob muche jay (cascade)
export async function DELETE(_req: Request, { params }: Ctx) {
  const { supabase, user } = await requireUser();
  if (!user) return unauthorized();

  const { data, error } = await supabase.from('forms').delete().eq('id', params.id).select('id');
  if (error) return NextResponse.json({ error: 'Could not delete the form.' }, { status: 500 });
  if (!data || data.length === 0) return notFoundJson();

  return NextResponse.json({ ok: true });
}