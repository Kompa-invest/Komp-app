import Link from "next/link";

// Adresse d'un test qui n'existe pas (produit inconnu ou lien ancien).
export default function ClarityNotFound() {
  return (
    <main className="ct-wrap ct-404">
      <div className="ct-kicker">Clarity Test</div>
      <h1>Ce test est introuvable.</h1>
      <p className="ct-lead">
        Le produit demandé n&apos;a pas de Clarity Test, ou l&apos;adresse a changé. Tous les produits du Décodeur ont leur test dans la
        rubrique.
      </p>
      <div className="ct-row" style={{ marginTop: 26 }}>
        <Link className="ct-btn" href="/clarity-test#tester">
          Voir tous les tests <span aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  );
}
