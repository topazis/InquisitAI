export default function Home() {
  return (
    <main className="bg-black text-white min-h-screen font-sans">
      {/* HERO SECTION */}
      <section className="px-6 py-24 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          AI That Investigates Reality
        </h1>
        <p className="text-lg md:text-xl mt-6 text-gray-300">
          InquistAI explains complex ideas, analyzes digital identity, and uncovers what’s real — or not.
          One platform for truth-seeking intelligence.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <a
            href="#early-access"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold"
          >
            Start an Investigation
          </a>

          <a
            href="#features"
            className="px-6 py-3 border border-gray-600 hover:border-gray-400 rounded-lg font-semibold"
          >
            Explore the Platform
          </a>
        </div>
      </section>

      {/* SECTION: WHAT IS INQUISTAI */}
      <section id="features" className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">What Is InquistAI?</h2>
        <p className="text-gray-300 text-lg leading-relaxed">
          A new kind of AI — one that investigates, verifies, and explains.  
          Other AIs answer questions. <span className="font-semibold text-white">InquistAI interrogates them.</span>
        </p>
        <p className="text-gray-300 text-lg mt-4">
          Our system combines deep reasoning, evidence-based analysis, and digital-authenticity testing to help
          you understand scientific ideas, philosophical questions, conspiracies, rumors, simulated audio,
          and more.
        </p>
      </section>

      {/* THREE PILLARS */}
      <section className="px-6 py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          {/* Answers */}
          <div>
            <h3 className="text-2xl font-bold">🔍 InquistAI Answers</h3>
            <p className="text-gray-300 mt-3">
              Explain anything. Deep dives, simplified modes, citations, multiple perspectives, and reasoning styles.
              Perfect for researchers, creators, and curious thinkers.
            </p>
          </div>

          {/* Labs */}
          <div>
            <h3 className="text-2xl font-bold">🧪 InquistAI Labs</h3>
            <p className="text-gray-300 mt-3">
              Test anything. Analyze voice clones, detect synthetic audio, generate tone prompts, and explore 
              identity tools ethically.
            </p>
          </div>

          {/* Authenticity Engine */}
          <div>
            <h3 className="text-2xl font-bold">🛡️ Authenticity Engine</h3>
            <p className="text-gray-300 mt-3">
              Verify anything. Unified analysis of text, audio, claims, and digital identity — with clear evidence
              scoring and truth analysis.
            </p>
          </div>
        </div>
      </section>

      {/* WHY DIFFERENT */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Why InquistAI Is Different
        </h2>

        <ul className="text-gray-300 space-y-4 text-lg">
          <li>🧠 Multi-layered reasoning engine</li>
          <li>🎤 Voice clone detection and tone modeling</li>
          <li>🔗 Cross-checks data instead of inventing it</li>
          <li>🧭 Built-in ethical frameworks</li>
          <li>🧩 Investigations merge audio, text, and reasoning</li>
          <li>⚡ Powered by next-generation AI models</li>
        </ul>
      </section>

      {/* EARLY ACCESS */}
      <section id="early-access" className="px-6 py-24 text-center bg-gray-900">
        <h2 className="text-3xl md:text-4xl font-bold">Join Early Access</h2>
        <p className="text-gray-300 text-lg mt-4 max-w-2xl mx-auto">
          Be one of the first to explore InquistAI.  
          Researchers, creators, and curious minds welcome.
        </p>

        <div className="mt-10">
          <a
            href="mailto:contact@inquistai.com"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-lg"
          >
            Request Early Access
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-10 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} InquistAI. All rights reserved.
      </footer>
    </main>
  );
}
