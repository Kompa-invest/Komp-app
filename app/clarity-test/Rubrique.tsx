"use client";

// La rubrique Clarity Test : ma carte de clarté, tester un produit, la question de la semaine,
// et le Clarity Test personnel (à venir).

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Family } from "@/lib/clarity/types";
import type { QuestionSemaine } from "@/lib/clarity/semaine";
import { flushPending, latestByProduct, loadPortfolioIds, loadResults, shortDate, type StoredResult } from "@/lib/clarity/store";
import { CtFooter, Html, IconAlert, IconClock, IconDoc, IconSearch, useCtSession } from "./ui";

export type Item = {
  id: string;
  name: string;
  sub: string;
  short: string;
  family: Family;
  n: number;
  /** Faits du test avec la date actuelle de leur source (pour détecter « à revoir »). */
  facts: { q: string; label: string; date: string }[];
};

type Semaine = QuestionSemaine & { productShort: string };

const LOGIN = "/login?next=" + encodeURIComponent("/clarity-test#carte");
const COLLAPSED = 9;

function norm(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/&nbsp;/g, " ");
}

/** Faits dont la source a changé depuis le test : leur intitulé. */
function changed(item: Item, r: StoredResult | undefined): string[] {
  if (!r) return [];
  const out: string[] = [];
  for (const a of r.answers) {
    const f = item.facts.find((x) => x.q === a.q);
    if (f && f.date && f.date !== a.d) out.push(f.label);
  }
  return out;
}

export default function Rubrique({ items, families, semaine }: { items: Item[]; families: Family[]; semaine: Semaine }) {
  const { user, supabase } = useCtSession();
  /** undefined : chargement ; null : lecture impossible. */
  const [rows, setRows] = useState<StoredResult[] | null | undefined>(undefined);
  const [pf, setPf] = useState<string[]>([]);
  const [cat, setCat] = useState<"Tous" | Family>("Tous");
  const [query, setQuery] = useState("");
  const [more, setMore] = useState(false);
  const [weekly, setWeekly] = useState<number | null>(null);

  const byId = useMemo(() => Object.fromEntries(items.map((x) => [x.id, x])) as Record<string, Item>, [items]);

  useEffect(() => {
    if (!user || !supabase) return;
    let alive = true;
    (async () => {
      await flushPending(supabase, user.id);
      const [res, ids] = await Promise.all([loadResults(supabase), loadPortfolioIds(supabase)]);
      if (!alive) return;
      setRows(res);
      setPf((ids ?? []).filter((id) => byId[id]));
      if (window.location.hash === "#carte") {
        requestAnimationFrame(() => document.getElementById("carte")?.scrollIntoView({ block: "start" }));
      }
    })();
    return () => {
      alive = false;
    };
  }, [user, supabase, byId]);

  const latest = useMemo(() => (rows ? latestByProduct(rows) : {}), [rows]);
  const testedIds = useMemo(() => Object.keys(latest).filter((id) => byId[id]), [latest, byId]);
  const reviewOf = (id: string) => changed(byId[id], latest[id]);

  const logged = !!user;
  const featured = useMemo(() => {
    const todo = pf.find((id) => !latest[id]);
    return byId[todo ?? pf[0] ?? "world"] ?? items[0];
  }, [pf, latest, byId, items]);

  /* ---------- Bloc 1 : ma carte ---------- */
  function renderCarte() {
    if (user === undefined || (logged && rows === undefined)) {
      return <div className="ct-loading" aria-label="Chargement de votre carte" />;
    }
    if (!logged) {
      return (
        <div className="ct-panel ct-locked">
          <div className="ct-ghostrows ct-cards" aria-hidden="true">
            {[0, 1, 2].map((k) => (
              <div className="ct-pc" key={k}>
                <div>
                  <div className="ct-ln" style={{ width: ["70%", "55%", "62%"][k] }} />
                  <div className="ct-ln" style={{ width: "40%" }} />
                </div>
                <div className="ct-sc">
                  <div>
                    <span>CLARTÉ</span>
                    <b>··</b>
                  </div>
                  <div>
                    <span>LUCIDITÉ</span>
                    <b>··</b>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="ct-lock-msg">
            <div className="ct-kicker">Réservé aux comptes Kompa</div>
            <h3>Votre carte de clarté vous attend</h3>
            <p>
              Sans compte, vous pouvez passer les tests et voir votre résultat. Avec un compte, Kompa garde votre carte et vous signale
              quand un fait change sur vos produits.
            </p>
            <div className="ct-row">
              <Link className="ct-btn" href={LOGIN}>
                Créer un compte / Se connecter
              </Link>
            </div>
          </div>
        </div>
      );
    }
    if (rows === null) {
      return (
        <div className="ct-panel ct-empty-card">
          <h3>Votre carte n&apos;a pas pu être chargée</h3>
          <p>Réessayez dans quelques instants. Vous pouvez passer un test en attendant&nbsp;: votre résultat s&apos;affichera bien.</p>
          <a className="ct-btn" href="#tester">
            Choisir un produit
          </a>
        </div>
      );
    }
    const ordered = [...testedIds].sort((a, b) => latest[b].created_at.localeCompare(latest[a].created_at));
    const pfTodo = pf.filter((id) => !latest[id]);
    if (!ordered.length && !pfTodo.length) {
      return (
        <div className="ct-panel ct-empty-card">
          <h3>Votre carte est encore vide</h3>
          <p>Passez un premier test&nbsp;: votre résultat s&apos;affichera ici, avec les faits à suivre sur ce produit.</p>
          <a className="ct-btn" href="#tester">
            Choisir un produit
          </a>
        </div>
      );
    }
    const totalReview = ordered.reduce((n, id) => n + reviewOf(id).length, 0);
    const lastDate = ordered.length ? shortDate(latest[ordered[0]].created_at) : "";
    const blind: { id: string; tag: string; label: string }[] = [];
    for (const id of ordered) {
      latest[id].answers.forEach((a, k) => {
        if (a.c >= 1 && a.s < 0.5) {
          const f = byId[id].facts.find((x) => x.q === a.q);
          blind.push({ id, tag: `${byId[id].short} · Q${k + 1}`, label: f?.label ?? "" });
        }
      });
    }
    return (
      <div className="ct-panel">
        <div className="ct-sumrow">
          <span>
            <b>{ordered.length}</b> produit{ordered.length > 1 ? "s" : ""} testé{ordered.length > 1 ? "s" : ""}
            {pf.length > 0 && <> · {pf.length} dans votre portefeuille</>}
          </span>
          <span>
            <b>{totalReview}</b> fait{totalReview > 1 ? "s" : ""} à revoir
          </span>
          {lastDate && <span>Dernier test&nbsp;: {lastDate}</span>}
        </div>
        <div className="ct-cards">
          {ordered.map((id) => {
            const it = byId[id];
            const r = latest[id];
            const rev = reviewOf(id);
            return (
              <div className={`ct-pc${rev.length ? " ct-alert" : ""}`} key={id}>
                <div>
                  <h4>{it.name}</h4>
                  <div className="ct-meta">
                    Testé le {shortDate(r.created_at)} · {r.answers.length} faits suivis
                    {pf.includes(id) && " · dans votre portefeuille"}
                  </div>
                </div>
                <div className="ct-sc">
                  <div>
                    <span>CLARTÉ</span>
                    <b>{r.clarity}&nbsp;%</b>
                  </div>
                  <div>
                    <span>LUCIDITÉ</span>
                    <b>{r.lucidity}&nbsp;%</b>
                  </div>
                </div>
                {rev.length > 0 && (
                  <div className="ct-note">
                    <p>
                      <span className="ct-badge ct-b-warn">
                        <IconAlert /> {rev.length} fait{rev.length > 1 ? "s" : ""} à revoir
                      </span>
                      &nbsp; La source a publié une nouvelle version&nbsp;: <Html html={rev.join(", ")} />.
                    </p>
                    <div className="ct-acts">
                      <Link className="ct-btn ct-v ct-sm" href={`/clarity-test/${id}#a-revoir`}>
                        Voir ce qui a changé
                      </Link>
                      <Link className="ct-ghost ct-sm" href={`/clarity-test/${id}`}>
                        Repasser le test
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {pfTodo.map((id) => (
            <div className="ct-pc" key={id}>
              <div>
                <h4>{byId[id].name}</h4>
                <div className="ct-meta">Dans votre portefeuille · test prêt, pas encore passé</div>
              </div>
              <div className="ct-acts">
                <Link className="ct-btn ct-sm" href={`/clarity-test/${id}`}>
                  Passer le test · 3 min
                </Link>
              </div>
            </div>
          ))}
        </div>
        {blind.length > 0 && (
          <div className="ct-blindrow">
            <span className="ct-t">Vos angles morts&nbsp;:</span>
            {blind.slice(0, 8).map((b) => (
              <Link key={b.tag} className="ct-c" href={`/clarity-test/${b.id}`} title={plainLabel(b.label)}>
                {b.tag}
              </Link>
            ))}
          </div>
        )}
        <p className="ct-fic">
          Les produits «&nbsp;dans votre portefeuille&nbsp;» viennent de «&nbsp;Comprendre mes investissements&nbsp;». Une réponse fausse
          donnée avec assurance devient un angle mort.
        </p>
      </div>
    );
  }

  /* ---------- Bloc 2 : la liste ---------- */
  const q = norm(query.trim());
  let list = items.filter(
    (it) =>
      (cat === "Tous" || it.family === cat) &&
      (!q || norm(it.name).includes(q) || norm(it.sub).includes(q) || norm(it.short).includes(q))
  );
  if (logged && pf.length) list = [...list].sort((a, b) => Number(pf.includes(b.id)) - Number(pf.includes(a.id)));
  const total = list.length;
  const collapsed = !q && cat === "Tous" && !more;
  if (collapsed) list = list.slice(0, COLLAPSED);
  const showMore = (collapsed && total > COLLAPSED) || (more && !q && cat === "Tous");

  const fr = latest[featured.id];
  const frReview = reviewOf(featured.id);

  return (
    <>
      <main className="ct-wide">
        <section className="ct-hero">
          <div>
            <div className="ct-kicker">Le Clarity Test</div>
            <h1>
              Savez-vous vraiment ce que vous <em>détenez</em>&nbsp;?
            </h1>
            <p className="ct-lead">
              Un test court sur un produit précis, jamais de culture générale. Deux scores&nbsp;: la <b>Clarté</b>, ce que vous avez compris,
              et la <b>Lucidité</b>, si vos certitudes tombent juste.
            </p>
            <div className="ct-row">
              <a className="ct-btn" href="#tester">
                Choisir un produit <span aria-hidden="true">→</span>
              </a>
              <a className="ct-ghost" href="#carte">
                {logged ? "Voir ma carte de clarté" : "Ce que garde votre carte"}
              </a>
            </div>
          </div>
          <div className="ct-hv" role="img" aria-label="Exemple de résultat : clarté 57 %, lucidité 59 %, boussole penchée vers « trop sûr »">
            <span className="ct-badge ct-b-soon ct-hv-tag">Exemple</span>
            <div className="ct-hv-p">À la fin de chaque test</div>
            <div className="ct-hv-s">
              <div>
                <span>Clarté</span>
                <b>
                  57<small>%</small>
                </b>
              </div>
              <div className="ct-l">
                <span>Lucidité</span>
                <b>
                  59<small>%</small>
                </b>
              </div>
            </div>
            <svg viewBox="0 0 300 160" aria-hidden="true">
              <path d="M40 140 A110 110 0 0 1 260 140" style={{ fill: "none", stroke: "var(--ct-line2)" }} strokeWidth="1.5" />
              <path d="M112 36 A110 110 0 0 1 188 36" style={{ fill: "none", stroke: "var(--ct-v)" }} strokeWidth="6" strokeLinecap="round" opacity=".55" />
              <text x="150" y="22" textAnchor="middle" fontFamily="IBM Plex Sans, sans-serif" fontSize="10.5" style={{ fill: "var(--ct-muted)" }} letterSpacing=".5">
                BIEN RÉGLÉE
              </text>
              <text x="40" y="156" textAnchor="start" fontFamily="IBM Plex Sans, sans-serif" fontSize="10" style={{ fill: "var(--ct-muted)" }}>
                TROP PRUDENT
              </text>
              <text x="260" y="156" textAnchor="end" fontFamily="IBM Plex Sans, sans-serif" fontSize="10" style={{ fill: "var(--ct-muted)" }}>
                TROP SÛR
              </text>
              <g transform="rotate(48 150 140)">
                <path d="M150 46 L157 140 L150 152 L143 140 Z" style={{ fill: "var(--ct-vdd)" }} />
                <path d="M150 46 L157 140 L150 140 Z" style={{ fill: "var(--ct-v)" }} />
              </g>
              <circle cx="150" cy="140" r="6" style={{ fill: "var(--ct-card)", stroke: "var(--ct-vdd)" }} strokeWidth="2" />
            </svg>
            <p className="ct-hv-m">La boussole de lucidité</p>
          </div>
        </section>

        <section className="ct-sec" id="carte">
          <div className="ct-sec-h">
            <div className="ct-kicker">
              <span className="ct-num">1</span>Ma carte de clarté
            </div>
            <h2>Ce que vous comprenez de vos placements</h2>
            <p>Chaque produit testé a sa ligne. Quand une source officielle change, le fait concerné repasse en «&nbsp;à revoir&nbsp;».</p>
          </div>
          {renderCarte()}
        </section>

        <section className="ct-sec" id="tester">
          <div className="ct-sec-h">
            <div className="ct-kicker">
              <span className="ct-num">2</span>Tester un produit
            </div>
            <h2>Choisissez un produit, puis votre chemin</h2>
            <p>
              Lisez d&apos;abord la fiche du Décodeur, ou testez directement si vous pensez déjà bien le connaître. C&apos;est souvent là que la
              lucidité réserve des surprises.
            </p>
          </div>

          <div className="ct-feat">
            <div>
              <div className="ct-row" style={{ gap: 6 }}>
                <span className="ct-badge ct-b-ready">Test prêt</span>
                {pf.includes(featured.id) && <span className="ct-badge ct-b-pf">Dans votre portefeuille</span>}
              </div>
              <h3>{featured.name}</h3>
              <div className="ct-isin">{featured.sub}</div>
              <div className="ct-tags">
                <span>{featured.family}</span>
                <span>{featured.n} questions</span>
                <span>Environ 3 minutes</span>
                <span>Faits tirés de sources officielles</span>
              </div>
              {fr && (
                <div className="ct-done">
                  Déjà passé le {shortDate(fr.created_at)}&nbsp;: clarté {fr.clarity}&nbsp;%, lucidité {fr.lucidity}&nbsp;%.
                  {frReview.length > 0 &&
                    (frReview.length > 1 ? ` ${frReview.length} faits ont changé depuis.` : " Un fait a changé depuis.")}
                </div>
              )}
            </div>
            <div className="ct-paths">
              <a className="ct-path ct-main" href={`/#fiche-${featured.id}`}>
                <span className="ct-ic">
                  <IconDoc />
                </span>
                <span>
                  <b>Lire la fiche, puis tester</b>
                  <span>Le chemin le plus simple pour une première fois</span>
                </span>
              </a>
              <Link className="ct-path" href={`/clarity-test/${featured.id}`}>
                <span className="ct-ic">
                  <IconClock />
                </span>
                <span>
                  <b>{fr ? "Repasser le test directement" : "Je le connais déjà, tester directement"}</b>
                  <span>Pour mesurer ce que vous pensez savoir</span>
                </span>
              </Link>
            </div>
          </div>

          <div className="ct-list-h">
            <h3>Tous les tests</h3>
            <label className="ct-search">
              <IconSearch />
              <input
                type="search"
                placeholder="Nom ou ISIN d'un produit"
                aria-label="Rechercher un produit"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>
          <div className="ct-chiprow" role="group" aria-label="Filtrer par catégorie">
            {(["Tous", ...families] as ("Tous" | Family)[]).map((c) => (
              <button key={c} type="button" className="ct-chip" aria-pressed={c === cat} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="ct-plist">
            {list.length ? (
              list.map((it) => {
                const r = latest[it.id];
                const rev = r ? reviewOf(it.id).length : 0;
                return (
                  <Link className="ct-pi" key={it.id} href={`/clarity-test/${it.id}`}>
                    <div>
                      <b>{it.name}</b>
                      <span className="ct-m">
                        {it.sub.startsWith("Produit générique") ? "" : `${it.sub} · `}
                        {it.family}
                      </span>
                    </div>
                    <div className="ct-bs">
                      {logged && pf.includes(it.id) && <span className="ct-badge ct-b-pf">Portefeuille</span>}
                      {rev > 0 && <span className="ct-badge ct-b-warn">À revoir</span>}
                      {r && !rev && <span className="ct-badge ct-b-done">Testé · {r.clarity}&nbsp;%</span>}
                      <span className="ct-go">
                        {r ? "Repasser" : "Tester"} <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="ct-empty">Aucun produit ne correspond. Le Décodeur s&apos;enrichit régulièrement.</div>
            )}
          </div>
          {showMore && (
            <div className="ct-more">
              <button type="button" className="ct-ghost" onClick={() => setMore(!more)}>
                {more ? "Réduire la liste" : `Voir les ${total} tests du Décodeur`}
              </button>
            </div>
          )}
          <p className="ct-fic">
            Chaque produit du Décodeur a son test. Il est aussi proposé en bas de la fiche du produit, juste après la lecture.
          </p>
        </section>

        <section className="ct-sec" id="semaine">
          <div className="ct-sec-h">
            <div className="ct-kicker">
              <span className="ct-num">3</span>La question de la semaine
            </div>
            <h2>Une question, une minute, tirée du Magazine</h2>
            <p>Chaque lundi, une question liée à l&apos;édition de la semaine. Un mécanisme à comprendre, jamais une prévision.</p>
          </div>
          <div className="ct-panel ct-qw">
            <div>
              <span className="ct-badge ct-b-soon">
                N°{semaine.edition} · {semaine.week}
              </span>
              <Html as="h3" html={semaine.prompt} />
            </div>
            <div>
              <div className="ct-qopts" role="group" aria-label="Votre réponse">
                {semaine.options.map((o, k) => {
                  let cls = "ct-qopt";
                  if (weekly !== null) {
                    if (k === semaine.correct) cls += " ct-good";
                    else if (k === weekly) cls += " ct-bad";
                  }
                  return (
                    <button key={k} type="button" className={cls} disabled={weekly !== null} onClick={() => setWeekly(k)}>
                      <span className="ct-k" aria-hidden="true">
                        {"ABCD"[k]}
                      </span>
                      <Html html={o} />
                    </button>
                  );
                })}
              </div>
              {weekly !== null && (
                <div className="ct-qrev" role="status">
                  <b>
                    {weekly === semaine.correct
                      ? `Exact\u00a0: ${semaine.good.charAt(0).toLowerCase()}${semaine.good.slice(1)}.`
                      : `${semaine.good}, en fait.`}
                  </b>
                  <Html html={semaine.explain} />
                  <div className="ct-src">
                    Source&nbsp;:{" "}
                    <a href={semaine.source.url} target="_blank" rel="noopener noreferrer">
                      {semaine.source.name}
                    </a>
                    , {semaine.source.date}
                  </div>
                  <div className="ct-row">
                    <a className="ct-ghost ct-sm" href={`/magazine#${semaine.slug}`}>
                      Lire l&apos;édition N°{semaine.edition}
                    </a>
                    {semaine.productShort && (
                      <Link className="ct-ghost ct-sm" href={`/clarity-test/${semaine.productId}`}>
                        Passer le test complet&nbsp;: {semaine.productShort}
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="ct-sec" id="perso">
          <div className="ct-perso">
            <div>
              <span className="ct-badge ct-b-pay">Bientôt</span>
              <h3>Le Clarity Test personnel</h3>
              <p>
                Le même test, construit à partir de vos propres documents. Pour vérifier que vous avez compris ce que vous vous apprêtez à
                signer.
              </p>
              <button type="button" className="ct-btn" disabled>
                Bientôt disponible
              </button>
            </div>
            <ol className="ct-steps3">
              <li>
                <span className="ct-n">1</span>
                <div>
                  <b>Vous déposez la proposition reçue</b>
                  <span>Via Second Opinion, ou le relevé de votre contrat.</span>
                </div>
              </li>
              <li>
                <span className="ct-n">2</span>
                <div>
                  <b>Kompa prépare les questions</b>
                  <span>À partir de votre document, pas d&apos;un produit type.</span>
                </div>
              </li>
              <li>
                <span className="ct-n">3</span>
                <div>
                  <b>Vous vérifiez avant de décider</b>
                  <span>Avec un bilan imprimable et les questions à poser en rendez-vous.</span>
                </div>
              </li>
            </ol>
          </div>
        </section>
      </main>
      <CtFooter>
        <b>Comment fonctionne le Clarity Test</b>
        <p style={{ marginTop: 8 }}>
          Chaque test porte sur un produit du Décodeur. Chaque réponse s&apos;appuie sur une source officielle, citée avec sa date dans le
          test. Vos résultats ne sont enregistrés que si vous êtes connecté, et vous seul y avez accès.
        </p>
      </CtFooter>
    </>
  );
}

function plainLabel(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
}
