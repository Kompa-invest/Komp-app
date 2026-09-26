import type { Metadata } from "next";
import Link from "next/link";
import CompoundSimulator from "./CompoundSimulator";

export const metadata: Metadata = {
  title: "Calculateur d'intérêts composés, et l'effet boule de neige expliqué · Kompa",
  description:
    "Calculez ce que deviendra votre épargne, et comprenez pourquoi : intérêts de vos intérêts, poids réel des frais.",
};

export default function InteretsComposesPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <Link href="/" className="text-sm" style={{ color: "var(--muted)" }}>
        ← Accueil
      </Link>
      <div className="kicker mt-8 mb-2">Intérêts composés</div>
      <h1 className="serif mb-3" style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 480, lineHeight: 1.15 }}>
        Calculez, puis comprenez.
      </h1>
      <p className="mb-8 max-w-2xl" style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6 }}>
        Estimez ce que deviendra votre épargne, puis voyez d&apos;où vient ce résultat : vos versements,
        les intérêts qu&apos;ils produisent, et les intérêts de ces intérêts.
      </p>
      <CompoundSimulator />
    </main>
  );
}
