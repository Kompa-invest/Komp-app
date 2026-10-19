import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Où renvoyer la personne une fois connectée (adresses de la nouvelle interface).
const DEST: Record<string, string> = {
  compte: "#/compte",
  prive: "#/prive",
  adhesion: "#/prive",
  portefeuille: "#/portefeuille",
  "second-opinion": "#/second-opinion",
  sentinelle: "#/sentinelle",
  "clarity-test": "#/clarity-test",
};
const OTP_TYPES = new Set(["magiclink", "signup", "email", "invite", "recovery", "email_change"]);

// Arrivée depuis le lien reçu par e-mail.
// Deux formes de lien sont acceptées :
//  - ?token_hash=…&type=email (modèles d'e-mails Kompa) : fonctionne même si l'e-mail
//    est ouvert sur un autre appareil ou dans l'application Gmail ;
//  - ?code=… (lien standard de Supabase) : seulement dans le navigateur de la demande.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const store = await cookies();
  const next = url.searchParams.get("next") ?? store.get("kompa_next")?.value ?? "compte";
  store.delete("kompa_next");
  const hash = DEST[next] ?? DEST.compte;
  const go = (etat: "ok" | "erreur") => {
    const extra = etat === "ok" && next === "adhesion" ? "&ouvrir=adhesion" : "";
    return NextResponse.redirect(new URL(`/?connexion=${etat}${extra}${hash}`, url.origin));
  };

  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") ?? "";

  if (url.searchParams.get("error") || url.searchParams.get("error_description")) return go("erreur");

  const supabase = await createClient();
  try {
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("[auth/callback] code", error.message);
        return go("erreur");
      }
      return go("ok");
    }
    if (tokenHash && OTP_TYPES.has(type)) {
      const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as EmailOtpType });
      if (error) {
        console.error("[auth/callback] token_hash", error.message);
        return go("erreur");
      }
      return go("ok");
    }
  } catch (e) {
    console.error("[auth/callback]", e);
  }
  return go("erreur");
}
