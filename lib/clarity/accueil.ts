// Les chiffres tournants de l'accueil : à chaque visite, trois faits tirés au hasard.
// Chaque fait renvoie à une question du Clarity Test : la source et sa date viennent
// directement du test, donc une mise à jour de la source s'y reporte automatiquement.
// Si la VALEUR d'un fait change, mettre aussi à jour « big » et « text » ci-dessous.

import { getBank } from "./index";

type HomeFactDef = { bank: string; q: string; tag: string; big: string; text: string; link: string };

const DEFS: HomeFactDef[] = [
  { bank: "world", q: "q1", tag: "Concentration", big: "72,94 %", text: "de l'indice MSCI World est investi aux États-Unis, malgré son nom.", link: "Tester l'ETF World" },
  { bank: "fonds-actif-actions", q: "g3", tag: "Fonds actifs", big: "98 %", text: "des fonds actions mondiales en euros ont fait moins bien que leur indice sur 10 ans.", link: "Comprendre les fonds actifs" },
  { bank: "sp500", q: "s2", tag: "Frais", big: "7 €", text: "par an pour 10 000 € dans un ETF S&P 500 à 0,07 % de frais courants (calcul Kompa).", link: "Tester l'ETF S&P 500" },
  { bank: "cac40", q: "c1", tag: "Concentration", big: "61,61 %", text: "d'un ETF CAC 40 repose sur ses 10 premières entreprises.", link: "Tester l'ETF CAC 40" },
  { bank: "em", q: "e1", tag: "Pays émergents", big: "28,8 %", text: "de l'indice des pays émergents est investi à Taïwan, premier pays devant la Corée et la Chine.", link: "Tester l'ETF émergents" },
  { bank: "em", q: "e2", tag: "Une seule entreprise", big: "13,76 %", text: "de l'indice des pays émergents, c'est TSMC à lui seul.", link: "Tester l'ETF émergents" },
  { bank: "compte-a-terme", q: "k3", tag: "Garantie", big: "100 000 €", text: "le plafond de la garantie des dépôts, par personne et par banque.", link: "Comprendre le compte à terme" },
  { bank: "livret-reglemente", q: "a2", tag: "Épargne réglementée", big: "1,7 %", text: "le taux du Livret A depuis le 1er août 2026, revu tous les six mois.", link: "Tester le Livret A" },
  { bank: "scpi", q: "s2", tag: "Frais", big: "5 à 12 %", text: "de frais d'entrée sur une SCPI, selon l'AMF.", link: "Tester la SCPI" },
  { bank: "fonds-monetaire-euro", q: "m3", tag: "Placements prudents", big: "−0,62 %", text: "pour les fonds monétaires court terme au 1er trimestre 2022 : même un placement prudent peut baisser.", link: "Tester le fonds monétaire" },
  { bank: "autocall", q: "c7", tag: "Durée", big: "8 à 12 ans", text: "la durée maximale habituelle d'un produit structuré, selon l'AMF.", link: "Comprendre l'autocall" },
  { bank: "nasdaq", q: "n1", tag: "Secteur", big: "59,65 %", text: "d'un ETF Nasdaq-100 est investi dans la technologie.", link: "Tester l'ETF Nasdaq" },
  { bank: "sp500", q: "s6", tag: "Scénario extrême", big: "−29,6 %", text: "en un an pour un ETF S&P 500 dans le scénario de tension de son DIC, sans plancher garanti.", link: "Tester l'ETF S&P 500" },
  { bank: "fonciere-cotee", q: "r2", tag: "Immobilier coté", big: "95 %", text: "des bénéfices de location qu'une foncière cotée (SIIC) doit reverser à ses actionnaires.", link: "Tester la foncière cotée" },
];

export type HomeFact = { tag: string; big: string; text: string; src: string; href: string; link: string };

export function homeFacts(): HomeFact[] {
  const out: HomeFact[] = [];
  for (const d of DEFS) {
    const bank = getBank(d.bank);
    const q = bank?.questions.find((x) => x.id === d.q);
    const s = q && bank ? bank.src[q.fact.src] : undefined;
    if (!bank || !s) continue;
    const name = s.name.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
    out.push({ tag: d.tag, big: d.big, text: d.text, src: `${name}, ${s.date}`, href: `/clarity-test/${d.bank}`, link: d.link });
  }
  return out;
}
