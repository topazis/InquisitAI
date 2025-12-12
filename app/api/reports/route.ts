import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

type SaveBody = {
  preset: string;
  prompt: string;
  result: any;   // keep flexible for now
  risk?: number; // optional
  isPublic?: boolean;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SaveBody;

    const preset = (body.preset ?? "").trim();
    const prompt = (body.prompt ?? "").trim();
    const result = body.result;

    if (!preset || !prompt || !result) {
      return NextResponse.json({ error: "Missing preset, prompt, or result." }, { status: 400 });
    }

    const risk = Number.isFinite(body.risk) ? Number(body.risk) : 0;
    const is_public = body.isPublic ?? true;

    const db = supabaseAdmin();
    const { data, error } = await db
      .from("investigations")
      .insert([{ preset, prompt, result, risk, is_public }])
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}
