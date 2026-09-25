import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  SO_BUCKET,
  SO_MAX_BYTES,
  SO_MAX_PER_EMAIL_PER_DAY,
  SO_MIME_BY_EXT,
  SO_TABLE,
} from "@/lib/second-opinion/config";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UNAVAILABLE = "Le service est momentanément indisponible. Réessayez dans quelques minutes.";

function fail(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}
function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// Étape 1 : on enregistre la demande et on renvoie une adresse d'envoi
// à usage unique. Le fichier part ensuite directement du navigateur
// vers l'espace privé, sans passer par le serveur du site.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail(400, "Requête invalide.");
  }

  // Champ piège invisible : un humain le laisse vide, un robot le remplit.
  if (text(body.website, 200)) return fail(400, "Requête invalide.");

  const civilityRaw = text(body.civility, 20);
  const civility = civilityRaw === "Madame" || civilityRaw === "Monsieur" ? civilityRaw : null;
  const firstName = text(body.firstName, 60);
  const lastName = text(body.lastName, 60);
  const email = text(body.email, 254).toLowerCase();
  const phone = text(body.phone, 40);
  const message = text(body.message, 3000);
  const ext = text(body.ext, 10).toLowerCase();
  const fileName = text(body.fileName, 200).replace(/[^\p{L}\p{N}._ ()-]/gu, "");
  const fileSize = Number(body.fileSize);

  if (!firstName) return fail(400, "Merci d'indiquer votre prénom.");
  if (!lastName) return fail(400, "Merci d'indiquer votre nom.");
  if (!EMAIL_RE.test(email)) return fail(400, "Merci d'indiquer une adresse e-mail valide.");
  if (phone.replace(/[^0-9]/g, "").length < 6) return fail(400, "Merci d'indiquer votre numéro de téléphone.");
  if (body.consent !== true) return fail(400, "Merci de cocher la case d'accord pour l'utilisation de votre document.");
  const contentType = SO_MIME_BY_EXT[ext];
  if (!contentType) return fail(400, "Format non accepté. Utilisez un PDF, une image JPG/PNG ou un fichier Word.");
  if (!Number.isFinite(fileSize) || fileSize <= 0 || fileSize > SO_MAX_BYTES)
    return fail(400, "Le document doit faire moins de 10 Mo.");

  const supabase = createAdminClient();

  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { count, error: countError } = await supabase
    .from(SO_TABLE)
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .eq("status", "received")
    .gte("created_at", since);
  if (countError) {
    console.error("[second-opinion] start/count", countError);
    return fail(500, UNAVAILABLE);
  }
  if ((count ?? 0) >= SO_MAX_PER_EMAIL_PER_DAY)
    return fail(429, "Vous avez déjà envoyé plusieurs demandes aujourd'hui. Réessayez demain.");

  const id = randomUUID();
  const path = `${id}/proposition.${ext}`;

  const { error: insertError } = await supabase.from(SO_TABLE).insert({
    id,
    full_name: `${firstName} ${lastName}`,
    civility,
    last_name: lastName,
    email,
    phone,
    message: message || null,
    file_path: path,
    file_name: fileName || null,
    file_size: fileSize,
    consent_at: new Date().toISOString(),
    status: "pending_upload",
  });
  if (insertError) {
    console.error("[second-opinion] start/insert", insertError);
    return fail(500, UNAVAILABLE);
  }

  const { data, error: signError } = await supabase.storage.from(SO_BUCKET).createSignedUploadUrl(path);
  if (signError || !data) {
    console.error("[second-opinion] start/sign", signError);
    await supabase.from(SO_TABLE).update({ status: "cancelled" }).eq("id", id);
    return fail(500, UNAVAILABLE);
  }

  return NextResponse.json({
    id,
    uploadUrl: data.signedUrl,
    contentType,
    // Clé publique (la même que celle déjà utilisée par le site) : sans danger.
    apiKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}
