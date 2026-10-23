import type { Question } from '@/types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Rule = Pick<Question, 'type' | 'required' | 'options'>;

export function validateAnswer(question: Rule, raw: string): string | null {
  const value = raw.trim();

  if (!value) return question.required ? 'This question is required.' : null;
  if (value.length > 2000) return 'Your answer is too long (max 2000 characters).';

  switch (question.type) {
    case 'email':
      return EMAIL_RE.test(value) ? null : 'Please enter a valid email address.';
    case 'yesno':
      return value === 'Yes' || value === 'No' ? null : 'Please choose Yes or No.';
    case 'choice':
      return (question.options ?? []).includes(value) ? null : 'Please choose one of the options.';
    default:
      return null;
  }
}