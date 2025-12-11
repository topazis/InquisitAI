"use client";

import { useState } from "react";

type PresetId = "simulation" | "voicemail" | "brain10" | "custom";

const presets: { id: PresetId; label: string; prompt: string }[] = [
  {
    id: "simulation",
    label: "Is the universe a simulation?",
    prompt:
      "Explain the simulation hypothesis and whether it is scientifically plausible. Include key arguments for and against.",
  },
  {
    id: "voicemail",
    label: "Is this voicemail real or AI-generated?",
    prompt:
      "Analyze this voicemail: 'Hey, it's me. I lost my phone. Can you send me $500 right now by gift card? I'll explain later.'",
  },
  {
    id: "brain10",
    label: "Do we use only 10% of our brain?",
    prompt:
      "Evaluate the claim that humans only use 10% of their brains. Explain where this idea comes from and whether it is accurate.",
  },
];

function getSimulatedResult(presetId: PresetId, prompt: string): string {
  if (presetId === "simulation") {
    return (
      `🔎 InquistAI Investigation — Simulation Hypothesis\n\n` +
      `📝 **Input**\n${prompt}\n\n` +
      `📌 **Summary**\n` +
      `The simulation hypothesis proposes that our reality might be a computer-generated environment ` +
      `run by an advanced civilization. It does not claim this is definitely true, but argues that under certain ` +
      `assumptions it could be statistically likely.\n\n` +
      `🧠 **Reasoning Layer**\n` +
      `• Identifies core assumptions: advanced civilizations exist, they run many simulations, and simulated minds can be conscious.\n` +
      `• Compares philosophical arguments (e.g., Bostrom’s trilemma) with current scientific evidence.\n` +
      `• Notes that there is no direct experimental proof, but some features of physics (discreteness, limits, etc.) can be interpreted in that frame.\n\n` +
      `📚 **Evidence & Constraints**\n` +
      `• No empirical test currently confirms or falsifies the hypothesis.\n` +
      `• Many arguments are anthropic or probabilistic, not strictly scientific.\n` +
      `• Practical constraints: computing power, energy, and motivation of hypothetical “simulators”.\n\n` +
      `✅ **Demo Verdict**\n` +
      `In a real run, InquistAI would give a confidence score like: **“Plausible as a philosophical model, unproven scientifically (Confidence: 0.3)”** ` +
      `and provide links to key papers and critiques. For now, treat it as an intriguing but unverified framework rather than an established fact.\n`
    );
  }

  if (presetId === "voicemail") {
    return (
      `🔎 InquistAI Investigation — Suspicious Voicemail\n\n` +
      `📝 **Input**\n${prompt}\n\n` +
      `📌 **Summary**\n` +
      `The message describes an urgent money request via gift cards with minimal context. This closely matches common scam patterns ` +
      `used in phone and text fraud.\n\n` +
      `🎤 **Authenticity Layer (Voice / Identity)**\n` +
      `• In the full product, InquistAI would analyze acoustic features, pacing, artifacts, and background noise for AI-synthesis clues.\n` +
      `• It would compare the caller’s usual phrasing, tone, and vocabulary against past verified messages (if available).\n` +
      `• It would flag the reliance on gift cards and urgency as high-risk scam markers regardless of whether the voice is human or synthetic.\n\n` +
      `🧠 **Reasoning Layer**\n` +
      `• Urgent request + emotional pressure + gift cards = classic scam pattern.\n` +
      `• Lack of verifiable details (location, context, callback options) further increases suspicion.\n` +
      `• Even if the voice is real, the behavior is unsafe and should be verified via a trusted channel.\n\n` +
      `🚨 **Demo Verdict**\n` +
      `A realistic output might be: **“High-risk financial scam pattern detected (Risk: 0.9). Do NOT send money without independently confirming ` +
      `the situation using a known-good contact method.”**\n`
    );
  }

  if (presetId === "brain10") {
    return (
      `🔎 InquistAI Investigation — “10% of the Brain” Myth\n\n` +
      `📝 **Input**\n${prompt}\n\n` +
      `📌 **Summary**\n` +
      `The claim that humans use only 10% of their brains is a persistent myth. Modern neuroscience shows that ` +
      `most brain regions are active over the course of a normal day, even during rest.\n\n` +
      `🧠 **Reasoning Layer**\n` +
      `• Reviews origin theories: misinterpreted early neuroscience, motivational speeches, and pop-psychology.\n` +
      `• Cross-checks with brain imaging studies (fMRI, PET) that show widespread activity.\n` +
      `• Notes that unused brain tissue would be biologically costly and likely lost through evolution.\n\n` +
      `📚 **Evidence & Sources (Conceptual)**\n` +
      `• Neuroimaging data: no large, permanently “dark” regions of the brain.\n` +
      `• Clinical data: small lesions can have major effects, implying that most tissue is functionally important.\n` +
      `• Educational and neuroscience organizations explicitly debunk the 10% myth.\n\n` +
      `✅ **Demo Verdict**\n` +
      `A realistic output might be: **“Claim is false. Humans use virtually all regions of their brain over time; the ‘10%’ figure is a myth ` +
      `(Confidence: 0.98).”**\n`
    );
  }

  // Custom or unknown preset: generic template
  return (
    `🔎 InquistAI Investigation — Demo Output\n\n` +
    `📝 **Input**\n${prompt}\n\n` +
    `📌 **Summary**\n` +
    `This is a simulated example of how InquistAI structures an investigation. In the live system, this section would summarize the ` +
    `core claim or question in precise, neutral language.\n\n` +
    `🧠 **Reasoning Layer**\n` +
    `• Identifies key assumptions and missing information.\n` +
    `• Cross-checks the claim against scientific, historical, or technical knowledge.\n` +
    `• Separates what is known, uncertain, and speculative.\n\n` +
    `🎤 **Authenticity Layer (if relevant)**\n` +
    `• Estimates whether associated audio or text is likely human or AI-generated.\n` +
    `• Flags phishing, deepfake, or manipulation patterns.\n` +
    `• Recommends what should be verified manually.\n\n` +
    `✅ **Demo Verdict**\n` +
    `In a real run, InquistAI would produce a verdict such as **“Mostly false”, “Plausible but unproven”, or “Likely AI-generated audio”** ` +
    `with a numerical confidence score and links to supporting references.\n`
  );
}

export default function DemoPage() {
  const [prompt, setPrompt] = useState(presets[0].prompt);
  const [selectedPreset, setSelectedPreset] = useState<PresetId>("simulation");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handlePresetChange = (id: PresetId) => {
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;
    setSelectedPreset(id);
    setPrompt(preset.prompt);
    setResult(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);

    // Simulated "investigation" – swap this for a real API call later
    setTimeout(() => {
      const simulated = getSimulatedResult(selectedPreset, prompt);
      setResult(simulated);
      setLoading(false);
    }, 900);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-10">
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
            This interactive demo shows how InquistAI structures an investigation. The content below
            is simulated, but the flow and layers reflect the real product experience.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] items-start">
          {/* Left: Form */}
          <section className="bg-gray-900/70 border border-gray-800/80 rounded-2xl p-6 md:p-7 shadow-xl shadow-black/40">
            <h2 className="text-lg font-semibold mb-4">1. Define the investigation</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      onClick={() => handlePresetChange(p.id)}
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
                      setPrompt("");
                      setResult(null);
                    }}
                    className={`px-3 py-2 rounded-full text-xs md:text-sm border transition ${
                      selectedPreset === "custom"
                        ? "bg-purple-600 border-purple-400 shadow-lg shadow-purple-500/30"
                        : "border-gray-700 hover:border-gray-500 hover:bg-gray-800"
                    }`}
                  >
                    Custom scenario
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
                  }}
                  rows={6}
                  className="w-full bg-black/70 border border-gray-700 rounded-xl px-3 py-2 text-sm md:text-base outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  placeholder="Describe the claim, question, or audio scenario you want InquistAI to investigate."
                />
                <p className="text-xs text-gray-500 mt-2">
                  In the full version, you’ll be able to attach audio files, transcripts, and metadata for deep
                  authenticity checks.
                </p>
              </div>

              {/* Submit */}
              <div className="flex items-center gap-4">
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
                  {loading ? "Running demo…" : "Run Demo Investigation"}
                </button>
                <span className="text-xs md:text-sm text-gray-400">
                  Demo only — no real data is sent or stored.
                </span>
              </div>
            </form>
          </section>

          {/* Right: Result */}
          <section className="bg-black/60 border border-gray-800 rounded-2xl p-6 md:p-7 shadow-xl shadow-black/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">2. Demo output</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300">
                Preview only
              </span>
            </div>

            {!result && !loading && (
              <div className="text-gray-500 text-sm md:text-base">
                <p>
                  Choose a scenario on the left, tweak the investigation prompt, and click{" "}
                  <span className="font-semibold text-gray-200">
                    “Run Demo Investigation”
                  </span>{" "}
                  to see how InquistAI structures its analysis.
                </p>
                <ul className="mt-4 list-disc list-inside space-y-1">
                  <li>🧠 Reasoning across claims, context, and evidence</li>
                  <li>🎤 Authenticity checks for audio and identity</li>
                  <li>✅ Clear verdicts with confidence scores</li>
                </ul>
              </div>
            )}

            {loading && (
              <div className="animate-pulse text-gray-300 text-sm md:text-base">
                <p>Building reasoning layers, simulating authenticity checks…</p>
                <p className="mt-2 text-gray-500">
                  In the real system, this step would query models, cross-check sources, and assemble a structured
                  report.
                </p>
              </div>
            )}

            {result && !loading && (
              <div className="mt-2 animate-[fadeIn_0.35s_ease-out]">
                <pre className="whitespace-pre-wrap text-sm md:text-base text-gray-100 leading-relaxed">
{result}
                </pre>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
