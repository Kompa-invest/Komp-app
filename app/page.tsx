import fs from "fs";
import path from "path";
import { createClient } from "@/lib/supabase/server";
import LegacyHome from "./home-legacy/LegacyHome";
import { BANKS } from "@/lib/clarity";
import { homeFacts } from "@/lib/clarity/accueil";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const dir = path.join(process.cwd(), "app/home-legacy");
  const html = fs.readFileSync(path.join(dir, "content.html"), "utf-8");
  const script1 = fs.readFileSync(path.join(dir, "script1.js"), "utf-8");
  // Liste des produits qui ont un Clarity Test : le Décodeur affiche le bloc du test sous leur fiche.
  const clarityIds = JSON.stringify(BANKS.map((b) => b.id));
  const script3 =
    `window.__KOMPA_CT__ = ${clarityIds};\n` +
    // Chiffres tournants de l'accueil (lib/clarity/accueil.ts).
    `window.__KOMPA_FACTS__ = ${JSON.stringify(homeFacts()).replace(/</g, "\\u003c")};\n` +
    fs.readFileSync(path.join(dir, "script3.js"), "utf-8");

  return (
    <LegacyHome html={html} script1={script1} script3={script3} isLoggedIn={!!user} />
  );
}
