import { createClient } from "@supabase/supabase-js";

// Client Supabase "administrateur", utilisé UNIQUEMENT côté serveur.
// Il contourne les policies RLS : la clé secrète ne doit jamais
// être préfixée NEXT_PUBLIC_ ni envoyée au navigateur.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Variables manquantes : NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY.");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
