import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FileText, MessageSquare } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SectionShell } from '../components/SectionShell';
import { ProductCard } from '../components/ProductCard';
import { SpecTable } from '../components/SpecTable';
import { siteUrl } from '../lib/supabase';
import type { Product, QuoteSelection, SiteContentMap } from '../types';

type ProductDetailPageProps = {
  products: Product[];
  content: SiteContentMap;
  onQuote: (s: NonNullable<QuoteSelection>) => void;
};

export function ProductDetailPage({ products, content, onQuote }: ProductDetailPageProps) {
  const { slug } = useParams();
  const product = products.find((x) => x.slug === slug);
  const [image, setImage] = useState('');

  useEffect(() => setImage(''), [slug]);

  if (!product) {
    return (
      <main className="section-pad w-full">
        <h1 className="text-3xl font-bold">Product not found</h1>
        <Link to="/products" className="text-amber-600 font-bold mt-4 inline-block">
          Return to catalog
        </Link>
      </main>
    );
  }

  const gallery = product.images.length ? product.images : [product.image];
  const active = image || product.image;
  const related = products.filter((x) => x.id !== product.id && x.category === product.category).slice(0, 4);
  const fallbackRelated = related.length ? related : products.filter((x) => x.id !== product.id).slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.summary,
    image: product.image.startsWith('http') ? product.image : `${siteUrl}${product.image}`,
    category: product.category,
  };

  return (
    <main className="w-full bg-[#f6f8fa]">
      <PageMeta
        title={`${product.name} | ${content.seo_defaults.siteName}`}
        description={product.summary}
        path={`/products/${product.slug}`}
        image={product.image}
        type="product"
        jsonLd={jsonLd}
      />
      <SectionShell className="pt-4">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Products', to: '/products' },
            { label: product.category, to: `/products?category=${encodeURIComponent(product.category)}` },
            { label: product.name },
          ]}
        />
      </SectionShell>

      <SectionShell className="pb-12">
        <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-8 lg:gap-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-2 order-2 sm:order-1 overflow-x-auto sm:overflow-visible">
              {gallery.map((url, i) => (
                <button
                  key={url + i}
                  type="button"
                  onClick={() => setImage(url)}
                  className={`shrink-0 border-2 bg-white p-1 ${active === url ? 'border-[#f9be24]' : 'border-slate-200'}`}
                >
                  <img className="w-16 h-16 sm:w-20 sm:h-20 object-contain" src={url} alt={`View ${i + 1}`} loading="lazy" />
                </button>
              ))}
            </div>
            <div className="flex-1 order-1 sm:order-2 bg-white border border-slate-200 p-4 md:p-8 min-h-[320px] md:min-h-[480px] flex items-center justify-center">
              <img src={active} alt={product.name} className="w-full max-h-[520px] object-contain" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
            <span className="inline-block text-xs font-black uppercase tracking-wider bg-slate-100 text-[#0b294a] px-3 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-[#0b294a] mt-4">{product.name}</h1>
            <p className="text-slate-600 mt-4 leading-relaxed">{product.summary}</p>
            <p className="mt-4 text-sm text-slate-700 leading-7">{product.description}</p>
            <p className="mt-3 text-sm font-semibold text-amber-700">Pricing on request — submit a quotation inquiry.</p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                type="button"
                className="btn btn-yellow w-full sm:w-auto flex-1"
                onClick={() => onQuote({ id: product.id, name: product.name })}
              >
                Request for Quotation →
              </button>
              <button
                type="button"
                className="btn btn-outline w-full sm:w-auto flex-1"
                onClick={() => onQuote({ id: product.id, name: product.name })}
              >
                <MessageSquare size={18} />
                Inquiry / Request Quote
              </button>
            </div>

            {product.features.length > 0 ? (
              <div className="mt-10 border-t pt-6">
                <h2 className="text-lg font-black text-[#0b294a] mb-3">Features</h2>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                  {product.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {product.applications.length > 0 ? (
              <div className="mt-8 border-t pt-6">
                <h2 className="text-lg font-black text-[#0b294a] mb-3">Applications</h2>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                  {product.applications.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-8 border-t pt-6">
              <h2 className="text-lg font-black text-[#0b294a] mb-4">Technical Specifications</h2>
              <SpecTable specs={product.specs} />
            </div>

            <div className="mt-8 border-t pt-6">
              <h2 className="text-lg font-black text-[#0b294a] mb-3">Technical Documents</h2>
              {product.documents.length ? (
                <ul className="space-y-2">
                  {product.documents.map((doc) => (
                    <li key={doc.url}>
                      <a
                        href={doc.url}
                        className="inline-flex items-center gap-2 font-bold text-[#0b294a] hover:text-amber-600 text-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText size={16} />
                        {doc.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 text-sm">Documents pending — upload in admin when available.</p>
              )}
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell className="section-pad bg-white border-t">
        <h2 className="text-2xl font-black text-[#0b294a] mb-6">Related Products</h2>
        <div className="grid-products">
          {fallbackRelated.map((item) => (
            <ProductCard key={item.id} product={item} onQuote={onQuote} compact />
          ))}
        </div>
      </SectionShell>
    </main>
  );
}