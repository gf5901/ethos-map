type Props = {
  createdAt: string;
  updatedAt: string;
};

function formatIsoDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(d);
}

export function NodeMetaDates({ createdAt, updatedAt }: Props) {
  const updated = formatIsoDate(updatedAt);
  const created = formatIsoDate(createdAt);
  const showBoth = createdAt !== updatedAt;

  return (
    <p className="text-xs text-slate-500 dark:text-slate-500">
      <span className="sr-only">Dataset metadata: </span>
      Updated {updated}
      {showBoth ? ` · Added ${created}` : null}
    </p>
  );
}
