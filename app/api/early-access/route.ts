import { NextRequest, NextResponse } from "next/server";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/manrldra";

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

    // Forward to Formspree
    const resp = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        source: "inquistai-early-access",
      }),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      console.error("Formspree error:", resp.status, text);
      return NextResponse.json(
        { error: "Failed to store email. Please try again later." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Early access API error:", error);
    return NextResponse.json(
      { error: "Internal error while capturing email." },
      { status: 500 }
    );
  }
}
