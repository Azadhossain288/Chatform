'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Question } from '@/types';
import { validateAnswer } from '@/lib/validations/response';

export interface ChatMsg {
  id: string;
  from: 'bot' | 'user';
  text: string;
}

export type ChatStatus = 'starting' | 'asking' | 'busy' | 'failed' | 'done';

interface Options {
  form: { welcome_message: string; completion_message: string; questions: Question[] };
  slug?: string;
  preview?: boolean;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
let counter = 0;
const nextId = () => `m${++counter}`;

// welcome -> question 1 -> ... -> shesh question -> save -> completion
// Preview mode e server e kichu pathay na
export function useChatFlow({ form, slug, preview }: Options) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [typing, setTyping] = useState(false);
  const [status, setStatus] = useState<ChatStatus>('starting');
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const answers = useRef<Record<string, string>>({});
  const started = useRef(false);

  // Bot er message, age ekto "typing..." dekhay, jate chat er moto lage
  const say = useCallback(async (text: string) => {
    setTyping(true);
    await sleep(500);
    setTyping(false);
    setMessages((m) => [...m, { id: nextId(), from: 'bot', text }]);
  }, []);

  useEffect(() => {
    if (started.current) return; // React dev mode e duibar chalano thekay
    started.current = true;

    (async () => {
      await say(form.welcome_message);
      if (form.questions.length === 0) {
        await say(form.completion_message);
        setStatus('done');
        return;
      }
      await say(form.questions[0].label);
      setStatus('asking');
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = useCallback(async () => {
    setStatus('busy');
    setError(null);

    if (!preview) {
      try {
        const res = await fetch(`/api/public/forms/${slug}/responses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: answers.current }),
        });
        if (!res.ok) throw new Error('Request failed');
      } catch {
        setError('We could not send your answers. Check your connection and try again.');
        setStatus('failed');
        return;
      }
    }

    await say(form.completion_message);
    setStatus('done');
  }, [form.completion_message, preview, say, slug]);

  const submit = useCallback(
    async (raw: string) => {
      const question = form.questions[index];
      if (status !== 'asking' || !question) return;

      const problem = validateAnswer(question, raw);
      if (problem) {
        setError(problem);
        return;
      }

      const value = raw.trim();
      setError(null);
      setStatus('busy');
      answers.current[question.id] = value;
      setMessages((m) => [...m, { id: nextId(), from: 'user', text: value || 'Skipped' }]);

      const nextIndex = index + 1;
      if (nextIndex < form.questions.length) {
        await say(form.questions[nextIndex].label);
        setIndex(nextIndex);
        setStatus('asking');
      } else {
        await save();
      }
    },
    [form.questions, index, save, say, status]
  );

  return {
    messages,
    typing,
    status,
    error,
    currentQuestion: status === 'asking' ? form.questions[index] ?? null : null,
    submit,
    retry: save,
  };
}