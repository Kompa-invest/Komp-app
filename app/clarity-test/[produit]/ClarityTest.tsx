"use client";

// Clarity Test d'un produit : accueil, 7 questions, puis la carte de clarté.
// Les règles de calcul sont dans lib/clarity/scoring.ts, les questions dans lib/clarity/banks/.

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { Bank, ChoiceQuestion, DocQuestion, Question, SliderQuestion, Source } from "@/lib/clarity/types";
import {
  CONFIDENCE,
  computeResult,
  factsToReview,
  fmt,
  lucidOf,
  scoreOf,
  sliderGap,
  verdict,
  type Answer,
  type Result,
} from "@/lib/clarity/scoring";
import {
  flushPending,
  insertResult,
  latestByProduct,
  loadPortfolioIds,
  loadResults,
  savePending,
  shortDate,
  type StoredResult,
} from "@/lib/clarity/store";
import { CtFooter, FamilyIcon, Html, IconAlert, IconBell, IconClock, Toast, plain, useCtSession, useToast } from "../ui";

type Stage = "intro" | "quiz" | "results";
type Cur = { value: number | null; conf: number | null; done: boolean };
type SaveState = "idle" | "saving" | "saved" | "error" | "anon";

const EMPTY: Cur = { value: null, conf: null, done: false };
const LOGIN_NEXT = "/login?next=" + encodeURIComponent("/clarity-test#carte");

const subscribeNothing = () => () => {};
/** Paramètres de l'adresse, lus sans décalage entre le serveur et le navigateur. */
function useSearch(): string {
  return useSyncExternalStore(subscribeNothing, () => window.location.search, () => "");
}

function reducedMotion(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function scrollTop(el?: HTMLElement | null) {
  const behavior: ScrollBehavior = reducedMotion() ? "auto" : "smooth";
  if (el) el.scrollIntoView({ behavior, block: "start" });
  else window.scrollTo({ top: 0, behavior });
}

/** Nombre de décimales d'un pas de curseur (0,5 donne 1). */
function decimals(step: number): number {
  const s = String(step);
  return s.includes(".") ? s.split(".")[1].length : 0;
}

/** Sources utilisées par les questions, dans l'ordre d'apparition. */
function usedSources(bank: Bank): Source[] {
  const seen = new Set<string>();
  const out: Source[] = [];
  for (const q of bank.questions) {
    if (seen.has(q.fact.src)) continue;
    seen.add(q.fact.src);
    const s = bank.src[q.fact.src];
    if (s) out.push(s);
  }
  return out;
}

function SourceName({ src }: { src: Source }) {
  return src.url ? (
    <a href={src.url} target="_blank" rel="noopener noreferrer" dangerouslySetInnerHTML={{ __html: src.name }} />
  ) : (
    <Html html={src.name} />
  );
}

export default function ClarityTest({ bank, names }: { bank: Bank; names: Record<string, string> }) {
  const { user, supabase } = useCtSession();
  const fromFiche = new URLSearchParams(useSearch()).get("depuis") === "fiche";
  const Q = bank.questions;

  const [stage, setStage] = useState<Stage>("intro");
  const [i, setI] = useState(0);
  const [cur, setCur] = useState<Cur>(EMPTY);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [last, setLast] = useState<StoredResult | null>(null);
  const [save, setSave] = useState<SaveState>("idle");
  const [pfTodo, setPfTodo] = useState<string[]>([]);
  const [toast, showToast] = useToast();
  const quizRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const movedRef = useRef(false);

  // Compte connecté : on envoie un éventuel résultat en attente, puis on lit le dernier test de ce produit.
  useEffect(() => {
    if (!user || !supabase) return;
    let alive = true;
    (async () => {
      await flushPending(supabase, user.id);
      const rows = await loadResults(supabase, bank.id);
      if (!alive || !rows || !rows.length) return;
      setLast(rows[0]);
      if (window.location.hash === "#a-revoir") {
        requestAnimationFrame(() => document.getElementById("a-revoir")?.scrollIntoView({ block: "start" }));
      }
    })();
    return () => {
      alive = false;
    };
  }, [user, supabase, bank.id]);

  // Après validation, le bouton « Question suivante » prend le focus (clavier, lecteurs d'écran).
  // Sur petit écran, la page se place sur la réponse : les barres « estimation / réalité »
  // pour un curseur, l'explication pour les autres questions.
  const isSlider = Q[i]?.type === "slider";
  useEffect(() => {
    if (!cur.done) return;
    nextRef.current?.focus({ preventScroll: true });
    const id = requestAnimationFrame(() => {
      const target = document.querySelector(isSlider ? ".ct-bars" : ".ct-rev");
      if (!target) return;
      const top = target.getBoundingClientRect().top;
      if (top > window.innerHeight * 0.65 || top < 90) {
        window.scrollBy({ top: top - 120, behavior: reducedMotion() ? "auto" : "smooth" });
      }
    });
    return () => cancelAnimationFrame(id);
  }, [cur.done, isSlider]);

  // À chaque nouvelle question, le titre prend le focus et la page remonte.
  useEffect(() => {
    if (stage !== "quiz" || !movedRef.current) return;
    titleRef.current?.focus({ preventScroll: true });
    scrollTop(quizRef.current);
  }, [i, stage]);

  const result = useMemo<Result | null>(
    () => (stage === "results" && answers.length === Q.length ? computeResult(bank, answers) : null),
    [stage, answers, bank, Q.length]
  );

  const review = useMemo(() => (last ? factsToReview(bank, last.answers) : []), [last, bank]);

  function start() {
    setAnswers([]);
    setI(0);
    setCur(EMPTY);
    setSave("idle");
    setStage("quiz");
    movedRef.current = true;
    scrollTop();
  }

  function validate() {
    const q = Q[i];
    if (cur.done || cur.value === null || cur.conf === null) return;
    const s = scoreOf(q, cur.value);
    const l = lucidOf(s, cur.conf);
    const answer: Answer = {
      qid: q.id,
      axis: q.axis,
      value: cur.value,
      conf: cur.conf,
      s,
      l,
      srcKey: q.fact.src,
      srcDate: bank.src[q.fact.src]?.date ?? "",
    };
    setAnswers((prev) => [...prev.slice(0, i), answer]);
    setCur({ ...cur, done: true });
  }

  function next() {
    if (i < Q.length - 1) {
      setI(i + 1);
      setCur(EMPTY);
      return;
    }
    finish(answers);
  }

  function finish(all: Answer[]) {
    const r = computeResult(bank, all);
    const record = {
      product_id: bank.id,
      clarity: r.clarity,
      lucidity: r.lucidity,
      answers: all.map((a) => ({ q: a.qid, s: a.s, c: a.conf, d: a.srcDate })),
    };
    setStage("results");
    scrollTop();
    if (user && supabase) {
      setSave("saving");
      insertResult(supabase, user.id, record).then((ok) => {
        if (!ok) savePending(record);
        setSave(ok ? "saved" : "error");
        if (ok) setLast({ ...record, created_at: new Date().toISOString() });
      });
      Promise.all([loadPortfolioIds(supabase), loadResults(supabase)]).then(([pf, rows]) => {
        if (!pf) return;
        const tested = rows ? latestByProduct(rows) : {};
        setPfTodo(pf.filter((id) => id !== bank.id && !tested[id] && names[id]).slice(0, 2));
      });
    } else {
      savePending(record);
      setSave("anon");
    }
  }

  async function share(r: Result) {
    const url = `${window.location.origin}/clarity-test/${bank.id}`;
    const text = `${plain(bank.share)} à ${r.clarity} %. Et vous ? Le Clarity Test Kompa :`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Clarity Test Kompa", text, url });
      } catch {
        // partage annulé
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      showToast("Lien copié. Vous pouvez le coller dans un message.");
    } catch {
      showToast(`Lien du test\u00a0: ${url}`);
    }
  }

  const sources = usedSources(bank);

  return (
    <>
      <main>
        {stage === "intro" && (
          <section className="ct-intro">
            <div className="ct-wrap">
              <nav className="ct-crumb" aria-label="Fil d'Ariane">
                <Link href="/clarity-test">Clarity Test</Link>
                <span aria-hidden="true">›</span>
                <span>{bank.family}</span>
              </nav>
              <div className="ct-prod">
                <div className="ct-prod-ic">
                  <FamilyIcon family={bank.family} />
                </div>
                <div>
                  <b>{bank.name}</b>
                  <span>{bank.sub}</span>
                </div>
              </div>
              {fromFiche ? (
                <h1>
                  Vous venez de lire la fiche.
                  <br />
                  <em>Que vous en reste-t-il&nbsp;?</em>
                </h1>
              ) : (
                <h1>
                  Ce produit,
                  <br />
                  <em>que savez-vous vraiment&nbsp;?</em>
                </h1>
              )}
              <p className="ct-lead">
                {Q.length} questions sur ce produit précis, aucune de culture générale. À chaque réponse, vous dites aussi à quel point vous
                êtes sûr de vous. C&apos;est là que le test devient intéressant.
              </p>

              <div className="ct-duo">
                <div className="ct-duo-c">
                  <div className="ct-kicker">Score 1</div>
                  <div className="ct-t">Clarté</div>
                  <p>Ce que vous avez réellement compris du produit.</p>
                </div>
                <div className="ct-duo-c">
                  <div className="ct-kicker">Score 2</div>
                  <div className="ct-t">Lucidité</div>
                  <p>Si vous savez ce que vous savez. Être certain et se tromper, c&apos;est le vrai risque.</p>
                </div>
              </div>

              <ol className="ct-steps">
                <li>
                  <span className="ct-n">1</span>
                  <span>
                    Vous répondez, puis vous pariez sur votre certitude&nbsp;: «&nbsp;je devine&nbsp;», «&nbsp;plutôt sûr&nbsp;» ou
                    «&nbsp;certain&nbsp;».
                  </span>
                </li>
                <li>
                  <span className="ct-n">2</span>
                  <span>Chaque réponse révèle un fait tiré de sources officielles, avec sa source et sa date.</span>
                </li>
                <li>
                  <span className="ct-n">3</span>
                  <span>
                    Avec un compte, votre carte de clarté garde ces faits en mémoire. Quand une source change, la carte vous le signale.
                  </span>
                </li>
              </ol>

              {last && (
                <div className={`ct-past${review.length ? " ct-alert" : ""}`} id="a-revoir">
                  <div className="ct-past-top">
                    <b>Déjà passé le {shortDate(last.created_at)}</b>
                    <span className="ct-muted ct-small">
                      Clarté {last.clarity}&nbsp;% · Lucidité {last.lucidity}&nbsp;%
                    </span>
                    {review.length > 0 && (
                      <span className="ct-badge ct-b-warn">
                        <IconAlert /> {review.length} fait{review.length > 1 ? "s" : ""} à revoir
                      </span>
                    )}
                  </div>
                  {review.length > 0 ? (
                    <>
                      <p className="ct-small" style={{ margin: "10px 0 0" }}>
                        Depuis votre test, la source de {review.length > 1 ? "ces faits" : "ce fait"} a publié une nouvelle version&nbsp;:
                      </p>
                      <ul>
                        {review.map((qid) => {
                          const q = Q.find((x) => x.id === qid);
                          if (!q) return null;
                          const src = bank.src[q.fact.src];
                          return (
                            <li key={qid}>
                              <Html html={q.fact.label} />
                              &nbsp;: <Html as="b" html={q.fact.value} />{" "}
                              <span className="ct-src">
                                ({src && <SourceName src={src} />}, {src?.date})
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : (
                    <p className="ct-small ct-muted" style={{ margin: "8px 0 0" }}>
                      Aucune source n&apos;a changé depuis&nbsp;: vos faits sont toujours à jour.
                    </p>
                  )}
                </div>
              )}

              <div className="ct-cta-row">
                <button type="button" className="ct-btn" onClick={start}>
                  {last ? "Repasser le test" : "Commencer le test"} <span aria-hidden="true">→</span>
                </button>
                <span className="ct-muted ct-small">Environ 3 minutes</span>
                {!fromFiche && (
                  <a className="ct-ghost ct-sm" href={`/#fiche-${bank.id}`}>
                    Lire d&apos;abord la fiche
                  </a>
                )}
              </div>

              <div className="ct-legal">
                Ce test vérifie que vous comprenez le produit. Il ne dit pas si ce produit vous convient&nbsp;: Kompa ne choisit jamais à
                votre place.
              </div>
            </div>
          </section>
        )}

        {stage === "quiz" && (
          <section className="ct-quiz" ref={quizRef} aria-label="Questions du test">
            <div className="ct-wrap">
              <div className="ct-prog" aria-hidden="true">
                {Q.map((q, k) => (
                  <i key={q.id} className={k < i ? "ct-on" : k === i ? "ct-cur" : undefined} />
                ))}
              </div>
              <div className="ct-prog-l">
                <span>
                  Question {i + 1} sur {Q.length}
                </span>
                <span>{bank.short}</span>
              </div>
              <QuestionCard
                key={Q[i].id}
                bank={bank}
                q={Q[i]}
                cur={cur}
                setCur={setCur}
                onValidate={validate}
                onNext={next}
                isLast={i === Q.length - 1}
                titleRef={titleRef}
                nextRef={nextRef}
              />
            </div>
          </section>
        )}

        {stage === "results" && result && (
          <Results
            bank={bank}
            r={result}
            answers={answers}
            save={save}
            pfTodo={pfTodo}
            names={names}
            onAgain={start}
            onShare={() => share(result)}
          />
        )}
      </main>

      <CtFooter>
        <b>Sources des faits utilisés dans ce test</b>
        <ol>
          {sources.map((s) => (
            <li key={s.name + s.date}>
              <SourceName src={s} />, {s.date}
            </li>
          ))}
        </ol>
        <p>
          Les extraits de documents sont reformulés. Vos réponses ne sont enregistrées que si vous êtes connecté, dans votre carte de
          clarté.
        </p>
      </CtFooter>
      <Toast msg={toast} />
    </>
  );
}

/* ---------- Une question ---------- */

const ICON_OK = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
const ICON_NO = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
    <path d="M12 6.5v7.5M12 18v.01" />
  </svg>
);
const ICON_MID = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <path d="M6 12h12" />
  </svg>
);

function QuestionCard({
  bank,
  q,
  cur,
  setCur,
  onValidate,
  onNext,
  isLast,
  titleRef,
  nextRef,
}: {
  bank: Bank;
  q: Question;
  cur: Cur;
  setCur: (c: Cur) => void;
  onValidate: () => void;
  onNext: () => void;
  isLast: boolean;
  titleRef: React.RefObject<HTMLHeadingElement | null>;
  nextRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const pick = (value: number) => {
    if (!cur.done) setCur({ ...cur, value });
  };
  const ready = cur.value !== null && cur.conf !== null;

  return (
    <div className="ct-qcard">
      <div className="ct-kicker">{q.axis}</div>
      <h2 ref={titleRef} tabIndex={-1} style={{ outline: "none" }} dangerouslySetInnerHTML={{ __html: q.prompt }} />

      {q.type === "slider" ? (
        <SliderZone q={q} done={cur.done} answered={cur.value} onChange={pick} />
      ) : q.type === "doc" ? (
        <DocZone q={q} done={cur.done} value={cur.value} onPick={pick} />
      ) : (
        <ChoiceZone q={q} done={cur.done} value={cur.value} onPick={pick} />
      )}

      <div className="ct-conf-w">
        <div className="ct-conf-l">
          <b id={`conf-${q.id}`}>Votre certitude</b>
          <span>Soyez honnête&nbsp;: la lucidité compte autant que la bonne réponse.</span>
        </div>
        <div className="ct-conf" role="radiogroup" aria-labelledby={`conf-${q.id}`}>
          {CONFIDENCE.map((c, k) => (
            <button
              key={c.label}
              type="button"
              role="radio"
              aria-checked={cur.conf === k}
              className={cur.conf === k ? "ct-sel" : undefined}
              disabled={cur.done}
              onClick={() => {
                if (!cur.done) setCur({ ...cur, conf: k });
              }}
            >
              <span className="ct-dots" aria-hidden="true">
                {[1, 2, 3].map((d) => (
                  <i key={d} className={d <= c.dots ? "ct-f" : undefined} />
                ))}
              </span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {!cur.done ? (
        <div className="ct-act">
          <button type="button" className="ct-btn" disabled={!ready} onClick={onValidate}>
            Valider
          </button>
        </div>
      ) : (
        <Reveal bank={bank} q={q} cur={cur} isLast={isLast} onNext={onNext} nextRef={nextRef} />
      )}
    </div>
  );
}

function ChoiceZone({ q, done, value, onPick }: { q: ChoiceQuestion; done: boolean; value: number | null; onPick: (k: number) => void }) {
  return (
    <div className={`ct-opts${q.type === "tf" ? " ct-tf" : ""}`} role="radiogroup" aria-label="Votre réponse">
      {q.options.map((o, k) => {
        let cls = "ct-opt";
        if (done) {
          if (k === q.correct) cls += " ct-good";
          else if (k === value) cls += " ct-bad";
        } else if (k === value) cls += " ct-sel";
        return (
          <button key={k} type="button" role="radio" aria-checked={value === k} className={cls} disabled={done} onClick={() => onPick(k)}>
            <span className="ct-k" aria-hidden="true">
              {"ABCD"[k]}
            </span>
            <Html html={o} />
          </button>
        );
      })}
    </div>
  );
}

const DOC_DEFAULT = {
  title: "Document d'informations clés",
  sub: "Extrait reformulé",
  section: "Quels sont les risques et qu'est-ce que cela pourrait me rapporter&nbsp;?",
  foot: "Reformulation fidèle du document officiel.",
};

function DocZone({ q, done, value, onPick }: { q: DocQuestion; done: boolean; value: number | null; onPick: (k: number) => void }) {
  const d = q.doc ?? DOC_DEFAULT;
  return (
    <div className="ct-doc">
      <div className="ct-doc-h">
        <Html as="b" html={d.title} />
        <Html html={d.sub} />
      </div>
      <Html as="p" className="ct-doc-sec" html={d.section} />
      <div role="radiogroup" aria-label="Phrases de l'extrait">
        {q.sentences.map((t, k) => {
          let cls = "ct-sent";
          if (done) {
            if (k === q.correct) cls += " ct-good";
            else if (k === value) cls += " ct-bad";
          } else if (k === value) cls += " ct-sel";
          return (
            <button key={k} type="button" role="radio" aria-checked={value === k} className={cls} disabled={done} onClick={() => onPick(k)}>
              <Html html={t} />
              {done && k === q.correct && <Html className="ct-tag" html={q.tag} />}
            </button>
          );
        })}
      </div>
      <Html as="div" className="ct-doc-foot" html={d.foot} />
    </div>
  );
}

function SliderZone({
  q,
  done,
  answered,
  onChange,
}: {
  q: SliderQuestion;
  done: boolean;
  answered: number | null;
  onChange: (v: number) => void;
}) {
  const [pos, setPos] = useState(q.start);
  const [showReal, setShowReal] = useState(false);
  const vdec = decimals(q.step);
  const unit = q.unit === "€" ? "&nbsp;€" : "&nbsp;%";
  const pct = (v: number) => Math.max(0, Math.min(100, (v / q.max) * 100));
  const track = ((pos - q.min) / (q.max - q.min)) * 100;

  // La barre « réalité » se déploie juste après la validation.
  useEffect(() => {
    if (!done) return;
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setShowReal(true));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [done]);

  return (
    <div>
      <div className="ct-est" aria-hidden="true">
        <b dangerouslySetInnerHTML={{ __html: fmt(pos, vdec) + unit }} />
        <span>votre estimation</span>
      </div>
      <input
        type="range"
        className="ct-range"
        min={q.min}
        max={q.max}
        step={q.step}
        value={pos}
        disabled={done}
        aria-label="Votre estimation"
        aria-valuetext={plain(fmt(pos, vdec) + unit)}
        style={{ "--p": `${track}%` } as React.CSSProperties}
        onChange={(e) => {
          const v = Number(e.target.value);
          setPos(v);
          onChange(v);
        }}
      />
      <div className="ct-scale" aria-hidden="true">
        <span dangerouslySetInnerHTML={{ __html: fmt(q.min, 0) + unit }} />
        <span dangerouslySetInnerHTML={{ __html: fmt((q.min + q.max) / 2, vdec) + unit }} />
        <span dangerouslySetInnerHTML={{ __html: fmt(q.max, 0) + unit }} />
      </div>
      <div className="ct-bars">
        <div>
          <div className="ct-bar-l">
            <span>Votre estimation</span>
            <b dangerouslySetInnerHTML={{ __html: fmt(pos, vdec) + unit }} />
          </div>
          <div className="ct-bar">
            <i style={{ width: `${pct(pos)}%` }} />
          </div>
        </div>
        {done && (
          <div>
            <div className="ct-bar-l">
              <Html html={q.realLabel} />
              <Html as="b" html={q.real} />
            </div>
            <div className="ct-bar ct-real">
              <i style={{ width: showReal ? `${pct(q.target)}%` : "0%" }} />
            </div>
          </div>
        )}
      </div>
      {done && answered !== null && <Html as="div" className="ct-gap" html={sliderGap(q, answered)} />}
    </div>
  );
}

function Reveal({
  bank,
  q,
  cur,
  isLast,
  onNext,
  nextRef,
}: {
  bank: Bank;
  q: Question;
  cur: Cur;
  isLast: boolean;
  onNext: () => void;
  nextRef: React.RefObject<HTMLButtonElement | null>;
}) {
  if (cur.value === null || cur.conf === null) return null;
  const s = scoreOf(q, cur.value);
  const v = verdict(s, cur.conf);
  const src = bank.src[q.fact.src];
  return (
    <div className="ct-rev" aria-live="polite">
      <div className="ct-verdict">
        <div className={`ct-ic ct-${v.cls}`}>{v.cls === "g" ? ICON_OK : v.cls === "p" ? ICON_MID : ICON_NO}</div>
        <div>
          <Html as="b" html={v.title} />
          <Html as="p" html={v.text} />
        </div>
      </div>
      <p className="ct-expl">
        <strong dangerouslySetInnerHTML={{ __html: q.good + "." }} /> <Html html={q.explain} />
      </p>
      {q.extra && <Html as="p" className="ct-extra" html={q.extra} />}
      <div className="ct-fact">
        <div className="ct-kicker">
          <IconClock size={12} />
          Fait daté
        </div>
        <Html as="div" className="ct-val" html={q.fact.value} />
        <Html as="div" className="ct-lab" html={q.fact.label} />
        {src && (
          <div className="ct-src">
            Source&nbsp;: <SourceName src={src} />, {src.date}
          </div>
        )}
        {q.fact.note && <Html as="div" className="ct-note" html={q.fact.note} />}
        {src && <span className="ct-per">↻ {src.refresh}</span>}
      </div>
      <div className="ct-act">
        <button type="button" className="ct-btn" ref={nextRef} onClick={onNext}>
          {isLast ? "Voir ma carte de clarté" : "Question suivante"} <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

/* ---------- Résultats ---------- */

function CountUp({ to }: { to: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    let t0 = 0;
    const dur = reducedMotion() ? 1 : 900;
    const step = (t: number) => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / dur);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return (
    <>
      <span aria-hidden="true">{n}</span>
      <span className="ct-sr">{to}</span>
    </>
  );
}

function Radar({ axes, score }: { axes: string[]; score: Record<string, number> }) {
  const cx = 170;
  const cy = 150;
  const R = 100;
  const n = axes.length;
  const pt = (k: number, r: number): [number, number] => {
    const a = -Math.PI / 2 + (k * 2 * Math.PI) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const poly = axes.map((ax, k) => pt(k, R * Math.max(0.06, score[ax])).join(",")).join(" ");
  const label = axes.map((ax) => `${ax} ${Math.round(score[ax] * 100)} %`).join(", ");
  return (
    <svg className="ct-chart" viewBox="-60 0 460 300" role="img" aria-label={`Carte de clarté en cinq repères\u00a0: ${label}`}>
      <defs>
        <linearGradient id="ct-rg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--ct-v)", stopOpacity: 0.55 }} />
          <stop offset="1" style={{ stopColor: "var(--ct-vdd)", stopOpacity: 0.25 }} />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon
          key={f}
          points={axes.map((_, k) => pt(k, R * f).join(",")).join(" ")}
          style={{ fill: "none", stroke: "var(--ct-line2)" }}
          strokeWidth={1}
          strokeDasharray={f === 1 ? undefined : "3 4"}
        />
      ))}
      {axes.map((ax, k) => {
        const p = pt(k, R);
        return <line key={ax} x1={cx} y1={cy} x2={p[0]} y2={p[1]} style={{ stroke: "var(--ct-line)" }} />;
      })}
      <polygon points={poly} fill="url(#ct-rg)" style={{ stroke: "var(--ct-vd)" }} strokeWidth={2.5} strokeLinejoin="round">
        <animate attributeName="opacity" from="0" to="1" dur=".8s" />
      </polygon>
      {axes.map((ax, k) => {
        const p = pt(k, R * Math.max(0.06, score[ax]));
        const l = pt(k, R + 26);
        const anchor = Math.abs(l[0] - cx) < 8 ? "middle" : l[0] > cx ? "start" : "end";
        return (
          <g key={ax}>
            <circle cx={p[0]} cy={p[1]} r={4} style={{ fill: "var(--ct-card)", stroke: "var(--ct-vd)" }} strokeWidth={2} />
            <text className="ct-radar-lab" x={l[0]} y={l[1] + 4} textAnchor={anchor}>
              {ax}
            </text>
            <text className="ct-radar-val" x={l[0]} y={l[1] + 19} textAnchor={anchor}>
              {Math.round(score[ax] * 100)}&nbsp;%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Compass({ angle, wobble, label }: { angle: number; wobble: boolean; label: string }) {
  const [rot, setRot] = useState(0);
  const [wob, setWob] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setRot(angle), 120);
    const t2 = wobble && !reducedMotion() ? setTimeout(() => setWob(true), 1500) : null;
    return () => {
      clearTimeout(t1);
      if (t2) clearTimeout(t2);
    };
  }, [angle, wobble]);
  const cx = 150;
  const cy = 160;
  const R = 120;
  const s9 = Math.sin(Math.PI / 9);
  const c9 = Math.cos(Math.PI / 9);
  const ticks = [];
  for (let d = -90; d <= 90; d += 15) {
    const r1 = R - (d % 45 === 0 ? 12 : 6);
    const a = (d * Math.PI) / 180;
    ticks.push(
      <line
        key={d}
        x1={cx + r1 * Math.sin(a)}
        y1={cy - r1 * Math.cos(a)}
        x2={cx + R * Math.sin(a)}
        y2={cy - R * Math.cos(a)}
        style={{ stroke: "var(--ct-line2)" }}
        strokeWidth={1.2}
      />
    );
  }
  return (
    <svg className="ct-chart" viewBox="0 0 300 200" role="img" aria-label={`Boussole de lucidité\u00a0: ${label}`}>
      <path d={`M${cx - R} ${cy} A${R} ${R} 0 0 1 ${cx + R} ${cy}`} style={{ fill: "none", stroke: "var(--ct-line2)" }} strokeWidth={1.5} />
      <path
        d={`M${cx - R * s9} ${cy - R * c9} A${R} ${R} 0 0 1 ${cx + R * s9} ${cy - R * c9}`}
        style={{ fill: "none", stroke: "var(--ct-v)" }}
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.55}
      />
      {ticks}
      <text className="ct-compass-txt" x={cx} y={cy - R - 10} textAnchor="middle">
        BIEN RÉGLÉE
      </text>
      <text className="ct-compass-txt" x={cx - R - 6} y={cy + 20} textAnchor="start">
        TROP PRUDENT
      </text>
      <text className="ct-compass-txt" x={cx + R + 6} y={cy + 20} textAnchor="end">
        TROP SÛR
      </text>
      <g className={`ct-needle${wob ? " ct-wobble" : ""}`} style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${rot}deg)` }}>
        <path d={`M${cx} ${cy - R + 18} L${cx + 8} ${cy} L${cx} ${cy + 14} L${cx - 8} ${cy} Z`} style={{ fill: "var(--ct-vdd)" }} />
        <path d={`M${cx} ${cy - R + 18} L${cx + 8} ${cy} L${cx} ${cy} Z`} style={{ fill: "var(--ct-v)" }} />
      </g>
      <circle cx={cx} cy={cy} r={7} style={{ fill: "var(--ct-card)", stroke: "var(--ct-vdd)" }} strokeWidth={2} />
    </svg>
  );
}

function Chips({ tags }: { tags: string[] }) {
  if (!tags.length) return <span className="ct-small ct-muted">Aucune</span>;
  return (
    <>
      {tags.map((t) => (
        <span key={t} className="ct-c">
          {t}
        </span>
      ))}
    </>
  );
}

function Results({
  bank,
  r,
  answers,
  save,
  pfTodo,
  names,
  onAgain,
  onShare,
}: {
  bank: Bank;
  r: Result;
  answers: Answer[];
  save: SaveState;
  pfTodo: string[];
  names: Record<string, string>;
  onAgain: () => void;
  onShare: () => void;
}) {
  const Q = bank.questions;
  return (
    <section className="ct-res">
      <div className="ct-wide">
        <div className="ct-res-h">
          <div className="ct-kicker">Votre carte de clarté · {bank.short}</div>
          <Html as="h1" html={r.title} />
          <Html as="p" className="ct-summary" html={r.summary} />
        </div>

        <div className="ct-scores">
          <div className="ct-score">
            <div className="ct-lab">Clarté</div>
            <div className="ct-big">
              <CountUp to={r.clarity} />
              <small>%</small>
            </div>
            <p>Part des notions du produit que vous maîtrisez.</p>
          </div>
          <div className="ct-score ct-lucid">
            <div className="ct-lab">Lucidité</div>
            <div className="ct-big">
              <CountUp to={r.lucidity} />
              <small>%</small>
            </div>
            <Html as="p" html={r.lucidityText} />
          </div>
        </div>

        <div className="ct-grid2">
          <div className="ct-panel">
            <div className="ct-kicker">La carte</div>
            <h3>Vos cinq repères sur ce produit</h3>
            <p className="ct-sub">Plus la forme s&apos;étend, plus le repère est clair pour vous.</p>
            <Radar axes={bank.axes} score={r.axisScore} />
          </div>
          <div className="ct-panel">
            <div className="ct-kicker">La boussole de lucidité</div>
            <h3>Vos certitudes sont-elles bien réglées&nbsp;?</h3>
            <p className="ct-sub">
              Elle compare votre niveau de certitude à vos bonnes réponses. Le nord, c&apos;est quand les deux coïncident.
            </p>
            <Compass angle={r.angle} wobble={r.mode === "float"} label={r.lucidityLabel} />
            <Html as="p" className="ct-compass-msg" html={r.compassText} />
          </div>
        </div>

        <div className="ct-panel ct-mt">
          <div className="ct-kicker">Certitude et justesse</div>
          <h3>Où se cachent vos angles morts</h3>
          <p className="ct-sub">
            Un angle mort, c&apos;est une réponse fausse donnée avec assurance. C&apos;est souvent là qu&apos;une mauvaise surprise
            commence.
          </p>
          <div className="ct-matrix">
            <span />
            <span className="ct-mx-h">Réponse juste</span>
            <span className="ct-mx-h">Réponse fausse</span>
            <span className="ct-mx-r">Vous étiez sûr</span>
            <div className="ct-mx ct-solid">
              <b>Vos acquis</b>
              <p>Vous saviez, et vous saviez que vous saviez.</p>
              <div className="ct-chips">
                <Chips tags={r.cells.solid} />
              </div>
            </div>
            <div className="ct-mx ct-blind">
              <b>Vos angles morts</b>
              <p>Sûr de vous, et pourtant à côté. À revoir en priorité.</p>
              <div className="ct-chips">
                <Chips tags={r.cells.blind} />
              </div>
            </div>
            <span className="ct-mx-r">Vous deviniez</span>
            <div className="ct-mx">
              <b>Vos intuitions</b>
              <p>Juste sans en être sûr. Ça ne demande qu&apos;à se confirmer.</p>
              <div className="ct-chips">
                <Chips tags={r.cells.intu} />
              </div>
            </div>
            <div className="ct-mx">
              <b>Vos découvertes</b>
              <p>Vous saviez que vous ne saviez pas. C&apos;est réglé.</p>
              <div className="ct-chips">
                <Chips tags={r.cells.disc} />
              </div>
            </div>
          </div>
        </div>

        <div className="ct-panel ct-mt">
          <div className="ct-kicker">Vos faits datés</div>
          <h3>Ce que vous savez maintenant, et depuis quand c&apos;est vrai</h3>
          <p className="ct-sub">
            Chaque fait a une source et une date. Quand la source publie une nouvelle version, le fait repasse en «&nbsp;à revoir&nbsp;» sur
            votre carte.
          </p>
          <table className="ct-facts">
            <thead>
              <tr>
                <th>Fait</th>
                <th>Valeur</th>
                <th>Source</th>
                <th>Date</th>
                <th>État</th>
              </tr>
            </thead>
            <tbody>
              {Q.map((q, k) => {
                const src = bank.src[q.fact.src];
                return (
                  <tr key={q.id}>
                    <td>
                      <span className="ct-muted ct-small">Q{k + 1} · </span>
                      <Html html={q.fact.label} />
                    </td>
                    <Html as="td" html={q.fact.value} />
                    <td>{src && <SourceName src={src} />}</td>
                    <td className="ct-d">{src?.date}</td>
                    <td>
                      {src?.watch ? (
                        <span className="ct-state ct-watch" title="Source susceptible de changer souvent">
                          À surveiller
                        </span>
                      ) : (
                        <span className="ct-state ct-ok">À jour</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="ct-grid2">
          <div className="ct-panel">
            <div className="ct-kicker">Avant votre prochain rendez-vous</div>
            <h3>Les questions à poser</h3>
            <p className="ct-sub">Tirées de vos réponses. À poser à votre courtier, votre banque ou votre conseiller.</p>
            <ul className="ct-asks">
              {r.asks.map((t, k) => (
                <li key={k}>
                  <span>{k + 1}</span>
                  <Html as="div" html={t} />
                </li>
              ))}
            </ul>
          </div>
          <div className="ct-panel">
            <div className="ct-kicker">Et la suite&nbsp;?</div>
            <h3>Une carte qui vit avec vos placements</h3>
            <p className="ct-sub">
              Chaque produit testé a sa ligne. Rien ne bouge sans raison&nbsp;: un fait ne repasse «&nbsp;à revoir&nbsp;» que si sa source
              officielle publie une nouvelle version.
            </p>
            <div className="ct-timeline">
              <div className="ct-trow">
                <div>
                  <b>{bank.name}</b>
                  <span>
                    Testé aujourd&apos;hui · {answers.length} faits suivis
                  </span>
                </div>
                <div className="ct-pct">{r.clarity}&nbsp;%</div>
              </div>
              {pfTodo.map((id) => (
                <div className="ct-trow" key={id}>
                  <div>
                    <b>{names[id]}</b>
                    <span>Dans votre portefeuille · pas encore testé</span>
                  </div>
                  <Link className="ct-ghost ct-sm" href={`/clarity-test/${id}`}>
                    Tester
                  </Link>
                </div>
              ))}
            </div>
            <SaveNotice save={save} />
          </div>
        </div>

        <div className="ct-grid2">
          <div className="ct-panel">
            <div className="ct-kicker">À partager</div>
            <h3>Votre carte, sans aucun montant</h3>
            <p className="ct-sub">
              Un message prêt à envoyer à un proche, qui l&apos;invite à tester le même produit. Aucune donnée personnelle, aucun chiffre de
              patrimoine.
            </p>
            <div className="ct-share">
              <div className="ct-ring" />
              <div className="ct-ring2" />
              <div className="ct-sl">
                kompa
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.6" fill="none" stroke="#F8F3EA" strokeWidth="1.4" />
                  <path d="M8 8 L9.3 6.7 L12 12 L6.7 9.3 Z" fill="#C4623A" />
                </svg>
              </div>
              <div className="ct-sq" dangerouslySetInnerHTML={{ __html: `${bank.share} à <em>${r.clarity}&nbsp;%</em>. Et vous&nbsp;?` }} />
              <div className="ct-ss">Lucidité&nbsp;: {r.lucidityLabel} · Clarity Test Kompa</div>
            </div>
            <div className="ct-share-act">
              <button type="button" className="ct-btn ct-sm" onClick={onShare}>
                Partager
              </button>
            </div>
          </div>
          <div className="ct-panel ct-premium">
            <span className="ct-badge ct-b-pay">Bientôt</span>
            <h3 style={{ marginTop: 14 }}>Le Clarity Test personnel</h3>
            <p className="ct-sub" style={{ marginBottom: 0 }}>
              Le même test, construit à partir de vos propres documents&nbsp;: la proposition reçue de votre banque (via Second Opinion) ou le
              relevé de votre contrat.
            </p>
            <ul>
              <li>Questions tirées de votre document, pas d&apos;un produit type.</li>
              <li>Faits surveillés sur vos produits, rappel quand une source change.</li>
              <li>Un bilan imprimable à apporter à votre rendez-vous.</li>
            </ul>
            <button type="button" className="ct-btn" disabled>
              Bientôt disponible
            </button>
          </div>
        </div>

        <div className="ct-end">
          <button type="button" className="ct-btn" onClick={onAgain}>
            Repasser le test
          </button>
          <a className="ct-ghost" href={`/#fiche-${bank.id}`}>
            Revenir à la fiche du produit
          </a>
          <Link className="ct-ghost" href="/clarity-test#tester">
            Tester un autre produit
          </Link>
        </div>
        <div className="ct-legal">
          Ce test mesure votre compréhension d&apos;un produit. Il ne constitue ni un conseil en investissement, ni une évaluation de votre
          profil d&apos;investisseur.
        </div>
      </div>
    </section>
  );
}

function SaveNotice({ save }: { save: SaveState }) {
  if (save === "idle") return null;
  let title: string;
  let text: string;
  let action: React.ReactNode = null;
  if (save === "saving") {
    title = "Enregistrement en cours";
    text = "Votre résultat rejoint votre carte de clarté.";
  } else if (save === "saved") {
    title = "Ajouté à votre carte de clarté";
    text = "Si une source officielle change, le fait concerné repassera « à revoir » sur votre carte.";
    action = (
      <Link className="ct-ghost ct-sm" href="/clarity-test#carte">
        Voir ma carte
      </Link>
    );
  } else if (save === "error") {
    title = "Ce résultat n'a pas pu être enregistré pour l'instant";
    text = "Il reste affiché ici, et Kompa réessaiera de l'enregistrer lors de votre prochaine visite sur le Clarity Test.";
  } else {
    title = "Gardez ce résultat dans votre carte de clarté";
    text =
      "Sans compte, il est seulement gardé sur cet appareil, pendant deux jours. Connectez-vous ou créez un compte : il rejoindra votre carte.";
    action = (
      <Link className="ct-btn ct-sm" href={LOGIN_NEXT}>
        Créer un compte / Se connecter
      </Link>
    );
  }
  return (
    <div className="ct-notif" role="status">
      <div className="ct-bell">
        <IconBell />
      </div>
      <div>
        <b>{title}</b>
        <p>{text}</p>
        {action && <div className="ct-row">{action}</div>}
      </div>
    </div>
  );
}
