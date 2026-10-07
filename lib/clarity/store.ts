// Clarity Test : enregistrement des résultats dans Supabase (table clarity_results,
// voir supabase/clarity-test.sql). Utilisé uniquement côté navigateur.
//
// Si la table n'existe pas encore ou si l'enregistrement échoue, rien ne casse :
// le résultat reste affiché, et il est gardé sur l'appareil pour un nouvel essai.

import type { SupabaseClient } from "@supabase/supabase-js";

/** Une réponse telle qu'elle est gardée : question, justesse, certitude, date de la source. */
export type StoredAnswer = { q: string; s: number; c: number; d: string };

export type StoredResult = {
  product_id: string;
  clarity: number;
  lucidity: number;
  answers: StoredAnswer[];
  created_at: string;
};

const PENDING_KEY = "kompa-ct-pending";
/** Un résultat passé sans compte reste disponible deux jours, le temps de se connecter. */
const PENDING_MAX_AGE = 2 * 24 * 60 * 60 * 1000;

export function savePending(r: Omit<StoredResult, "created_at">): void {
  try {
    const list = readPending().filter((x) => x.product_id !== r.product_id);
    list.push({ ...r, created_at: new Date().toISOString() });
    localStorage.setItem(PENDING_KEY, JSON.stringify(list.slice(-10)));
  } catch {
    // stockage indisponible (navigation privée) : on ignore
  }
}

function readPending(): StoredResult[] {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as StoredResult[];
    if (!Array.isArray(list)) return [];
    const now = Date.now();
    return list.filter(
      (x) =>
        x &&
        typeof x.product_id === "string" &&
        Array.isArray(x.answers) &&
        now - new Date(x.created_at).getTime() < PENDING_MAX_AGE
    );
  } catch {
    return [];
  }
}

function writePending(list: StoredResult[]): void {
  try {
    if (list.length) localStorage.setItem(PENDING_KEY, JSON.stringify(list));
    else localStorage.removeItem(PENDING_KEY);
  } catch {
    // ignoré
  }
}

/** Enregistre un résultat pour l'utilisateur connecté. Renvoie true si c'est fait. */
export async function insertResult(
  supabase: SupabaseClient,
  userId: string,
  r: Omit<StoredResult, "created_at"> & { created_at?: string }
): Promise<boolean> {
  try {
    const row: Record<string, unknown> = {
      user_id: userId,
      product_id: r.product_id,
      clarity: Math.round(r.clarity),
      lucidity: Math.round(r.lucidity),
      answers: r.answers,
    };
    if (r.created_at) row.created_at = r.created_at;
    const { error } = await supabase.from("clarity_results").insert(row);
    return !error;
  } catch {
    return false;
  }
}

/** Envoie les résultats passés sans compte, une fois l'utilisateur connecté. */
export async function flushPending(supabase: SupabaseClient, userId: string): Promise<number> {
  const list = readPending();
  if (!list.length) return 0;
  const left: StoredResult[] = [];
  let saved = 0;
  for (const r of list) {
    if (await insertResult(supabase, userId, r)) saved++;
    else left.push(r);
  }
  writePending(left);
  return saved;
}

/** Les résultats de l'utilisateur, du plus récent au plus ancien. `null` si la lecture échoue. */
export async function loadResults(
  supabase: SupabaseClient,
  productId?: string
): Promise<StoredResult[] | null> {
  try {
    let query = supabase
      .from("clarity_results")
      .select("product_id, clarity, lucidity, answers, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (productId) query = query.eq("product_id", productId);
    const { data, error } = await query;
    if (error || !data) return null;
    return data as StoredResult[];
  } catch {
    return null;
  }
}

/** Le dernier résultat de chaque produit. */
export function latestByProduct(rows: StoredResult[]): Record<string, StoredResult> {
  const out: Record<string, StoredResult> = {};
  for (const r of rows) if (!out[r.product_id]) out[r.product_id] = r;
  return out;
}

/** Les produits de « Comprendre mes investissements ». `null` si la lecture échoue. */
export async function loadPortfolioIds(supabase: SupabaseClient): Promise<string[] | null> {
  try {
    const { data, error } = await supabase
      .from("portfolio_holdings")
      .select("fund_id")
      .order("created_at", { ascending: true });
    if (error || !data) return null;
    return (data as { fund_id: string }[]).map((x) => x.fund_id);
  } catch {
    return null;
  }
}

const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

/** Date courte en français, ex. « 6 oct. 2026 ». */
export function shortDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
