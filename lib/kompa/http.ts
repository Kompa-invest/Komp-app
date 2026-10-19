import { NextResponse } from "next/server";

// Petites aides communes aux routes de la nouvelle interface.

export const INDISPONIBLE = "Le service est momentanément indisponible. Réessayez dans quelques minutes.";

/** Réponse JSON jamais mise en cache (données propres à chaque visiteur). */
export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export function fail(status: number, error: string) {
  return json({ error }, status);
}

export function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Adresse du site (ex. https://www.kompa-invest.fr), déduite de la requête. */
export function siteOrigin(req: Request): string {
  return new URL(req.url).origin;
}
