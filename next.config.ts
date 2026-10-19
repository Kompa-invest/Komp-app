import type { NextConfig } from "next";

// Nouvelle interface (octobre 2026) : toute la vitrine est la page statique
// public/kompa.html, servie à l'adresse « / ». Ses pages internes ont des adresses
// du type /#/magazine. Les anciennes adresses sont redirigées vers leur équivalent.
//
// Retour à l'ancienne page d'accueil : supprimer la règle « beforeFiles » ci-dessous
// (l'ancienne page app/page.tsx est toujours dans le dépôt).

const ANCIENNES_ADRESSES: [string, string][] = [
  ["/magazine", "/#/magazine"],
  ["/magazine/index.html", "/#/magazine"],
  ["/interets-composes", "/#/calculateur"],
  ["/login", "/#/compte"],
  ["/portfolio", "/#/portefeuille"],
  ["/clarity-test", "/#/clarity-test"],
  ["/clarity-test/:produit", "/#/clarity-test/:produit"],
  ["/clarity-test/:produit/defi/:score", "/#/clarity-test/:produit"],
];

const nextConfig: NextConfig = {
  async redirects() {
    return ANCIENNES_ADRESSES.map(([source, destination]) => ({ source, destination, permanent: false }));
  },
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/kompa.html" }],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
