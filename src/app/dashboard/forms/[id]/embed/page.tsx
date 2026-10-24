import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getBaseUrl } from '@/lib/base-url';
import { CopyButton } from '@/components/ui/CopyButton';

export default async function EmbedPage({ params }: { params: { id: string } }) {
  const { data: form } = await createClient()
    .from('forms')
    .select('slug, status')
    .eq('id', params.id)
    .maybeSingle();
  if (!form) notFound();

  const base = getBaseUrl();
  const publicUrl = `${base}/f/${form.slug}`;
  const snippet = `<script src="${base}/widget.js" data-form="${form.slug}" async></script>`;
  const published = form.status === 'published';

  return (
    <div className="max-w-2xl space-y-8">
      {!published && (
        <p role="status" className="rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This form is a draft. The link and the widget will only work after you press Publish.
        </p>
      )}

      <section>
        <h2 className="text-base font-semibold text-slate-900">Public link</h2>
        <p className="mt-1 text-sm text-slate-600">Share this link anywhere. It opens the chat on its own page.</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <code className="flex-1 overflow-x-auto rounded-md bg-slate-100 px-3 py-2 text-sm">{publicUrl}</code>
          <CopyButton text={publicUrl} label="Copy link" />
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-slate-900">Website widget</h2>
        <p className="mt-1 text-sm text-slate-600">
          Paste this line into your website, just before the closing body tag. A chat button will appear in the bottom
          right corner.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-start">
          <pre className="flex-1 overflow-x-auto rounded-md bg-slate-900 p-3 text-sm text-slate-100">
            <code>{snippet}</code>
          </pre>
          <CopyButton text={snippet} label="Copy code" />
        </div>
        <p className="mt-3 text-sm text-slate-600">
          To put the button on the left, add <code className="rounded bg-slate-100 px-1">data-position=&quot;left&quot;</code>{' '}
          to the tag. Change the color and welcome text in the{' '}
          <Link href={`/dashboard/forms/${params.id}`} className="text-teal-700 underline">
            Builder
          </Link>
          .
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-slate-900">Test it</h2>
        <p className="mt-1 text-sm text-slate-600">
          Open a sample website that has your widget installed. To test on a real external site, paste the snippet into
          any HTML file.
        </p>
        <Link
          href={`/demo-site.html?form=${form.slug}`}
          target="_blank"
          className="mt-3 inline-block text-sm text-teal-700 underline"
        >
          Open the test website
        </Link>
      </section>
    </div>
  );
}