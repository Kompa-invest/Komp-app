import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { plainText, readDefi } from "./shared";

// Image d'aperçu du lien de défi (iMessage, WhatsApp, LinkedIn...).
export const alt = "Défi Clarity Test Kompa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ produit: string; score: string }> }) {
  const { produit, score } = await params;
  const d = readDefi(produit, score);
  const logo = await readFile(path.join(process.cwd(), "public/kompa-logo-sombre.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const share = d ? plainText(d.bank.share) : "Le Clarity Test Kompa";
  const n = d ? d.score : null;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#4F3C69", color: "#F8F3EA", padding: "64px 72px", position: "relative" }}>
        <div style={{ position: "absolute", right: -120, top: -120, width: 520, height: 520, borderRadius: 520, border: "2px solid rgba(255,255,255,0.16)", display: "flex" }} />
        <div style={{ position: "absolute", right: -20, top: -20, width: 300, height: 300, borderRadius: 300, border: "2px solid rgba(255,255,255,0.12)", display: "flex" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img src={logoSrc} width={206} height={60} alt="" />
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: "#E3D8EE" }}>CLARITY TEST</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
          {n !== null && (
            <div style={{ display: "flex", alignItems: "baseline", fontSize: 200, fontWeight: 700, lineHeight: 1, color: "#FFFFFF" }}>
              {n}
              <span style={{ fontSize: 90, color: "#E3D8EE", marginLeft: 6 }}>%</span>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", fontSize: 50, lineHeight: 1.15 }}>{share}.</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 46, fontWeight: 700 }}>À toi de jouer : tu penses faire mieux ?</div>
          <div style={{ display: "flex", fontSize: 26, color: "#E3D8EE" }}>3 min</div>
        </div>
      </div>
    ),
    size
  );
}
