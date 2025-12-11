import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set on the server." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const prompt: string = body?.prompt;
    const presetId: string | undefined = body?.presetId;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'prompt'." },
        { status: 400 }
      );
    }

    const systemPrompt = `
You are InquistAI, an investigative AI that analyzes claims, questions, and digital authenticity.
Structure your response with clear sections:

🔎 Title line
📝 Summary (short, neutral)
🧠 Reasoning Layer (bullet points)
🎤 Authenticity Layer (only if relevant to identity/audio; otherwise 1 short line saying it's not applicable)
✅ Verdict (with a confidence score between 0 and 1)

Keep it concise but substantive. No markdown headings, just use the emojis as markers. Avoid repeating the user's wording excessively.
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Preset: ${presetId ?? "custom"}\n\nUser prompt:\n${prompt}`,
        },
      ],
      temperature: 0.4,
      max_tokens: 800,
    });

    const text =
      completion.choices[0]?.message?.content ||
      "InquistAI could not generate a response. Please try again.";

    return NextResponse.json({ result: text });
  } catch (err) {
    console.error("Investigate API error:", err);
    return NextResponse.json(
      { error: "Internal server error while running investigation." },
      { status: 500 }
    );
  }
}
