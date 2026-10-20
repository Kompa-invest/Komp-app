import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SO_TABLE } from "@/lib/second-opinion/config";
import { FIRST_NAME_RE, firstNameOf, planOf } from "@/lib/kompa/offres";
import { fail, json, readJson, text } from "@/lib/kompa/http";

export const runtime = "nodejs";

// Ce que la page d'accueil doit savoir du visiteur : connecté ou non,
// prénom, formule, préférences d'e-mails, demandes de Second Opinion.
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return json({ user: null });

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;

  // Les demandes de Second Opinion envoyées avec cette adresse (dates seulement).
  let soRequests: { date: string }[] = [];
  if (user.email) {
    try {
      const admin = createAdminClient();
      const { data } = await admin
        .from(SO_TABLE)
        .select("received_at, created_at")
        .eq("email", user.email.toLowerCase())
        .eq("status", "received")
        .order("created_at", { ascending: false })
        .limit(10);
      soRequests = (data ?? []).map((r: { received_at: string | null; created_at: string }) => ({
        date: r.received_at ?? r.created_at,
      }));
    } catch (e) {
      console.error("[me] second-opinion", e);
    }
  }

  return json({
    user: { email: user.email ?? "", first: firstNameOf(user), since: user.created_at ?? null },
    plan: planOf(user),
    prefs: { magazine: meta.magazine === true },
    priveRequest: typeof meta.prive_request === "object" && meta.prive_request ? meta.prive_request : null,
    soRequests,
  });
}

// Réglages de Mon espace : préférence Magazine et/ou prénom.
export async function PATCH(req: Request) {
  const body = await readJson(req);
  if (!body) return fail(400, "Requête invalide.");
  const data: Record<string, unknown> = {};
  if ("magazine" in body) {
    if (typeof body.magazine !== "boolean") return fail(400, "Requête invalide.");
    data.magazine = body.magazine;
  }
  if ("first" in body) {
    const first = text(body.first, 60).replace(/\s+/g, " ");
    if (!FIRST_NAME_RE.test(first)) return fail(400, "Indiquez un prénom (lettres, espaces, tirets ou apostrophes).");
    data.first_name = first;
  }
  if (!Object.keys(data).length) return fail(400, "Requête invalide.");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return fail(401, "Connectez-vous pour modifier vos réglages.");

  const { error } = await supabase.auth.updateUser({ data });
  if (error) {
    console.error("[me] réglages", error.message);
    return fail(500, "Le réglage n'a pas pu être enregistré. Réessayez.");
  }
  return json({ ok: true });
}
