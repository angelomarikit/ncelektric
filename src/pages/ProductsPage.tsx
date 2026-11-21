import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SectionShell } from '../components/SectionShell';
import { ProductCard } from '../components/ProductCard';
import { banners } from '../lib/assets';
import type { Category, Product, QuoteSelection, SiteContentMap } from '../types';

type ProductsPageProps = {
  products: Product[];
  categories: Category[];
  content: SiteContentMap;
  onQuote: (s: NonNullable<QuoteSelection>) => void;
};

type SortKey = 'newest' | 'name';

export function ProductsPage({ products, categories, content, onQuote }: ProductsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = searchParams.get('category') || 'All';
  const [category, setCategory] = useState(initial);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [sort, setSort] = useState<SortKey>((searchParams.get('sort') as SortKey) || 'newest');
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    setCategory(searchParams.get('category') || 'All');
    setSearch(searchParams.get('q') || '');
    setSort((searchParams.get('sort') as SortKey) || 'newest');
  }, [searchParams]);

  const categoryNames = useMemo(() => {
    const fromProducts = [...new Set(products.map((p) => p.category))];
    const fromDb = categories.map((c) => c.name);
    return [...new Set([...fromDb, ...fromProducts])];
  }, [products, categories]);

  const results = useMemo(() => {
    let list = products.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        [p.name, p.summary, p.category].join(' ').toLowerCase().includes(search.toLowerCase()),
    );
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else list = [...list].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    return list;
  }, [products, category, search, sort]);

  function syncParams(patch: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams);
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    setSearchParams(next, { replace: true });
  }

  function pickCategory(c: string) {
    setCategory(c);
    syncParams({ category: c === 'All' ? null : c });
    setMobileFilters(false);
  }

  const sidebar = (
    <aside className="catalog-sidebar space-y-5">
      <div className="bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-[#f9be24] text-[#09243d] font-black px-4 py-3 text-sm">Product Categories</div>
        <ul className="divide-y divide-slate-100">
          {['All', ...categoryNames].map((c) => (
            <li key={c}>
              <button
                type="button"
                className={`w-full text-left px-4 py-3 text-sm font-semibold flex justify-between items-center hover:bg-slate-50 ${category === c ? 'text-[#0b294a] bg-amber-50' : 'text-slate-700'}`}
                onClick={() => pickCategory(c)}
              >
                {c}
                <span className="text-slate-400">›</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white border border-slate-200 p-4 shadow-sm">
        <p className="font-black text-sm text-[#0b294a] mb-3">Search products</p>
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            aria-label="Search products"
            className="field pl-9 text-sm"
            placeholder="Search catalog…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              syncParams({ q: e.target.value || null });
            }}
          />
        </label>
        <p className="text-xs text-slate-500 mt-3">Quotation-only catalog — no online checkout.</p>
      </div>
    </aside>
  );

  return (
    <main className="w-full bg-[#f6f8fa]">
      <PageMeta
        title={`Products | ${content.seo_defaults.siteName}`}
        description="Browse electrical equipment, compare specifications, and request quotations."
        path="/products"
        image={banners.catalogHero}
      />
      <section className="relative w-full min-h-[260px] md:min-h-[320px] lg:min-h-[360px] bg-[#0b294a] overflow-hidden">
        <img
          src={banners.catalogHero}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b294a]/98 via-[#0b294a]/72 to-[#0b294a]/25 md:to-transparent" />
        <SectionShell className="relative py-10 md:py-14 lg:py-16 text-white">
          <p className="text-[#f9be24] font-bold text-xs tracking-widest">ELECTRICAL &amp; CONSTRUCTION SUPPLY</p>
          <h1 className="text-3xl md:text-5xl font-black mt-2 max-w-2xl">Reliability in Power and Construction</h1>
          <p className="text-slate-200 mt-4 max-w-2xl text-sm md:text-base">
            Electrical equipment · Industrial supplies · Project sourcing. Browse the catalog and request quotations for
            your project.
          </p>
        </SectionShell>
      </section>

      <SectionShell>
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Products', to: '/products' },
            { label: category === 'All' ? 'All Products' : category },
          ]}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-black text-[#0b294a]">{category === 'All' ? 'All Products' : category}</h2>
            <p className="text-sm text-slate-500 mt-1">
              Showing {results.length} of {products.length} products
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-sm font-semibold bg-white border px-3 py-2 shadow-sm">
              <SlidersHorizontal size={16} />
              Sort
              <select
                className="border-0 bg-transparent font-semibold"
                value={sort}
                onChange={(e) => {
                  const val = e.target.value as SortKey;
                  setSort(val);
                  syncParams({ sort: val === 'newest' ? null : val });
                }}
              >
                <option value="newest">Display order</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </label>
            <button type="button" className="lg:hidden btn btn-outline text-sm" onClick={() => setMobileFilters(true)}>
              <Filter size={16} />
              Filters
            </button>
          </div>
        </div>

        <div className="catalog-layout">
          <div className="hidden lg:block">{sidebar}</div>
          <div className="min-w-0">
            {results.length ? (
              <div className="grid-products">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} onQuote={onQuote} compact />
                ))}
              </div>
            ) : (
              <div className="bg-white border p-10 text-center shadow-sm">
                <p className="font-bold text-lg">No matching products found</p>
                <p className="text-slate-500 mt-2">Try another category or search term.</p>
                <Link to="/collections" className="btn btn-yellow mt-6 inline-flex">
                  Browse collections
                </Link>
              </div>
            )}
          </div>
        </div>
      </SectionShell>

      {mobileFilters ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/60"
            aria-label="Close filters"
            onClick={() => setMobileFilters(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[min(100%,320px)] bg-[#f6f8fa] p-4 overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black">Filters</h3>
              <button type="button" onClick={() => setMobileFilters(false)} aria-label="Close">
                <X />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      ) : null}
    </main>
  );
}