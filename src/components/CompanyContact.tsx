import { MapPin, Phone } from 'lucide-react';
import { phoneTel } from '../lib/phone';
import type { SiteSettings } from '../types';

export function CompanyContact({ settings, compact }: { settings: SiteSettings; compact?: boolean }) {
  const phones = [settings.phoneLine, settings.phoneLine2].filter(Boolean);
  if (!settings.addressLine && !phones.length) return null;

  return (
    <div
      className={`rounded-md border border-slate-200 bg-slate-50 text-sm text-slate-700 ${compact ? 'p-3' : 'p-4 md:p-5'}`}
    >
      <p className="font-bold text-[#0b294a] mb-2">NC Elektric — contact</p>
      {settings.addressLine ? (
        <p className="flex gap-2 items-start mb-2">
          <MapPin size={16} className="text-[#f9be24] shrink-0 mt-0.5" aria-hidden />
          <span>{settings.addressLine}</span>
        </p>
      ) : null}
      {phones.length ? (
        <ul className="space-y-1">
          {phones.map((p) => (
            <li key={p}>
              <a
                href={phoneTel(p)}
                className="inline-flex items-center gap-2 font-semibold text-[#0b294a] hover:text-amber-700"
              >
                <Phone size={16} className="text-[#f9be24]" aria-hidden />
                {p}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}