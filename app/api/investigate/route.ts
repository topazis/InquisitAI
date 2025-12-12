// app/api/investigate/route.ts
import OpenAI from "openai";

export const runtime = "nodejs";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

type InvestigationResult = {
  summary: string;
  risk: {
    level: RiskLevel;
    confidence: number; // 0..1
    rationale: string[];
  };
  findings: {
    reasoning: string[];
    authenticity?: string[];
  };
  actionPlan: {
    doNow: string[];
    doNotDo: string[];
    verify: string[];
    escalateWhen: string[];
  };
  notes?: string;
};

type PresetId = "simulation" | "voicemail" | "brain10" | "custom" | string;

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0.5;
  return Math.max(0, Math.min(1, n));
}

function isRiskLevel(x: unknown): x is RiskLevel {
  return x === "LOW" || x === "MEDIUM" || x === "HIGH";
}

function asStringArray(x: unknown): string[] {
  if (!Array.isArray(x)) return [];
  return x.map((v) => String(v)).filter((s) => s.trim().length > 0);
}

function normalizeResult(x: any): InvestigationResult | null {
  if (!x || typeof x !== "object") return null;

  const summary = typeof x.summary === "string" ? x.summary : "";
  const risk = x.risk ?? {};
  const findings = x.findings ?? {};
  const actionPlan = x.actionPlan ?? {};

  const level: RiskLevel = isRiskLevel(risk.level) ? risk.level : "MEDIUM";
  const confidence = clamp01(Number(risk.confidence));

  const out: InvestigationResult = {
    summary: summary.trim() || "No summary provided.",
    risk: {
      level,
      confidence,
      rationale: asStringArray(risk.rationale),
    },
    findings: {
      reasoning: asStringArray(findings.reasoning),
      authenticity:
        findings.authenticity === undefined ? undefined : asStringArray(findings.authenticity),
    },
    actionPlan: {
      doNow: asStringArray(actionPlan.doNow),
      doNotDo: asStringArray(actionPlan.doNotDo),
      verify: asStringArray(actionPlan.verify),
      escalateWhen: asStringArray(actionPlan.escalateWhen),
    },
    notes: typeof x.notes === "string" ? x.notes : undefined,
  };

  // Hard minimums so UI never breaks
  if (out.risk.rationale.length === 0) out.risk.rationale = ["Insufficient structured rationale returned."];
  if (out.findings.reasoning.length === 0) out.findings.reasoning = ["Insufficient structured reasoning returned."];

  if (out.actionPlan.doNow.length === 0) out.actionPlan.doNow = ["Pause and avoid acting on urgency until verified."];
  if (out.actionPlan.doNotDo.length === 0) out.actionPlan.doNotDo = ["Do not send money, credentials, or codes based on this message alone."];
  if (out.actionPlan.verify.length === 0) out.actionPlan.verify = ["Verify using a known-good contact method (not replies/links provided in the message)."];
  if (out.actionPlan.escalateWhen.length === 0) out.actionPlan.escalateWhen = ["If money/accounts are at risk, contact your bank/service provider immediately."];

  return out;
}

function buildFallback(presetId: PresetId, prompt: string): InvestigationResult {
  const p = (prompt || "").trim();

  if (presetId === "voicemail") {
    return {
      summary:
        "This resembles a classic high-pressure payment scam (urgent request + gift cards + vague story). Treat as high risk until verified offline.",
      risk: {
        level: "HIGH",
        confidence: 0.92,
        rationale: [
          "Urgent money request and time pressure",
          "Gift cards are untraceable / irreversible",
          "Vague context and no verifiable details",
          "Matches known impersonation/CEO-fraud patterns",
        ],
      },
      findings: {
        reasoning: [
          "The combination of urgency + secrecy + unusual payment method is a strong scam signature.",
          "Even if the voice is real, the behavior is unsafe—verification is required before any action.",
        ],
        authenticity: [
          "Voice realism can’t be confirmed from text alone.",
          "AI voice or real voice both remain possible; the risk comes from the request pattern.",
        ],
      },
      actionPlan: {
        doNow: [
          "Do not pay or reply with details.",
          "Call the person using a known-good number from your contacts (not the message).",
          "If this is a workplace scenario, notify your manager/IT/security channel.",
        ],
        doNotDo: [
          "Do not buy gift cards or share the codes.",
          "Do not click links or install apps suggested by the message.",
          "Do not continue the conversation on the same channel until verified.",
        ],
        verify: [
          "Use an independent channel (phone call, in-person, official company directory).",
          "Ask for a verification detail only the real person would know (non-public, non-guessable).",
        ],
        escalateWhen: [
          "If any money was sent: contact the retailer and your bank immediately.",
          "If credentials were shared: reset passwords and enable MFA right away.",
          "If this targets a business: file an incident with IT/security.",
        ],
      },
      notes:
        "Fallback report shown because live investigation was unavailable. Treat this as decision support, not legal/financial advice.",
    };
  }

  if (presetId === "brain10") {
    return {
      summary:
        "The “10% of our brain” claim is a myth. Neuroscience shows widespread brain activity across tasks and time.",
      risk: {
        level: "LOW",
        confidence: 0.93,
        rationale: [
          "Brain imaging shows broad activation patterns",
          "Evolutionary and clinical evidence contradicts unused brain tissue",
          "The claim is commonly traced to misinterpretations of early neuroscience",
        ],
      },
      findings: {
        reasoning: [
          "Different regions activate based on task demands; even at rest, networks are active.",
          "Brain injuries affecting small regions can cause major deficits—implying those regions matter.",
        ],
      },
      actionPlan: {
        doNow: [
          "Treat the claim as false unless specific peer-reviewed evidence is provided.",
          "Ask the source for a credible citation (textbook, journal article).",
        ],
        doNotDo: [
          "Do not share the claim as fact.",
          "Do not use it to justify expensive “brain unlocking” products.",
        ],
        verify: [
          "Cross-check using reputable sources (major medical institutions, neuroscience textbooks).",
          "Look for peer-reviewed reviews rather than blogs repeating the myth.",
        ],
        escalateWhen: [
          "If someone is selling a product/service using this claim, treat it as a marketing red flag.",
        ],
      },
      notes:
        "Fallback report shown because live investigation was unavailable.",
    };
  }

  if (presetId === "simulation") {
    return {
      summary:
        "The simulation hypothesis is philosophically interesting but currently lacks direct scientific tests that could confirm it.",
      risk: {
        level: "LOW",
        confidence: 0.78,
        rationale: [
          "Primarily philosophical reasoning rather than testable evidence",
          "No widely accepted empirical signature",
          "Depends on assumptions about future computation and motivations",
        ],
      },
      findings: {
        reasoning: [
          "Arguments like Bostrom’s explore probability and incentives, not measurement.",
          "Scientific plausibility is limited by lack of falsifiable predictions in mainstream form.",
        ],
      },
      actionPlan: {
        doNow: [
          "Treat it as a philosophical position, not established science.",
          "Separate ‘interesting’ from ‘proven’ when discussing it.",
        ],
        doNotDo: [
          "Do not treat it as evidence for conspiracy-style claims.",
          "Do not confuse probability arguments with experimental confirmation.",
        ],
        verify: [
          "Ask: what would count as falsifying evidence?",
          "Look for peer-reviewed discussions in philosophy of mind / physics foundations.",
        ],
        escalateWhen: [
          "If someone uses it to justify risky decisions (‘nothing is real’), treat it as a mental-health / safety red flag.",
        ],
      },
      notes:
        "Fallback report shown because live investigation was unavailable.",
    };
  }

  // Generic fallback
  return {
    summary:
      "Live investigation was unavailable. This report provides a structured risk-and-actions template based on the provided input.",
    risk: {
      level: "MEDIUM",
      confidence: 0.55,
      rationale: [
        "Not enough verified context to conclude strongly",
        "Structured review flags assumptions and verification needs",
      ],
    },
    findings: {
      reasoning: [
        "Identify the key claim/request and what evidence would confirm it.",
        "Separate what is known vs unknown; avoid acting on urgency without verification.",
      ],
      authenticity: p ? ["Authenticity assessment depends on additional data (source, channel, metadata)."] : undefined,
    },
    actionPlan: {
      doNow: [
        "Pause and avoid acting on urgency.",
        "Collect key details (who/what/when/where) and preserve the message.",
      ],
      doNotDo: [
        "Do not send money, credentials, or access codes.",
        "Do not click unknown links or install unknown software.",
      ],
      verify: [
        "Verify via a known-good channel (official site/number, in-person, internal directory).",
        "Ask for corroboration or independent confirmation.",
      ],
      escalateWhen: [
        "If money/data/accounts are involved, escalate to the relevant provider or security team.",
      ],
    },
    notes:
      "Fallback report shown because live investigation was unavailable.",
  };
}

function makeSystemPrompt() {
  return [
    "You are InquistAI, a risk-analysis assistant.",
    "Return ONLY valid JSON. No markdown, no backticks, no commentary.",
    "Your JSON MUST match this schema:",
    "{",
    '  "summary": string,',
    '  "risk": { "level": "LOW"|"MEDIUM"|"HIGH", "confidence": number(0..1), "rationale": string[] },',
    '  "findings": { "reasoning": string[], "authenticity"?: string[] },',
    '  "actionPlan": { "doNow": string[], "doNotDo": string[], "verify": string[], "escalateWhen": string[] },',
    '  "notes"?: string',
    "}",
    "Guidance:",
    "- Prefer clear, direct language and practical next steps.",
    "- If uncertain, say so in rationale and keep confidence lower.",
    "- Avoid legal/medical certainty; recommend escalation appropriately.",
  ].join("\n");
}

function makeUserPrompt(presetId: PresetId, prompt: string) {
  return [
    `Preset: ${presetId}`,
    "",
    "Analyze the following input for scams, impersonation, urgency, financial risk, and safe response.",
    "Return JSON in the required schema.",
    "",
    "INPUT:",
    prompt,
  ].join("\n");
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const prompt = typeof body?.prompt === "string" ? body.prompt : "";
    const presetId = typeof body?.presetId === "string" ? body.presetId : "custom";

    // Optional image support (data URL)
    const imageDataUrl = typeof body?.imageDataUrl === "string" ? body.imageDataUrl : null;

    if (!prompt.trim() && !imageDataUrl) {
      return Response.json(
        { error: "Missing prompt (and no image provided)." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      const fallback = buildFallback(presetId, prompt);
      return Response.json(
        { result: fallback, error: "OPENAI_API_KEY not set — showing fallback." },
        { status: 200 }
      );
    }

    const client = new OpenAI({ apiKey });

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const messages: any[] = [
      { role: "system", content: makeSystemPrompt() },
      {
        role: "user",
        content: imageDataUrl
          ? [
              { type: "text", text: makeUserPrompt(presetId, prompt || "(no text prompt provided)") },
              { type: "image_url", image_url: { url: imageDataUrl } },
            ]
          : makeUserPrompt(presetId, prompt),
      },
    ];

    const completion = await client.chat.completions.create({
      model,
      messages,
      // This strongly nudges the model to output parseable JSON
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";
    let parsed: any = null;

    try {
      parsed = JSON.parse(raw);
    } catch {
      // model returned non-JSON despite response_format
      parsed = null;
    }

    const normalized = normalizeResult(parsed);
    if (!normalized) {
      const fallback = buildFallback(presetId, prompt);
      return Response.json(
        { result: fallback, error: "Model returned invalid JSON — showing fallback." },
        { status: 200 }
      );
    }

    return Response.json({ result: normalized }, { status: 200 });
  } catch (err: any) {
    // Last-resort fallback (never 500 the UI)
    const fallback = buildFallback("custom", "");
    return Response.json(
      { result: fallback, error: err?.message || "Server error — showing fallback." },
      { status: 200 }
    );
  }
}
