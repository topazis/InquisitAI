"use client";

import { useState } from "react";

function EarlyAccessForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error || "Something went wrong. Please try again.");
      } else {
        setStatus("success");
        setMessage("Thanks — you’re on the list. I’ll be in touch.");
        setEmail("");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  const disabled = status === "loading";

  return (
    <div className="inline-flex flex-col items-center gap-3 w-full max-w-md mx-auto">
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col sm:flex-row items-stretch gap-3"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-xl bg-black/70 border border-gray-700 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={disabled}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold min-w-[150px] ${
            disabled
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {status === "loading" ? "Submitting…" : "Join early access"}
        </button>
      </form>

      {message && (
        <p
          className={`text-xs ${
            status === "success" ? "text-emerald-400" : "text-amber-400"
          }`}
        >
          {message}
        </p>
      )}

      <p className="text-xs text-gray-500 max-w-md">
        No spam, no marketing blasts—just occasional emails while I figure out what
        matters most for people using AI to spot scams, bad info, and sketchy claims.
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      {/* NAV */}
      <header className="border-b border-gray-900/70">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold">
              IQ
            </div>
            <span className="font-semibold tracking-tight">InquistAI</span>
          </div>

          {/* UPDATED NAV WITH LIBRARY LINK */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <a href="#use-cases" className="hover:text-white">
              Use cases
            </a>
            <a href="#how-it-works" className="hover:text-white">
              How it works
            </a>

            {/* ⭐ NEW LIBRARY LINK */}
            <a href="/library" className="hover:text-white">
              Library
            </a>

            <a href="#early-access" className="hover:text-white">
              Early access
            </a>
            <a
              href="/demo"
              className="px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-sm font-semibold"
            >
              Try a demo
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-gray-900/70">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-blue-400 uppercase mb-4">
              Truth • Risk • Authenticity
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              AI investigations for{" "}
              <span className="text-blue-400">scams, claims, and digital noise.</span>
            </h1>
            <p className="mt-5 text-gray-300 text-base md:text-lg max-w-xl">
              Paste a message, claim, or scenario. InquistAI breaks it down into reasoning,
              risk signals, and a clear verdict—so you know whether to trust it, ignore it,
              or escalate it.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/demo"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm md:text-base font-semibold shadow-lg shadow-blue-500/30"
              >
                Run a demo investigation
              </a>
              <a
                href="#early-access"
                className="px-6 py-3 rounded-xl border border-gray-700 hover:border-gray-500 text-sm md:text-base font-semibold text-gray-200"
              >
                Join early access list
              </a>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              No prompting tricks. Consistent, structured reports every time.
            </p>
          </div>

          {/* Right: hero “card” */}
          <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-5 md:p-6 shadow-xl shadow-black/40">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-semibold text-gray-300">Example investigation</div>
              <span className="text-[10px] px-2 py-1 rounded-full bg-gray-800 text-gray-400">
                Demo preview
              </span>
            </div>
            <div className="bg-black/60 border border-gray-800 rounded-xl p-4 text-xs md:text-sm text-gray-100 space-y-3">
              <p>🔎 “Is this voicemail from my boss, or a scam?”</p>
              <p>
                🧠 Reasoning Layer:
                <br />
                • Urgent money request via gift cards
                <br />
                • Vague context, no verifiable details
                <br />
                • Matches known CEO fraud and gift card scam patterns
              </p>
              <p>
                🎤 Authenticity Layer:
                <br />
                • Voice content and phrasing raise more red flags than audio quality
                <br />
                • Recommends independent verification on a known-good number
              </p>
              <p>
                ✅ Verdict: <span className="font-semibold">High scam risk</span> — do not pay
                without offline confirmation. (Confidence: 0.92)
              </p>
            </div>
            <p className="mt-3 text-[11px] text-gray-500">
              InquistAI is not a replacement for legal or financial advice. It&apos;s a structured
              lens on risk and plausibility.
            </p>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section id="use-cases" className="border-b border-gray-900/70">
        <div className="max-w-6xl mx-auto px-6 py-14 md:py-18">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">Where InquistAI helps first</h2>
          <p className="text-gray-300 mb-8 max-w-2xl">
            Start with the high-stakes, high-noise situations where a second opinion matters.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-lg font-semibold mb-2">🧓 Family scam protection</h3>
              <p className="text-gray-300 text-sm">
                Paste suspicious texts, emails, or voicemail transcripts and get a structured
                scam-likelihood breakdown you can share with family.
              </p>
            </div>

            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-lg font-semibold mb-2">🏢 Small business sanity check</h3>
              <p className="text-gray-300 text-sm">
                Evaluate “urgent vendor” messages, unexpected invoices, or weird HR outreach before
                money or data leaves your systems.
              </p>
            </div>

            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-lg font-semibold mb-2">🎓 Claims & misinformation</h3>
              <p className="text-gray-300 text-sm">
                Run bold claims through a calm, evidence-aware reasoning engine that separates
                what&apos;s known, unknown, and just speculation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-b border-gray-900/70">
        <div className="max-w-6xl mx-auto px-6 py-14 md:py-18">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">How an investigation works</h2>
          <p className="text-gray-300 mb-8 max-w-2xl">
            Under the hood, InquistAI is just a smart orchestrator: it takes your input, runs
            reasoning patterns on top of foundation models, and returns a consistent report.
          </p>

          <div className="grid gap-6 md:grid-cols-3 text-sm">
            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold mb-3">
                1
              </span>
              <h3 className="font-semibold mb-1">You submit a scenario</h3>
              <p className="text-gray-300">
                Paste a message, claim, or transcript. Choose a template like scam check,
                misinformation review, or “is this legit?”
              </p>
            </div>

            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold mb-3">
                2
              </span>
              <h3 className="font-semibold mb-1">We build the reasoning</h3>
              <p className="text-gray-300">
                The engine breaks the input into claims, cross-checks for patterns and red flags,
                and separates facts, uncertainties, and assumptions.
              </p>
            </div>

            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold mb-3">
                3
              </span>
              <h3 className="font-semibold mb-1">You get a clear verdict</h3>
              <p className="text-gray-300">
                You receive a structured report with summary, reasoning layer, authenticity notes,
                and a verdict with confidence score.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <a
              href="/demo"
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold"
            >
              Try the interactive demo
            </a>
            <span className="text-gray-400 flex items-center">
              No signup yet • Uses OpenAI models under the hood
            </span>
          </div>
        </div>
      </section>

      {/* EARLY ACCESS */}
      <section id="early-access" className="border-b border-gray-900/70">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">
            Early access for testers
          </h2>
          <p className="text-gray-300 mb-6">
            I&apos;m looking for people who deal with scams, sketchy messages, or
            high-stakes decisions and want a second set of eyes. Drop your email
            and I&apos;ll reach out as I shape the product.
          </p>

          <EarlyAccessForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-[11px] text-gray-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} InquistAI. All rights reserved.</span>
          <span className="text-gray-600">
            Built on top of modern AI models. Use as decision support, not as your only source of truth.
          </span>
        </div>
      </footer>
    </main>
  );
}
