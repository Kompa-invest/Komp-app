import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="kicker mb-3">Kompa</div>
      <h1 className="serif text-4xl md:text-5xl font-medium leading-tight mb-4">
        Comprendre,
        <br />
        pour investir en confiance.
      </h1>
      <p className="text-[15px] mb-8" style={{ color: "var(--muted)" }}>
        Ce que vous possédez, ce qu&apos;on vous propose, combien cela coûte
        réellement. Traduit en langage clair.
      </p>

      <div className="card mb-6">
        <div className="kicker mb-2">Nouveau</div>
        <h2 className="serif text-xl font-medium mb-2">
          Créez un compte pour sauvegarder votre portefeuille.
        </h2>
        <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
          Fini de resaisir vos produits à chaque visite : une fois connecté,
          votre portefeuille simulé dans « Comprendre mes investissements »
          reste enregistré.
        </p>
        {user ? (
          <Link href="/portfolio" className="btn">
            Voir mon portefeuille →
          </Link>
        ) : (
          <div className="flex gap-3 flex-wrap">
            <Link href="/login" className="btn">
              Créer un compte / Se connecter
            </Link>
          </div>
        )}
      </div>

      <p className="text-xs" style={{ color: "var(--muted)" }}>
        Le reste du prototype (Décodeur, Second Opinion, Clarity Test,
        Comprendre les marchés) reste pour l&apos;instant sur la version
        précédente ; il sera migré ici au fil des prochaines briques.
      </p>
    </main>
  );
}
