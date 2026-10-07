"use client";

// Clarity Test : petits éléments partagés (session, en-tête, icônes, texte enrichi, message bref).

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Family } from "@/lib/clarity/types";

/* ---------- Session ---------- */

type Session = {
  /** undefined : vérification en cours ; null : pas de compte connecté. */
  user: { id: string } | null | undefined;
  supabase: SupabaseClient | null;
};

const SessionCtx = createContext<Session>({ user: undefined, supabase: null });

export function CtSession({ children }: { children: ReactNode }) {
  const supabase = useMemo<SupabaseClient | null>(() => {
    try {
      return createClient();
    } catch {
      return null;
    }
  }, []);
  const [user, setUser] = useState<Session["user"]>(undefined);

  useEffect(() => {
    let alive = true;
    const done = (u: Session["user"]) => {
      if (alive) setUser(u);
    };
    if (!supabase) {
      Promise.resolve().then(() => done(null));
    } else {
      supabase.auth
        .getUser()
        .then(({ data }) => done(data.user ? { id: data.user.id } : null))
        .catch(() => done(null));
    }
    return () => {
      alive = false;
    };
  }, [supabase]);

  const value = useMemo(() => ({ user, supabase }), [user, supabase]);
  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>;
}

export function useCtSession(): Session {
  return useContext(SessionCtx);
}

/* ---------- En-tête ---------- */

export function CtHeader() {
  const { user } = useCtSession();
  const pathname = usePathname();
  const back = encodeURIComponent(pathname || "/clarity-test");
  return (
    <header className="ct-nav">
      <div className="ct-wide ct-nav-in">
        {/* Liens vers l'accueil en <a> : l'accueil doit se recharger entièrement pour relancer ses scripts. */}
        {/* eslint-disable @next/next/no-html-link-for-pages */}
        <a className="ct-logo" href="/" aria-label="Kompa, retour à l'accueil">
          <Image className="ct-logo-light" src="/kompa-logo.png" alt="Kompa" width={96} height={28} loading="eager" />
          <Image className="ct-logo-dark" src="/kompa-logo-sombre.png" alt="" aria-hidden="true" width={96} height={28} loading="eager" />
        </a>
        <nav className="ct-links" aria-label="Navigation du site">
          <a href="/#decodeur-tool">Décodeur</a>
          <a href="/#second-opinion-tool">Second Opinion</a>
          <a href="/#xray-tool">Comprendre mes investissements</a>
          <a href="/magazine">Le Magazine</a>
          {/* eslint-enable @next/next/no-html-link-for-pages */}
          <Link href="/clarity-test" className="ct-on" aria-current={pathname === "/clarity-test" ? "page" : undefined}>
            Clarity Test
          </Link>
        </nav>
        {user ? (
          <Link className="ct-auth" href="/portfolio">
            Mon portefeuille
          </Link>
        ) : (
          <Link className="ct-auth" href={`/login?next=${back}`}>
            Créer un compte / Se connecter
          </Link>
        )}
      </div>
    </header>
  );
}

/* ---------- Texte enrichi ---------- */

type HtmlTag = "span" | "p" | "b" | "h1" | "h2" | "h3" | "div" | "em" | "strong" | "li" | "td";

/** Affiche un texte rédigé par Kompa contenant &nbsp;, <i>, <strong>... (jamais une saisie utilisateur). */
export function Html({ html, as = "span", className }: { html: string; as?: HtmlTag; className?: string }) {
  const Tag = as;
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Retire les balises et les entités, pour un texte de partage. */
export function plain(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/* ---------- Icônes ---------- */

const ic = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function FamilyIcon({ family }: { family: Family }) {
  switch (family) {
    case "ETF et indices":
      return (
        <svg {...ic}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
        </svg>
      );
    case "Actions":
      return (
        <svg {...ic}>
          <path d="M3 21h18M5 21V10l7-5 7 5v11" />
          <path d="M9 21v-6h6v6" />
        </svg>
      );
    case "Obligations":
      return (
        <svg {...ic}>
          <path d="M7 3h7l4 4v14H7z" />
          <path d="M14 3v4h4M10 12h5M10 16h5" />
        </svg>
      );
    case "Fonds d'investissement":
      return (
        <svg {...ic}>
          <path d="M12 3a9 9 0 1 0 9 9h-9z" />
          <path d="M15 3.5A9 9 0 0 1 20.5 9H15z" />
        </svg>
      );
    case "Produits monétaires":
      return (
        <svg {...ic}>
          <ellipse cx="12" cy="7" rx="7" ry="3" />
          <path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
        </svg>
      );
    case "Immobilier":
      return (
        <svg {...ic}>
          <path d="M3 11l9-7 9 7" />
          <path d="M5 10v10h14V10M10 20v-5h4v5" />
        </svg>
      );
    default:
      return (
        <svg {...ic}>
          <path d="M12 3l9 5-9 5-9-5z" />
          <path d="M3 13l9 5 9-5" />
        </svg>
      );
  }
}

export function IconDoc() {
  return (
    <svg {...ic}>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4M10 12h5M10 16h5" />
    </svg>
  );
}

export function IconClock({ size = 20 }: { size?: number }) {
  return (
    <svg {...ic} width={size} height={size}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function IconAlert() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 6.5v7.5M12 18v.01" />
    </svg>
  );
}

export function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

/* ---------- Message bref ---------- */

export function useToast(): [string, (msg: string) => void] {
  const [msg, setMsg] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );
  const show = (m: string) => {
    setMsg(m);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(""), 3600);
  };
  return [msg, show];
}

export function Toast({ msg }: { msg: string }) {
  return (
    <div className={`ct-toast${msg ? " ct-on" : ""}`} role="status" aria-live="polite">
      {msg}
    </div>
  );
}

/* ---------- Pied de page ---------- */

export function CtFooter({ children }: { children?: ReactNode }) {
  return (
    <footer className="ct-foot">
      <div className="ct-wide">
        {children}
        <p>
          Le Clarity Test mesure votre compréhension d&apos;un produit. Il ne dit pas si ce produit vous convient et ne constitue ni un
          conseil en investissement, ni une évaluation de votre profil d&apos;investisseur. Kompa informe, Kompa ne conseille pas.
        </p>
      </div>
    </footer>
  );
}
