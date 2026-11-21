import { categoryPhotos } from './assets';
import { defaultCategories } from '../data/defaults';
import type { Category } from '../types';

/** Canonical shop-by-category slugs (design kit). */
export const canonicalCategorySlugs = [
  'transformers',
  'transformer-cores',
  'poles-structures',
  'packaging-crating',
  'construction-materials',
] as const;

const photoBySlug: Record<string, string> = {
  transformers: categoryPhotos.transformers,
  'transformer-cores': categoryPhotos.transformerCores,
  'poles-structures': categoryPhotos.steelPoles,
  'packaging-crating': categoryPhotos.crating,
  'construction-materials': categoryPhotos.constructionMaterials,
};

function shouldUseBundledPhoto(image: string | null | undefined): boolean {
  if (!image) return true;
  if (image.endsWith('.svg')) return true;
  if (image.includes('/categories/') && !image.includes('/categories/photos/')) return true;
  return false;
}

export function resolveCategoryImage(slug: string, dbImage: string | null): string | null {
  const bundled = photoBySlug[slug];
  if (bundled && shouldUseBundledPhoto(dbImage)) return bundled;
  return dbImage ?? bundled ?? null;
}

/**
 * Keeps exactly five homepage/collection categories with bundled photography,
 * even when Supabase still has legacy rows (SVG art or old category names).
 */
export function mergeCategoriesWithDefaults(remote: Category[]): Category[] {
  const bySlug = new Map(remote.map((c) => [c.slug, c]));

  return defaultCategories.map((def) => {
    const row = bySlug.get(def.slug);
    if (!row) {
      return { ...def, image: resolveCategoryImage(def.slug, def.image) };
    }
    return {
      ...def,
      id: row.id,
      name: row.name || def.name,
      description: row.description || def.description,
      sort_order: row.sort_order ?? def.sort_order,
      image: resolveCategoryImage(def.slug, row.image),
    };
  });
}