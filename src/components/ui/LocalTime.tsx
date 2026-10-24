'use client';

import { useEffect, useState } from 'react';

// Nijer timezone e shomoy dekhay (server ar browser er mismatch ray na)
export function LocalTime({ iso }: { iso: string }) {
  const [text, setText] = useState(`${iso.replace('T', ' ').slice(0, 16)} UTC`);

  useEffect(() => {
    setText(new Date(iso).toLocaleString());
  }, [iso]);

  return <time dateTime={iso}>{text}</time>;
}