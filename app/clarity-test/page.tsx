import type { Metadata } from "next";
import { BANKS, FAMILIES, getBank } from "@/lib/clarity";
import { QUESTION_SEMAINE } from "@/lib/clarity/semaine";
import Rubrique, { type Item } from "./Rubrique";

export const metadata: Metadata = {
  title: "Le Clarity Test · Kompa",
  description:
    "Savez-vous vraiment ce que vous détenez\u00a0? Un test court sur un produit précis, deux scores (clarté et lucidité) et des faits datés, tirés de sources officielles.",
};

export default function ClarityTestPage() {
  // Seul le strict nécessaire part vers le navigateur : les questions restent dans chaque test.
  const items: Item[] = BANKS.map((b) => ({
    id: b.id,
    name: b.name,
    sub: b.sub,
    short: b.short,
    family: b.family,
    n: b.questions.length,
    facts: b.questions.map((q) => ({ q: q.id, label: q.fact.label, date: b.src[q.fact.src]?.date ?? "" })),
  }));
  const semaine = { ...QUESTION_SEMAINE, productShort: getBank(QUESTION_SEMAINE.productId)?.short ?? "" };

  return <Rubrique items={items} families={FAMILIES} semaine={semaine} />;
}
