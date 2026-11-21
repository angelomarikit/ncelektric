import { Link } from 'react-router-dom';
import { ArrowRight, FileSearch } from 'lucide-react';
import type { Product, QuoteSelection } from '../types';

type ProductCardProps = {
  product: Product;
  onQuote: (selection: NonNullable<QuoteSelection>) => void;
  compact?: boolean;
};

export function ProductCard({ product, onQuote, compact }: ProductCardProps) {
  return (
    <article className="product-card group flex flex-col h-full rounded-lg border border-slate-200/80 bg-white shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300">
      <Link
        to={`/products/${product.slug}`}
        className={`product-media block relative overflow-hidden bg-slate-100 ${compact ? 'product-media-compact' : 'product-media-standard'}`}
      >
        <img
          className="product-media-img"
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
        />
        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-white/95 text-[#0b294a] px-2.5 py-1 rounded shadow-sm">
          {product.category}
        </span>
      </Link>
      <div className="p-4 md:p-5 flex flex-col flex-1 gap-2">
        <Link
          className="text-base font-bold text-[#0b294a] leading-snug line-clamp-2 group-hover:text-[#17456d] transition-colors"
          to={`/products/${product.slug}`}
        >
          {product.name}
        </Link>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">{product.summary}</p>
        <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            className="btn btn-yellow btn-card-primary w-full"
            onClick={() => onQuote({ id: product.id, name: product.name })}
          >
            Request Quote
          </button>
          <Link className="btn btn-card-secondary w-full" to={`/products/${product.slug}`}>
            <FileSearch size={16} />
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

function isCategoryPhoto(src: string) {
  return src.includes('/categories/photos/') || src.endsWith('.jpg') || src.includes('image(20');
}

export function CategoryCard({
  name,
  description,
  image,
  href,
}: {
  name: string;
  description?: string;
  image: string;
  href: string;
}) {
  const photo = isCategoryPhoto(image);
  return (
    <Link
      to={href}
      className="category-card group w-full bg-white border border-slate-200 rounded-lg hover:border-[#f9be24]/80 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      <div className={`category-art-wrap ${photo ? 'category-art-photo' : ''}`}>
        <img src={image} className={photo ? 'category-art-cover' : 'category-art'} alt={name} loading="lazy" />
        {photo ? <span className="category-photo-accent" aria-hidden /> : null}
      </div>
      <div className="p-4 md:p-5 border-t border-slate-100 flex flex-col flex-1">
        <div className="flex justify-between items-center gap-2 font-bold text-[#0b294a] text-base md:text-lg">
          <span>{name}</span>
          <ArrowRight className="text-[#f9be24] shrink-0 group-hover:translate-x-0.5 transition-transform" size={18} />
        </div>
        {description ? <p className="text-sm text-slate-500 mt-2 line-clamp-2 flex-1">{description}</p> : null}
        <span className="text-sm font-bold text-[#f9be24] mt-3 inline-block">View Products</span>
      </div>
    </Link>
  );
}