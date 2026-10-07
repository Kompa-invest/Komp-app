import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtFooter } from "../../../ui";
import { SITE, plainText, readDefi } from "./shared";

type Props = { params: Promise<{ produit: string; score: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { produit, score } = await params;
  const d = readDefi(produit, score);
  if (!d) return {};
  // Le message part d'un proche à un autre : il tutoie. La page, elle, vouvoie (c'est Kompa qui parle).
  const title = `${plainText(d.bank.share)} à ${d.score} %. Et toi ?`;
  const description = `Un Clarity Test Kompa sur ${d.bank.short} : ${d.bank.questions.length} questions, environ 3 minutes. À toi de jouer !`;
  return {
    metadataBase: new URL(SITE),
    title,
    description,
    openGraph: { title, description, siteName: "Kompa", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function DefiPage({ params }: Props) {
  const { produit, score } = await params;
  const d = readDefi(produit, score);
  if (!d) notFound();
  const { bank } = d;
  return (
    <>
      <main className="ct-wrap ct-404">
        <div className="ct-kicker">Un défi Clarity Test</div>
        <h1>
          {plainText(bank.share)} à <em style={{ color: "var(--ct-vd)" }}>{d.score}&nbsp;%</em>.<br />
          Et vous&nbsp;?
        </h1>
        <p className="ct-lead">
          {bank.questions.length} questions sur {bank.name}, aucune de culture générale. Environ 3 minutes. À vous de jouer&nbsp;:
          ferez-vous mieux&nbsp;?
        </p>
        <div className="ct-row" style={{ marginTop: 26 }}>
          <Link className="ct-btn" href={`/clarity-test/${bank.id}`}>
            Relever le défi <span aria-hidden="true">→</span>
          </Link>
          <a className="ct-ghost" href={`/#fiche-${bank.id}`}>
            Lire d&apos;abord la fiche
          </a>
        </div>
      </main>
      <CtFooter />
    </>
  );
}
