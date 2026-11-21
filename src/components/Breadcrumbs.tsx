import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

type Crumb = { label: string; to?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500 py-4">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            {i > 0 ? <ChevronRight size={14} className="text-slate-400" /> : null}
            {item.to ? (
              <Link to={item.to} className="hover:text-[#0b294a] font-medium">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-700 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}