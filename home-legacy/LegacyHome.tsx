"use client";

import { useEffect } from "react";
import Script from "next/script";
import "./legacy.css";

export default function LegacyHome({
  html,
  script1,
  script3,
  isLoggedIn,
}: {
  html: string;
  script1: string;
  script3: string;
  isLoggedIn: boolean;
}) {
  useEffect(() => {
    const btn = document.getElementById("navAuthBtn") as HTMLAnchorElement | null;
    if (!btn) return;
    if (isLoggedIn) {
      btn.textContent = "Mon portefeuille";
      btn.setAttribute("href", "/portfolio");
    } else {
      btn.textContent = "Créer un compte / Se connecter";
      btn.setAttribute("href", "/login");
    }
  }, [isLoggedIn]);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <Script
        id="kompa-legacy-theme"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: script1 }}
      />
      <Script
        id="kompa-legacy-app"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: script3 }}
      />
    </>
  );
}
