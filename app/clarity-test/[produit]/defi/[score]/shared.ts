import { getBank } from "@/lib/clarity";
import type { Bank } from "@/lib/clarity/types";

// Lien de défi partagé après un test : /clarity-test/<produit>/defi/<score>.
export const SITE = "https://www.kompa-invest.fr";

export function plainText(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
}

/** Produit et score valides (entier de 0 à 100), sinon null. */
export function readDefi(produit: string, score: string): { bank: Bank; score: number } | null {
  const bank = getBank(produit);
  if (!bank || !/^\d{1,3}$/.test(score)) return null;
  const n = Number(score);
  if (n > 100) return null;
  return { bank, score: n };
}
