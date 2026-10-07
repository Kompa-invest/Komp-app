-- Clarity Test : les résultats des tests, pour la « carte de clarté » de chaque compte.
-- À exécuter UNE fois, AVANT de mettre le code en ligne :
-- Dashboard Supabase > SQL Editor > New query > coller tout ce fichier > Run.
-- Le script peut être relancé sans risque : il ne supprime aucune donnée.

create table if not exists public.clarity_results (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  -- Identifiant du produit, le même que dans le Décodeur (ex. « world »).
  product_id  text not null check (char_length(product_id) between 1 and 60),
  clarity     smallint not null check (clarity between 0 and 100),
  lucidity    smallint not null check (lucidity between 0 and 100),
  -- Une entrée par question : q = question, s = justesse (0, 0.5 ou 1),
  -- c = certitude (0, 1 ou 2), d = date de la source du fait au moment du test.
  -- La date sert à signaler « à revoir » quand la source officielle change.
  answers     jsonb not null default '[]'::jsonb
              check (jsonb_typeof(answers) = 'array' and jsonb_array_length(answers) <= 20),
  created_at  timestamptz not null default now()
);

create index if not exists clarity_results_user_product_idx
  on public.clarity_results (user_id, product_id, created_at desc);

alter table public.clarity_results enable row level security;

-- Chaque utilisateur ne voit, n'ajoute et ne supprime que ses propres résultats.
drop policy if exists "Les utilisateurs lisent leurs propres résultats" on public.clarity_results;
create policy "Les utilisateurs lisent leurs propres résultats"
  on public.clarity_results for select
  using (auth.uid() = user_id);

drop policy if exists "Les utilisateurs ajoutent leurs propres résultats" on public.clarity_results;
create policy "Les utilisateurs ajoutent leurs propres résultats"
  on public.clarity_results for insert
  with check (auth.uid() = user_id);

drop policy if exists "Les utilisateurs suppriment leurs propres résultats" on public.clarity_results;
create policy "Les utilisateurs suppriment leurs propres résultats"
  on public.clarity_results for delete
  using (auth.uid() = user_id);
