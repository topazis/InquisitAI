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

export default function DemoClient({
  initialPreset,
  initialPrompt,
}: {
  initialPreset?: string;
  initialPrompt?: string;
}) {
  const normalizedPreset: PresetId | null =
    initialPreset === "simulation" ||
    initialPreset === "voicemail" ||
    initialPreset === "brain10" ||
    initialPreset === "custom"
      ? initialPreset
      : null;

  const defaultPreset: PresetId =
    normalizedPreset && normalizedPreset !== "custom"
      ? normalizedPreset
      : "simulation";

  const initialPromptValue = (() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      return initialPrompt;
    }
    if (normalizedPreset && normalizedPreset !== "custom") {
      const p = presets.find((x) => x.id === normalizedPreset);
      if (p) return p.prompt;
    }
    return presets[0].prompt;
  })();

  const [prompt, setPrompt] = useState(initialPromptValue);
  const [selectedPreset, setSelectedPreset] = useState<PresetId>(
    normalizedPreset ?? defaultPreset
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Snapshot of the prompt + timestamp used for the last completed investigation
  const [reportPrompt, setReportPrompt] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);

  const runInvestigation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResult(null);
    setErrorMsg(null);

    // Snapshot meta for the report
    setReportPrompt(prompt);
    setGeneratedAt(new Date());

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
      const fallback = getFallbackResult(selectedPreset, prompt);
      setErrorMsg("Network or server error — showing fallback.");
      setResult(fallback);
    }

    setLoading(false);
  };

  const handleExportPdf = () => {
    if (!result) return;
    if (typeof window === "undefined") return;
    window.print(); // Browser handles "Save as PDF"
  };

  const effectivePrompt = reportPrompt ?? prompt;
  const presetLabel =
    presets.find((p) => p.id === selectedPreset)?.label ?? "Custom scenario";

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header (hidden in print) */}
        <header className="mb-10 print-hide">
          <a
            href="/"
            className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            ← Back to home
          </a>
          <h1 className="text-3xl md:text-4xl font-bold mt-4">
            Demo: InquistAI Investigation
          </h1>
          <p className="text-gray-300 mt-3 max-w-2xl">
            This interactive demo runs your prompt through the investigation engine
            (when credits are available), with a structured fallback so you can always
            see how InquistAI thinks.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] items-start">
          {/* Left: Form (hidden in print) */}
          <section className="bg-gray-900/70 border border-gray-800/80 rounded-2xl p-6 md:p-7 shadow-xl shadow-black/40 print-hide">
            <h2 className="text-lg font-semibold mb-4">1. Define the investigation</h2>
            <form onSubmit={runInvestigation} className="space-y-6">
              {/* Preset buttons */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-200">
                  Choose an example scenario
                </label>
                <div className="flex flex-wrap gap-2">
                  {presets.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(p.id);
                        setPrompt(p.prompt);
                        setResult(null);
                        setErrorMsg(null);
                        setReportPrompt(null);
                        setGeneratedAt(null);
                      }}
                      className={`px-3 py-2 rounded-full text-xs md:text-sm border transition 
                        ${
                          selectedPreset === p.id
                            ? "bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30"
                            : "border-gray-700 hover:border-gray-500 hover:bg-gray-800"
                        }`}
                    >
                      {p.label}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPreset("custom");
                      setResult(null);
                      setErrorMsg(null);
                      setReportPrompt(null);
                      setGeneratedAt(null);
                    }}
                    className={`px-3 py-2 rounded-full text-xs md:text-sm border transition ${
                      selectedPreset === "custom"
                        ? "bg-purple-600 border-purple-400 shadow-lg shadow-purple-500/30"
                        : "border-gray-700 hover:border-gray-500 hover:bg-gray-800"
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {/* Prompt textarea */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-200">
                  Investigation prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    setSelectedPreset("custom");
                    setResult(null);
                    setErrorMsg(null);
                    setReportPrompt(null);
                    setGeneratedAt(null);
                  }}
                  rows={6}
                  className="w-full bg-black/70 border border-gray-700 rounded-xl px-3 py-2 text-sm md:text-base outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  placeholder="Describe the claim, message, or scenario you want InquistAI to investigate."
                />
                <p className="text-xs text-gray-500 mt-2">
                  Templates from{" "}
                  <a href="/templates" className="underline text-blue-300">
                    /templates
                  </a>{" "}
                  can pre-fill this with common scenarios.
                </p>
              </div>

              {/* Submit + Export buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm md:text-base transition 
                    ${
                      loading || !prompt.trim()
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30"
                    }`}
                >
                  {loading ? "Running investigation…" : "Run Investigation"}
                </button>

                <button
                  type="button"
                  disabled={!result || loading}
                  onClick={handleExportPdf}
                  className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold border transition
                    ${
                      !result || loading
                        ? "border-gray-700 text-gray-500 cursor-not-allowed"
                        : "border-gray-600 text-gray-200 hover:border-blue-400 hover:text-blue-200"
                    }`}
                >
                  Export as PDF
                </button>

                <span className="text-xs md:text-sm text-gray-400">
                  When OpenAI credits are exhausted, you&apos;ll see structured fallback output.
                  Use the PDF button to save the report.
                </span>
              </div>
            </form>
          </section>

          {/* Right: Report / Result (print-optimized) */}
          <section className="bg-black/60 border border-gray-800 rounded-2xl p-6 md:p-7 shadow-xl shadow-black/50 print-report">
            {/* Report header / branding */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-semibold text-gray-300 print:text-black">
                  InquistAI Investigation Report
                </div>
                <div className="text-[11px] text-gray-500 print:text-black/70">
                  Scenario: {presetLabel}
                </div>
              </div>
              <div className="text-[11px] text-gray-500 text-right print:text-black/70">
                {generatedAt ? (
                  <>
                    <div>Generated:</div>
                    <div>{generatedAt.toLocaleString()}</div>
                  </>
                ) : (
                  <span>Run an investigation to generate a report.</span>
                )}
              </div>
            </div>

            {/* Input snapshot */}
            {effectivePrompt && (
              <div className="mb-4 text-xs md:text-sm">
                <div className="font-semibold mb-1 text-gray-200 print:text-black">
                  Input
                </div>
                <div className="border border-gray-700 rounded-lg bg-black/40 print:bg-white print:border-black/20 px-3 py-2 text-gray-200 print:text-black whitespace-pre-wrap text-xs md:text-sm">
                  {effectivePrompt}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-100 print:text-black">
                Analysis
              </h2>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300 print:bg-black print:text-white">
                Live + fallback
              </span>
            </div>

            {errorMsg && (
              <p className="mb-3 text-xs text-amber-400 print:text-[11px]">
                ⚠ {errorMsg}
              </p>
            )}

            {!result && !loading && !errorMsg && (
              <div className="text-gray-500 text-sm md:text-base print:text-black">
                <p>
                  Choose a scenario or paste your own, then click{" "}
                  <span className="font-semibold text-gray-200 print:text-black">
                    “Run Investigation”
                  </span>{" "}
                  to generate a report you can export as PDF.
                </p>
                <ul className="mt-4 list-disc list-inside space-y-1">
                  <li>🧠 Reasoning across claims, context, and evidence</li>
                  <li>🎤 Authenticity notes where relevant</li>
                  <li>✅ Clear verdicts with confidence scores</li>
                </ul>
              </div>
            )}

            {loading && (
              <div className="animate-pulse text-gray-300 text-sm md:text-base print:text-black">
                <p>Building reasoning layers and querying the investigation engine…</p>
                <p className="mt-2 text-gray-500 print:text-black/70">
                  In full production, this step combines model calls, pattern checks, and
                  reference lookups before generating the report.
                </p>
              </div>
            )}

            {result && !loading && (
              <div className="mt-3 animate-[fadeIn_0.35s_ease-out]">
                <pre className="whitespace-pre-wrap text-sm md:text-base text-gray-100 print:text-black leading-relaxed">
                  {result}
                </pre>
              </div>
            )}

            {/* Footer note for print */}
            {result && (
              <p className="mt-6 text-[10px] text-gray-500 print:text-black/70 border-t border-gray-800 pt-3 print:border-black/20">
                InquistAI is an AI-assisted reasoning tool. Use this report as decision support,
                not as a substitute for professional legal, financial, or security advice.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
