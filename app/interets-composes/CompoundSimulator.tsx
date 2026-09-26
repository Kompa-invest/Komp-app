"use client";

import { useEffect, useMemo, useState } from "react";

const eur = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const dec = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });
const fmt = (n: number) => `${eur.format(Math.round(n))} €`;

type Point = { year: number; paid: number; simple: number; net: number; gross: number };

// Convention : taux annuel effectif ; versements en fin de mois au taux mensuel équivalent.
// Frais prélevés sur l'encours : rendement net = (1 + r) × (1 − f) − 1.
// "Intérêts simples" = ce que rapporteraient vos seuls versements si les gains étaient retirés au fur et à mesure.
// Le reste des gains = intérêts produits par les intérêts (effet boule de neige).
function simulate(initial: number, monthly: number, years: number, rate: number, fees: number) {
  const g = Math.pow(1 + rate, 1 / 12) - 1;
  const n = Math.pow((1 + rate) * (1 - fees), 1 / 12) - 1;
  let gross = initial, net = initial, paid = initial, simple = 0;
  const pts: Point[] = [{ year: 0, paid, simple: 0, net, gross }];
  for (let m = 1; m <= years * 12; m++) {
    simple += paid * n;
    gross = gross * (1 + g) + monthly;
    net = net * (1 + n) + monthly;
    paid += monthly;
    if (m % 12 === 0) pts.push({ year: m / 12, paid, simple, net, gross });
  }
  return pts;
}

function Control(props: {
  id: string;
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const [text, setText] = useState(dec.format(props.value));
  useEffect(() => setText(dec.format(props.value)), [props.value]);

  const commit = (raw: string) => {
    const v = parseFloat(raw.replace(/\s/g, "").replace(",", "."));
    const clamped = Number.isFinite(v) ? Math.min(Math.max(v, props.min), props.max) : props.value;
    props.onChange(clamped);
    setText(dec.format(clamped));
  };
  const fill = Math.min(((props.value - props.min) / (props.max - props.min)) * 100, 100);

  return (
    <div className="kc-ctrl">
      <div className="kc-ctrl-head">
        <label htmlFor={props.id}>{props.label}</label>
        <span className="kc-box">
          <input
            id={props.id}
            inputMode="decimal"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && commit((e.target as HTMLInputElement).value)}
          />
          <span>{props.unit}</span>
        </span>
      </div>
      <input
        type="range"
        aria-label={props.label}
        min={props.min}
        max={props.max}
        step={props.step}
        value={Math.min(props.value, props.max)}
        onChange={(e) => props.onChange(Number(e.target.value))}
        style={{ ["--fill" as string]: `${fill}%` }}
      />
    </div>
  );
}

export default function CompoundSimulator() {
  const [initial, setInitial] = useState(5000);
  const [monthly, setMonthly] = useState(150);
  const [years, setYears] = useState(20);
  const [ratePct, setRatePct] = useState(4);
  const [feesPct, setFeesPct] = useState(1);

  const pts = useMemo(
    () => simulate(initial, monthly, Math.max(1, Math.round(years)), ratePct / 100, feesPct / 100),
    [initial, monthly, years, ratePct, feesPct],
  );
  const Y = pts.length - 1;
  const end = pts[Y];
  const gains = end.net - end.paid;
  const simpleShown = Math.max(Math.min(end.simple, gains), 0);
  const snowball = Math.max(gains - end.simple, 0);
  const feesCost = Math.max(end.gross - end.net, 0);
  const snowShare = gains > 0 ? Math.round((snowball / gains) * 100) : 0;

  const W = 640, H = 200, padT = 8;
  const maxV = Math.max(...pts.map((p) => Math.max(p.gross, p.paid)), 1);
  const x = (i: number) => (i / Math.max(Y, 1)) * W;
  const y = (v: number) => padT + (1 - v / maxV) * (H - padT);
  const area = (top: (p: Point) => number, bottom: (p: Point) => number) =>
    "M" + pts.map((p, i) => `${x(i)},${y(top(p))}`).join("L") +
    "L" + [...pts].reverse().map((p, i) => `${x(Y - i)},${y(bottom(p))}`).join("L") + "Z";
  const paidTop = (p: Point) => Math.min(p.paid, p.net);
  const simpleTop = (p: Point) => Math.min(p.paid + p.simple, Math.max(p.net, p.paid));
  const netTop = (p: Point) => Math.max(p.net, p.paid);
  const grossLine = "M" + pts.map((p, i) => `${x(i)},${y(p.gross)}`).join("L");

  return (
    <div className="kc">
      <style>{CSS}</style>

      <section className="card kc-calc" aria-label="Calculateur">
        <div className="kc-grid">
          <Control id="kc-initial" label="Somme de départ" unit="€" value={initial} min={0} max={100000} step={500} onChange={setInitial} />
          <Control id="kc-monthly" label="Versement mensuel" unit="€" value={monthly} min={0} max={2000} step={10} onChange={setMonthly} />
          <Control id="kc-years" label="Durée" unit="ans" value={years} min={1} max={50} step={1} onChange={(v) => setYears(Math.round(v))} />
          <Control id="kc-rate" label="Rendement supposé / an" unit="%" value={ratePct} min={0} max={10} step={0.1} onChange={setRatePct} />
          <Control id="kc-fees" label="Frais / an" unit="%" value={feesPct} min={0} max={3} step={0.05} onChange={setFeesPct} />
        </div>
        <p className="kc-hint">
          Le rendement est une hypothèse, pas une promesse. Pour les frais, additionnez ceux du contrat et des fonds.
        </p>

        <div className="kc-result" aria-live="polite">
          <div>
            <p className="kc-eyebrow">Capital estimé dans {Y} an{Y > 1 ? "s" : ""}</p>
            <p className="kc-big serif">{fmt(end.net)}</p>
          </div>
          <dl className="kc-kpis">
            <div><dt>Versé</dt><dd>{fmt(end.paid)}</dd></div>
            <div><dt>Intérêts gagnés</dt><dd>{fmt(Math.max(gains, 0))}</dd></div>
            <div><dt>Coût des frais</dt><dd>{fmt(feesCost)}</dd></div>
          </dl>
        </div>
      </section>

      <section aria-labelledby="kc-und-title">
        <h2 id="kc-und-title" className="serif kc-h2">Comprendre ce résultat</h2>

        {gains > 0 ? (
          <p className="kc-story serif">
            Vous versez <b>{fmt(end.paid)}</b>. Vos versements rapportent <b className="c-simple">{fmt(simpleShown)}</b>,
            et ces intérêts rapportent à leur tour <b className="c-snow">{fmt(snowball)}</b> : c&apos;est l&apos;effet
            boule de neige.
          </p>
        ) : (
          <p className="kc-story serif">
            Avec ces réglages, les frais dépassent le rendement supposé : votre épargne finit sous le total de vos
            versements.
          </p>
        )}

        <figure className="kc-figure">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img"
            aria-label={`Évolution sur ${Y} ans : versements, intérêts des versements et intérêts des intérêts`}>
            <path d={area(paidTop, () => 0)} className="a-paid" />
            <path d={area(simpleTop, paidTop)} className="a-simple" />
            <path d={area(netTop, simpleTop)} className="a-snow" />
            <path d={grossLine} className="l-gross" />
          </svg>
          <div className="kc-axis"><span>Aujourd&apos;hui</span><span>{Math.round(Y / 2)} ans</span><span>{Y} ans</span></div>
          <figcaption className="kc-legend">
            <span><i className="sw sw-paid" />Vos versements</span>
            <span><i className="sw sw-simple" />Intérêts de vos versements</span>
            <span><i className="sw sw-snow" />Intérêts de vos intérêts</span>
            <span><i className="sw sw-gross" />Sans frais</span>
          </figcaption>
        </figure>

        <div className="kc-explain">
          {gains > 0 && (
            <p>
              <strong>Pourquoi la durée compte autant :</strong> {snowShare} % de vos gains viennent d&apos;intérêts qui
              ont eux-mêmes rapporté. Allongez la durée : cette part grandit plus vite que le reste.
            </p>
          )}
          {feesCost >= 1 && (
            <p>
              <strong>Les frais suivent le même mécanisme, à l&apos;envers :</strong> sans eux, vous auriez environ{" "}
              {fmt(end.gross)}. L&apos;écart avec la ligne pointillée se creuse chaque année.
            </p>
          )}
        </div>

        <details className="kc-details">
          <summary>Voir le détail année par année</summary>
          <div className="kc-table-wrap">
            <table>
              <thead>
                <tr><th>Année</th><th>Versé</th><th>Intérêts cumulés</th><th>Capital</th><th>Sans frais</th></tr>
              </thead>
              <tbody>
                {pts.slice(1).map((p) => (
                  <tr key={p.year}>
                    <td>{p.year}</td>
                    <td>{fmt(p.paid)}</td>
                    <td>{fmt(p.net - p.paid)}</td>
                    <td><b>{fmt(p.net)}</b></td>
                    <td>{fmt(p.gross)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>

      <p className="kc-note">
        Exemple de calcul, pas une prévision : le rendement est une hypothèse fixe, alors qu&apos;en réalité il varie
        et un placement peut baisser. Avant impôts et prélèvements sociaux, versements en fin de mois. Kompa fournit
        de l&apos;information et ne formule pas de conseil personnalisé.
      </p>
    </div>
  );
}

const CSS = `
.kc{--c-paid:color-mix(in srgb,var(--text) 14%,transparent);--c-simple:color-mix(in srgb,var(--accent) 45%,transparent);--c-snow:var(--accent);display:grid;gap:44px;}
.kc-h2{font-size:22px;font-weight:480;margin:0 0 16px;}
.kc-calc{padding:26px 28px;}
.kc-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:18px 28px;}
@media (min-width:600px){.kc-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
@media (min-width:860px){.kc-grid{grid-template-columns:repeat(3,minmax(0,1fr));}}
.kc-ctrl-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;}
.kc-ctrl-head label{font-size:13px;color:var(--muted);line-height:1.3;}
.kc-box{display:inline-flex;align-items:baseline;gap:4px;border:1px solid var(--border);border-radius:8px;padding:4px 8px;background:var(--bg);flex-shrink:0;}
.kc-box:focus-within{border-color:var(--accent);}
.kc-box input{width:5.5ch;border:0;background:transparent;font:inherit;font-size:15px;font-weight:500;color:var(--text);text-align:right;outline:none;font-variant-numeric:tabular-nums;}
.kc-box span{font-size:13px;color:var(--muted);}
.kc-ctrl input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:4px;cursor:pointer;
  background:linear-gradient(to right,var(--accent) var(--fill),var(--border) var(--fill));}
.kc-ctrl input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:var(--accent);border:2px solid var(--card);box-shadow:0 0 0 1px var(--accent);}
.kc-ctrl input[type=range]::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:var(--accent);border:2px solid var(--card);}
.kc-ctrl input[type=range]:focus-visible{outline:2px solid var(--accent);outline-offset:6px;}
.kc-hint{font-size:12px;color:var(--muted);margin:16px 0 0;}
.kc-result{margin-top:22px;padding-top:20px;border-top:1px solid var(--border);display:grid;gap:16px;align-items:end;}
@media (min-width:720px){.kc-result{grid-template-columns:auto minmax(0,1fr);gap:48px;}}
.kc-eyebrow{font-size:13px;color:var(--muted);margin:0;}
.kc-big{font-size:clamp(36px,6vw,52px);line-height:1;font-weight:560;letter-spacing:-0.02em;margin:6px 0 0;}
.kc-kpis{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:0;}
.kc-kpis div{display:grid;gap:2px;}
.kc-kpis dt{font-size:12px;color:var(--muted);}
.kc-kpis dd{margin:0;font-size:16px;font-weight:500;font-variant-numeric:tabular-nums;}
@media (max-width:520px){.kc-kpis{grid-template-columns:1fr;}.kc-kpis div{display:flex;justify-content:space-between;}}
.kc-story{font-size:clamp(18px,2.6vw,22px);line-height:1.55;margin:0;}
.kc-story b{font-weight:560;}
.kc-story .c-simple{color:color-mix(in srgb,var(--accent) 70%,var(--text));}
.kc-story .c-snow{color:var(--accent);}
.kc-figure{margin:22px 0 0;}
.kc-figure svg{width:100%;height:170px;display:block;}
.a-paid{fill:var(--c-paid);}
.a-simple{fill:var(--c-simple);}
.a-snow{fill:var(--c-snow);}
.l-gross{fill:none;stroke:var(--text);stroke-width:1.5;stroke-dasharray:5 5;vector-effect:non-scaling-stroke;}
.kc-axis{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-top:8px;}
.kc-legend{display:flex;flex-wrap:wrap;gap:8px 20px;margin-top:12px;font-size:12px;color:var(--muted);}
.kc-legend span{display:inline-flex;align-items:center;gap:8px;}
.sw{display:inline-block;width:12px;height:12px;border-radius:3px;}
.sw-paid{background:var(--c-paid);}
.sw-simple{background:var(--c-simple);}
.sw-snow{background:var(--c-snow);}
.sw-gross{height:0;width:16px;border-top:2px dashed var(--text);border-radius:0;}
.kc-explain{margin:20px 0 0;display:grid;gap:12px;}
.kc-explain p{margin:0;font-size:15px;line-height:1.6;}
.kc-details{margin-top:20px;border-top:1px solid var(--border);padding-top:14px;}
.kc-details summary{cursor:pointer;font-size:14px;font-weight:500;color:var(--accent);}
.kc-table-wrap{overflow-x:auto;margin-top:14px;}
.kc-details table{width:100%;border-collapse:collapse;font-size:13px;font-variant-numeric:tabular-nums;}
.kc-details th{text-align:right;font-weight:500;color:var(--muted);padding:7px 10px;border-bottom:1px solid var(--border);white-space:nowrap;}
.kc-details td{text-align:right;padding:7px 10px;border-bottom:1px solid var(--border);white-space:nowrap;}
.kc-details th:first-child,.kc-details td:first-child{text-align:left;}
.kc-note{font-size:12px;color:var(--muted);line-height:1.6;margin:0;}
`;
