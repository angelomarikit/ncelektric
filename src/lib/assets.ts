/** Paths aligned with instructions/ASSET-MAP.json */
export const brand = {
  /** Primary logo (official artwork on light backgrounds) */
  logo: '/assets/brand/nc-elektric-logo.jpg',
  logoSvg: '/assets/brand/nc-elektric-logo.svg',
  logoLight: '/assets/brand/nc-elektric-logo-light.svg',
  favicon: '/assets/brand/favicon.svg',
};

export const banners = {
  homeHero: '/assets/banners/home-hero.jpg',
  homeHeroSvg: '/assets/banners/home-hero.svg',
  catalogHero: '/assets/banners/catalog-hero.jpg',
  catalogHeroSvg: '/assets/banners/catalog-hero.svg',
  industrialBg: '/assets/banners/industrial-background.svg',
  valueSection: '/assets/banners/value-section-bg.jpg',
};

/** Category card photography (full-bleed); SVG illustrations kept as fallbacks */
export const categoryPhotos = {
  transformers: '/assets/categories/photos/transformers.png',
  transformerCores: '/assets/categories/photos/transformer-cores.png',
  steelPoles: '/assets/categories/photos/poles-structures.jpg',
  crating: '/assets/categories/photos/packaging-crating.png',
  constructionMaterials: '/assets/categories/photos/construction-materials.png',
} as const;

export const categoryArt = {
  transformers: '/assets/categories/transformers.svg',
  transformerCores: '/assets/categories/transformer-cores.svg',
  steelPoles: '/assets/categories/steel-poles.svg',
  crating: '/assets/categories/crating.svg',
  constructionMaterials: '/assets/categories/construction-materials.svg',
} as const;