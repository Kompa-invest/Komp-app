import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail } from "@/lib/email";
import {
  SO_BUCKET,
  SO_DISCLAIMER,
  SO_DOCUMENT_DAYS,
  SO_TABLE,
  SO_UPLOAD_TIMEOUT_HOURS,
  addBusinessDays,
} from "@/lib/second-opinion/config";

export const runtime = "nodejs";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UNAVAILABLE = "Le service est momentanément indisponible. Réessayez dans quelques minutes.";

function fail(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}
function frDate(d: Date) {
  return d.toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Étape 2 : le navigateur signale que le fichier est envoyé.
// On vérifie qu'il est bien arrivé, puis :
//  - Théo reçoit un e-mail avec toutes les infos et un lien vers le document ;
//    "Répondre" dans sa messagerie répond directement à l'utilisateur ;
//  - l'utilisateur reçoit une confirmation.
export async function POST(req: Request) {
  let id = "";
  try {
    id = String((await req.json())?.id ?? "");
  } catch {
    return fail(400, "Requête invalide.");
  }
  if (!UUID_RE.test(id)) return fail(400, "Requête invalide.");

  const supabase = createAdminClient();
  const { data: row, error } = await supabase.from(SO_TABLE).select("*").eq("id", id).single();
  if (error || !row) return fail(404, "Demande introuvable. Recommencez l'envoi.");
  if (row.status === "received") return NextResponse.json({ ok: true });
  if (row.status !== "pending_upload") return fail(409, "Cette demande n'est plus active. Recommencez l'envoi.");

  const ageHours = (Date.now() - new Date(row.created_at).getTime()) / 3600000;
  if (ageHours > SO_UPLOAD_TIMEOUT_HOURS) return fail(409, "Délai dépassé. Recommencez l'envoi.");

  const [folder, storedName] = String(row.file_path).split("/");
  const { data: objects } = await supabase.storage.from(SO_BUCKET).list(folder);
  if (!objects?.some((o) => o.name === storedName)) {
    return fail(400, "Le document n'a pas été reçu. Recommencez l'envoi.");
  }

  const { data: link, error: linkError } = await supabase.storage
    .from(SO_BUCKET)
    .createSignedUrl(row.file_path, SO_DOCUMENT_DAYS * 24 * 3600);
  if (linkError || !link) {
    console.error("[second-opinion] finish/link", linkError);
    return fail(500, UNAVAILABLE);
  }

  const now = new Date();
  const { error: updateError } = await supabase
    .from(SO_TABLE)
    .update({ status: "received", received_at: now.toISOString() })
    .eq("id", id)
    .eq("status", "pending_upload");
  if (updateError) {
    console.error("[second-opinion] finish/update", updateError);
    return fail(500, UNAVAILABLE);
  }

  const notifyTo = process.env.SO_NOTIFY_TO ?? process.env.SMTP_USER ?? "";
  // "Bonjour Madame Dupont," si la civilité est indiquée, sinon "Bonjour Marie Dupont,".
  const greetingName =
    row.civility && row.last_name ? `${row.civility} ${row.last_name}` : row.full_name;
  const displayName = row.civility ? `${row.civility} ${row.full_name}` : row.full_name;
  const deadline = frDate(addBusinessDays(now, 2));
  const expires = frDate(new Date(now.getTime() + SO_DOCUMENT_DAYS * 24 * 3600 * 1000));

  const results = await Promise.allSettled([
    sendMail({
      to: notifyTo,
      replyTo: row.email,
      subject: `Second Opinion : ${displayName}`,
      text:
        `Nouvelle demande de Second Opinion.\n\n` +
        `Nom : ${displayName}\n` +
        `E-mail : ${row.email}\n` +
        `Téléphone : ${row.phone}\n` +
        `Fichier : ${row.file_name ?? "document"}\n\n` +
        `Ce que la personne veut regarder en priorité :\n${row.message ?? "Non précisé."}\n\n` +
        `OUVRIR LE DOCUMENT (lien valable jusqu'au ${expires}) :\n${link.signedUrl}\n\n` +
        `À rendre avant : ${deadline} (48 h ouvrées).\n\n` +
        `Pour répondre, clique simplement sur "Répondre" : ta réponse partira à ${row.email}.\n` +
        `Le document sera supprimé automatiquement le ${expires}.`,
    }),
    sendMail({
      to: row.email,
      replyTo: notifyTo,
      subject: "Kompa : votre document est bien reçu",
      text:
        `Bonjour ${greetingName},\n\n` +
        `Nous avons bien reçu votre document. Vous recevrez une seconde lecture à cette adresse ` +
        `sous 48 heures ouvrées.\n\n` +
        `Votre document est conservé dans un espace privé, uniquement pour cette analyse, ` +
        `puis supprimé automatiquement ${SO_DOCUMENT_DAYS} jours après votre envoi.\n\n` +
        `${SO_DISCLAIMER}\n\n` +
        `L'équipe Kompa\nhttps://kompa-invest.fr`,
    }),
  ]);
  results.forEach((r) => {
    if (r.status === "rejected") console.error("[second-opinion] finish/email", r.reason);
  });

  // Si l'e-mail à Théo n'est pas parti, on le signale : sinon la demande passerait inaperçue.
  if (results[0].status === "rejected") {
    return fail(500, "Votre document est bien arrivé, mais la notification n'a pas pu partir. Écrivez-nous à contact@kompa-invest.fr.");
  }
  return NextResponse.json({ ok: true });
}
