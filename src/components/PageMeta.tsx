import { useEffect } from 'react';
import { siteUrl } from '../lib/supabase';

type PageMetaProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'product';
  jsonLd?: Record<string, unknown>;
};

function setMeta(name: string, content: string, property = false) {
  const attr = property ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function PageMeta({ title, description, path = '/', image, type = 'website', jsonLd }: PageMetaProps) {
  const canonical = `${siteUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  const ogImage = image?.startsWith('http') ? image : image ? `${siteUrl.replace(/\/$/, '')}${image}` : undefined;

  useEffect(() => {
    document.title = title;
    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', type, true);
    setMeta('og:url', canonical, true);
    if (ogImage) setMeta('og:image', ogImage, true);

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonical;

    const scriptId = 'nc-json-ld';
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, canonical, ogImage, type, jsonLd]);

  return null;
}