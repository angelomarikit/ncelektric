import type { QuoteRecord } from '../../types';
import type { AdminTab } from './AdminPage';

export function AdminDashboard({
  products,
  categories,
  quotes,
  onNavigate,
}: {
  products: number;
  categories: number;
  quotes: QuoteRecord[];
  onNavigate: (t: AdminTab) => void;
}) {
  const recent = quotes.slice(0, 5);
  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 border">
          <p className="text-slate-500 text-sm">Products</p>
          <strong className="text-3xl">{products}</strong>
        </div>
        <div className="bg-white p-6 border">
          <p className="text-slate-500 text-sm">Collections</p>
          <strong className="text-3xl">{categories}</strong>
        </div>
        <div className="bg-white p-6 border">
          <p className="text-slate-500 text-sm">Quote requests</p>
          <strong className="text-3xl">{quotes.length}</strong>
        </div>
      </div>
      <section className="bg-white border p-6">
        <h2 className="text-xl font-black mb-4">Recent quotation requests</h2>
        {recent.length === 0 ? (
          <p className="text-slate-500">No requests yet.</p>
        ) : (
          <ul className="divide-y">
            {recent.map((q) => (
              <li key={q.id} className="py-3 text-sm">
                <strong>{q.product_name}</strong> — {q.full_name} ({q.status})
              </li>
            ))}
          </ul>
        )}
        <button type="button" className="btn btn-outline mt-4 text-sm" onClick={() => onNavigate('quotes')}>
          Manage quotations
        </button>
      </section>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn btn-yellow" onClick={() => onNavigate('products')}>
          Add product
        </button>
        <button type="button" className="btn btn-outline" onClick={() => onNavigate('content')}>
          Edit homepage
        </button>
      </div>
    </div>
  );
}