import { useState, type FormEvent } from 'react';
import type { Category } from '../../types';

export function AdminCategories({
  categories,
  onSave,
  onDelete,
  onUpload,
  onNotice,
}: {
  categories: Category[];
  onSave: (c: Partial<Category>) => Promise<void>;
  onDelete: (id: string) => void;
  onUpload: (file: File) => Promise<string>;
  onNotice: (msg: string) => void;
}) {
  const [editing, setEditing] = useState<Partial<Category>>({ sort_order: 0 });

  async function submit(e: FormEvent) {
    e.preventDefault();
    await onSave(editing);
    setEditing({ sort_order: 0 });
  }

  return (
    <div className="grid lg:grid-cols-2 gap-10">
      <form onSubmit={submit} className="grid gap-3 p-6 bg-white border">
        <h2 className="text-xl font-black">{editing.id ? 'Edit' : 'Add'} collection</h2>
        <label className="text-sm font-bold">
          Name
          <input
            className="field mt-1"
            required
            value={editing.name || ''}
            onChange={(e) => setEditing((v) => ({ ...v, name: e.target.value }))}
          />
        </label>
        <label className="text-sm font-bold">
          Slug
          <input
            className="field mt-1"
            value={editing.slug || ''}
            onChange={(e) => setEditing((v) => ({ ...v, slug: e.target.value }))}
          />
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
          Sort order
          <input
            type="number"
            className="field mt-1"
            value={editing.sort_order ?? 0}
            onChange={(e) => setEditing((v) => ({ ...v, sort_order: Number(e.target.value) }))}
          />
        </label>
        <label className="text-sm font-bold">
          Collection image
          <input
            className="field mt-1"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f)
                void onUpload(f)
                  .then((url) => setEditing((v) => ({ ...v, image: url })))
                  .catch((err) => onNotice(err instanceof Error ? err.message : 'Upload failed'));
            }}
          />
        </label>
        {editing.image ? <img src={editing.image} alt="" className="h-32 object-contain border" /> : null}
        <div className="flex gap-2">
          <button type="submit" className="btn btn-yellow">
            Save collection
          </button>
          <button type="button" className="btn btn-outline" onClick={() => setEditing({ sort_order: 0 })}>
            Clear
          </button>
        </div>
      </form>
      <div className="grid gap-2">
        {categories.map((c) => (
          <div key={c.id} className="flex gap-3 bg-white border p-3 items-center">
            {c.image ? <img src={c.image} className="w-16 h-16 object-contain" alt="" /> : null}
            <div className="flex-1">
              <div className="font-bold">{c.name}</div>
              <div className="text-xs text-slate-500">{c.description}</div>
            </div>
            <button type="button" className="underline text-sm" onClick={() => setEditing(c)}>
              Edit
            </button>
            <button type="button" className="text-red-700 text-sm underline" onClick={() => onDelete(c.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}