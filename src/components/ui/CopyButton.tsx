'use client';

import { useState } from 'react';
import { Button } from './Button';

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard block thakle text ta dekha jachhe, haate copy kora jabe
    }
  }

  return (
    <Button variant="secondary" onClick={copy}>
      {copied ? 'Copied' : label}
    </Button>
  );
}