'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function PublishButton({ formId, published }: { formId: string; published: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/forms/${formId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publish: !published }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Something went wrong.');
      } else {
        router.refresh();
      }
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end">
      <Button variant={published ? 'secondary' : 'primary'} onClick={toggle} disabled={loading}>
        {loading ? 'Working...' : published ? 'Unpublish' : 'Publish'}
      </Button>
      {error && (
        <p role="alert" className="mt-1 max-w-[220px] text-right text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}