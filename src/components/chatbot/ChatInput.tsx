'use client';

import { useState } from 'react';

interface Props {
  type: 'text' | 'email';
  color: string;
  onSubmit: (value: string) => void;
}

export function ChatInput({ type, color, onSubmit }: Props) {
  const [value, setValue] = useState('');

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type={type}
        inputMode={type === 'email' ? 'email' : 'text'}
        autoComplete={type === 'email' ? 'email' : 'off'}
        placeholder={type === 'email' ? 'you@example.com' : 'Type your answer...'}
        aria-label="Your answer"
        maxLength={2000}
        autoFocus
        // text-base (16px) dile iPhone e input e zoom hoy na
        className="min-w-0 flex-1 rounded-full border border-slate-300 px-4 py-2 text-base focus:border-slate-500 focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Send"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{ backgroundColor: color }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
          <path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12 2-12 2z" />
        </svg>
      </button>
    </form>
  );
}