"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/portfolio";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      setLoading(false);
      if (error) {
        setError(traduireErreur(error.message));
        return;
      }
      setSignupDone(true);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(traduireErreur(error.message));
      return;
    }
    router.push(next);
    router.refresh();
  }

  if (signupDone) {
    return (
      <main className="max-w-md mx-auto px-6 py-20">
        <Link
          href="/"
          className="text-xs mb-8 inline-flex items-center gap-1.5"
          style={{ color: "var(--muted)" }}
        >
          ← Retour à l&apos;accueil
        </Link>
        <div className="card">
          <div className="kicker mb-2">Compte créé</div>
          <h1 className="serif text-2xl font-medium mb-3">
            Vérifiez votre boîte mail.
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Un e-mail de confirmation vient d&apos;être envoyé à{" "}
            <strong>{email}</strong>. Cliquez sur le lien qu&apos;il contient
            pour activer votre compte, puis revenez vous connecter.
          </p>
          <button
            className="btn-ghost mt-6"
            onClick={() => {
              setSignupDone(false);
              setMode("signin");
            }}
          >
            Retour à la connexion
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto px-6 py-20">
      <Link
        href="/"
        className="text-xs mb-8 inline-flex items-center gap-1.5"
        style={{ color: "var(--muted)" }}
      >
        ← Retour à l&apos;accueil
      </Link>
      <div className="kicker mb-2 mt-6">Kompa</div>
      <h1 className="serif text-3xl font-medium mb-8">
        {mode === "signin" ? "Se connecter" : "Créer un compte"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === "signup" && (
          <div>
            <label className="text-xs uppercase tracking-wide block mb-1.5" style={{ color: "var(--muted)" }}>
              Nom complet
            </label>
            <input
              className="field"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label className="text-xs uppercase tracking-wide block mb-1.5" style={{ color: "var(--muted)" }}>
            E-mail
          </label>
          <input
            className="field"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide block mb-1.5" style={{ color: "var(--muted)" }}>
            Mot de passe
          </label>
          <input
            className="field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn mt-2" disabled={loading}>
          {loading
            ? "Un instant…"
            : mode === "signin"
            ? "Se connecter"
            : "Créer mon compte"}
        </button>
      </form>

      <p className="text-sm mt-6" style={{ color: "var(--muted)" }}>
        {mode === "signin" ? (
          <>
            Pas encore de compte ?{" "}
            <button
              className="underline"
              style={{ color: "var(--accent)" }}
              onClick={() => setMode("signup")}
            >
              Créez-en un
            </button>
          </>
        ) : (
          <>
            Déjà un compte ?{" "}
            <button
              className="underline"
              style={{ color: "var(--accent)" }}
              onClick={() => setMode("signin")}
            >
              Connectez-vous
            </button>
          </>
        )}
      </p>
    </main>
  );
}

function traduireErreur(msg: string): string {
  if (msg.includes("Invalid login credentials")) {
    return "E-mail ou mot de passe incorrect.";
  }
  if (msg.includes("User already registered")) {
    return "Un compte existe déjà avec cet e-mail.";
  }
  if (msg.includes("Password should be at least")) {
    return "Le mot de passe doit contenir au moins 6 caractères.";
  }
  return msg;
}
