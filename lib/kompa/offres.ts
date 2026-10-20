// Les formules de Kompa : un seul endroit pour les noms et les prix.
// Les mêmes valeurs sont affichées dans la page d'accueil (public/kompa.html) :
// en cas de changement de prix, modifier les deux.

export const PRIVE = "Kompa Privé";

export const PRIVE_TARIFS = {
  mensuel: { label: "formule mensuelle", prix: "9,90 € par mois" },
  annuel: { label: "formule annuelle", prix: "99 € par an" },
} as const;

export type Facturation = keyof typeof PRIVE_TARIFS;

// Second Opinion à l'unité, pour les personnes sans abonnement.
export const SO_PRIX_UNITE = "39 €";

// Formule d'une demande de Second Opinion.
//  - "prive" : membre Kompa Privé (analyse incluse, vérifié côté serveur) ;
//  - "unite" : analyse à l'unité, à régler après l'envoi du document.
export type SoOffre = "prive" | "unite";

/** La formule du compte, lue dans les métadonnées « app » (modifiables uniquement côté serveur). */
export function planOf(user: { app_metadata?: Record<string, unknown> } | null | undefined): "prive" | "standard" {
  return user?.app_metadata?.plan === "prive" ? "prive" : "standard";
}

/** Le prénom du compte, tel qu'indiqué à l'inscription ou modifié dans Mon espace.
 *  Pas de repli sur « full_name » : selon les anciens comptes, le nom de famille y figure en premier
 *  et le site saluait alors la personne par son nom. Sans prénom, Mon espace propose de l'indiquer. */
export function firstNameOf(user: { user_metadata?: Record<string, unknown> } | null | undefined): string {
  const meta = user?.user_metadata ?? {};
  const first = typeof meta.first_name === "string" ? meta.first_name.trim() : "";
  if (first) return first;
  const given = typeof meta.given_name === "string" ? meta.given_name.trim() : "";
  return given;
}

/** Prénom saisi par la personne : lettres (accents compris), espaces, tirets et apostrophes, 40 caractères au plus. */
export const FIRST_NAME_RE = /^[\p{L}][\p{L}'’ .-]{0,39}$/u;
