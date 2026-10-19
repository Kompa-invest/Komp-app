import { createClient } from "@/lib/supabase/server";
import { INDISPONIBLE, fail, json, readJson } from "@/lib/kompa/http";

export const runtime = "nodejs";

// « Mon portefeuille » enregistré dans le compte (table public.portfolios,
// voir supabase/nouvelle-interface.sql). Une ligne par compte, qui contient
// la liste des placements telle que la page d'accueil la manipule.

const MAX_LINES = 100;

type Line = { k: string; pid: string; amount: number; fee: number | null; name?: string; asset?: string };

function cleanLine(raw: unknown): Line | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const k = typeof r.k === "string" ? r.k.slice(0, 40) : "";
  const pid = typeof r.pid === "string" ? r.pid.slice(0, 60) : "";
  const amount = Number(r.amount);
  if (!k || !pid || !Number.isFinite(amount) || amount < 0 || amount > 1e12) return null;
  const feeNum = r.fee === null || r.fee === undefined || r.fee === "" ? null : Number(r.fee);
  const line: Line = { k, pid, amount, fee: feeNum !== null && Number.isFinite(feeNum) ? Math.min(Math.max(feeNum, 0), 20) : null };
  if (typeof r.name === "string" && r.name) line.name = r.name.slice(0, 120);
  if (typeof r.asset === "string" && r.asset) line.asset = r.asset.slice(0, 40);
  return line;
}

// Anciens identifiants de produits (ancienne page /portfolio) -> identifiants de la nouvelle interface.
const OLD_IDS: Record<string, string> = {
  world: "ishares-msci-world", sp500: "ishares-sp500", nasdaq: "amundi-nasdaq100", em: "ishares-em-imi",
  cac40: "amundi-cac40", acwi: "spdr-acwi", ftseallworld: "vanguard-all-world", worldsmallcap: "ishares-world-small",
  russell2000: "russell-2000", sp500ew: "xtrackers-sp500-ew", stoxx600: "ishares-stoxx600", eurostoxx50: "ishares-eurostoxx50",
  japan: "ishares-japan", china: "ishares-china", india: "ishares-india", "apple-action": "apple", "lvmh-action": "lvmh",
  "totalenergies-action": "totalenergies", "oat-france": "oat-france", "treasury-us": "treasury-us",
  "obligation-entreprise": "obligation-entreprise", "fonds-actif-actions": "fonds-actif-actions",
  "fonds-diversifie": "fonds-diversifie", "fonds-flexible": "fonds-flexible", "fonds-monetaire-euro": "amundi-overnight",
  "compte-a-terme": "compte-a-terme", "livret-reglemente": "livret-a", scpi: "scpi", opci: "opci",
  "fonciere-cotee": "fonciere-cotee", "produit-capital-garanti": "capital-garanti", autocall: "autocall",
};

async function currentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function GET() {
  const { supabase, user } = await currentUser();
  if (!user) return fail(401, "Connectez-vous pour retrouver votre portefeuille.");

  const { data, error } = await supabase.from("portfolios").select("lines, updated_at").eq("user_id", user.id).maybeSingle();
  if (error) {
    console.error("[portfolio] get", error.message);
    return fail(500, INDISPONIBLE);
  }
  if (data) {
    const lines = Array.isArray(data.lines) ? data.lines.map(cleanLine).filter(Boolean) : [];
    return json({ lines, updatedAt: data.updated_at });
  }

  // Pas encore de portefeuille dans le nouveau format : on reprend, s'il existe,
  // celui de l'ancienne page « Mon portefeuille » (table portfolio_holdings).
  const { data: old } = await supabase
    .from("portfolio_holdings")
    .select("fund_id, fund_name, amount, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });
  const lines: Line[] = (old ?? []).map((h: { fund_id: string; fund_name: string; amount: number }, i: number) => {
    const pid = OLD_IDS[h.fund_id];
    return pid
      ? { k: `old${i}`, pid, amount: Number(h.amount), fee: null }
      : { k: `old${i}`, pid: "custom", amount: Number(h.amount), fee: null, name: h.fund_name, asset: "actions" };
  });
  return json({ lines, updatedAt: null, imported: lines.length > 0 });
}

export async function PUT(req: Request) {
  const body = await readJson(req);
  if (!body || !Array.isArray(body.lines)) return fail(400, "Requête invalide.");
  if (body.lines.length > MAX_LINES) return fail(400, `Un portefeuille peut contenir au plus ${MAX_LINES} placements.`);
  const lines = body.lines.map(cleanLine).filter((l): l is Line => l !== null);

  const { supabase, user } = await currentUser();
  if (!user) return fail(401, "Connectez-vous pour enregistrer votre portefeuille.");

  const { error } = await supabase
    .from("portfolios")
    .upsert({ user_id: user.id, lines, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (error) {
    console.error("[portfolio] put", error.message);
    return fail(500, "Votre portefeuille n'a pas pu être enregistré dans votre compte. Réessayez.");
  }
  return json({ ok: true });
}
