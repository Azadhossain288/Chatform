const steps = [
  { title: 'Build your form', body: 'Sign up, create a form and add your questions.' },
  { title: 'Publish it', body: 'Press Publish. Your form gets its own public link.' },
  { title: 'Add it to your site', body: 'Copy the script tag and paste it before the closing body tag of your page.' },
  { title: 'Read the answers', body: 'Open the dashboard to see every response and when it was sent.' },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <h2 className="font-serif text-3xl font-semibold text-slate-900">How it works</h2>
      <ol className="mt-10 grid gap-8 md:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.title}>
            <span className="font-serif text-4xl text-teal-700">{i + 1}</span>
            <h3 className="mt-2 font-medium text-slate-900">{s.title}</h3>
            <p className="mt-1 leading-relaxed text-slate-600">{s.body}</p>
          </li>
        ))}
      </ol>
      <pre className="mt-10 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
        <code>{`<script src="https://your-app.com/widget.js" data-form="abc123" async></script>`}</code>
      </pre>
    </section>
  );
}