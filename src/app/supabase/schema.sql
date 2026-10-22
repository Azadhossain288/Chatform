

create extension if not exists "pgcrypto";

-- ---------- Tables ----------
create table if not exists forms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published')),
  welcome_message text not null default 'Hi there! Let us get started.',
  completion_message text not null default 'Thanks! Your response has been recorded.',
  theme_color text not null default '#0f766e',
  created_at timestamptz not null default now()
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references forms(id) on delete cascade,
  type text not null check (type in ('text', 'email', 'choice', 'yesno')),
  label text not null,
  options jsonb,
  required boolean not null default true,
  position int not null default 0
);

create table if not exists responses (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references forms(id) on delete cascade,
  submitted_at timestamptz not null default now()
);

create table if not exists answers (
  id uuid primary key default gen_random_uuid(),
  response_id uuid not null references responses(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  value text not null default ''
);

create index if not exists forms_owner_idx on forms(owner_id);
create index if not exists questions_form_idx on questions(form_id, position);
create index if not exists responses_form_idx on responses(form_id, submitted_at desc);
create index if not exists answers_response_idx on answers(response_id);

-- ---------- Row Level Security ----------
alter table forms enable row level security;
alter table questions enable row level security;
alter table responses enable row level security;
alter table answers enable row level security;

create policy "owners manage their forms" on forms
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "owners manage their questions" on questions
  for all
  using (exists (select 1 from forms f where f.id = questions.form_id and f.owner_id = auth.uid()))
  with check (exists (select 1 from forms f where f.id = questions.form_id and f.owner_id = auth.uid()));

create policy "owners read their responses" on responses
  for select
  using (exists (select 1 from forms f where f.id = responses.form_id and f.owner_id = auth.uid()));

create policy "owners read their answers" on answers
  for select
  using (exists (
    select 1 from responses r join forms f on f.id = r.form_id
    where r.id = answers.response_id and f.owner_id = auth.uid()
  ));