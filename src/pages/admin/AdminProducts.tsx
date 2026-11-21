import { useState, type FormEvent } from 'react';
import type { Category, Product } from '../../types';

type AdminProductsProps = {
  products: Product[];
  categories: Category[];
  onSave: (p: Partial<Product>) => Promise<boolean | void>;
  onDelete: (id: string) => void;
  onUpload: (file: File) => Promise<string>;
  onNotice: (msg: string) => void;
};

export function AdminProducts({ products, categories, onSave, onDelete, onUpload, onNotice }: AdminProductsProps) {
  const [editing, setEditing] = useState<Partial<Product>>({ published: true });
  const [specKey, setSpecKey] = useState('');
  const [specVal, setSpecVal] = useState('');
  const [featureLine, setFeatureLine] = useState('');
  const [applicationLine, setApplicationLine] = useState('');
  const [docLabel, setDocLabel] = useState('');
  const [docUrl, setDocUrl] = useState('');

  const categoryOptions =
    categories.length > 0 ? categories.map((c) => c.name) : [...new Set(products.map((p) => p.category))];

  async function submit(e: FormEvent) {
    e.preventDefault();
    const ok = await onSave(editing);
    if (ok) setEditing({ published: true });
  }

  function addSpec() {
    if (!specKey.trim()) return;
    setEditing((v) => ({ ...v, specs: { ...(v.specs || {}), [specKey]: specVal } }));
    setSpecKey('');
    setSpecVal('');
  }

  function addFeature() {
    if (!featureLine.trim()) return;
    setEditing((v) => ({ ...v, features: [...(v.features || []), featureLine.trim()] }));
    setFeatureLine('');
  }

  function addApplication() {
    if (!applicationLine.trim()) return;
    setEditing((v) => ({ ...v, applications: [...(v.applications || []), applicationLine.trim()] }));
    setApplicationLine('');
  }

  function addDocument() {
    if (!docLabel.trim() || !docUrl.trim()) return;
    setEditing((v) => ({
      ...v,
      documents: [...(v.documents || []), { label: docLabel.trim(), url: docUrl.trim() }],
    }));
    setDocLabel('');
    setDocUrl('');
  }

  return (
    <div className="grid lg:grid-cols-2 gap-10">
      <section>
        <h2 className="text-2xl font-black mb-5">Manage products</h2>
        <form onSubmit={submit} className="grid gap-3 p-6 bg-white border">
          <h3 className="text-xl font-bold">{editing.id ? 'Edit' : 'Add'} product</h3>
          {(['name', 'slug', 'summary'] as const).map((field) => (
            <label key={field} className="text-sm font-bold capitalize">
              {field}
              <input
                className="field mt-1"
                required={field === 'name'}
                value={editing[field] || ''}
                onChange={(e) => setEditing((v) => ({ ...v, [field]: e.target.value }))}
              />
            </label>
          ))}
          <label className="text-sm font-bold">
            Category
            <select
              className="field mt-1"
              required
              value={editing.category || ''}
              onChange={(e) => setEditing((v) => ({ ...v, category: e.target.value }))}
            >
              <option value="">Select category</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-bold">
            Description
            <textarea
              className="field mt-1"
              rows={3}
              value={editing.description || ''}
              onChange={(e) => setEditing((v) => ({ ...v, description: e.target.value }))}
            />
          </label>
          <label className="text-sm font-bold">
            Display order
            <input
              type="number"
              className="field mt-1"
              value={editing.sort_order ?? 0}
              onChange={(e) => setEditing((v) => ({ ...v, sort_order: Number(e.target.value) }))}
            />
          </label>
          <label className="font-bold text-sm">
            Product photography
            <input
              className="field mt-1"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f)
                  void onUpload(f)
                    .then((url) =>
                      setEditing((v) => ({
                        ...v,
                        image: v.image || url,
                        images: [...(v.images || []), url],
                      })),
                    )
                    .catch((err) => onNotice(err instanceof Error ? err.message : 'Upload failed'));
              }}
            />
          </label>
          {editing.images?.length ? (
            <div className="flex flex-wrap gap-2">
              {editing.images.map((url) => (
                <div key={url} className="relative border p-1">
                  <img src={url} className="h-16 w-16 object-contain" alt="" />
                  <button
                    type="button"
                    className="text-xs text-red-700 block"
                    onClick={() =>
                      setEditing((v) => ({
                        ...v,
                        images: v.images?.filter((u) => u !== url),
                        image: v.image === url ? v.images?.find((u) => u !== url) || '' : v.image,
                      }))
                    }
                  >
                    Remove
                  </button>
                  {editing.image !== url ? (
                    <button type="button" className="text-xs underline" onClick={() => setEditing((v) => ({ ...v, image: url }))}>
                      Set main
                    </button>
                  ) : (
                    <span className="text-xs text-amber-600">Main</span>
                  )}
                </div>
              ))}
            </div>
          ) : null}
          <div className="border p-3 grid gap-2">
            <span className="font-bold text-sm">Specifications</span>
            <div className="flex gap-2">
              <input className="field" placeholder="Key" value={specKey} onChange={(e) => setSpecKey(e.target.value)} />
              <input className="field" placeholder="Value" value={specVal} onChange={(e) => setSpecVal(e.target.value)} />
              <button type="button" className="btn btn-outline text-sm" onClick={addSpec}>
                Add
              </button>
            </div>
            {Object.entries(editing.specs || {}).map(([k, val]) => (
              <div key={k} className="text-sm flex justify-between">
                <span>
                  {k}: {val}
                </span>
                <button
                  type="button"
                  className="text-red-700"
                  onClick={() => {
                    const next = { ...(editing.specs || {}) };
                    delete next[k];
                    setEditing((v) => ({ ...v, specs: next }));
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="border p-3 grid gap-2">
            <span className="font-bold text-sm">Features</span>
            <div className="flex gap-2">
              <input className="field" value={featureLine} onChange={(e) => setFeatureLine(e.target.value)} />
              <button type="button" className="btn btn-outline text-sm" onClick={addFeature}>
                Add
              </button>
            </div>
            <ul className="text-sm list-disc pl-4">
              {(editing.features || []).map((f, i) => (
                <li key={i}>
                  {f}{' '}
                  <button
                    type="button"
                    className="text-red-700"
                    onClick={() =>
                      setEditing((v) => ({ ...v, features: v.features?.filter((_, idx) => idx !== i) }))
                    }
                  >
                    remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="border p-3 grid gap-2">
            <span className="font-bold text-sm">Applications</span>
            <div className="flex gap-2">
              <input className="field" value={applicationLine} onChange={(e) => setApplicationLine(e.target.value)} />
              <button type="button" className="btn btn-outline text-sm" onClick={addApplication}>
                Add
              </button>
            </div>
            <ul className="text-sm list-disc pl-4">
              {(editing.applications || []).map((a, i) => (
                <li key={i}>
                  {a}{' '}
                  <button
                    type="button"
                    className="text-red-700"
                    onClick={() =>
                      setEditing((v) => ({ ...v, applications: v.applications?.filter((_, idx) => idx !== i) }))
                    }
                  >
                    remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="border p-3 grid gap-2">
            <span className="font-bold text-sm">Documents (URL)</span>
            <input className="field" placeholder="Label" value={docLabel} onChange={(e) => setDocLabel(e.target.value)} />
            <input className="field" placeholder="https://…" value={docUrl} onChange={(e) => setDocUrl(e.target.value)} />
            <button type="button" className="btn btn-outline text-sm w-fit" onClick={addDocument}>
              Add document
            </button>
          </div>
          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={Boolean(editing.featured)}
              onChange={(e) => setEditing((v) => ({ ...v, featured: e.target.checked }))}
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={Boolean(editing.published)}
              onChange={(e) => setEditing((v) => ({ ...v, published: e.target.checked }))}
            />
            Published (uncheck to archive)
          </label>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-yellow">
              Save product
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setEditing({ published: true })}>
              Clear
            </button>
          </div>
        </form>
      </section>
      <section>
        <h2 className="text-xl font-black mb-4">Catalog ({products.length})</h2>
        <div className="grid gap-2 max-h-[70vh] overflow-y-auto">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-3 bg-white p-3 border">
              <img src={p.image} className="w-14 h-14 object-contain" alt="" />
              <div className="flex-1 text-sm">
                <div className="font-bold">{p.name}</div>
                <div className="text-slate-500">
                  {p.published ? 'Published' : 'Archived'} · order {p.sort_order ?? 0}
                </div>
              </div>
              <button type="button" className="underline text-sm" onClick={() => setEditing(p)}>
                Edit
              </button>
              <button type="button" className="text-red-700 underline text-sm" onClick={() => onDelete(p.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}