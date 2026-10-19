-- Nouvelle interface (octobre 2026) : à exécuter UNE fois, AVANT de mettre le code en ligne.
-- Supabase > SQL Editor > New query > coller tout ce fichier > Run.
-- Le script peut être relancé sans risque : il ne supprime aucune donnée.

-- 1. « Mon portefeuille » enregistré dans le compte.
--    Une ligne par compte ; « lines » contient la liste des placements
--    (produit, montant, frais) telle que la page d'accueil la manipule.
create table if not exists public.portfolios (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  lines       jsonb not null default '[]'::jsonb
              check (jsonb_typeof(lines) = 'array' and jsonb_array_length(lines) <= 100),
  updated_at  timestamptz not null default now()
);

alter table public.portfolios enable row level security;

-- Chaque utilisateur ne voit et ne modifie que son propre portefeuille.
drop policy if exists "Les utilisateurs lisent leur portefeuille" on public.portfolios;
create policy "Les utilisateurs lisent leur portefeuille"
  on public.portfolios for select using (auth.uid() = user_id);

drop policy if exists "Les utilisateurs créent leur portefeuille" on public.portfolios;
create policy "Les utilisateurs créent leur portefeuille"
  on public.portfolios for insert with check (auth.uid() = user_id);

drop policy if exists "Les utilisateurs modifient leur portefeuille" on public.portfolios;
create policy "Les utilisateurs modifient leur portefeuille"
  on public.portfolios for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Les utilisateurs suppriment leur portefeuille" on public.portfolios;
create policy "Les utilisateurs suppriment leur portefeuille"
  on public.portfolios for delete using (auth.uid() = user_id);

-- 2. Second Opinion : formule de chaque demande
--    ('prive' = membre Kompa Privé, 'unite' = analyse à l'unité, à régler).
alter table public.second_opinion_requests add column if not exists offer text;
