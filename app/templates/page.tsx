"use client";

const templates = [
  {
    id: "voicemail",
    name: "Suspicious voicemail from a 'boss' or family member",
    description:
      "Analyze a voicemail or message asking for urgent money, gift cards, or sensitive info. Great for CEO fraud and fake family emergency scams.",
    examplePrompt:
      "I got a voicemail from someone claiming to be my boss asking for urgent gift card payments. Analyze this message for scam risk and red flags.",
  },
  {
    id: "scam_text",
    name: "Text or email that might be a scam",
    description:
      "Paste any text or email that feels off—fake package delivery, bank alerts, 'you won a prize', and more.",
    examplePrompt:
      "This text says my bank account is locked and I must click a link to verify my identity. Check if this is likely a phishing scam and explain why.",
  },
  {
    id: "simulation",
    name: "Big, weird claims (simulation, conspiracies, etc.)",
    description:
      "Run philosophical or speculative claims through a calm, structured reasoning engine that separates evidence from speculation.",
    examplePrompt:
      "Evaluate the claim that we are almost certainly living in a computer simulation. Summarize the argument and its main weaknesses.",
  },
  {
    id: "brain10",
    name: "Fact-check a popular science myth",
    description:
      "Good for '10% of the brain', detox cleanses, miracle supplements, and similar viral science claims.",
    examplePrompt:
      "Evaluate whether the claim that humans only use 10% of their brain is accurate. Explain the scientific consensus.",
  },
  {
    id: "social_post",
    name: "Suspicious social media post",
    description:
      "Paste a viral tweet, Facebook post, or screenshot text and get an assessment of plausibility, missing context, and risk.",
    examplePrompt:
      "This post claims that a new law secretly bans cash and forces everyone onto a government-controlled digital currency. Analyze its plausibility.",
  },
  {
    id: "custom",
    name: "Custom investigation",
    description:
      "Anything that feels off, manipulative, or too good to be true. Use this when nothing else fits.",
    examplePrompt:
      "I got a message from someone I don't know claiming to represent a company and offering a work-from-home job with upfront equipment money. Analyze this.",
  },
];

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-900/70">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold">
              IQ
            </div>
            <span className="font-semibold tracking-tight">InquistAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <a href="/" className="hover:text-white">
              Home
            </a>
            <a href="/demo" className="hover:text-white">
              Demo
            </a>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Investigation templates
        </h1>
        <p className="text-gray-300 max-w-2xl mb-8">
          Choose a template that matches your situation. We’ll send you to the demo
          with a pre-filled scenario so you can see how InquistAI thinks about it.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {templates.map((tpl) => {
            const href =
              tpl.id === "simulation" || tpl.id === "brain10" || tpl.id === "voicemail"
                ? `/demo?preset=${encodeURIComponent(tpl.id)}`
                : `/demo?prompt=${encodeURIComponent(tpl.examplePrompt)}&preset=custom`;

            return (
              <a
                key={tpl.id}
                href={href}
                className="group bg-gray-900/70 border border-gray-800 rounded-2xl p-5 hover:border-blue-500/70 hover:bg-gray-900 transition-colors flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold mb-1 group-hover:text-blue-300">
                    {tpl.name}
                  </h2>
                  <p className="text-gray-300 text-sm mb-3">{tpl.description}</p>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  <span className="block font-semibold text-gray-300 mb-1">
                    Example prompt:
                  </span>
                  <p className="line-clamp-3 group-hover:text-gray-200">
                    “{tpl.examplePrompt}”
                  </p>
                  <span className="mt-2 inline-flex items-center text-[11px] text-blue-300">
                    Open in demo
                    <span className="ml-1">↗</span>
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-10 text-sm text-gray-400">
          <p>
            All templates currently use the same investigation engine. In future versions, each
            template will have tailored checks, scoring, and exportable reports.
          </p>
        </div>
      </section>
    </main>
  );
}
