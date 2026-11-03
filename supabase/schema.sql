-- Run in Supabase SQL editor.
create table if not exists meme_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  tx_hash text unique not null,      -- one payment can only publish one page
  owner text not null,
  data jsonb not null,               -- full MemePage payload
  respect integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists meme_pages_created_idx on meme_pages (created_at desc);
alter table meme_pages enable row level security; -- server uses the service role key
