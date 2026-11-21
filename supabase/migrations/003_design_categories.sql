-- Align seeded categories with design kit (five collections + SVG art paths)
insert into public.categories (name, slug, description, image, sort_order) values
  ('Transformers', 'transformers', 'Distribution and pole-mounted transformers for utility and industrial projects.', '/assets/categories/photos/transformers.png', 0),
  ('Transformer Cores', 'transformer-cores', 'Laminated cores and assemblies — verify specifications before publish.', '/assets/categories/photos/transformer-cores.png', 1),
  ('Poles & Structures', 'poles-structures', 'Galvanized steel poles and structural components.', '/assets/categories/photos/poles-structures.jpg', 2),
  ('Packaging & Crating', 'packaging-crating', 'Industrial crating and packaging for equipment.', '/assets/categories/photos/packaging-crating.png', 3),
  ('Construction Materials', 'construction-materials', 'Electrical construction materials and hardware.', '/assets/categories/photos/construction-materials.png', 4)
on conflict (slug) do update set
  description = excluded.description,
  image = excluded.image,
  sort_order = excluded.sort_order;

update public.site_content set payload = payload || '{"image":"/assets/banners/home-hero.jpg","headline":"Electrical Equipment &","headlineAccent":"Industrial Supply Solutions","description":"Explore electrical equipment, transformer components, structural products, and industrial materials for your project requirements."}'::jsonb
where id = 'hero';