'use client';

import type { PublicForm } from '@/types';
import { ChatWidget } from './ChatWidget';

// Iframe er bhitore chat. Close button parent page ke message pathay.
export function EmbedChat({ form }: { form: PublicForm }) {
  return (
    <ChatWidget
      form={form}
      slug={form.slug}
      onClose={() => window.parent.postMessage({ type: 'chatform:close' }, '*')}
    />
  );
}