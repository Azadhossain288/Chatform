export type QuestionType = 'text' | 'email' | 'choice' | 'yesno';
export type FormStatus = 'draft' | 'published';

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  options: string[] | null;
  required: boolean;
}

export interface FormSettings {
  title: string;
  welcome_message: string;
  completion_message: string;
  theme_color: string;
}

// Public chat widget ja chay (owner er info thake na)
export interface PublicForm extends FormSettings {
  slug: string;
  questions: Question[];
}

export interface FormSummary {
  id: string;
  title: string;
  slug: string;
  status: FormStatus;
  created_at: string;
  response_count: number;
}

export interface ResponseRow {
  id: string;
  submitted_at: string;
  answers: { question_id: string; value: string }[];
}