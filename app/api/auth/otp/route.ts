import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { EMAIL_RE, INDISPONIBLE, fail, json, readJson, siteOrigin, text } from "@/lib/kompa/http";

export const runtime = "nodejs";

// Pages où l'on peut revenir après avoir cliqué sur le lien de connexion.
const NEXT_OK = new Set(["compte", "prive", "adhesion", "portefeuille", "second-opinion", "sentinelle", "clarity-test"]);

// Connexion et inscription sans mot de passe : Supabase envoie un lien
// à usage unique (depuis contact@, réglage SMTP de Supabase).
export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return fail(400, "Requête invalide.");

  // Champ piège invisible : un humain le laisse vide, un robot le remplit.
  if (text(body.website, 200)) return fail(400, "Requête invalide.");

  const email = text(body.email, 254).toLowerCase();
  const signup = body.signup === true;
  const first = text(body.first, 60);
  const next = NEXT_OK.has(text(body.next, 40)) ? text(body.next, 40) : "compte";

  if (!EMAIL_RE.test(email)) return fail(400, "Indiquez une adresse e-mail valide.");
  if (signup && !first) return fail(400, "Indiquez votre prénom.");
  if (signup && body.terms !== true) return fail(400, "Merci d'accepter les conditions pour créer votre compte.");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: signup,
      emailRedirectTo: `${siteOrigin(req)}/auth/callback?next=${next}`,
      data: signup
        ? {
            first_name: first,
            full_name: first,
            magazine: body.magazine === true,
            terms_accepted_at: new Date().toISOString(),
          }
        : undefined,
    },
  });

  if (error) {
    const code = (error as { code?: string }).code ?? "";
    const status = (error as { status?: number }).status ?? 0;
    if (!signup && (code === "otp_disabled" || code === "signup_disabled" || code === "user_not_found" || /signups not allowed/i.test(error.message))) {
      return fail(404, "Aucun compte n'existe avec cette adresse. Créez votre compte en une minute.");
    }
    if (code.startsWith("over_") || status === 429 || /security purposes|rate limit/i.test(error.message)) {
      return fail(429, "Un lien vient déjà de vous être envoyé. Patientez une minute avant d'en demander un nouveau.");
    }
    if (code === "email_address_invalid") return fail(400, "Cette adresse e-mail n'est pas acceptée. Vérifiez-la.");
    console.error("[auth/otp]", code, error.message);
    return fail(500, INDISPONIBLE);
  }

  // Page où revenir après le clic : gardée aussi dans un cookie, car le lien des e-mails
  // (modèles personnalisés, lien « token_hash ») ne la transporte pas.
  const store = await cookies();
  store.set("kompa_next", next, { path: "/", maxAge: 3600, httpOnly: true, sameSite: "lax", secure: siteOrigin(req).startsWith("https") });

  return json({ ok: true });
}
