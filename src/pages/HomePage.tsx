import { Link } from 'react-router-dom';
import { Boxes, FileText, ShieldCheck, Truck } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';
import { SectionHeading, SectionShell } from '../components/SectionShell';
import { CategoryCard, ProductCard } from '../components/ProductCard';
import { banners } from '../lib/assets';
import type { Category, Product, QuoteSelection, SiteContentMap } from '../types';

const valueIcons = [ShieldCheck, Boxes, Truck, FileText];

type HomePageProps = {
  products: Product[];
  categories: Category[];
  content: SiteContentMap;
  onQuote: (s: NonNullable<QuoteSelection>) => void;
};

export function HomePage({ products, categories, content, onQuote }: HomePageProps) {
  const { hero, homepage, seo_defaults } = content;
  const featured = products.filter((p) => p.featured).slice(0, 5);

  return (
    <>
      <PageMeta
        title={seo_defaults.defaultTitle}
        description={seo_defaults.defaultDescription}
        path="/"
        image={hero.image}
      />
      <section className="relative w-full min-h-[480px] md:min-h-[620px] lg:min-h-[680px] bg-[#0b294a] overflow-hidden">
        <img
          src={hero.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b294a]/97 via-[#0b294a]/55 to-transparent md:to-[#0b294a]/10" />
        <div className="relative w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-14 md:py-20 lg:py-24 max-w-2xl lg:max-w-3xl">
          <p className="text-[#f9be24] font-bold tracking-[.2em] text-xs md:text-sm">{hero.eyebrow}</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.08] mt-4">
            {hero.headline}
            <span className="block text-[#f9be24] mt-1">{hero.headlineAccent}</span>
          </h1>
          <p className="text-slate-200 mt-6 text-base md:text-lg leading-relaxed">{hero.description}</p>
          <div className="flex flex-wrap gap-3 mt-8 text-xs md:text-sm font-semibold text-white/90">
            {['Electrical Equipment', 'Construction Materials', 'Project Supply'].map((label) => (
              <span key={label} className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#f9be24]" />
                {label}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-10">
            <Link to="/products" className="btn btn-yellow">
              {hero.ctaProducts} →
            </Link>
            <button
              type="button"
              className="btn border-2 border-white text-white bg-transparent hover:bg-white/10"
              onClick={() => onQuote({ id: '', name: 'General Inquiry' })}
            >
              {hero.ctaQuote}
            </button>
          </div>
        </div>
      </section>

      <SectionShell className="section-pad bg-[#f6f8fa]">
        <SectionHeading
          title={homepage.categoriesTitle}
          subtitle={homepage.categoriesSubtitle}
          action={
            <Link to="/collections" className="font-bold text-[#0b294a] hover:text-amber-600 text-sm">
              View All Categories →
            </Link>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
          {categories.map((c) => (
            <CategoryCard
              key={c.id}
              name={c.name}
              description={c.description}
              image={c.image || ''}
              href={`/products?category=${encodeURIComponent(c.name)}`}
            />
          ))}
        </div>
      </SectionShell>

      <SectionShell className="section-pad bg-[#f8fafc]">
        <SectionHeading
          title={homepage.featuredTitle}
          subtitle={homepage.featuredSubtitle}
          action={
            <Link to="/products" className="font-bold text-[#0b294a] hover:text-amber-600 text-sm">
              View All Products →
            </Link>
          }
        />
        {featured.length ? (
          <div className="grid-products is-five">{featured.map((p) => <ProductCard key={p.id} product={p} onQuote={onQuote} />)}</div>
        ) : (
          <p className="text-slate-500">No featured products yet.</p>
        )}
      </SectionShell>

      <section className="w-full relative bg-[#0b294a] text-white overflow-hidden min-h-[420px]">
        <img
          src={banners.valueSection}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#0b294a]/88 md:bg-gradient-to-r md:from-[#0b294a]/95 md:via-[#0b294a]/82 md:to-[#0b294a]/55" />
        <SectionShell className="section-pad relative">
          <SectionHeading title={homepage.valueTitle} subtitle="WHY NC ELEKTRIC" theme="dark" />
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
            {homepage.valueItems.map((item, i) => {
              const Icon = valueIcons[i] ?? ShieldCheck;
              return (
                <div
                  key={item.title}
                  className="value-card backdrop-blur-sm bg-white/10 border border-white/15 p-6 rounded-lg hover:bg-white/15 transition-colors"
                >
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-[#f9be24]/20 text-[#f9be24] mb-4">
                    <Icon size={26} strokeWidth={2.25} />
                  </div>
                  <h3 className="font-bold text-lg text-white">{item.title}</h3>
                  <p className="text-slate-200 text-sm mt-2 leading-relaxed">{item.body}</p>
                </div>
              );
            })}
          </div>
        </SectionShell>
      </section>

      <SectionShell className="section-pad bg-white">
        <div className="grid lg:grid-cols-2 gap-10 items-center w-full">
          <img
            className="w-full max-h-[480px] object-cover border border-slate-200"
            src={homepage.aboutImage}
            alt="Warehouse and industrial materials"
            loading="lazy"
          />
          <div className="relative">
            <div className="powering-accent" aria-hidden />
            <p className="text-[#f9be24] font-bold tracking-widest text-sm">COMPANY OVERVIEW</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#0b294a] mt-3">{homepage.poweringTitle}</h2>
            <p className="text-slate-600 mt-5 leading-relaxed">{homepage.poweringBody}</p>
            <Link className="btn btn-yellow mt-8" to="/about">
              Learn More About Us →
            </Link>
          </div>
        </div>
      </SectionShell>

      <SectionShell className="section-pad bg-[#f9be24]" bleed>
        <div className="w-full flex flex-wrap justify-between gap-5 items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-3xl font-black text-[#09243d]">{homepage.ctaTitle}</h2>
            <p className="text-[#09243d]/90 mt-2">{homepage.ctaBody}</p>
          </div>
          <button type="button" className="btn btn-navy" onClick={() => onQuote({ id: '', name: 'General Inquiry' })}>
            Request Quotation →
          </button>
        </div>
      </SectionShell>
    </>
  );
}