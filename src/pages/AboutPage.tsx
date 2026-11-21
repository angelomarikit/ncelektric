import { PageMeta } from '../components/PageMeta';
import type { QuoteSelection, SiteContentMap } from '../types';

type AboutPageProps = {
  content: SiteContentMap;
  onQuote: (s: NonNullable<QuoteSelection>) => void;
};

export function AboutPage({ content, onQuote }: AboutPageProps) {
  const { about, seo_defaults } = content;
  return (
    <main className="section-pad min-h-[60vh] w-full">
      <PageMeta
        title={`About Us | ${seo_defaults.siteName}`}
        description={about.body.slice(0, 160)}
        path="/about"
      />
      <p className="font-bold text-amber-600 uppercase">NC Elektric</p>
      <h1 className="text-5xl font-black mt-3">{about.title}</h1>
      <p className="mt-7 max-w-3xl text-lg leading-8">{about.body}</p>
      <p className="mt-4 text-sm text-slate-500 italic">{about.draftNotice}</p>
      <button type="button" className="btn btn-yellow mt-8" onClick={() => onQuote({ id: '', name: 'General Inquiry' })}>
        Request Quotation
      </button>
    </main>
  );
}