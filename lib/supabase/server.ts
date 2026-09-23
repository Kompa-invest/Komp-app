import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Client Supabase utilisé dans les Server Components / Server Actions.
// Lit et écrit les cookies de session côté serveur.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll appelé depuis un Server Component : ignoré si un
            // middleware se charge déjà du rafraîchissement de session.
          }
        },
      },
    }
  );
}
