export type ProductDocument = { label: string; url: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  image: string;
  images: string[];
  specs: Record<string, string>;
  features: string[];
  applications: string[];
  documents: ProductDocument[];
  featured: boolean;
  published: boolean;
  sort_order?: number;
  created_at?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  sort_order: number;
};

export type QuoteSelection = { id: string; name: string } | null;

export type QuoteRecord = {
  id: string;
  product_id: string | null;
  product_name: string;
  full_name: string;
  company: string | null;
  email: string;
  phone: string | null;
  quantity: string | null;
  project_location: string | null;
  message: string | null;
  status: 'new' | 'in_progress' | 'closed' | string;
  created_at: string;
};

export type HeroContent = {
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  description: string;
  image: string;
  ctaProducts: string;
  ctaQuote: string;
};

export type AboutContent = {
  title: string;
  body: string;
  draftNotice: string;
};

export type ContactContent = {
  title: string;
  body: string;
  draftNotice: string;
};

export type FooterContent = {
  tagline: string;
  legalNote: string;
  social: { label: string; url: string }[];
};

export type SeoDefaults = {
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
};

export type SiteSettings = {
  addressLine: string;
  phoneLine: string;
  emailLine: string;
};

export type HomepageContent = {
  categoriesTitle: string;
  categoriesSubtitle: string;
  featuredTitle: string;
  featuredSubtitle: string;
  aboutTitle: string;
  aboutBody: string;
  aboutImage: string;
  ctaTitle: string;
  ctaBody: string;
  valueTitle: string;
  valueItems: { title: string; body: string }[];
  poweringTitle: string;
  poweringBody: string;
};

export type SiteContentMap = {
  hero: HeroContent;
  homepage: HomepageContent;
  about: AboutContent;
  contact: ContactContent;
  footer: FooterContent;
  seo_defaults: SeoDefaults;
  settings: SiteSettings;
};