import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ChatWidget } from '@/components/chatbot/ChatWidget';
import type { Question } from '@/types';

export default async function PreviewPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: form } = await supabase
    .from('forms')
    .select('title, slug, status, welcome_message, completion_message, theme_color')
    .eq('id', params.id)
    .maybeSingle();
  if (!form) notFound();

  const { data: questions } = await supabase
    .from('questions')
    .select('id, type, label, options, required')
    .eq('form_id', params.id)
    .order('position');

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_380px]">
      <div>
        <h2 className="text-base font-semibold text-slate-900">Preview</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          This is how visitors will see your form. Answers you give here are not saved. If something looks wrong, go
          back to the Builder, save your changes and reload this page.
        </p>
        {form.status === 'published' ? (
          <p className="mt-4 text-sm text-slate-600">
            This form is live at{' '}
            <Link href={`/f/${form.slug}`} target="_blank" className="text-teal-700 underline">
              /f/{form.slug}
            </Link>
          </p>
        ) : (
          <p className="mt-4 text-sm text-slate-600">This form is a draft. Press Publish when you are happy with it.</p>
        )}
      </div>

      <div className="h-[600px] w-full overflow-hidden rounded-2xl border border-slate-300 shadow-lg">
        <ChatWidget form={{ ...form, questions: (questions ?? []) as Question[] }} preview />
      </div>
    </div>
  );
}