"use client";

import { useState } from "react";

type PresetId = "simulation" | "voicemail" | "brain10" | "custom";

const presets = [
  {
    id: "simulation" as const,
    label: "Is the universe a simulation?",
    prompt:
      "Explain the simulation hypothesis and whether it is scientifically plausible. Include key arguments for and against.",
  },
  {
    id: "voicemail" as const,
    label: "Is this voicemail real or AI-generated?",
    prompt:
      "Analyze this voicemail: 'Hey, it's me. I lost my phone. Can you send me $500 right now by gift card? I'll explain later.'",
  },
  {
    id: "brain10" as const,
    label: "Do we use only 10% of our brain?",
    prompt:
      "Evaluate the claim that humans only use 10% of their brains. Explain where this idea comes from and whether it is accurate.",
  },
];

function getFallbackResult(presetId: PresetId, prompt: string): string {
  if (presetId === "simulation") {
    return `
🔎 InquistAI Investigation — Simulation Hypothesis (Fallback)

📝 Summary
The simulation hypothesis suggests our reality might be a constructed computational environment. Interesting, but not scientifically confirmed.

🧠 Reasoning Layer
• Considers computing power requirements.
• Evaluates philosophical arguments like Bostrom's.
• Notes lack of experimental proof.

🎤 Authenticity Layer
Not applicable to conceptual claims.

✅ Verdict
Plausible philosophically; unproven scientifically.
    `;
  }

  if (presetId === "voicemail") {
    return `
🔎 InquistAI Investigation — Suspicious Voicemail (Fallback)

📝 Summary
Content shows strong scam indicators: urgency, money request, gift cards.

🧠 Reasoning Layer
• Classic scam playbook.
• Urgent emotional appeal + vague explanation.
• Gift cards = untraceable payment method.

🎤 Authenticity Layer
Real or AI-generated voice both possible — behavior is unsafe either way.

✅ Verdict
High-risk scam pattern. Do not send money.
    `;
  }

  if (presetId === "brain10") {
    return `
🔎 InquistAI Investigation — 10% Brain Myth (Fallback)

📝 Summary
Neuroscience debunks the “10% brain use” idea.

🧠 Reasoning Layer
• fMRI studies show activity across nearly all regions.
• Evolution would not maintain inactive tissue.
• Misquotes from early neuroscience likely origin.

🎤 Authenticity Layer
Not applicable.

✅ Verdict
Claim is false.
    `;
  }

  return `
🔎 InquistAI Investigation — Generic Fallback

📝 Summary
Live investigation unavailable. This is a structural demo.

🧠 Reasoning Layer
• Identifies assumptions.
• Separates known vs unknown.
• Suggests additional data needed.

🎤 Authenticity Layer
Would analyze audio realism if available.

✅ Verdict
Fallback only.
  `;
}

export default function DemoPage() {
  const [prompt, setPrompt] = useState(presets[0].prompt);
  const [selectedPreset, setSelectedPreset] = useState<PresetId>("simulation");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const runInvestigation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, presetId: selectedPreset }),
      });

      if (!res.ok) {
        const fallback = getFallbackResult(selectedPreset, prompt);
        setErrorMsg("Live investigation unavailable — showing fallback.");
        setResult(fallback);
      } else {
        const data = await res.json();
        setResult(data.result ?? getFallbackResult(selectedPreset, prompt));
      }
    } catch (err) {
      setErrorMsg("Network or server error — showing fallback.");
      setResult(getFallbackResult(selectedPreset, prompt));
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <a href="/" className="text-sm text-gray-400 hover:text-gray-200">
          ← Back to Home
        </a>

        <h1 className="text-4xl font-bold mt-5 mb-4">
          Demo: InquistAI Investigation
        </h1>

        <div className="grid md:grid-cols-2 gap-8 mt-10">
          {/* LEFT PANEL */}
          <section className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4">1. Set Investigation</h2>

            <div className="flex flex-wrap gap-2 mb-6">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPreset(p.id);
                    setPrompt(p.prompt);
                    setResult(null);
                    setErrorMsg(null);
                  }}
                  className={`px-3 py-2 rounded-full text-sm border ${
                    selectedPreset === p.id
                      ? "bg-blue-600 border-blue-400"
                      : "border-gray-700 hover:bg-gray-800"
                  }`}
                >
                  {p.label}
                </button>
              ))}

              {/* Custom */}
              <button
                onClick={() => {
                  setSelectedPreset("custom");
                  setPrompt("");
                  setResult(null);
                  setErrorMsg(null);
                }}
                className={`px-3 py-2 rounded-full text-sm border ${
                  selectedPreset === "custom"
                    ? "bg-purple-600 border-purple-400"
                    : "border-gray-700 hover:bg-gray-800"
                }`}
              >
                Custom
              </button>
            </div>

            <form onSubmit={runInvestigation} className="space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-sm"
                placeholder="Describe a claim or scenario..."
              />

              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className={`w-full py-3 rounded-lg font-semibold ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500"
                }`}
              >
                {loading ? "Running..." : "Run Investigation"}
              </button>
            </form>
          </section>

          {/* RIGHT PANEL */}
          <section className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4">2. Output</h2>

            {errorMsg && (
              <p className="text-yellow-400 text-sm mb-3">{errorMsg}</p>
            )}

            {/* Loading */}
            {loading && (
              <div className="animate-pulse text-gray-400">
                Running investigation…
              </div>
            )}

            {/* Empty state */}
            {!result && !loading && (
              <p className="text-gray-500 text-sm">
                Select a scenario and run an investigation.
              </p>
            )}

            {/* Result */}
            {result && !loading && (
              <pre className="whitespace-pre-wrap text-gray-100 text-sm mt-2">
                {result}
              </pre>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
