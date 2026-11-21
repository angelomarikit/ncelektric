import { useEffect, useState } from 'react';
import { defaultSiteContent } from '../data/defaults';
import { supabase, backendReady } from '../lib/supabase';
import type { SiteContentMap } from '../types';

type ContentKey = keyof SiteContentMap;

function deepMerge<T extends object>(base: T, patch: Partial<T>): T {
  return { ...base, ...patch };
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContentMap>(defaultSiteContent);
  const [loading, setLoading] = useState(backendReady);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const keys: ContentKey[] = ['hero', 'homepage', 'about', 'contact', 'footer', 'seo_defaults', 'settings'];
      const { data, error: err } = await supabase.from('site_content').select('id,payload').in('id', keys);
      if (cancelled) return;
      if (err) {
        setError(err.message);
      } else if (data?.length) {
        setContent((prev) => {
          const next = { ...prev };
          for (const row of data) {
            const id = row.id as ContentKey;
            if (id in next) {
              (next as Record<string, unknown>)[id] = deepMerge(
                next[id] as object,
                row.payload as object,
              );
            }
          }
          return next;
        });
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { content, setContent, loading, error };
}