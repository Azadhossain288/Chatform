'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormSettings, Question } from '@/types';
import { useChatFlow } from '@/hooks/useChatFlow';
import { AnswerButtons } from './AnswerButtons';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';

export interface ChatFormData extends FormSettings {
  questions: Question[];
}

interface Props {
  form: ChatFormData;
  /** Public slug. Preview na hole lagbe. */
  slug?: string;
  /** Preview mode: kichu save hoy na. */
  preview?: boolean;
  /** Close button dekhay (embed iframe er bhitore). */
  onClose?: () => void;
}

export function ChatWidget(props: Props) {
  // run bodlale session abar shuru hoy = Restart
  const [run, setRun] = useState(0);
  return (
    <ChatSession
      key={run}
      {...props}
      onRestart={props.preview ? () => setRun((r) => r + 1) : undefined}
    />
  );
}

function ChatSession({ form, slug, preview, onClose, onRestart }: Props & { onRestart?: () => void }) {
  const chat = useChatFlow({ form, slug, preview });
  const bottomRef = useRef<HTMLDivElement>(null);
  const color = form.theme_color;
  const question = chat.currentQuestion;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [chat.messages.length, chat.typing, chat.status]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      <header className="flex items-center gap-3 px-4 py-3 text-white" style={{ backgroundColor: color }}>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{form.title}</p>
          <p className="text-xs text-white/80">{preview ? 'Preview: answers are not saved' : 'Answer one question at a time'}</p>
        </div>
        {onRestart && (
          <button
            type="button"
            onClick={onRestart}
            className="rounded-md px-2 py-1 text-xs font-medium text-white/90 hover:bg-white/20"
          >
            Restart
          </button>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        )}
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4" role="log" aria-live="polite">
        {chat.messages.map((m) => (
          <ChatMessage key={m.id} from={m.from} text={m.text} color={color} />
        ))}
        {chat.typing && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <footer className="min-h-[72px] border-t border-slate-200 bg-white p-3">
        {chat.error && (
          <p role="alert" className="mb-2 text-xs text-red-600">
            {chat.error}
          </p>
        )}

        {chat.status === 'asking' && question && (
          <>
            {question.type === 'choice' && (
              <AnswerButtons options={question.options ?? []} color={color} onSelect={chat.submit} />
            )}
            {question.type === 'yesno' && (
              <AnswerButtons options={['Yes', 'No']} color={color} onSelect={chat.submit} />
            )}
            {(question.type === 'text' || question.type === 'email') && (
              <ChatInput key={question.id} type={question.type} color={color} onSubmit={chat.submit} />
            )}
            {!question.required && (
              <button
                type="button"
                onClick={() => chat.submit('')}
                className="mt-2 text-xs text-slate-500 underline hover:text-slate-700"
              >
                Skip this question
              </button>
            )}
          </>
        )}

        {chat.status === 'failed' && (
          <button
            type="button"
            onClick={chat.retry}
            className="w-full rounded-full px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: color }}
          >
            Try again
          </button>
        )}

        {(chat.status === 'starting' || chat.status === 'busy') && (
          <p className="py-2 text-center text-xs text-slate-400">Please wait...</p>
        )}

        {chat.status === 'done' && (
          <p className="py-2 text-center text-xs text-slate-400">
            {preview ? 'End of preview' : 'Your response has been submitted'}
          </p>
        )}
      </footer>
    </div>
  );
}