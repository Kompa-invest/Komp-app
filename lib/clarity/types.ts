// Clarity Test : types des données.
// Les textes peuvent contenir un petit sous-ensemble de HTML (&nbsp;, <i>, <strong>) :
// ils sont rédigés par l'équipe Kompa, jamais saisis par un utilisateur.

/** Une source datée. Quand sa date change, les faits qui s'y rattachent repassent « à revoir ». */
export type Source = {
  name: string;
  /** Date affichée (ex. « 3 sept. 2026 »). C'est elle qui sert à détecter un changement. */
  date: string;
  url?: string;
  /** Phrase courte : quand la source est revue (ex. « Revu à chaque nouvelle version du DIC »). */
  refresh: string;
  /** Source qui change souvent (taux, liste annuelle...) : affichée « À surveiller ». */
  watch?: boolean;
};

export type Fact = {
  label: string;
  value: string;
  /** Clé de la source dans `Bank.src`. */
  src: string;
  note?: string;
};

type BaseQuestion = {
  id: string;
  /** Un des repères de la carte (`Bank.axes`). */
  axis: string;
  prompt: string;
  /** Bonne réponse, en quelques mots. */
  good: string;
  explain: string;
  extra?: string;
  fact: Fact;
  /** Question que l'utilisateur peut poser à son intermédiaire. */
  ask: string;
};

export type ChoiceQuestion = BaseQuestion & {
  type: "choice" | "tf";
  options: string[];
  correct: number;
};

export type DocQuestion = BaseQuestion & {
  type: "doc";
  doc?: { title: string; sub: string; section: string; foot: string };
  sentences: string[];
  correct: number;
  /** Étiquette affichée sous la bonne phrase. */
  tag: string;
};

export type SliderQuestion = BaseQuestion & {
  type: "slider";
  min: number;
  max: number;
  step: number;
  start: number;
  unit: "%" | "€";
  target: number;
  /** [écart pour « juste », écart pour « presque »] */
  tol: [number, number];
  /** Décimales de l'écart affiché. */
  dec: number;
  /** « point » ou « € » */
  gapUnit: "point" | "€";
  /** Accord de « sous-estimé(e) » : féminin par défaut (une part). */
  fem?: boolean;
  /** Valeur réelle affichée (ex. « 72,94&nbsp;% »). */
  real: string;
  realLabel: string;
};

export type Question = ChoiceQuestion | DocQuestion | SliderQuestion;

export type Family =
  | "ETF et indices"
  | "Actions"
  | "Obligations"
  | "Fonds d'investissement"
  | "Produits monétaires"
  | "Immobilier"
  | "Produits structurés";

export type Bank = {
  /** Identique à l'identifiant du produit dans le Décodeur (lib/funds.ts). */
  id: string;
  name: string;
  /** ISIN ou « Produit générique du Décodeur ». */
  sub: string;
  /** Nom court (fil d'Ariane, carte de clarté). */
  short: string;
  family: Family;
  /** Phrase de la carte à partager, complétée par « à X %. Et vous ? ». */
  share: string;
  /** Les cinq repères de la carte. */
  axes: string[];
  src: Record<string, Source>;
  questions: Question[];
  /** Points relevés pendant la rédaction, pour Théo (non affichés aux utilisateurs). */
  notes?: string[];
};
