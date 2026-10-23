'use client';

import { useState } from 'react';
import type { Question, QuestionType } from '@/types';

// Builder er state: question add / edit / reorder / delete
export function useFormBuilder(initial: Question[]) {
  const [questions, setQuestions] = useState<Question[]>(initial);

  const add = (type: QuestionType) =>
    setQuestions((qs) => [
      ...qs,
      {
        id: crypto.randomUUID(),
        type,
        label: '',
        options: type === 'choice' ? ['Option 1', 'Option 2'] : null,
        required: true,
      },
    ]);

  const update = (id: string, patch: Partial<Question>) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  const move = (id: string, direction: -1 | 1) =>
    setQuestions((qs) => {
      const from = qs.findIndex((q) => q.id === id);
      const to = from + direction;
      if (from < 0 || to < 0 || to >= qs.length) return qs;
      const copy = [...qs];
      [copy[from], copy[to]] = [copy[to], copy[from]];
      return copy;
    });

  const remove = (id: string) => setQuestions((qs) => qs.filter((q) => q.id !== id));

  return { questions, add, update, move, remove };
}