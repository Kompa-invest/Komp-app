// La question de la semaine du Clarity Test, liée à l'édition du lundi du Magazine.
// À mettre à jour chaque semaine, en même temps que l'édition (voir la procédure
// « Comprendre les marchés » dans le projet Kompa). Un mécanisme, jamais une prévision.

export type QuestionSemaine = {
  edition: number;
  /** Ancre de l'édition dans le Magazine, ex. « n5 ». */
  slug: string;
  week: string;
  prompt: string;
  options: string[];
  correct: number;
  good: string;
  explain: string;
  source: { name: string; date: string; url: string };
  /** Test du Décodeur le plus proche du sujet. */
  productId: string;
};

export const QUESTION_SEMAINE: QuestionSemaine = {
  edition: 5,
  slug: "n5",
  week: "Semaine du 28 septembre au 2 octobre 2026",
  prompt:
    "Cette semaine, le taux auquel la France emprunte à 10 ans a frôlé 5&nbsp;%. Quand ce taux monte, que devient le prix des OAT déjà émises, celles que détiennent de nombreux fonds&nbsp;?",
  options: ["Il monte", "Il baisse", "Il ne bouge pas, puisque c'est l'État qui emprunte"],
  correct: 1,
  good: "Il baisse",
  explain:
    "Les nouvelles OAT offrent des intérêts plus élevés&nbsp;: les anciennes, moins rémunératrices, intéressent moins et leur prix baisse. C'est ce qui peut faire reculer un fonds obligataire, y compris en assurance-vie. Gardée jusqu'à l'échéance, une OAT est remboursée comme prévu, sauf défaut de l'État.",
  source: {
    name: "AMF, « Pourquoi le prix des obligations baisse lorsque les taux montent »",
    date: "16 oct. 2017",
    url: "https://www.amf-france.org/sites/institutionnel/files/pdf/59282/fr/Pourquoi_le_prix_des_obligations_baisse_lorsque_les_taux_montent_.pdf",
  },
  productId: "oat-france",
};
