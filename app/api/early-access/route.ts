import { NextRequest, NextResponse } from "next/server";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const email = (body?.email as string | undefined)?.trim();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();

    // For now, we just log to the server logs.
    // On Vercel, you’ll see this in the function logs.
    console.log("Early access signup:", { email, timestamp });

    // TODO: later, plug this into Supabase, Vercel KV, or an email service.
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Early access API error:", error);
    return NextResponse.json(
      { error: "Internal error while capturing email." },
      { status: 500 }
    );
  }
}
