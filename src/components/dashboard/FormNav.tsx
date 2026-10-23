'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function FormNav({ formId }: { formId: string }) {
  const pathname = usePathname();
  const base = `/dashboard/forms/${formId}`;
  const tabs = [
    { href: base, label: 'Builder' },
    { href: `${base}/preview`, label: 'Preview' },
    { href: `${base}/responses`, label: 'Responses' },
    { href: `${base}/embed`, label: 'Share and embed' },
  ];

  return (
    <nav aria-label="Form sections" className="flex gap-1 overflow-x-auto border-b border-slate-200">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? 'page' : undefined}
            className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium ${
              active ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}