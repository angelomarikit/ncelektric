import { useEffect, useState } from 'react';
import { editorialProducts, normalizeProduct } from '../data/defaults';
import { supabase, backendReady } from '../lib/supabase';
import type { Product } from '../types';

export function useProducts(admin = false) {
  const [products, setProducts] = useState<Product[]>(editorialProducts);
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
      let query = supabase.from('products').select('*').order('sort_order', { ascending: true });
      if (!admin) {
        query = query.eq('published', true);
      }
      const { data, error: err } = await query;
      if (cancelled) return;
      if (err) {
        setError(err.message);
      } else if (data?.length) {
        setProducts(data.map((row) => normalizeProduct(row as Record<string, unknown>)));
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [admin]);

  return { products, setProducts, loading, error };
}