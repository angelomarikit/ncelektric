import { PageMeta } from '../components/PageMeta';
import type { QuoteSelection, SiteContentMap } from '../types';

type ContactPageProps = {
  content: SiteContentMap;
  onQuote: (s: NonNullable<QuoteSelection>) => void;
};

export function ContactPage({ content, onQuote }: ContactPageProps) {
  const { contact, seo_defaults } = content;
  return (
    <main className="section-pad min-h-[60vh] w-full">
      <PageMeta
        title={`Contact Us | ${seo_defaults.siteName}`}
        description={contact.body.slice(0, 160)}
        path="/contact"
      />
      <p className="font-bold text-amber-600 uppercase">NC Elektric</p>
      <h1 className="text-5xl font-black mt-3">{contact.title}</h1>
      <p className="mt-7 max-w-3xl text-lg leading-8">{contact.body}</p>
      <p className="mt-4 text-sm text-slate-500 italic">{contact.draftNotice}</p>
      <button type="button" className="btn btn-yellow mt-8" onClick={() => onQuote({ id: '', name: 'General Inquiry' })}>
        Request Quotation
      </button>
    </main>
  );
}