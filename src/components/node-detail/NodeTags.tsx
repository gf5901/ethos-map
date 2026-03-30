type Props = { tags: string[] };

export function NodeTags({ tags }: Props) {
  if (!tags.length) return null;
  return (
    <section aria-label="Topics">
      <p className="text-label text-slate-500">Topics</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {tags.map((t) => (
          <li key={t}>
            <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200">
              {t}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
