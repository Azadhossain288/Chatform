import { z } from 'zod';

export const QUESTION_TYPES = ['text', 'email', 'choice', 'yesno'] as const;

export const questionSchema = z
  .object({
    id: z.string().uuid(),
    type: z.enum(QUESTION_TYPES),
    label: z
      .string()
      .trim()
      .min(1, 'Every question needs a label')
      .max(200, 'Question labels can be at most 200 characters'),
    options: z.array(z.string().trim().min(1).max(100)).max(10, 'At most 10 options').nullable().optional(),
    required: z.boolean(),
  })
  .refine((q) => q.type !== 'choice' || (q.options?.length ?? 0) >= 2, {
    message: 'Multiple choice questions need at least 2 options',
    path: ['options'],
  });

export const formUpdateSchema = z.object({
  title: z.string().trim().min(1, 'Form title is required').max(120, 'Title is too long'),
  welcome_message: z.string().trim().min(1, 'Welcome message is required').max(300, 'Welcome message is too long'),
  completion_message: z
    .string()
    .trim()
    .min(1, 'Completion message is required')
    .max(300, 'Completion message is too long'),
  theme_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Theme color must look like #0f766e'),
  questions: z.array(questionSchema).max(50, 'At most 50 questions'),
});

export const createFormSchema = z.object({
  title: z.string().trim().min(1, 'Form title is required').max(120, 'Title is too long'),
});

export const publishSchema = z.object({ publish: z.boolean() });