# ChatForm

Build a form, publish it, add a friendly chat widget to any website with one line of code, and read the responses in a simple dashboard.

Instead of showing a long form, ChatForm asks the questions **one at a time in a chat window**, which feels more natural and is easier to finish.

**Live demo:** _add your Vercel URL here_
**Test the widget:** _add your Vercel URL_ `/demo-site.html?form=YOUR_SLUG`

## Features

- **Landing page** with hero, features, how it works, a live widget demo and footer
- **Sign up and login** with email and password (Supabase Auth). The dashboard is protected
- **Dashboard** with total forms, published forms and total responses. Create, edit, delete, publish and unpublish forms
- **Form builder** with text, email, multiple choice and yes/no questions. Reorder, delete, mark as required, preview before publishing
- **Chat widget** that shows one question at a time, with text input, answer buttons, validation, welcome and completion messages, and a custom color
- **Public link** for every form (`/f/<slug>`) and an **embeddable floating widget** (`/widget.js`) that works on desktop and mobile
- **Responses** saved in PostgreSQL and shown in the dashboard with timestamps

AI features, payments and subscriptions are out of scope for this MVP.

## Tech stack

| Part | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Next.js API routes |
| Database and auth | Supabase (PostgreSQL + Auth) |
| Validation | Zod (shared by the chat UI and the server) |
| Version control | Git and GitHub |

## Getting started

### 1. Requirements

- Node.js 18 or newer
- A free [Supabase](https://supabase.com) account

### 2. Install

```bash
git clone https://github.com/YOUR-USERNAME/chatform.git
cd chatform
npm install
```

### 3. Set up the database

1. Create a new project in Supabase
2. Open **SQL Editor**, paste the contents of `supabase/schema.sql` and click **Run**
3. Open **Authentication > Providers > Email** and turn off **Confirm email** (this makes local testing easier)

### 4. Environment variables

Copy the example file and fill in the values from **Supabase > Project Settings > API Keys**:

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable (anon) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret (service role) key. **Server only. Never commit it** |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` locally, your real URL in production |

### 5. Run

```bash
npm run dev
```

Open http://localhost:3000.

## Try the full flow

1. Sign up and open the dashboard
2. Click **New form**, add questions in the builder and click **Save changes**
3. Open the **Preview** tab and try the chat (nothing is saved in preview)
4. Click **Publish**
5. Open **Share and embed** and click **Open the test website**
6. Click the chat button in the bottom right corner and answer the questions
7. Go back to the dashboard and open the **Responses** tab to see the submission

## Embed on any website

After publishing a form, paste this line into your website just before the closing `</body>` tag:

```html
<script src="https://YOUR-APP-URL/widget.js" data-form="YOUR-SLUG" async></script>
```

The slug is the last part of the form's public link (`/f/<slug>`). The **Share and embed** tab shows the complete line ready to copy.

To place the button on the left side, add `data-position="left"`.

## How it works

- `public/widget.js` adds a floating button and an iframe to the host page. The iframe loads `/embed/<slug>` from this app, so the widget's CSS and JavaScript never clash with the host website.
- `next.config.mjs` allows framing only for `/embed/*`. The dashboard sends `X-Frame-Options: DENY`.
- The **owner API** (`/api/forms/...`) requires a login and is protected by Row Level Security in the database.
- The **public API** (`/api/public/forms/...`) only returns forms that are **published**. It uses the service role key on the server and never exposes it to the browser.
- Answers are validated twice: in the chat for instant feedback and again on the server for security. Both use the same function in `src/lib/validations/response.ts`.

## API

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET, POST | `/api/forms` | owner | List and create forms |
| GET, PATCH, DELETE | `/api/forms/:id` | owner | Read, save and delete a form |
| POST | `/api/forms/:id/publish` | owner | Body: `{ "publish": true }` or `{ "publish": false }` |
| GET | `/api/forms/:id/responses` | owner | List submissions |
| GET | `/api/public/forms/:slug` | public | Get a published form |
| POST | `/api/public/forms/:slug/responses` | public | Submit `{ "answers": { "<questionId>": "text" } }` |

## Database

| Table | Purpose |
|---|---|
| `forms` | Title, unique slug, status (draft or published), messages, theme color |
| `questions` | Questions of a form with type, label, options, required flag and position |
| `responses` | One row per submission, with the submission time |
| `answers` | The answer to each question in a submission |

The full schema, including security policies, is in `supabase/schema.sql`.

## Project structure

```
public/                  widget.js (embed script) and demo-site.html (test website)
supabase/                schema.sql (tables and security policies)
src/app/                 pages and API routes
  (auth)/                login and signup
  dashboard/             dashboard, form builder, preview, responses, share and embed
  f/[slug]/              public form page
  embed/[slug]/          page loaded inside the widget iframe
  api/                   owner API and public API
src/components/          ui, landing, dashboard, builder, chatbot, auth
src/hooks/               useChatFlow, useFormBuilder
src/lib/                 Supabase clients, Zod validations, helpers
src/middleware.ts        protects /dashboard
```

## Deploy to Vercel

1. Push the project to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add the four environment variables. Set `NEXT_PUBLIC_APP_URL` to your Vercel URL (no trailing slash)
4. Deploy. If you change an environment variable later, redeploy so it takes effect

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Check code style |
| `npm run typecheck` | Check TypeScript types |

## Security notes

- Never commit `.env.local`. It is listed in `.gitignore`
- The service role key bypasses database security. Use it only in server code
- Row Level Security makes sure owners can only see their own forms and responses
