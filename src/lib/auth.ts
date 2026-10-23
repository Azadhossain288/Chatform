import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export const unauthorized = () => NextResponse.json({ error: 'Please log in first.' }, { status: 401 });
export const notFoundJson = () => NextResponse.json({ error: 'Form not found.' }, { status: 404 });