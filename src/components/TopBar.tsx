import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SiteSettings } from '../types';

export function TopBar({ settings }: { settings: SiteSettings }) {
  return (
    <div className="w-full bg-[#071d34] text-white text-xs md:text-sm border-b border-white/10">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-2 flex flex-wrap justify-between gap-3">
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-slate-300">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} className="text-[#f9be24]" aria-hidden />
            {settings.addressLine || 'Address — add verified details in admin'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Phone size={14} className="text-[#f9be24]" aria-hidden />
            {settings.phoneLine || 'Phone — add in admin'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Mail size={14} className="text-[#f9be24]" aria-hidden />
            {settings.emailLine || 'Email — add in admin'}
          </span>
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