-- Second Opinion : table des demandes + espace privé pour les documents.
-- À exécuter UNE fois : Dashboard Supabase > SQL Editor > New query > coller > Run.

create table if not exists public.second_opinion_requests (
  id              uuid primary key,
  created_at      timestamptz not null default now(),
  full_name       text,
  email           text,
  phone           text,
  message         text,
  file_path       text not null,
  file_name       text,
  file_size       bigint,
  consent_at      timestamptz not null,
  status          text not null default 'pending_upload'
                  check (status in ('pending_upload', 'received', 'cancelled')),
  received_at     timestamptz,
  file_deleted_at timestamptz,
  anonymized_at   timestamptz
);

create index if not exists second_opinion_requests_email_idx
  on public.second_opinion_requests (email, created_at desc);

-- Sécurité : RLS activée SANS aucune policy.
-- Personne ne peut lire ni écrire cette table depuis le navigateur ;
-- seul le serveur du site (clé secrète) y a accès.
alter table public.second_opinion_requests enable row level security;

-- Espace privé pour les documents : 10 Mo max, PDF / images / Word.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'second-opinion', 'second-opinion', false, 10485760,
  array[
    'application/pdf', 'image/jpeg', 'image/png', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Ajout (25/09/2026) : civilité et nom de famille, pour "Bonjour Madame Dupont".
alter table public.second_opinion_requests
  add column if not exists civility  text,
  add column if not exists last_name text;
