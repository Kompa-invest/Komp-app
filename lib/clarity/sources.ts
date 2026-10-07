import type { Source } from "./types";

// Sources partagées entre plusieurs tests. Chaque date est celle du document
// (ou, à défaut, sa date de consultation). Si une source est mise à jour,
// changer sa date ici fait repasser les faits concernés « à revoir ».

export const FICHE: Source = {
  name: "Fiche Kompa du Décodeur",
  date: "version en ligne",
  refresh: "Revu à chaque mise à jour de la fiche",
};

export const AMF_OBLIGATIONS: Source = {
  name: "AMF, « Pourquoi le prix des obligations baisse lorsque les taux montent »",
  date: "16 oct. 2017",
  url: "https://www.amf-france.org/sites/institutionnel/files/pdf/59282/fr/Pourquoi_le_prix_des_obligations_baisse_lorsque_les_taux_montent_.pdf",
  refresh: "Revu si l'AMF met à jour l'article",
};

export const AMF_FRAIS_2017: Source = {
  name: "AMF, guide « Les frais liés à vos investissements financiers »",
  date: "nov. 2017",
  url: "https://www.amf-france.org/sites/institutionnel/files/contenu_simple/guide/guide_pedagogique/S'informer%20sur%20%20Les%20frais%20lies%20a%20vos%20investissements%20financiers.pdf",
  refresh: "Revu si l'AMF met à jour le guide",
};

export const AMF_FRAIS_2023: Source = {
  name: "AMF, fiche « Les frais des placements financiers »",
  date: "mise en ligne en déc. 2023",
  url: "https://www.amf-france.org/sites/institutionnel/files/private/2023-12/2023_les_frais_des_placements_financiers.pdf",
  refresh: "Revu si l'AMF met à jour la fiche",
};

export const AMF_ETUDE_FRAIS_2024: Source = {
  name: "AMF, étude « Analyse des frais des fonds de droit français »",
  date: "mai 2024",
  url: "https://www.amf-france.org/sites/institutionnel/files/private/2024-05/etude-analyse-des-frais_fr_0.pdf",
  refresh: "Revu si l'AMF publie une nouvelle étude",
};

export const AMF_VOTE_AG: Source = {
  name: "AMF, guide « Le vote en assemblée générale »",
  date: "édition 2022",
  url: "https://www.amf-france.org/sites/institutionnel/files/private/2023-02/Le%20vote%20en%20AG%20MAJ%202023_0.pdf",
  refresh: "Revu si l'AMF met à jour le guide",
};

export const AMF_SCPI: Source = {
  name: "AMF, fiche « Investir dans une SCPI »",
  date: "mise en ligne en déc. 2023",
  url: "https://www.amf-france.org/sites/institutionnel/files/private/2023-12/2023_investir_dans_une_scpi.pdf",
  refresh: "Revu si l'AMF met à jour la fiche",
};

export const AMF_STRUCTURES_NOTE: Source = {
  name: "AMF, note explicative sur les produits structurés",
  date: "mise en ligne en juin 2026",
  url: "https://www.amf-france.org/sites/institutionnel/files/private/2026-06/note_explicative_-_produits_structures.pdf",
  refresh: "Revu si l'AMF publie une nouvelle note",
};

export const AMF_STRUCTURES_ETUDE: Source = {
  name: "AMF, étude sur la lisibilité des produits structurés",
  date: "janv. 2026",
  url: "https://www.amf-france.org/sites/institutionnel/files/private/2026-01/etudes-produits-structures.pdf",
  refresh: "Revu si l'AMF publie une nouvelle étude",
};

export const BOFIP_TTF: Source = {
  name: "BOFiP, taux de la taxe sur les transactions financières",
  date: "28 mai 2025",
  url: "https://bofip.impots.gouv.fr/bofip/14605-PGP.html/ACTU-2025-00034",
  refresh: "Revu à chaque loi de finances",
  watch: true,
};

export const BOFIP_TTF_LISTE: Source = {
  name: "BOFiP, liste des sociétés soumises à la taxe sur les transactions financières",
  date: "17 déc. 2025",
  url: "https://bofip.impots.gouv.fr/bofip/9789-PGP.html/identifiant%3DBOI-ANNX-000467-20251217",
  refresh: "Liste mise à jour chaque fin d'année",
  watch: true,
};

export const SP_PEA: Source = {
  name: "Service-public.gouv.fr, fiche « Plan d'épargne en actions (PEA) »",
  date: "vérifiée le 22 mai 2026",
  url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2385",
  refresh: "Revu à chaque mise à jour de la fiche",
};

export const ECO_GARANTIE: Source = {
  name: "Ministère de l'Économie, « Garantie des dépôts et des titres »",
  date: "consultée le 7 oct. 2026",
  url: "https://www.economie.gouv.fr/facileco/garantie-des-depots-et-des-titres",
  refresh: "Revu si le plafond de garantie change",
};

export const ISHARES_SP500_FS: Source = {
  name: "iShares, fiche mensuelle de l'ETF iShares Core S&P 500",
  date: "31 août 2026",
  url: "https://www.ishares.com/uk/individual/en/literature/fact-sheet/cspx-ishares-core-s-p-500-ucits-etf-fund-fact-sheet-en-gb.pdf",
  refresh: "Revu à chaque nouvelle fiche mensuelle",
  watch: true,
};

export const ISHARES_WORLD_FS: Source = {
  name: "iShares, fiche mensuelle de l'ETF iShares Core MSCI World",
  date: "31 août 2026",
  url: "https://www.ishares.com/gls-download/literature/fact-sheet/swda-ishares-core-msci-world-ucits-etf-fund-fact-sheet-en-gb.pdf",
  refresh: "Revu à chaque nouvelle fiche mensuelle",
  watch: true,
};

export const AMUNDI_CAC40_FS: Source = {
  name: "Amundi, reporting mensuel de l'ETF Amundi CAC 40",
  date: "31 août 2026",
  url: "https://www.amundietf.fr/pdfDocuments/monthly-factsheet/FR0007052782/FRA/FRA/RETAIL/ETF",
  refresh: "Revu à chaque nouveau reporting",
  watch: true,
};
