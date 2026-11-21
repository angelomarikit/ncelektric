import { useEffect } from 'react';
import { brand } from '../lib/assets';
import { siteUrl } from '../lib/supabase';

type PageMetaProps = {
  title: string;
  description: string;
  path?: string;
  /** Page-specific share image; defaults to brand OG banner */
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

function absoluteAssetUrl(image: string): string {
  if (image.startsWith('http')) return image;
  return `${siteUrl.replace(/\/$/, '')}${image.startsWith('/') ? image : `/${image}`}`;
}

export function PageMeta({ title, description, path = '/', image, type = 'website', jsonLd }: PageMetaProps) {
  const canonical = `${siteUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  const shareImage = absoluteAssetUrl(image ?? brand.ogImage);

  useEffect(() => {
    document.title = title;
    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', type, true);
    setMeta('og:url', canonical, true);
    setMeta('og:image', shareImage, true);
    setMeta('og:image:alt', 'NC Elektric Construction and Trading Co.', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', shareImage);

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
  }, [title, description, canonical, shareImage, type, jsonLd]);

  return null;
}