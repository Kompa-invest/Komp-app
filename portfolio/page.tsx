"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FUNDS, findFund } from "@/lib/funds";

type Holding = {
  id: string;
  fund_id: string;
  fund_name: string;
  amount: number;
};

const MAX_HOLDINGS = 50;

export default function PortfolioPage() {
  const supabase = createClient();
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState("");
  const [addError, setAddError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadHoldings = useCallback(async () => {
    const { data, error } = await supabase
      .from("portfolio_holdings")
      .select("id, fund_id, fund_name, amount")
      .order("created_at", { ascending: true });
    if (!error && data) setHoldings(data as Holding[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?next=/portfolio");
        return;
      }
      setUserEmail(user.email ?? null);
      await loadHoldings();
    })();
  }, [supabase, router, loadHoldings]);

  async function handleAdd() {
    setAddError("");
    const q = query.trim();
    const amt = parseFloat(amount);

    if (!q) {
      setAddError("Indiquez le nom d'un produit.");
      return;
    }
    const fund = findFund(q);
    if (!fund) {
      setAddError(
        "Produit introuvable dans notre bibliothèque. Essayez un nom proche (ex. « World », « Apple », « SCPI »)."
      );
      return;
    }
    if (!amt || amt <= 0 || isNaN(amt)) {
      setAddError("Indiquez un montant investi supérieur à 0 €.");
      return;
    }
    if (holdings.some((h) => h.fund_id === fund.id)) {
      setAddError("Ce produit est déjà dans votre portefeuille.");
      return;
    }
    if (holdings.length >= MAX_HOLDINGS) {
      setAddError(`Cette version est limitée à ${MAX_HOLDINGS} produits.`);
      return;
    }

    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("portfolio_holdings").insert({
      user_id: user.id,
      fund_id: fund.id,
      fund_name: fund.name,
      amount: amt,
    });
    setSaving(false);
    if (error) {
      setAddError("Erreur d'enregistrement : " + error.message);
      return;
    }
    setQuery("");
    setAmount("");
    await loadHoldings();
  }

  async function handleRemove(id: string) {
    setSaving(true);
    await supabase.from("portfolio_holdings").delete().eq("id", id);
    setSaving(false);
    await loadHoldings();
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const totalAmount = holdings.reduce((s, h) => s + h.amount, 0);

  const terRows = holdings
    .map((h) => ({ h, fund: findFund(h.fund_name) }))
    .filter((r) => r.fund && typeof r.fund.ter === "number");
  const terCoveredAmount = terRows.reduce((s, r) => s + r.h.amount, 0);
  const annualFeeEUR = terRows.reduce(
    (s, r) => s + (r.h.amount * (r.fund!.ter as number)) / 100,
    0
  );
  const weightedTerPct =
    terCoveredAmount > 0 ? (annualFeeEUR / terCoveredAmount) * 100 : null;

  const countryTotals: Record<string, number> = {};
  const noGeoNames: string[] = [];
  holdings.forEach((h) => {
    const fund = findFund(h.fund_name);
    if (!fund || !fund.geo || fund.geo.length === 0) {
      noGeoNames.push(h.fund_name);
      return;
    }
    fund.geo.forEach((g) => {
      countryTotals[g.c] = (countryTotals[g.c] || 0) + h.amount * (g.p / 100);
    });
  });
  const countries = Object.keys(countryTotals).sort(
    (a, b) => countryTotals[b] - countryTotals[a]
  );
  const concentration = countries.find(
    (c) => c !== "Reste" && totalAmount > 0 && countryTotals[c] / totalAmount > 0.5
  );

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <Link href="/" className="text-sm" style={{ color: "var(--muted)" }}>
          ← Accueil
        </Link>
        {userEmail && (
          <div className="flex items-center gap-3 text-sm" style={{ color: "var(--muted)" }}>
            <span>{userEmail}</span>
            <button className="btn-ghost" onClick={handleSignOut}>
              Se déconnecter
            </button>
          </div>
        )}
      </div>

      <div className="kicker mb-2">Comprendre mes investissements</div>
      <h1 className="serif text-3xl font-medium mb-3">Votre portefeuille, sauvegardé.</h1>
      <p className="text-[15px] mb-8" style={{ color: "var(--muted)" }}>
        Ajoutez vos produits une seule fois : ils restent enregistrés sur
        votre compte, même avec un grand nombre de lignes.
      </p>

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Chargement…</p>
      ) : (
        <>
          <div className="card mb-6">
            <h3 className="serif text-lg font-medium mb-4">
              Ajouter une ligne à votre portefeuille
            </h3>
            <div className="flex gap-3 flex-wrap">
              <input
                className="field flex-[2] min-w-[200px]"
                list="fund-list"
                placeholder="ex. World, S&P 500, Apple, SCPI..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <datalist id="fund-list">
                {FUNDS.map((f) => (
                  <option key={f.id} value={f.name} />
                ))}
              </datalist>
              <input
                className="field flex-1 min-w-[170px]"
                type="number"
                min={0}
                step={100}
                placeholder="Montant investi (€)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button className="btn" onClick={handleAdd} disabled={saving}>
                Ajouter
              </button>
            </div>
            {addError && <p className="error-text">{addError}</p>}
            <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
              Maximum {MAX_HOLDINGS} produits. Le nom doit correspondre à un
              produit de notre bibliothèque.
            </p>
          </div>

          {holdings.length === 0 ? (
            <div className="card text-sm" style={{ color: "var(--muted)" }}>
              Aucun produit ajouté pour l&apos;instant.
            </div>
          ) : (
            <div className="flex flex-col gap-2 mb-6">
              {holdings.map((h) => (
                <div
                  key={h.id}
                  className="card flex justify-between items-center py-3"
                >
                  <div>
                    <b className="block text-sm">{h.fund_name}</b>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>
                      {Math.round(h.amount).toLocaleString("fr-FR")} € investis
                    </span>
                  </div>
                  <button
                    className="btn-ghost"
                    onClick={() => handleRemove(h.id)}
                    disabled={saving}
                  >
                    Retirer
                  </button>
                </div>
              ))}
            </div>
          )}

          {holdings.length >= 2 && (
            <div className="card">
              <h3 className="serif text-lg font-medium mb-4">
                Votre portefeuille combiné
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="kicker mb-2">Montant total investi</h4>
                  <p className="text-sm">
                    {Math.round(totalAmount).toLocaleString("fr-FR")} €
                  </p>
                </div>
                <div>
                  <h4 className="kicker mb-2">Frais annuels moyens pondérés</h4>
                  {weightedTerPct !== null ? (
                    <p className="text-sm">
                      {weightedTerPct.toFixed(2).replace(".", ",")} % par an,
                      soit environ{" "}
                      {Math.round(annualFeeEUR).toLocaleString("fr-FR")} €/an
                    </p>
                  ) : (
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      Aucun produit sélectionné n&apos;a de frais en % dans
                      notre base.
                    </p>
                  )}
                </div>
              </div>

              {countries.length > 0 && (
                <div className="mt-6">
                  <h4 className="kicker mb-2">Répartition géographique combinée</h4>
                  {countries.map((c) => {
                    const pct =
                      totalAmount > 0
                        ? (countryTotals[c] / totalAmount) * 100
                        : 0;
                    return (
                      <div key={c} className="flex items-center gap-3 text-[13px] mb-2">
                        <span className="w-24 shrink-0">{c}</span>
                        <div
                          className="flex-grow h-2 rounded-full overflow-hidden"
                          style={{ background: "var(--border)" }}
                        >
                          <div
                            style={{
                              width: Math.min(pct, 100).toFixed(1) + "%",
                              background: "var(--accent)",
                              height: "100%",
                            }}
                          />
                        </div>
                        <b className="w-10 text-right" style={{ color: "var(--muted)" }}>
                          {Math.round(pct)} %
                        </b>
                      </div>
                    );
                  })}
                  {noGeoNames.length > 0 && (
                    <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
                      Pas de répartition géographique disponible pour :{" "}
                      {noGeoNames.join(", ")}.
                    </p>
                  )}
                </div>
              )}

              {concentration && (
                <div
                  className="mt-5 pl-4 py-3 text-sm rounded-r-xl"
                  style={{ borderLeft: "3px solid var(--accent)", background: "var(--bg)" }}
                >
                  <b className="block mb-1">Concentration géographique élevée</b>
                  Votre portefeuille est exposé à plus de 50 % à{" "}
                  {concentration}.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
