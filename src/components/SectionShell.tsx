import type { ReactNode } from 'react';

export function SectionShell({
  children,
  className = '',
  bleed = false,
}: {
  children: ReactNode;
  className?: string;
  bleed?: boolean;
}) {
  return (
    <section className={`w-full ${className}`}>
      <div className={bleed ? 'w-full' : 'w-full px-4 sm:px-6 lg:px-10 xl:px-14'}>{children}</div>
    </section>
  );
}

export function SectionHeading({
  title,
  subtitle,
  action,
  theme = 'light',
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  theme?: 'light' | 'dark';
}) {
  const titleClass = theme === 'dark' ? 'text-white' : 'text-[#0b294a]';
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div className="flex gap-4 items-start">
        <span className="w-1.5 min-h-[3rem] bg-[#f9be24] shrink-0 rounded-sm" aria-hidden />
        <div>
          {subtitle ? <p className="text-[#f9be24] font-bold text-xs tracking-widest uppercase">{subtitle}</p> : null}
          <h2 className={`text-2xl md:text-3xl font-black mt-1 ${titleClass}`}>{title}</h2>
        </div>
      </div>
      {action}
    </div>
  );
}