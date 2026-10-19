import { createClient } from "@/lib/supabase/server";
import { json } from "@/lib/kompa/http";

export const runtime = "nodejs";

export async function POST() {
  const supabase = await createClient();
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.error("[auth/logout]", e);
  }
  return json({ ok: true });
}
