import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const db = supabaseAnon();
  const { data, error } = await db
    .from("investigations")
    .select("id, created_at, preset, prompt, risk")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [] });
}
