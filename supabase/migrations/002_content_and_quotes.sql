-- Product extended fields
alter table public.products
  add column if not exists features jsonb not null default '[]'::jsonb,
  add column if not exists applications jsonb not null default '[]'::jsonb,
  add column if not exists documents jsonb not null default '[]'::jsonb;

create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_slug on public.products(slug);

-- Rate limiting for quotation edge function (service role only)
create table if not exists public.quote_rate_limits (
  ip_hash text not null,
  window_start timestamptz not null,
  hit_count int not null default 1,
  primary key (ip_hash, window_start)
);

alter table public.quote_rate_limits enable row level security;

-- Site media bucket for hero / collection CMS uploads
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "Anyone reads site media" on storage.objects for select using (bucket_id = 'site-media');
create policy "Admins upload site media" on storage.objects for insert to authenticated
  with check (bucket_id = 'site-media' and public.is_site_admin());
create policy "Admins update site media" on storage.objects for update to authenticated
  using (bucket_id = 'site-media' and public.is_site_admin())
  with check (bucket_id = 'site-media' and public.is_site_admin());
create policy "Admins delete site media" on storage.objects for delete to authenticated
  using (bucket_id = 'site-media' and public.is_site_admin());

-- Default site content (idempotent)
insert into public.site_content (id, payload) values
  ('hero', '{"eyebrow":"NC ELEKTRIC CONSTRUCTION & TRADING CO.","headline":"POWERING INDUSTRY.","headlineAccent":"SUPPLYING SOLUTIONS.","description":"Explore electrical equipment and construction trading solutions for industrial and commercial projects.","image":"/assets/image(20261120-004332).png","ctaProducts":"Explore Products","ctaQuote":"Request Quotation"}'::jsonb),
  ('homepage', '{"categoriesTitle":"Explore Product Collections","categoriesSubtitle":"OUR OFFERINGS","featuredTitle":"Featured Products","featuredSubtitle":"PRODUCT SPOTLIGHT","aboutTitle":"Electrical supply and trading, built around your project needs.","aboutBody":"We showcase equipment and materials for electrical construction and power distribution. Contact our team to discuss product availability and quotations.","aboutImage":"/assets/image(20261120-004337).png","ctaTitle":"Have a product requirement?","ctaBody":"Send your project details and request a quotation."}'::jsonb),
  ('about', '{"title":"About Our Company","body":"NC Elektric Construction & Trading Co. presents electrical equipment and construction trading products for project inquiries. This introduction is editable draft content pending the company profile.","draftNotice":"Draft content — update official company information in the admin CMS."}'::jsonb),
  ('contact', '{"title":"Contact & Inquiries","body":"Discuss your product needs, project location, quantities, and specifications through our request for quotation form. Official contact details will be added after owner verification.","draftNotice":"Draft content — add verified phone, email, and address in admin when available."}'::jsonb),
  ('footer', '{"tagline":"Construction & Trading Co.","legalNote":"Product descriptions pending owner verification.","social":[]}'::jsonb),
  ('seo_defaults', '{"siteName":"NC Elektric","defaultTitle":"NC Elektric | Electrical Equipment & Construction Trading","defaultDescription":"Browse electrical equipment and construction supplies from NC Elektric Construction & Trading Co. Request product quotations."}'::jsonb),
  ('settings', '{"contactEmail":"","contactPhone":"","addressDraft":"Add verified business address in admin."}'::jsonb)
on conflict (id) do nothing;

-- Default categories
insert into public.categories (name, slug, description, image, sort_order) values
  ('Transformers', 'transformers', 'Power distribution and transformer equipment for industrial projects.', '/assets/image(20261120-004312).png', 0),
  ('Power Distribution', 'power-distribution', 'Distribution gear for commercial and industrial installations.', '/assets/image(20261120-004319).png', 1),
  ('Construction Supplies', 'construction-supplies', 'Electrical materials and components for construction procurement.', '/assets/image(20261120-004323).png', 2)
on conflict (slug) do nothing;