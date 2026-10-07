import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BANKS, getBank } from "@/lib/clarity";
import type { Bank } from "@/lib/clarity/types";
import ClarityTest from "./ClarityTest";

// Un test par produit du Décodeur, généré à la construction du site.
// Un identifiant inconnu affiche la page « introuvable » de la rubrique (app/clarity-test/not-found.tsx).

export function generateStaticParams() {
  return BANKS.map((b) => ({ produit: b.id }));
}

type Props = { params: Promise<{ produit: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { produit } = await params;
  const bank = getBank(produit);
  if (!bank) return {};
  return {
    title: `Clarity Test\u00a0: ${bank.short} · Kompa`,
    description: `${bank.questions.length} questions pour vérifier ce que vous comprenez vraiment de ce produit\u00a0: ${bank.name}. Chaque réponse révèle un fait daté, tiré d'une source officielle.`,
  };
}

export default async function ProductTestPage({ params }: Props) {
  const { produit } = await params;
  const bank = getBank(produit);
  if (!bank) notFound();

  // Les notes de rédaction restent internes : elles ne partent pas vers le navigateur.
  const publicBank: Bank = { ...bank, notes: undefined };
  const names: Record<string, string> = Object.fromEntries(BANKS.map((b) => [b.id, b.name]));

  return <ClarityTest key={bank.id} bank={publicBank} names={names} />;
}
