import { useState } from 'react';
import type { QuoteRecord } from '../../types';

const statuses = ['new', 'in_progress', 'closed'];

export function AdminQuotes({
  quotes,
  onUpdateStatus,
}: {
  quotes: QuoteRecord[];
  onUpdateStatus: (id: string, status: string) => Promise<void>;
}) {
  const [selected, setSelected] = useState<QuoteRecord | null>(null);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-white border divide-y max-h-[75vh] overflow-y-auto">
        {quotes.length === 0 ? (
          <p className="p-6 text-slate-500">No requests received yet.</p>
        ) : (
          quotes.map((q) => (
            <button
              type="button"
              key={q.id}
              className={`w-full text-left p-5 hover:bg-slate-50 ${selected?.id === q.id ? 'bg-amber-50' : ''}`}
              onClick={() => setSelected(q)}
            >
              <strong>{q.product_name}</strong>
              <p className="text-sm">{q.full_name}</p>
              <p className="text-xs text-slate-500">
                {new Date(q.created_at).toLocaleString()} · {q.status}
              </p>
            </button>
          ))
        )}
      </div>
      {selected ? (
        <div className="bg-white border p-6">
          <h2 className="text-xl font-black mb-4">Inquiry detail</h2>
          <dl className="grid gap-2 text-sm">
            <div>
              <dt className="font-bold">Product</dt>
              <dd>{selected.product_name}</dd>
            </div>
            <div>
              <dt className="font-bold">Name</dt>
              <dd>{selected.full_name}</dd>
            </div>
            <div>
              <dt className="font-bold">Company</dt>
              <dd>{selected.company || '—'}</dd>
            </div>
            <div>
              <dt className="font-bold">Email</dt>
              <dd>{selected.email}</dd>
            </div>
            <div>
              <dt className="font-bold">Phone</dt>
              <dd>{selected.phone || '—'}</dd>
            </div>
            <div>
              <dt className="font-bold">Quantity</dt>
              <dd>{selected.quantity || '—'}</dd>
            </div>
            <div>
              <dt className="font-bold">Location</dt>
              <dd>{selected.project_location || '—'}</dd>
            </div>
            <div>
              <dt className="font-bold">Message</dt>
              <dd className="whitespace-pre-wrap">{selected.message || '—'}</dd>
            </div>
          </dl>
          <label className="block mt-6 font-bold text-sm">
            Status
            <select
              className="field mt-2"
              value={selected.status}
              onChange={(e) => {
                const next = e.target.value;
                setSelected({ ...selected, status: next });
                void onUpdateStatus(selected.id, next);
              }}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : (
        <p className="text-slate-500">Select an inquiry to view details.</p>
      )}
    </div>
  );
}