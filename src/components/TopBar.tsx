import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { phoneTel } from '../lib/phone';
import type { SiteSettings } from '../types';

export function TopBar({ settings }: { settings: SiteSettings }) {
  const phones = [settings.phoneLine, settings.phoneLine2].filter(Boolean);
  return (
    <div className="w-full bg-[#071d34] text-white text-xs md:text-sm border-b border-white/10">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-2 flex flex-wrap justify-between gap-3">
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-slate-300">
          {settings.addressLine ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} className="text-[#f9be24]" aria-hidden />
              {settings.addressLine}
            </span>
          ) : null}
          {phones.map((p) => (
            <a key={p} href={phoneTel(p)} className="inline-flex items-center gap-1.5 hover:text-white">
              <Phone size={14} className="text-[#f9be24]" aria-hidden />
              {p}
            </a>
          ))}
          {settings.emailLine ? (
            <a href={`mailto:${settings.emailLine}`} className="inline-flex items-center gap-1.5 hover:text-white">
              <Mail size={14} className="text-[#f9be24]" aria-hidden />
              {settings.emailLine}
            </a>
          ) : null}
        </div>
        <div className="flex gap-4 text-slate-300">
          <Link to="/contact" className="hover:text-white">
            Help &amp; Support
          </Link>
          <Link to="/products" className="hover:text-white">
            Product catalog
          </Link>
        </div>
      </div>
    </div>
  );
}