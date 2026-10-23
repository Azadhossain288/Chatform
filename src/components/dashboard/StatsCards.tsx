interface Props {
  totalForms: number;
  publishedForms: number;
  totalResponses: number;
}

export function StatsCards({ totalForms, publishedForms, totalResponses }: Props) {
  const stats = [
    { label: 'Total forms', value: totalForms },
    { label: 'Published', value: publishedForms },
    { label: 'Total responses', value: totalResponses },
  ];

  return (
   
 <dl className="grid grid-cols-1 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {stats.map((s) => (
        <div key={s.label} className="px-5 py-4">
          <dt className="text-sm text-slate-500">{s.label}</dt>
          <dd className="mt-1 font-serif text-3xl text-slate-900">{s.value}</dd>
        </div>
      ))}
    </dl>

  );
}