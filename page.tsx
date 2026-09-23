import fs from "fs";
import path from "path";
import { createClient } from "@/lib/supabase/server";
import LegacyHome from "./home-legacy/LegacyHome";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const dir = path.join(process.cwd(), "app/home-legacy");
  const html = fs.readFileSync(path.join(dir, "content.html"), "utf-8");
  const script1 = fs.readFileSync(path.join(dir, "script1.js"), "utf-8");
  const script3 = fs.readFileSync(path.join(dir, "script3.js"), "utf-8");

  return (
    <LegacyHome html={html} script1={script1} script3={script3} isLoggedIn={!!user} />
  );
}
