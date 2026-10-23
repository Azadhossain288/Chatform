import { NextResponse } from 'next/server';
import { requireUser, unauthorized } from '@/lib/auth';
import { getFormsWithCounts } from '@/lib/forms';
import { generateSlug } from '@/lib/slug';
import { createFormSchema } from '@/lib/validations/form';

export const dynamic = 'force-dynamic';

// GET /api/forms -> amar shob form
export async function GET() {
  const { supabase, user } = await requireUser();
  if (!user) return unauthorized();

  try {
    return NextResponse.json(await getFormsWithCounts(supabase));
  } catch {
    return NextResponse.json({ error: 'Could not load forms.' }, { status: 500 });
  }
}

// POST /api/forms -> notun draft form + unique slug
export async function POST(req: Request) {
  const { supabase, user } = await requireUser();
  if (!user) return unauthorized();

  const parsed = createFormSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    const { data: form, error } = await supabase
      .from('forms')
      .insert({ owner_id: user.id, title: parsed.data.title, slug: generateSlug() })
      .select('id, slug')
      .single();

    if (error?.code === '23505') continue; // slug age thekei ache, abar chesta
    if (error || !form) {
      return NextResponse.json({ error: 'Could not create the form.' }, { status: 500 });
    }

    // Builder khali na thakar jonno ekta example question
    await supabase
      .from('questions')
      .insert({ form_id: form.id, type: 'text', label: 'What is your name?', required: true, position: 0 });

    return NextResponse.json(form, { status: 201 });
  }

  return NextResponse.json({ error: 'Could not generate a unique link. Try again.' }, { status: 500 });
}