import type { Bank, Question, SliderQuestion } from "./types";

// Règles de calcul du Clarity Test (identiques à la maquette validée le 6 octobre 2026).

export const CONFIDENCE = [
  { label: "Je devine", dots: 1 },
  { label: "Plutôt sûr", dots: 2 },
  { label: "Certain", dots: 3 },
] as const;

export type Answer = {
  qid: string;
  axis: string;
  /** Réponse donnée : index d'option ou valeur du curseur. */
  value: number;
  /** 0 = je devine, 1 = plutôt sûr, 2 = certain */
  conf: number;
  /** Justesse : 1, 0,5 (presque, curseur) ou 0. */
  s: number;
  /** Lucidité de cette réponse, de 0 à 1. */
  l: number;
  /** Clé et date de la source du fait au moment du test. */
  srcKey: string;
  srcDate: string;
};

export function scoreOf(q: Question, v: number): number {
  if (q.type === "slider") {
    const d = Math.abs(v - q.target);
    if (d <= q.tol[0] + 1e-9) return 1;
    if (d <= q.tol[1] + 1e-9) return 0.5;
    return 0;
  }
  return v === q.correct ? 1 : 0;
}

/** Récompense l'accord entre certitude et justesse. */
export function lucidOf(s: number, conf: number): number {
  const ifRight = [0.5, 0.8, 1][conf];
  const ifWrong = [1, 0.45, 0][conf];
  return s * ifRight + (1 - s) * ifWrong;
}

export type Verdict = { cls: "g" | "p" | "b"; title: string; text: string };

export function verdict(s: number, conf: number): Verdict {
  if (s === 1) {
    if (conf === 2) return { cls: "g", title: "Juste, et vous en étiez certain.", text: "C'est un acquis. Il rejoint votre carte." };
    if (conf === 1) return { cls: "g", title: "Juste, bien vu.", text: "Vous pouvez vous faire un peu plus confiance sur ce point." };
    return { cls: "g", title: "Juste, en devinant.", text: "Vous en saviez plus que vous ne le pensiez." };
  }
  if (s === 0.5) return { cls: "p", title: "Presque.", text: "Vous avez la bonne intuition, pas encore le bon ordre de grandeur." };
  if (conf === 2) return { cls: "b", title: "Pas tout à fait, alors que vous étiez certain.", text: "C'est exactement ce que le test cherche&nbsp;: un angle mort. Mieux vaut le découvrir ici." };
  if (conf === 1) return { cls: "b", title: "Pas tout à fait.", text: "Bon à savoir avant que ça compte vraiment." };
  return { cls: "b", title: "Pas tout à fait, et vous le sentiez.", text: "Vous aviez au moins repéré ce que vous ne saviez pas. C'est déjà de la lucidité." };
}

const nf = (d: number) =>
  new Intl.NumberFormat("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

/** Nombre au format français, espaces insécables compris (sortie HTML). */
export function fmt(n: number, d = 0): string {
  return nf(d).format(n).replace(/[  ]/g, "&nbsp;");
}

/** Phrase d'écart pour un curseur, après validation. */
export function sliderGap(q: SliderQuestion, value: number): string {
  const gap = Math.abs(value - q.target);
  if (gap < Math.pow(10, -q.dec) / 2) return "Écart d'intuition&nbsp;: <b>aucun</b>, en plein dans le mille.";
  const unit = q.gapUnit === "€" ? "&nbsp;€" : gap >= 2 ? " points" : " point";
  const e = q.fem === false ? "" : "e";
  const dir = value < q.target ? `, vous l'avez sous-estimé${e}.` : `, vous l'avez surestimé${e}.`;
  return `Écart d'intuition&nbsp;: <b>${fmt(gap, q.dec)}${unit}</b>${dir}`;
}

function avg(a: number[]): number {
  return a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
}

export type Mode = "ok" | "sure" | "shy" | "float";

export type Result = {
  clarity: number;
  lucidity: number;
  axisScore: Record<string, number>;
  mode: Mode;
  angle: number;
  lucidityText: string;
  compassText: string;
  title: string;
  summary: string;
  cells: { solid: string[]; blind: string[]; intu: string[]; disc: string[] };
  asks: string[];
  lucidityLabel: string;
};

export function computeResult(bank: Bank, answers: Answer[]): Result {
  const clarity = Math.round(avg(answers.map((a) => a.s)) * 100);
  const lucidity = Math.round(avg(answers.map((a) => a.l)) * 100);
  const confAvg = avg(answers.map((a) => a.conf / 2));
  const acc = avg(answers.map((a) => a.s));
  const bias = confAvg - acc;

  const axisScore: Record<string, number> = {};
  for (const ax of bank.axes) axisScore[ax] = avg(answers.filter((a) => a.axis === ax).map((a) => a.s));
  const values = bank.axes.map((a) => axisScore[a]);
  const hi = Math.max(...values);
  const lo = Math.min(...values);
  const join = (arr: string[]) => {
    const b = arr.map((x) => `<strong>${x.toLowerCase()}</strong>`);
    return b.length > 1 ? b.slice(0, -1).join(", ") + " et " + b[b.length - 1] : b[0];
  };
  const bestA = bank.axes.filter((a) => axisScore[a] === hi);
  const worstA = bank.axes.filter((a) => axisScore[a] === lo);
  const known = answers.filter((a) => a.s >= 1).length;

  let title: string;
  if (clarity >= 85) title = "Ce produit n'a presque plus de secret pour vous.";
  else if (clarity >= 60) title = "Vous voyez clair, avec quelques zones d'ombre.";
  else if (clarity >= 35) title = "Le brouillard se lève, mais il reste du chemin.";
  else title = "Bonne nouvelle&nbsp;: vous savez maintenant où regarder.";

  let summary = `Vous maîtrisez ${known} notion${known > 1 ? "s" : ""} sur ${answers.length}. `;
  if (hi > lo) {
    summary += (bestA.length > 1 ? "Vos repères les plus clairs&nbsp;: " : "Votre repère le plus clair&nbsp;: ") + join(bestA) + ". ";
    summary += (worstA.length > 1 ? "À éclaircir&nbsp;: " : "Celui à éclaircir&nbsp;: ") + join(worstA) + ".";
  } else {
    summary += "Vos cinq repères sont au même niveau.";
  }

  const blind = answers.filter((a) => a.conf >= 1 && a.s < 0.5).length;
  const intu = answers.filter((a) => a.conf === 0 && a.s >= 0.5).length;
  let mode: Mode;
  if (lucidity >= 75 && blind === 0) mode = "ok";
  else if (blind > intu) mode = "sure";
  else if (intu > blind) mode = "shy";
  else if (lucidity >= 75) mode = "ok";
  else mode = "float";
  const tilt = Math.min(70, Math.max(25, (100 - lucidity) * 1.5));

  let angle = 0;
  let lucidityText: string;
  let compassText: string;
  if (mode === "sure") {
    angle = tilt;
    lucidityText = `Sûr de vous, et pourtant à côté, sur ${blind} question${blind > 1 ? "s" : ""}.`;
    compassText = "Vous avez tendance à être plus sûr que juste. Vos angles morts sont là où vous étiez certain.";
  } else if (mode === "shy") {
    angle = -tilt;
    lucidityText = "Vous doutez plus que nécessaire.";
    compassText = "Vous en savez plus que vous ne le pensez. Vous pouvez vous faire davantage confiance.";
  } else if (mode === "float") {
    lucidityText = "Vos certitudes varient d'une question à l'autre.";
    compassText = "Réglage flottant&nbsp;: tantôt trop sûr, tantôt trop prudent. Le prochain test dira de quel côté vous penchez.";
  } else if (answers.every((a) => a.conf === 0)) {
    lucidityText = "Vous saviez ce que vous ne saviez pas.";
    compassText = "Vous n'avez parié sur aucune certitude, et vous aviez raison de douter. C'est le meilleur point de départ.";
  } else {
    angle = Math.max(-15, Math.min(15, bias * 60));
    lucidityText = "Vos certitudes collent à vos réponses.";
    compassText = "Vos certitudes sont bien réglées&nbsp;: quand vous êtes sûr, vous avez généralement raison.";
  }

  const cells = { solid: [] as string[], blind: [] as string[], intu: [] as string[], disc: [] as string[] };
  answers.forEach((a, k) => {
    const sure = a.conf >= 1;
    const right = a.s >= 0.5;
    const tag = `Q${k + 1}`;
    if (right && sure) cells.solid.push(tag);
    else if (!right && sure) cells.blind.push(tag);
    else if (right && !sure) cells.intu.push(tag);
    else cells.disc.push(tag);
  });

  let asks = answers
    .map((a, k) => (a.s < 1 ? bank.questions[k]?.ask : undefined))
    .filter((x): x is string => !!x);
  if (asks.length === 0) {
    asks = ["La documentation de ce produit a-t-elle changé depuis que je l'ai acheté&nbsp;?", bank.questions[1].ask];
  }
  asks = asks.slice(0, 4);

  const lucidityLabel = { ok: "bien réglée", sure: "plus sûr que juste", shy: "plus prudent que nécessaire", float: "en cours de réglage" }[mode];

  return { clarity, lucidity, axisScore, mode, angle, lucidityText, compassText, title, summary, cells, asks, lucidityLabel };
}

/** Faits dont la source a changé depuis le test (à revoir). */
export function factsToReview(bank: Bank, stored: { q: string; d: string }[]): string[] {
  const out: string[] = [];
  for (const a of stored) {
    const q = bank.questions.find((x) => x.id === a.q);
    if (!q) continue;
    const now = bank.src[q.fact.src]?.date;
    if (now && now !== a.d) out.push(q.id);
  }
  return out;
}
