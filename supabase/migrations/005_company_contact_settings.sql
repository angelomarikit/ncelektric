insert into public.site_content (id, payload) values
  ('settings', jsonb_build_object(
    'addressLine', 'Blk 9 Florida Joyous Hgts Antipolo City 1870',
    'phoneLine', '0994 977 3159',
    'phoneLine2', '0921 466 1263',
    'emailLine', ''
  ))
on conflict (id) do update set
  payload = public.site_content.payload || excluded.payload,
  updated_at = now();