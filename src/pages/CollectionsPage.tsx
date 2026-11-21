import { PageMeta } from '../components/PageMeta';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SectionHeading, SectionShell } from '../components/SectionShell';
import { CategoryCard } from '../components/ProductCard';
import { banners } from '../lib/assets';
import type { Category, Product, SiteContentMap } from '../types';

type CollectionsPageProps = {
  categories: Category[];
  products: Product[];
  content: SiteContentMap;
};

export function CollectionsPage({ categories, products, content }: CollectionsPageProps) {
  return (
    <main className="w-full bg-[#f6f8fa]">
      <PageMeta
        title={`Collections | ${content.seo_defaults.siteName}`}
        description="Explore NC Elektric product collections by category."
        path="/collections"
        image={banners.catalogHero}
      />
      <section className="relative w-full min-h-[220px] md:min-h-[280px] bg-[#0b294a] overflow-hidden">
        <img src={banners.catalogHero} alt="" className="absolute inset-0 w-full h-full object-cover object-center" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b294a]/98 via-[#0b294a]/70 to-[#0b294a]/20" />
        <SectionShell className="relative py-10 text-white">
          <p className="text-[#f9be24] font-bold text-xs tracking-widest">COLLECTIONS</p>
          <h1 className="text-3xl md:text-5xl font-black mt-2">Product Categories</h1>
          <p className="text-slate-200 mt-3 max-w-2xl">
            Browse transformers, cores, structures, crating, and construction materials.
          </p>
        </SectionShell>
      </section>
      <SectionShell>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Collections' }]} />
        <SectionHeading title="Shop by Category" subtitle="ALL COLLECTIONS" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
          {categories.map((c) => (
            <CategoryCard
              key={c.id}
              name={c.name}
              description={c.description}
              image={c.image || products.find((p) => p.category === c.name)?.image || ''}
              href={`/products?category=${encodeURIComponent(c.name)}`}
            />
          ))}
        </div>
      </SectionShell>
    </main>
  );
}