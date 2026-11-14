-- Portfolio backend setup — run this whole script once in the Supabase
-- SQL editor (Dashboard → SQL Editor → New query → paste → Run).
--
-- Studio access is an email allowlist. It lives here (the real enforcement)
-- and in NEXT_PUBLIC_OWNER_EMAILS in .env.local (the UI gate).
-- To change editors later: edit public.owner_emails() below and re-run,
-- and update .env.local to match.

create or replace function public.owner_emails()
returns text[]
language sql
immutable
as $$
  select array[
    'amithabey13@gmail.com',
    'nnavaneeth2@gmail.com'
  ];
$$;

create or replace function public.is_owner()
returns boolean
language sql
stable
as $$
  select coalesce(lower(auth.jwt() ->> 'email') = any (public.owner_emails()), false);
$$;

-- The whole site lives in one row.
create table if not exists public.site (
  id text primary key,
  draft jsonb not null,
  published jsonb not null,
  version integer not null default 1,
  published_at timestamptz not null default now(),
  history jsonb not null default '[]'::jsonb
);

alter table public.site enable row level security;

drop policy if exists "public read" on public.site;
create policy "public read" on public.site
  for select using (true);

drop policy if exists "owners insert" on public.site;
create policy "owners insert" on public.site
  for insert with check (public.is_owner());

drop policy if exists "owners update" on public.site;
create policy "owners update" on public.site
  for update using (public.is_owner()) with check (public.is_owner());

-- Images bucket: public read, owners upload/replace.
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

drop policy if exists "public read images" on storage.objects;
create policy "public read images" on storage.objects
  for select using (bucket_id = 'images');

drop policy if exists "owners upload images" on storage.objects;
create policy "owners upload images" on storage.objects
  for insert with check (bucket_id = 'images' and public.is_owner());

drop policy if exists "owners update images" on storage.objects;
create policy "owners update images" on storage.objects
  for update using (bucket_id = 'images' and public.is_owner());

drop policy if exists "owners delete images" on storage.objects;
create policy "owners delete images" on storage.objects
  for delete using (bucket_id = 'images' and public.is_owner());
