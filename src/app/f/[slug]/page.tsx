import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicForm } from '@/lib/forms';
import { ChatWidget } from '@/components/chatbot/ChatWidget';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const form = await getPublicForm(params.slug);
  return { title: form ? form.title : 'Form not found' };
}

export default async function PublicFormPage({ params }: { params: { slug: string } }) {
  const form = await getPublicForm(params.slug);
  if (!form) notFound(); // draft ba bhul slug

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-slate-100 sm:p-6">
      <div className="h-[100dvh] w-full max-w-md overflow-hidden bg-white sm:h-[660px] sm:rounded-2xl sm:shadow-xl">
        <ChatWidget form={form} slug={form.slug} />
      </div>
    </main>
  );
}