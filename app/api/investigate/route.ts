import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    // 1. Check env
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not set. Add it to .env.local (local) and Vercel env (prod)." },
        { status: 500 }
      );
    }

    // 2. Parse body
    const body = await req.json().catch(() => null);
    const prompt = body?.prompt as string | undefined;
    const presetId = (body?.presetId as string | undefined) ?? "custom";

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'prompt' in request body." },
        { status: 400 }
      );
    }

    // 3. Init OpenAI client
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `
You are InquistAI, an investigative AI that analyzes claims, questions, and digital authenticity.

Structure your response with these sections using the emojis exactly:

🔎 Title line
📝 Summary (short, neutral)
🧠 Reasoning Layer (bullet points)
🎤 Authenticity Layer (say "Not applicable" if no audio/identity context)
✅ Verdict (include a confidence score between 0 and 1)

Be concise but substantive. Output plain text with emojis, no extra markdown headings.
    `.trim();

    // 4. Call OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.4,
      max_tokens: 700,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Preset: ${presetId}\n\nUser prompt:\n${prompt}`,
        },
      ],
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "OpenAI returned no content in the response." },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: content });
  } catch (error: any) {
    console.error("Investigate API error:", error);

    // In dev, expose the error message so you can see what's wrong
    const message =
      process.env.NODE_ENV === "development"
        ? error?.message || String(error)
        : "Internal server error while running investigation.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
