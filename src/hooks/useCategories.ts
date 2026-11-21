import { useEffect, useState } from 'react';
import { defaultCategories } from '../data/defaults';
import { mergeCategoriesWithDefaults } from '../lib/categories';
import { supabase, backendReady } from '../lib/supabase';
import type { Category } from '../types';

function normalizeCategory(row: Record<string, unknown>): Category {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description ?? ''),
    image: row.image ? String(row.image) : null,
    sort_order: Number(row.sort_order ?? 0),
  };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
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
      const { data, error: err } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (cancelled) return;
      if (err) setError(err.message);
      else if (data?.length) {
        const remote = data.map((r) => normalizeCategory(r as Record<string, unknown>));
        setCategories(mergeCategoriesWithDefaults(remote));
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, setCategories, loading, error };
}