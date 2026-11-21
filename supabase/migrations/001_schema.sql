create extension if not exists pgcrypto;
create table if not exists public.admin_users(user_id uuid primary key references auth.users(id) on delete cascade);
create table if not exists public.categories(id uuid primary key default gen_random_uuid(),name text not null unique,slug text not null unique,description text not null default '',image text,sort_order int default 0);
create table if not exists public.products(id uuid primary key default gen_random_uuid(),name text not null,slug text not null unique,category text not null,summary text not null default '',description text not null default '',image text not null default '',images jsonb not null default '[]'::jsonb,specs jsonb not null default '{}'::jsonb,featured boolean not null default false,published boolean not null default false,sort_order int not null default 0,created_at timestamptz not null default now());
create table if not exists public.site_content(id text primary key,payload jsonb not null default '{}'::jsonb,updated_at timestamptz default now());
create table if not exists public.quotes(id uuid primary key default gen_random_uuid(),product_id uuid references public.products(id) on delete set null,product_name text not null,full_name text not null,company text,email text not null,phone text,quantity text,project_location text,message text,status text not null default 'new',created_at timestamptz not null default now());
create index if not exists idx_products_visibility on public.products(published,sort_order);create index if not exists idx_quotes_created on public.quotes(created_at desc);
create or replace function public.is_site_admin() returns boolean language sql stable security definer set search_path = '' as $$ select exists(select 1 from public.admin_users where user_id = (select auth.uid())) $$;
revoke all on function public.is_site_admin() from public;grant execute on function public.is_site_admin() to authenticated,anon;
alter table public.admin_users enable row level security;alter table public.categories enable row level security;alter table public.products enable row level security;alter table public.site_content enable row level security;alter table public.quotes enable row level security;
create policy "Admins read own role" on public.admin_users for select to authenticated using (user_id=auth.uid());
create policy "Public read categories" on public.categories for select using (true);
create policy "Public read published products" on public.products for select using (published or public.is_site_admin());
create policy "Public read site content" on public.site_content for select using (true);
create policy "Admins manage categories" on public.categories for all to authenticated using(public.is_site_admin()) with check(public.is_site_admin());
create policy "Admins manage products" on public.products for all to authenticated using(public.is_site_admin()) with check(public.is_site_admin());
create policy "Admins manage content" on public.site_content for all to authenticated using(public.is_site_admin()) with check(public.is_site_admin());
create policy "Admins read quotes" on public.quotes for select to authenticated using(public.is_site_admin());
create policy "Admins update quotes" on public.quotes for update to authenticated using(public.is_site_admin()) with check(public.is_site_admin());
-- Public quotation inserts intentionally denied; only the authenticated Edge Function service role writes.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('product-media','product-media',true,10485760,array['image/jpeg','image/png','image/webp']) on conflict(id) do nothing;
create policy "Anyone reads product images" on storage.objects for select using(bucket_id='product-media');
create policy "Admins upload product images" on storage.objects for insert to authenticated with check(bucket_id='product-media' and public.is_site_admin());
create policy "Admins edit product images" on storage.objects for update to authenticated using(bucket_id='product-media' and public.is_site_admin()) with check(bucket_id='product-media' and public.is_site_admin());
create policy "Admins delete product images" on storage.objects for delete to authenticated using(bucket_id='product-media' and public.is_site_admin());
-- After creating an admin in Supabase Auth, grant access manually:
-- insert into public.admin_users(user_id) values ('REPLACE_WITH_AUTH_USER_UUID');
