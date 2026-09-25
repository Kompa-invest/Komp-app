import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  SO_ANONYMIZE_DAYS,
  SO_BUCKET,
  SO_DOCUMENT_DAYS,
  SO_TABLE,
  SO_UPLOAD_TIMEOUT_HOURS,
} from "@/lib/second-opinion/config";

export const runtime = "nodejs";

// Nettoyage automatique, lancé chaque nuit par Vercel (voir vercel.json) :
//  1. envois abandonnés depuis plus de 24 h : fichier supprimé, demande annulée ;
//  2. documents de plus de 7 jours : supprimés ;
//  3. demandes de plus de 90 jours : nom, e-mail, téléphone et message effacés
//     (on garde la date pour pouvoir compter les demandes).
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Non autorisé", { status: 401 });
  }

  const supabase = createAdminClient();
  const now = Date.now();
  const nowIso = new Date(now).toISOString();
  const ago = (ms: number) => new Date(now - ms).toISOString();

  const { data: abandoned } = await supabase
    .from(SO_TABLE)
    .select("id, file_path")
    .eq("status", "pending_upload")
    .lt("created_at", ago(SO_UPLOAD_TIMEOUT_HOURS * 3600 * 1000));

  const { data: expired } = await supabase
    .from(SO_TABLE)
    .select("id, file_path")
    .eq("status", "received")
    .is("file_deleted_at", null)
    .lt("created_at", ago(SO_DOCUMENT_DAYS * 86400 * 1000));

  const paths = [...(abandoned ?? []), ...(expired ?? [])].map((r) => r.file_path);
  if (paths.length) {
    const { error } = await supabase.storage.from(SO_BUCKET).remove(paths);
    if (error) {
      console.error("[second-opinion] cleanup/remove", error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }
  }
  if (abandoned?.length) {
    await supabase
      .from(SO_TABLE)
      .update({ status: "cancelled", file_deleted_at: nowIso })
      .in("id", abandoned.map((r) => r.id));
  }
  if (expired?.length) {
    await supabase
      .from(SO_TABLE)
      .update({ file_deleted_at: nowIso })
      .in("id", expired.map((r) => r.id));
  }

  const { data: anonymized } = await supabase
    .from(SO_TABLE)
    .update({
      full_name: null,
      civility: null,
      last_name: null,
      email: null,
      phone: null,
      message: null,
      file_name: null,
      anonymized_at: nowIso,
    })
    .is("anonymized_at", null)
    .lt("created_at", ago(SO_ANONYMIZE_DAYS * 86400 * 1000))
    .select("id");

  return NextResponse.json({
    ok: true,
    abandoned: abandoned?.length ?? 0,
    documentsDeleted: expired?.length ?? 0,
    anonymized: anonymized?.length ?? 0,
  });
}
