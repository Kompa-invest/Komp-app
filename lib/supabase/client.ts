import { createBrowserClient } from "@supabase/ssr";

// Client Supabase utilisé dans les composants React côté navigateur
// ("use client"). Les variables d'environnement sont publiques par design
// (clé "anon"), la sécurité réelle est assurée par les policies RLS
// définies dans supabase/schema.sql.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
