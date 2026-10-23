import { NextResponse } from 'next/server';
import { getPublicForm } from '@/lib/forms';

export const dynamic = 'force-dynamic';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: cors });
}

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const form = await getPublicForm(params.slug);
  if (!form) return NextResponse.json({ error: 'Form not found.' }, { status: 404, headers: cors });
  return NextResponse.json(form, { headers: cors });
}