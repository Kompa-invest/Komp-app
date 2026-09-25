// Réglages du Second Opinion.

export const SO_BUCKET = "second-opinion";
export const SO_TABLE = "second_opinion_requests";

export const SO_MAX_BYTES = 10 * 1024 * 1024; // 10 Mo

// Extension du fichier -> type envoyé au stockage
export const SO_MIME_BY_EXT: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

// Durée pendant laquelle le lien "Ouvrir le document" de ton e-mail fonctionne,
// et après laquelle le document est supprimé automatiquement.
export const SO_DOCUMENT_DAYS = 30;

// Au-delà, nom / e-mail / téléphone / message sont effacés de la base.
// On garde seulement la date, pour pouvoir compter les demandes. [À VALIDER]
export const SO_ANONYMIZE_DAYS = 90;

export const SO_MAX_PER_EMAIL_PER_DAY = 3;
export const SO_UPLOAD_TIMEOUT_HOURS = 24;

export const SO_DISCLAIMER =
  "Kompa fournit de l'information. Kompa ne formule pas de conseil personnalisé et ne gère pas votre argent.";

// "48 h ouvrées" : on saute samedi et dimanche (jours fériés non gérés).
export function addBusinessDays(from: Date, days: number): Date {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return d;
}
