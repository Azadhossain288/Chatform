import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-serif text-lg font-semibold text-teal-800">ChatForm</p>
          <p className="mt-1">Forms that feel like a conversation.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          <a href="#features" className="hover:text-slate-900">Features</a>
          <a href="#how-it-works" className="hover:text-slate-900">How it works</a>
          <a href="#demo" className="hover:text-slate-900">Live demo</a>
          <Link href="/login" className="hover:text-slate-900">Log in</Link>
          <Link href="/signup" className="hover:text-slate-900">Sign up</Link>
        </nav>
        <div>
          <a href="mailto:hello@chatform.example" className="hover:text-slate-900">hello@chatform.example</a>
          <p className="mt-1 text-slate-400">&copy; {new Date().getFullYear()} ChatForm</p>
        </div>
      </div>
    </footer>
  );
}