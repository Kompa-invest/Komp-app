import type { Bank, Family } from "./types";
import { ETF_BANKS } from "./banks/etf";
import { ACTIONS_BANKS } from "./banks/actions";
import { OBLIGATIONS_BANKS } from "./banks/obligations";
import { FONDS_BANKS } from "./banks/fonds";
import { MONETAIRES_BANKS } from "./banks/monetaires";
import { IMMOBILIER_BANKS } from "./banks/immobilier";
import { STRUCTURES_BANKS } from "./banks/structures";

export type { Bank, Family, Question, Source, Fact } from "./types";

/** Les familles, dans l'ordre des onglets du Décodeur. */
export const FAMILIES: Family[] = [
  "ETF et indices",
  "Actions",
  "Obligations",
  "Fonds d'investissement",
  "Produits monétaires",
  "Immobilier",
  "Produits structurés",
];

/** Tous les tests, dans l'ordre du Décodeur. */
export const BANKS: Bank[] = [
  ...ETF_BANKS,
  ...ACTIONS_BANKS,
  ...OBLIGATIONS_BANKS,
  ...FONDS_BANKS,
  ...MONETAIRES_BANKS,
  ...IMMOBILIER_BANKS,
  ...STRUCTURES_BANKS,
];

const BY_ID: Record<string, Bank> = Object.fromEntries(BANKS.map((b) => [b.id, b]));

export function getBank(id: string): Bank | undefined {
  return BY_ID[id];
}

/** Date actuelle de la source d'un fait (sert à savoir si un fait est « à revoir »). */
export function factSourceDate(bank: Bank, questionId: string): string | undefined {
  const q = bank.questions.find((x) => x.id === questionId);
  if (!q) return undefined;
  return bank.src[q.fact.src]?.date;
}
