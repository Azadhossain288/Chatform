import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getFormsWithCounts } from '@/lib/forms';
import { buttonClass } from '@/components/ui/Button';
import { FormList } from '@/components/dashboard/FormList';
import { StatsCards } from '@/components/dashboard/StatsCards';

export const metadata = { title: 'Dashboard - ChatForm' };

export default async function DashboardPage() {
  const forms = await getFormsWithCounts(createClient());

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-semibold">Your forms</h1>
        <Link href="/dashboard/forms/new" className={buttonClass('primary')}>
          New form
        </Link>
      </div>

      <StatsCards
        totalForms={forms.length}
        publishedForms={forms.filter((f) => f.status === 'published').length}
        totalResponses={forms.reduce((sum, f) => sum + f.response_count, 0)}
      />

      <FormList forms={forms} />
    </div>
  );
}