
const features = [
  {
    title: 'One question at a time',
    body: 'Visitors answer in a chat window, so nobody faces a wall of fields. Buttons make Yes/No and multiple choice a single tap.',
  },
  {
    title: 'A simple form builder',
    body: 'Add text, email, multiple choice and Yes/No questions. Reorder them, mark them required and preview before you publish.',
  },
  {
    title: 'Embed with one line',
    body: 'Paste a small script tag into any website and a floating chat button appears. It works on phones and desktops.',
  },
  {
    title: 'Answers are checked',
    body: 'Emails are verified and required questions cannot be skipped, in the chat and again on our server.',
  },
  {
    title: 'Your colors and words',
    body: 'Pick the widget color and write your own welcome and thank-you messages so it sounds like your brand.',
  },
  {
    title: 'Every response saved',
    body: 'See each submission with the time it arrived. Unpublish a form at any time and the widget stops accepting answers.',
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <h2 className="max-w-xl font-serif text-3xl font-semibold text-slate-900">Everything you need to collect answers</h2>
        <dl className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="border-t border-slate-300 pt-4">
              <dt className="font-medium text-slate-900">{f.title}</dt>
              <dd className="mt-2 max-w-md leading-relaxed text-slate-600">{f.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}