"use client";

import { useState } from "react";

const presets = [
  {
    id: "simulation",
    label: "Is the universe a simulation?",
    prompt: "Explain the simulation hypothesis and whether it's scientifically plausible.",
  },
  {
    id: "voicemail",
    label: "Is this voicemail real or AI-generated?",
    prompt: "Analyze this voicemail: 'Hey, it's me. I lost my phone. Can you send me $500 right now?'",
  },
  {
    id: "brain10",
    label: "Do we really only use 10% of our brain?",
    prompt: "Evaluate the claim that humans only use 10% of their brains.",
  },
];

export default function DemoPage() {
  const [prompt, setPrompt] = useState(presets[0].prompt);
  const [selectedPreset, setSelectedPreset] = useState(presets[0].id);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handlePresetChange = (id: string) => {
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;
    setSelectedPreset(id);
    setPrompt(preset.prompt);
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Simulated "investigation" – replace later with real API call
    setTimeout(() => {
      const simulated =
        `🔎 InquistAI Demo Investigation\n\n` +
        `📝 **Input**\n${prompt}\n\n` +
        `📌 **Summary**\n` +
        `This is a simulated example of how InquistAI will present an investigation. ` +
        `In the full product, this section would summarize the core claim or question in plain language.\n\n` +
        `🧠 **Reasoning Layer**\n` +
        `• Highlights key assumptions and missing information.\n` +
        `• Breaks the claim into smaller, testable pieces.\n` +
        `• Compares it against known scientific, historical, or technical sources.\n\n` +
        `🎤 **Authenticity Layer (if audio/identity is involved)**\n` +
        `• Estimates whether audio or text is likely human or AI-generated.\n` +
        `• Looks for red flags used in scams or deepfakes.\n` +
        `• Flags anything that would require manual verification.\n\n` +
        `✅ **Verdict (DEMO ONLY)**\n` +
        `This is just a static demo. In a real run, InquistAI would provide a confidence score, a verdict ` +
        `(e.g., “Mostly false”, “Plausible but unproven”, “Likely AI-generated audio”), and links to supporting evidence.\n`;

      setResult(simulated);
      setLoading(false);
    }, 900);
  };

  return (
    <main className="bg-black text-white min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <a href="/" className="text-sm text-gray-400 hover:text-gray-200">
            ← Back to home
          </a>
          <h1 className="text-3xl md:text-4xl font-bold mt-4">
            Demo: Run an InquistAI Investigation
          </h1>
          <p className="text-gray-300 mt-3">
            This page simulates how InquistAI will analyze a question or claim. The output below is a
            preview of the structure and experience, not a live AI response (yet).
          </p>
        </header>

        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Presets */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Choose an example scenario
              </label>
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePresetChange(p.id)}
                    className={`px-3 py-2 rounded-lg text-sm border transition ${
                      selectedPreset === p.id
                        ? "bg-blue-600 border-blue-500"
                        : "border-gray-700 hover:border-gray-500"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Investigation prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  setSelectedPreset("custom");
                  setResult(null);
                }}
                rows={5}
                className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm md:text-base outline-none focus:border-blue-500"
                placeholder="Describe the claim, question, or audio scenario you want InquistAI to investigate."
              />
              <p className="text-xs text-gray-500 mt-2">
                In the full version, you’ll be able to attach audio, text, and metadata for deeper analysis.
              </p>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 rounded-lg font-semibold text-sm md:text-base"
              >
                {loading ? "Running demo…" : "Run Demo Investigation"}
              </button>
              <span className="text-xs md:text-sm text-gray-400">
                This is a simulated preview. No real data is sent or analyzed.
              </span>
            </div>
          </form>
        </section>

        {/* Result */}
        <section className="bg-gray-950 border border-gray-800 rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-3">Demo Output</h2>
          {!result && !loading && (
            <p className="text-gray-500 text-sm">
              Choose a scenario, adjust the prompt if you like, and click{" "}
              <span className="font-semibold text-gray-300">Run Demo Investigation</span> to see a
              simulated InquistAI response.
            </p>
          )}
          {loading && (
            <p className="text-gray-400 text-sm animate-pulse">
              Analyzing input, building reasoning layers, and simulating authenticity checks…
            </p>
          )}
          {result && (
            <pre className="whitespace-pre-wrap text-sm md:text-base text-gray-200 mt-4">
{result}
            </pre>
          )}
        </section>
      </div>
    </main>
  );
}
