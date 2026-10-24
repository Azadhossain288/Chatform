import { notFound } from 'next/navigation';
import { getPublicForm } from '@/lib/forms';
import { EmbedChat } from '@/components/chatbot/EmbedChat';

export const dynamic = 'force-dynamic';

// widget.js je iframe banay, seta ei page load kore
export default async function EmbedPage({ params }: { params: { slug: string } }) {
  const form = await getPublicForm(params.slug);
  if (!form) notFound();

  return (
    <div className="h-[100dvh] w-full">
      <EmbedChat form={form} />
    </div>
  );
}