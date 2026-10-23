import { NextResponse } from 'next/server';
import { notFoundJson, requireUser, unauthorized } from '@/lib/auth';
import { publishSchema } from '@/lib/validations/form';

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { supabase, user } = await requireUser();
  if (!user) return unauthorized();

  const parsed = publishSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });

  if (parsed.data.publish) {
    const { count } = await supabase
      .from('questions')
      .select('id', { count: 'exact', head: true })
      .eq('form_id', params.id);
    if (!count) {
      return NextResponse.json({ error: 'Add and save at least one question before publishing.' }, { status: 400 });
    }
  }

  const { data } = await supabase
    .from('forms')
    .update({ status: parsed.data.publish ? 'published' : 'draft' })
    .eq('id', params.id)
    .select('id, status')
    .maybeSingle();

  if (!data) return notFoundJson();
  return NextResponse.json(data);
}