-- Schéma Kompa — à exécuter dans l'éditeur SQL de ton projet Supabase
-- (Dashboard Supabase > SQL Editor > New query > coller > Run).

-- Table des lignes de portefeuille simulé ("Comprendre mes investissements").
-- Un utilisateur peut avoir plusieurs lignes (un produit + un montant chacune).
create table if not exists public.portfolio_holdings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  fund_id text not null,
  fund_name text not null,
  amount numeric not null check (amount > 0),
  created_at timestamptz not null default now()
);

create index if not exists portfolio_holdings_user_id_idx
  on public.portfolio_holdings(user_id);

-- Un même produit ne peut apparaître qu'une fois par utilisateur
-- (cohérent avec la règle déjà présente côté prototype).
create unique index if not exists portfolio_holdings_user_fund_unique
  on public.portfolio_holdings(user_id, fund_id);

alter table public.portfolio_holdings enable row level security;

-- Chaque utilisateur ne peut lire, créer, modifier ou supprimer
-- que ses propres lignes de portefeuille.
create policy "Les utilisateurs lisent leur propre portefeuille"
  on public.portfolio_holdings for select
  using (auth.uid() = user_id);

create policy "Les utilisateurs ajoutent à leur propre portefeuille"
  on public.portfolio_holdings for insert
  with check (auth.uid() = user_id);

create policy "Les utilisateurs modifient leur propre portefeuille"
  on public.portfolio_holdings for update
  using (auth.uid() = user_id);

create policy "Les utilisateurs suppriment de leur propre portefeuille"
  on public.portfolio_holdings for delete
  using (auth.uid() = user_id);

-- Table de profil minimal (nom affiché), créée automatiquement à l'inscription.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Les utilisateurs lisent leur propre profil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Les utilisateurs modifient leur propre profil"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger : à chaque inscription (auth.users), on crée automatiquement
-- la ligne de profil correspondante.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
