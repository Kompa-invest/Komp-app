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

/** Le prénom du compte, tel qu'indiqué à l'inscription. */
export function firstNameOf(user: { user_metadata?: Record<string, unknown> } | null | undefined): string {
  const meta = user?.user_metadata ?? {};
  const first = typeof meta.first_name === "string" ? meta.first_name : "";
  if (first) return first;
  const full = typeof meta.full_name === "string" ? meta.full_name : "";
  return full.split(" ")[0] ?? "";
}
