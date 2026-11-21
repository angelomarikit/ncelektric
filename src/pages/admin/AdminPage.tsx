import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { backendReady, supabase } from '../../lib/supabase';
import { localImages, normalizeProduct } from '../../data/defaults';
import type { Category, Product, QuoteRecord, SiteContentMap } from '../../types';
import { defaultSiteContent } from '../../data/defaults';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminContent } from './AdminContent';
import { AdminQuotes } from './AdminQuotes';

export type AdminTab = 'dashboard' | 'products' | 'collections' | 'content' | 'quotes';

export function AdminPage() {
  const [session, setSession] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [tab, setTab] = useState<AdminTab>('dashboard');
  const [notice, setNotice] = useState('');
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [quotes, setQuotes] = useState<QuoteRecord[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContentMap>(defaultSiteContent);
  const nav = useNavigate();

  async function load() {
    if (!supabase) return;
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      setSession(false);
      return;
    }
    setSession(true);
    const check = await supabase.from('admin_users').select('user_id').eq('user_id', user.data.user.id).maybeSingle();
    if (!check.data) {
      setAuthorized(false);
      return;
    }
    setAuthorized(true);
    const [ps, qs, cats, contentRows] = await Promise.all([
      supabase.from('products').select('*').order('sort_order', { ascending: true }),
      supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100),
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('site_content').select('id,payload'),
    ]);
    if (ps.data) setItems(ps.data.map((r) => normalizeProduct(r as Record<string, unknown>)));
    if (qs.data) setQuotes(qs.data as QuoteRecord[]);
    if (cats.data)
      setCategories(
        cats.data.map((r) => ({
          id: String(r.id),
          name: String(r.name),
          slug: String(r.slug),
          description: String(r.description ?? ''),
          image: r.image ? String(r.image) : null,
          sort_order: Number(r.sort_order ?? 0),
        })),
      );
    if (contentRows.data?.length) {
      setSiteContent((prev) => {
        const next = { ...prev };
        for (const row of contentRows.data) {
          const id = row.id as keyof SiteContentMap;
          if (id in next) {
            (next as Record<string, unknown>)[id] = { ...(next[id] as object), ...(row.payload as object) };
          }
        }
        return next;
      });
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function logout() {
    await supabase?.auth.signOut();
    nav('/');
    window.location.reload();
  }

  async function uploadProductImage(file: File, bucket = 'product-media') {
    if (!supabase) throw new Error('No Supabase');
    const path = `products/${crypto.randomUUID()}-${file.name.replace(/[^\w.-]/g, '_')}`;
    const result = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
    if (result.error) throw result.error;
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }

  async function saveProduct(editing: Partial<Product>) {
    if (!supabase) return false;
    const slug = (editing.slug || editing.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '').replace(/^-|-$/g, '');
    const values = {
      name: editing.name,
      slug,
      category: editing.category,
      summary: editing.summary || '',
      description: editing.description || '',
      image: editing.image || localImages[0],
      images: editing.images?.length ? editing.images : [editing.image || localImages[0]],
      specs: editing.specs || {},
      features: editing.features || [],
      applications: editing.applications || [],
      documents: editing.documents || [],
      featured: Boolean(editing.featured),
      published: Boolean(editing.published),
      sort_order: editing.sort_order ?? 0,
    };
    const result = editing.id
      ? await supabase.from('products').update(values).eq('id', editing.id)
      : await supabase.from('products').insert(values);
    setNotice(result.error?.message || 'Product saved.');
    if (!result.error) await load();
    return !result.error;
  }

  async function deleteProduct(id: string) {
    if (!supabase || !window.confirm('Delete this product permanently?')) return;
    const res = await supabase.from('products').delete().eq('id', id);
    setNotice(res.error?.message || 'Product deleted.');
    await load();
  }

  async function saveCategory(cat: Partial<Category>) {
    if (!supabase) return;
    const slug = (cat.slug || cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '').replace(/^-|-$/g, '');
    const values = {
      name: cat.name,
      slug,
      description: cat.description || '',
      image: cat.image,
      sort_order: cat.sort_order ?? 0,
    };
    const result = cat.id
      ? await supabase.from('categories').update(values).eq('id', cat.id)
      : await supabase.from('categories').insert(values);
    setNotice(result.error?.message || 'Category saved.');
    if (!result.error) await load();
  }

  async function deleteCategory(id: string) {
    if (!supabase || !window.confirm('Delete this category?')) return;
    const res = await supabase.from('categories').delete().eq('id', id);
    setNotice(res.error?.message || 'Category deleted.');
    await load();
  }

  async function saveContentKey(key: keyof SiteContentMap, payload: SiteContentMap[keyof SiteContentMap]) {
    if (!supabase) return;
    const res = await supabase.from('site_content').upsert({ id: key, payload, updated_at: new Date().toISOString() });
    setNotice(res.error?.message || `Saved ${key}.`);
    if (!res.error) await load();
  }

  async function updateQuoteStatus(id: string, status: string) {
    if (!supabase) return;
    const res = await supabase.from('quotes').update({ status }).eq('id', id);
    setNotice(res.error?.message || 'Quote status updated.');
    if (!res.error) await load();
  }

  if (!backendReady) {
    return (
      <main className="section-pad w-full">
        <h1 className="text-3xl font-black">Admin setup required</h1>
        <p className="mt-5 max-w-2xl">
          Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local, run SQL migrations, and grant an admin
          role in public.admin_users.
        </p>
      </main>
    );
  }

  if (!session) {
    return <AdminLogin onSuccess={load} />;
  }

  if (!authorized) {
    return (
      <main className="section-pad w-full">
        <h1 className="text-3xl font-black">Access denied</h1>
        <p>Your account is not on the administrator allowlist.</p>
        <button type="button" className="btn btn-outline mt-5" onClick={logout}>
          Sign out
        </button>
      </main>
    );
  }

  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'products', label: 'Products' },
    { id: 'collections', label: 'Collections' },
    { id: 'content', label: 'Website content' },
    { id: 'quotes', label: 'Quotations' },
  ];

  return (
    <main className="section-pad w-full min-h-[70vh]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <p className="font-bold text-amber-600">CONTENT MANAGEMENT</p>
          <h1 className="text-4xl font-black">Admin</h1>
        </div>
        <button type="button" onClick={logout} className="btn btn-outline">
          Sign out
        </button>
      </div>
      <nav className="flex flex-wrap gap-2 mb-8 border-b pb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`px-4 py-2 rounded font-bold text-sm ${tab === t.id ? 'bg-[#0b294a] text-white' : 'bg-white border'}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>
      {notice ? (
        <p role="status" className="mb-6 p-4 bg-white border text-sm">
          {notice}
        </p>
      ) : null}
      {tab === 'dashboard' ? (
        <AdminDashboard products={items.length} categories={categories.length} quotes={quotes} onNavigate={setTab} />
      ) : null}
      {tab === 'products' ? (
        <AdminProducts
          products={items}
          categories={categories}
          onSave={saveProduct}
          onDelete={deleteProduct}
          onUpload={uploadProductImage}
          onNotice={setNotice}
        />
      ) : null}
      {tab === 'collections' ? (
        <AdminCategories
          categories={categories}
          onSave={saveCategory}
          onDelete={deleteCategory}
          onUpload={async (f) => uploadProductImage(f, 'site-media')}
          onNotice={setNotice}
        />
      ) : null}
      {tab === 'content' ? <AdminContent content={siteContent} onSave={saveContentKey} onUpload={uploadProductImage} /> : null}
      {tab === 'quotes' ? <AdminQuotes quotes={quotes} onUpdateStatus={updateQuoteStatus} /> : null}
    </main>
  );
}