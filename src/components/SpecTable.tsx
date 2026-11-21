type SpecTableProps = { specs: Record<string, string> };

export function SpecTable({ specs }: SpecTableProps) {
  const entries = Object.entries(specs);
  if (!entries.length) {
    return (
      <p className="text-slate-500 text-sm">
        Specifications pending — add verified technical data in the admin catalog.
      </p>
    );
  }
  return (
    <div className="divide-y border-t border-slate-200">
      {entries.map(([key, val]) => (
        <div className="flex justify-between gap-5 py-3" key={key}>
          <b className="text-slate-800">{key}</b>
          <span className="text-right text-slate-600">{val}</span>
        </div>
      ))}
    </div>
  );
}