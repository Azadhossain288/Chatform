import Link from 'next/link';
import { buttonClass } from '@/components/ui/Button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-serif text-xl font-semibold text-teal-800">
          ChatForm
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <a href="#features" className="hover:text-slate-900">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-slate-900">
            How it works
          </a>
          <a href="#demo" className="hover:text-slate-900">
            Live demo
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className={buttonClass('ghost')}>
            Log in
          </Link>
          <Link href="/signup" className={buttonClass('primary')}>
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}