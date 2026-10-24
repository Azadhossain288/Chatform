import Link from 'next/link';
import { buttonClass } from '@/components/ui/Button';

const transcript = [
  { from: 'bot', text: 'Hi! Which plan are you thinking about?' },
  { from: 'user', text: 'The yearly one' },
  { from: 'bot', text: 'Great choice. Where should we send the details?' },
  { from: 'user', text: 'maya@example.com' },
  { from: 'bot', text: 'Thanks Maya, we will email you within a day.' },
] as const;

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
      <div>
        <h1 className="font-serif text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
          Forms people actually finish, because they feel like a chat.
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
          Write your questions once. ChatForm shows them one at a time in a friendly chat window on your website, and
          keeps every answer in a dashboard you can read.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signup" className={buttonClass('primary', 'px-6 py-3 text-base')}>
            Create your first form
          </Link>
          <a href="#demo" className={buttonClass('secondary', 'px-6 py-3 text-base')}>
            Try the live demo
          </a>
        </div>
      </div>

      <div aria-hidden="true" className="mx-auto w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="space-y-3">
          {transcript.map((m, i) =>
            m.from === 'bot' ? (
              <p key={i} className="max-w-[85%] rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800">
                {m.text}
              </p>
            ) : (
              <p key={i} className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-teal-700 px-4 py-2 text-sm text-white">
                {m.text}
              </p>
            )
          )}
        </div>
      </div>
    </section>
  );
}