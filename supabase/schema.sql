create extension if not exists pgcrypto;
create table if not exists movies (id uuid primary key default gen_random_uuid(), tmdb_id bigint unique not null, slug text unique not null, title text not null, year text, poster_path text, backdrop_path text, overview text, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists votes (id uuid primary key default gen_random_uuid(), movie_id uuid not null references movies(id) on delete cascade, voter_hash text not null, vote text not null check (vote in ('good','bad')), created_at timestamptz default now(), unique(movie_id,voter_hash));
create or replace view ratings_summary as select movie_id,count(*)::int as total,count(*) filter(where vote='good')::int as good,count(*) filter(where vote='bad')::int as bad,case when count(*)=0 then null else round((count(*) filter(where vote='good'))::numeric*100/count(*),0)::int end as percent_good from votes group by movie_id;
alter table movies enable row level security; alter table votes enable row level security;
create policy "public can read movies" on movies for select using (true);
create policy "public can read ratings" on votes for select using (true);
