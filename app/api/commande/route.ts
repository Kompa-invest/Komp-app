import { createClient } from "@/lib/supabase/server";
import { sendMail } from "@/lib/email";
import { PRIVE, PRIVE_TARIFS, type Facturation, firstNameOf, planOf } from "@/lib/kompa/offres";
import { SO_DISCLAIMER } from "@/lib/second-opinion/config";
import { fail, json, readJson } from "@/lib/kompa/http";

export const runtime = "nodejs";

// Demande d'adhésion à Kompa Privé.
// Le paiement en ligne n'est pas encore branché : la demande arrive par e-mail
// à contact@, Théo envoie ensuite le moyen de règlement, puis active le compte
// (requête SQL indiquée dans l'e-mail qu'il reçoit).
// Réservé aux comptes connectés : la personne a donc déjà confirmé son adresse.
export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return fail(400, "Requête invalide.");
  const billing: Facturation = body.billing === "annuel" ? "annuel" : "mensuel";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) return fail(401, `Connectez-vous pour rejoindre ${PRIVE}.`);

  if (planOf(user) === "prive") return json({ ok: true, already: true });

  // Une seule demande par 24 h : un double clic ou un rechargement ne renvoie pas d'e-mail.
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const previous = meta.prive_request as { date?: string } | undefined;
  if (previous?.date && Date.now() - new Date(previous.date).getTime() < 24 * 3600 * 1000) {
    return json({ ok: true, duplicate: true });
  }

  const first = firstNameOf(user);
  const who = first ? `${first} (${user.email})` : user.email;
  const tarif = PRIVE_TARIFS[billing];
  const notifyTo = process.env.SO_NOTIFY_TO ?? process.env.SMTP_USER ?? "";
  const sql =
    `update auth.users set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"plan":"prive"}'::jsonb ` +
    `where email = '${user.email.replace(/'/g, "''")}';`;

  try {
    await sendMail({
      to: notifyTo,
      replyTo: user.email,
      subject: `${PRIVE} : demande d'adhésion de ${who}`,
      text:
        `Nouvelle demande d'adhésion à ${PRIVE}.\n\n` +
        `Prénom : ${first || "non indiqué"}\n` +
        `E-mail : ${user.email}\n` +
        `Formule choisie : ${tarif.label}, ${tarif.prix}\n\n` +
        `À faire :\n` +
        `1. Envoyer à la personne le moyen de règlement (clique sur "Répondre").\n` +
        `2. Une fois le règlement reçu, activer son compte : Supabase > SQL Editor > New query, coller la ligne ci-dessous, puis Run.\n\n` +
        `${sql}\n\n` +
        `La personne a reçu un e-mail lui indiquant une réponse sous 48 heures ouvrées.`,
    });
  } catch (e) {
    console.error("[commande] notify", e);
    return fail(500, "Votre demande n'a pas pu être transmise. Réessayez dans quelques minutes, ou écrivez-nous à contact@kompa-invest.fr.");
  }

  try {
    await sendMail({
      to: user.email,
      replyTo: notifyTo,
      subject: `${PRIVE} : votre demande d'adhésion est bien reçue`,
      text:
        `Bonjour${first ? " " + first : ""},\n\n` +
        `Nous avons bien reçu votre demande d'adhésion à ${PRIVE} (${tarif.label}, ${tarif.prix}, sans engagement).\n\n` +
        `Nous revenons vers vous à cette adresse sous 48 heures ouvrées pour finaliser le règlement. ` +
        `Votre accès est activé dès réception.\n\n` +
        `Une question ? Répondez simplement à cet e-mail.\n\n` +
        `${SO_DISCLAIMER}\n\n` +
        `L'équipe Kompa\nhttps://kompa-invest.fr`,
    });
  } catch (e) {
    // La demande est bien arrivée chez Kompa : on ne bloque pas la personne pour autant.
    console.error("[commande] confirmation", e);
  }

  const { error } = await supabase.auth.updateUser({
    data: { prive_request: { date: new Date().toISOString(), billing } },
  });
  if (error) console.error("[commande] meta", error.message);

  return json({ ok: true });
}
