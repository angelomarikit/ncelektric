import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { brand } from '../lib/assets';
import type { QuoteSelection } from '../types';

type HeaderProps = {
  onQuote: (selection: NonNullable<QuoteSelection>) => void;
};

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `relative py-1 font-semibold text-[#0b294a] hover:text-[#17456d] ${isActive ? 'text-[#0b294a] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-[#f9be24]' : ''}`;

export function Header({ onQuote }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 h-[72px] md:h-20 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center shrink-0 min-w-0 max-w-[min(100%,280px)]">
          <img
            src={brand.logo}
            alt="NC Elektric Construction and Trading Co."
            className="h-11 md:h-14 w-auto max-w-full object-contain object-left"
            width={280}
            height={56}
          />
        </Link>
        <nav className="hidden lg:flex items-center gap-8 text-sm">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/collections" className={linkClass}>
            Collections
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About Us
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact Us
          </NavLink>
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <button type="button" className="btn btn-yellow text-sm" onClick={() => onQuote({ id: '', name: 'General Inquiry' })}>
            Request for Quotation
          </button>
        </div>
        <button
          type="button"
          className="lg:hidden p-2 text-[#0b294a]"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {open ? (
        <nav
          className="lg:hidden px-4 pb-5 flex flex-col gap-4 border-t bg-white"
          onClick={() => setOpen(false)}
        >
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/collections" className={linkClass}>
            Collections
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About Us
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact Us
          </NavLink>
          <button type="button" className="btn btn-yellow w-full" onClick={() => onQuote({ id: '', name: 'General Inquiry' })}>
            Request for Quotation
          </button>
        </nav>
      ) : null}
    </header>
  );
}