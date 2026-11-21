import { Link } from 'react-router-dom';
import { brand } from '../lib/assets';
import type { FooterContent, QuoteSelection } from '../types';

type FooterProps = {
  footer: FooterContent;
  categories?: string[];
  onQuote: (selection: NonNullable<QuoteSelection>) => void;
};

export function Footer({ footer, onQuote, categories = [] }: FooterProps) {
  return (
    <footer className="w-full bg-[#071d34] text-white">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 section-pad !pb-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="inline-block bg-white rounded px-3 py-2 mb-4">
              <img src={brand.logo} alt="NC Elektric" className="h-10 w-auto max-w-[220px] object-contain" />
            </div>
            <p className="text-sm text-slate-400">{footer.tagline}</p>
          </div>
          <nav className="flex flex-col gap-2 text-sm">
            <span className="font-bold text-slate-200 mb-1">Navigation</span>
            <Link to="/" className="text-slate-300 hover:text-white">
              Home
            </Link>
            <Link to="/products" className="text-slate-300 hover:text-white">
              Products
            </Link>
            <Link to="/collections" className="text-slate-300 hover:text-white">
              Collections
            </Link>
            <Link to="/about" className="text-slate-300 hover:text-white">
              About Us
            </Link>
            <Link to="/contact" className="text-slate-300 hover:text-white">
              Contact Us
            </Link>
          </nav>
          {categories.length > 0 ? (
            <div className="flex flex-col gap-2 text-sm">
              <span className="font-bold text-slate-200 mb-1">Categories</span>
              {categories.slice(0, 8).map((c) => (
                <Link
                  key={c}
                  to={`/products?category=${encodeURIComponent(c)}`}
                  className="text-slate-300 hover:text-white"
                >
                  {c}
                </Link>
              ))}
            </div>
          ) : null}
          <div className="flex flex-col gap-3">
            <span className="font-bold text-slate-200">Product Inquiries</span>
            <p className="text-sm text-slate-400">Request pricing and availability for your project.</p>
            <button type="button" className="btn btn-yellow w-fit" onClick={() => onQuote({ id: '', name: 'General Inquiry' })}>
              Request Quotation
            </button>
            {footer.social.map((s) => (
              <a key={s.url} href={s.url} className="text-sm text-slate-400 hover:text-white" rel="noopener noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <p className="border-t border-white/15 mt-12 pt-6 text-slate-500 text-sm">
          © {new Date().getFullYear()} NC Elektric Construction & Trading Co. {footer.legalNote}
        </p>
      </div>
    </footer>
  );
}