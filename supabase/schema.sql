-- Run once in Supabase SQL Editor.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);
create table if not exists public.site_content (
  id text primary key, title text not null default '우리 사이트', description text not null default '',
  button_text text not null default '시작하기', button_url text not null default '#about', body text not null default '', image_url text not null default '', page_html text not null default '', updated_at timestamptz not null default now()
);
alter table public.site_content add column if not exists page_html text not null default '';
insert into public.site_content (id) values ('home') on conflict (id) do nothing;
alter table public.profiles enable row level security;
alter table public.site_content enable row level security;
create policy "public reads content" on public.site_content for select using (true);
create policy "users read own profile" on public.profiles for select to authenticated using (id=auth.uid());
create policy "admins edit content" on public.site_content for all to authenticated using ((select role from public.profiles where id=auth.uid())='admin') with check ((select role from public.profiles where id=auth.uid())='admin');
-- In Storage create a Public bucket named `images`, then run these policies.
create policy "public reads images" on storage.objects for select using (bucket_id='images');
create policy "admins upload images" on storage.objects for insert to authenticated with check (bucket_id='images' and (select role from public.profiles where id=auth.uid())='admin');
-- After creating an Auth user, replace UUID: insert into public.profiles (id,role) values ('USER_UUID','admin');
