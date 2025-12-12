import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v
  );
}

type ParamsMaybePromise = { id?: string } | Promise<{ id?: string }>;

async function unwrapParams(p: ParamsMaybePromise): Promise<{ id?: string }> {
  const anyP = p as any;
  if (anyP && typeof anyP.then === "function") return await anyP;
  return p as { id?: string };
}

export async function GET(_req: Request, ctx: { params: ParamsMaybePromise }) {
  try {
    const { id } = await unwrapParams(ctx.params);
    const reportId = (id ?? "").trim();

    if (!reportId) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    if (!isUuid(reportId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const db = supabaseAdmin();

    const { data, error } = await db
      .from("investigations")
      .select("id,preset,prompt,result,risk,is_public,created_at")
      .eq("id", reportId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Not found OR private -> behave like not found
    if (!data || !data.is_public) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(
      { report: data },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
