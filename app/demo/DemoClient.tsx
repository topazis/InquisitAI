"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
      "Analyze this voicemail: 'Hey, it's me. I lost my phone. Can you send me $500 right now by gift card? I'll explain later.' Identify scam indicators, emotional manipulation patterns, and what a safe response would be.",
  },
  {
    id: "brain10" as const,
    label: "Do we use only 10% of our brain?",
    prompt:
      "Evaluate the claim that humans only use 10% of their brains. Explain where this idea comes from and whether it is accurate.",
  },
] as const;

function isPresetId(x: unknown): x is PresetId {
  return x === "simulation" || x === "voicemail" || x === "brain10" || x === "custom";
}

function getPresetPrompt(id: PresetId): string {
  if (id === "custom") return "";
  const found = presets.find((p) => p.id === id);
  return found?.prompt ?? presets[0].prompt;
}

function getPresetLabel(id: PresetId): string {
  if (id === "custom") return "Custom scenario";
  const found = presets.find((p) => p.id === id);
  return found?.label ?? "Custom scenario";
}

/** ---- Structured result types (works with your new route.ts output) ---- */
type RiskLevel = "low" | "medium" | "high" | "critical";

type ActionPlanData = {
  doNow: string[];
  doNotDo: string[];
  verify: string[];
  escalateWhen: string[];
};

type Finding = {
  title: string;
  severity?: "info" | "low" | "medium" | "high";
  evidence?: string[];
};

type InvestigationStructured = {
  summary: string;
  risk: { level: RiskLevel; score: number; rationale?: string };
  findings: Finding[];
  actionPlan: ActionPlanData;
  notes?: string[];
};

function isStructured(x: unknown): x is InvestigationStructured {
  if (!x || typeof x !== "object") return false;
  const o = x as any;
  return typeof o.summary === "string" && !!o.risk && Array.isArray(o.findings) && !!o.actionPlan;
}

function getFallbackStructured(presetId: PresetId): InvestigationStructured {
  if (presetId === "voicemail") {
    return {
      summary:
        "This message matches common impersonation / “urgent help” scam patterns. Treat as high risk until verified via a known-safe channel.",
      risk: { level: "high", score: 82, rationale: "Urgency + gift cards + vague context + money request." },
      findings: [
        {
          title: "Urgent money request + untraceable payment method",
          severity: "high",
          evidence: ["Requests $500 immediately", "Gift cards are a common scam payment rail"],
        },
        {
          title: "Vague explanation / missing verifiable details",
          severity: "medium",
          evidence: ["No specific callback method", "No shared context you can confirm"],
        },
      ],
      actionPlan: {
        doNow: ["Do not pay or reply to the request directly.", "Contact the person via a known-good phone number."],
        doNotDo: ["Do not buy gift cards.", "Do not click links or install apps suggested by the message."],
        verify: ["Call/FaceTime the person using a number from your contacts.", "Ask a question only they would know."],
        escalateWhen: ["If financial info was shared, contact your bank immediately.", "If threats/extortion appear, contact local authorities."],
      },
      notes: ["Fallback report — live investigation unavailable."],
    };
  }

  if (presetId === "brain10") {
    return {
      summary:
        "The “10% brain use” claim is a myth. Neuroscience shows distributed activity across brain regions depending on the task.",
      risk: { level: "low", score: 18, rationale: "Common misconception; not a direct scam risk." },
      findings: [
        {
          title: "Misinterpretation of early neuroscience",
          severity: "low",
          evidence: ["Popularized by media/self-help", "Not supported by modern imaging and lesion studies"],
        },
        { title: "Brain tissue is metabolically expensive", severity: "medium", evidence: ["Evolution would not maintain mostly inactive tissue"] },
      ],
      actionPlan: {
        doNow: ["Treat the claim as false unless a credible source is provided."],
        doNotDo: ["Don’t use it to justify “brain unlocking” products/services."],
        verify: ["Check reputable neuroscience / medical references.", "Look for consensus summaries rather than single studies."],
        escalateWhen: ["If someone is selling a product based on it, treat it as a marketing red flag."],
      },
      notes: ["Fallback report — live investigation unavailable."],
    };
  }

  return {
    summary:
      "The simulation hypothesis is philosophically interesting, but not scientifically confirmed. No decisive test exists today.",
    risk: { level: "low", score: 12, rationale: "Conceptual topic; minimal direct harm unless used to justify risky behavior." },
    findings: [
      { title: "Philosophical argument (e.g., Bostrom-style reasoning)", severity: "info", evidence: ["Not a direct empirical claim"] },
      { title: "No accepted experimental confirmation", severity: "medium", evidence: ["Ideas exist, but evidence is not definitive"] },
    ],
    actionPlan: {
      doNow: ["Treat as a thought experiment unless evidence is presented."],
      doNotDo: ["Don’t treat it as proof to ignore real-world responsibilities."],
      verify: ["Seek peer-reviewed discussions and critiques.", "Separate metaphysics from testable physics claims."],
      escalateWhen: ["If someone uses it to push harmful ideology, step back and validate independently."],
    },
    notes: ["Fallback report — live investigation unavailable."],
  };
}

/** ---- Screenshot / redaction tool types ---- */
type ToolMode = "none" | "redact" | "blur";

type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/** ---- UI mini components (self-contained to avoid type/import build issues) ---- */
function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-800" />
      <div className="text-[11px] uppercase tracking-[0.22em] text-gray-500">{label}</div>
      <div className="h-px flex-1 bg-gray-800" />
    </div>
  );
}

function RiskDial({ risk }: { risk: InvestigationStructured["risk"] }) {
  const level = risk.level;
  const score = clamp(Math.round(risk.score ?? 0), 0, 100);

  const pill =
    level === "critical"
      ? "bg-red-600"
      : level === "high"
      ? "bg-amber-600"
      : level === "medium"
      ? "bg-blue-600"
      : "bg-emerald-600";

  return (
    <div className="rounded-2xl border border-gray-800 bg-black/40 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-100 print:text-black">Risk Dial</h3>
        <span className={`text-[10px] px-2 py-1 rounded-full text-white ${pill}`}>
          {level.toUpperCase()}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Score</span>
          <span className="font-semibold text-gray-200">{score}/100</span>
        </div>
        <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
          <div className="h-full bg-white/80" style={{ width: `${score}%` }} />
        </div>
        {risk.rationale ? <p className="text-xs text-gray-400">{risk.rationale}</p> : null}
      </div>
    </div>
  );
}

function ActionPlan({ plan }: { plan: ActionPlanData }) {
  const Section = ({
    title,
    items,
    tone,
  }: {
    title: string;
    items: string[];
    tone: "good" | "warn" | "neutral";
  }) => {
    const color =
      tone === "good"
        ? "text-emerald-300"
        : tone === "warn"
        ? "text-red-300"
        : "text-blue-300";

    return (
      <div>
        <h4 className={`text-sm font-semibold mb-2 ${color}`}>{title}</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-200">
          {items.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-gray-800 bg-black/40 p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-100 print:text-black">60-Second Action Plan</h3>
        <span className="text-[10px] px-2 py-1 rounded-full bg-gray-800 text-gray-300 print:bg-black print:text-white">
          Do this first
        </span>
      </div>

      <Section title="Do this now" items={plan.doNow} tone="good" />
      <Section title="Do NOT do this" items={plan.doNotDo} tone="warn" />
      <Section title="Verify safely" items={plan.verify} tone="neutral" />
      <Section title="Escalate if" items={plan.escalateWhen} tone="warn" />
    </div>
  );
}

export default function DemoClient({
  initialPreset,
  initialPrompt,
}: {
  initialPreset?: string;
  initialPrompt?: string;
}) {
  /** ---- URL hydration (works for client nav + repeated nav) ---- */
  const urlPreset: PresetId = useMemo(() => {
    return isPresetId(initialPreset) ? (initialPreset as PresetId) : "simulation";
  }, [initialPreset]);

  const urlPrompt: string = useMemo(() => {
    return typeof initialPrompt === "string" ? initialPrompt : "";
  }, [initialPrompt]);

  const [selectedPreset, setSelectedPreset] = useState<PresetId>(urlPreset);
  const [prompt, setPrompt] = useState<string>(() => {
    const p = (urlPrompt ?? "").trim();
    if (p.length > 0) return p;
    return getPresetPrompt(urlPreset);
  });

  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [resultObj, setResultObj] = useState<InvestigationStructured | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [reportPrompt, setReportPrompt] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);

  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const lastUrlKeyRef = useRef<string>("");

  useEffect(() => {
    const p = (urlPrompt ?? "").trim();
    const key = `${urlPreset}::${p}`;
    if (key === lastUrlKeyRef.current) return;

    setSelectedPreset(urlPreset);
    setPrompt(p.length > 0 ? p : getPresetPrompt(urlPreset));

    setResultText(null);
    setResultObj(null);
    setErrorMsg(null);
    setReportPrompt(null);
    setGeneratedAt(null);
    setShareMessage(null);

    lastUrlKeyRef.current = key;
  }, [urlPreset, urlPrompt]);

  /** ---- Screenshot / redaction tools state ---- */
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [toolMode, setToolMode] = useState<ToolMode>("none");
  const [blurStrength, setBlurStrength] = useState<number>(18);

  const [rectsRedact, setRectsRedact] = useState<Rect[]>([]);
  const [rectsBlur, setRectsBlur] = useState<Rect[]>([]);

  const [isDrawing, setIsDrawing] = useState(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const currentRectRef = useRef<Rect | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  type UndoState = {
    rectsRedact: Rect[];
    rectsBlur: Rect[];
    blurStrength: number;
    toolMode: ToolMode;
    imageDataUrl: string | null;
  };
  const undoStackRef = useRef<UndoState[]>([]);

  function pushUndo() {
    undoStackRef.current.push({
      rectsRedact: JSON.parse(JSON.stringify(rectsRedact)),
      rectsBlur: JSON.parse(JSON.stringify(rectsBlur)),
      blurStrength,
      toolMode,
      imageDataUrl,
    });
    if (undoStackRef.current.length > 50) undoStackRef.current.shift();
  }

  function undo() {
    const last = undoStackRef.current.pop();
    if (!last) return;
    setRectsRedact(last.rectsRedact);
    setRectsBlur(last.rectsBlur);
    setBlurStrength(last.blurStrength);
    setToolMode(last.toolMode);
    setImageDataUrl(last.imageDataUrl);
  }

  function clearEdits() {
    pushUndo();
    setRectsRedact([]);
    setRectsBlur([]);
    setToolMode("none");
  }

  function clearImage() {
    pushUndo();
    setImageDataUrl(null);
    setRectsRedact([]);
    setRectsBlur([]);
    setToolMode("none");
  }

  function getCanvasSizeForImage(img: HTMLImageElement) {
    // Keep it readable; cap width to 900ish while preserving aspect.
    const maxW = 860;
    const scale = Math.min(1, maxW / img.naturalWidth);
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);
    return { w, h, scale };
  }

  function drawCanvas(previewRect?: Rect | null) {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = getCanvasSizeForImage(img);
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;

    // base image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // blur regions (simple per-region blur approximation: pixelate)
    const blurRects = [...rectsBlur];
    if (previewRect && toolMode === "blur") blurRects.push(previewRect);

    for (const r of blurRects) {
      const x = Math.round(r.x);
      const y = Math.round(r.y);
      const w2 = Math.round(r.w);
      const h2 = Math.round(r.h);
      if (w2 <= 2 || h2 <= 2) continue;

      const block = clamp(Math.round(blurStrength / 2), 4, 40);
      // pixelate: draw tiny scaled copy back up
      const tmp = document.createElement("canvas");
      tmp.width = Math.max(1, Math.round(w2 / block));
      tmp.height = Math.max(1, Math.round(h2 / block));
      const tctx = tmp.getContext("2d");
      if (!tctx) continue;
      tctx.imageSmoothingEnabled = false;
      tctx.drawImage(canvas, x, y, w2, h2, 0, 0, tmp.width, tmp.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tmp, 0, 0, tmp.width, tmp.height, x, y, w2, h2);
      ctx.imageSmoothingEnabled = true;

      // outline
      ctx.strokeStyle = "rgba(56,189,248,0.9)";
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 0.5, y + 0.5, w2 - 1, h2 - 1);
    }

    // redact regions
    const redactRects = [...rectsRedact];
    if (previewRect && toolMode === "redact") redactRects.push(previewRect);

    for (const r of redactRects) {
      const x = Math.round(r.x);
      const y = Math.round(r.y);
      const w2 = Math.round(r.w);
      const h2 = Math.round(r.h);
      if (w2 <= 2 || h2 <= 2) continue;

      ctx.fillStyle = "rgba(0,0,0,0.92)";
      ctx.fillRect(x, y, w2, h2);

      ctx.strokeStyle = "rgba(239,68,68,0.95)";
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 0.5, y + 0.5, w2 - 1, h2 - 1);
    }

    // mode hint (only when tool active)
    if (toolMode !== "none") {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(10, 10, 160, 28);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";
      ctx.fillText(toolMode === "redact" ? "Redact mode" : "Blur mode", 18, 28);
    }
  }

  useEffect(() => {
    if (!imageDataUrl) return;
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      drawCanvas(null);
    };
    img.src = imageDataUrl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageDataUrl]);

  useEffect(() => {
    if (!imageDataUrl) return;
    drawCanvas(currentRectRef.current ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rectsBlur, rectsRedact, blurStrength, toolMode]);

  function canvasPointFromEvent(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
  }

  function onCanvasMouseDown(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (!imageDataUrl) return;
    if (toolMode === "none") return;

    pushUndo();
    setIsDrawing(true);
    const p = canvasPointFromEvent(e);
    startRef.current = p;
    currentRectRef.current = { x: p.x, y: p.y, w: 0, h: 0 };
    drawCanvas(currentRectRef.current);
  }

  function onCanvasMouseMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (!isDrawing) return;
    if (!startRef.current) return;
    if (!imageDataUrl) return;

    const cur = canvasPointFromEvent(e);
    const s = startRef.current;

    const x = Math.min(s.x, cur.x);
    const y = Math.min(s.y, cur.y);
    const w = Math.abs(cur.x - s.x);
    const h = Math.abs(cur.y - s.y);

    currentRectRef.current = { x, y, w, h };
    drawCanvas(currentRectRef.current);
  }

  function onCanvasMouseUp() {
    if (!isDrawing) return;
    setIsDrawing(false);

    const r = currentRectRef.current;
    startRef.current = null;
    currentRectRef.current = null;

    if (!r || r.w < 6 || r.h < 6) {
      drawCanvas(null);
      return;
    }

    if (toolMode === "redact") setRectsRedact((prev) => [...prev, r]);
    if (toolMode === "blur") setRectsBlur((prev) => [...prev, r]);

    drawCanvas(null);
  }

  async function exportEditedImageDataUrl(): Promise<string | null> {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    // canvas already has edits applied
    return canvas.toDataURL("image/png");
  }

  /** ---- Investigation ---- */
  const runInvestigation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResultText(null);
    setResultObj(null);
    setErrorMsg(null);

    setReportPrompt(prompt);
    setGeneratedAt(new Date());

    try {
      const editedImage = imageDataUrl ? await exportEditedImageDataUrl() : null;

      const payload: any = {
        prompt,
        presetId: selectedPreset,
      };

      // Backward compatible: only include if present
      if (editedImage) {
        payload.imageDataUrl = editedImage;
        payload.imageMeta = {
          toolMode,
          blurStrength,
          redactions: rectsRedact,
          blurs: rectsBlur,
        };
      }

      const res = await fetch("/api/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setErrorMsg("Live investigation unavailable — showing fallback.");
        setResultObj(getFallbackStructured(selectedPreset));
      } else {
        const data = await res.json();

        // Your route.ts may return either { result: ... } or the object itself.
        const candidate = data?.result ?? data;

        if (isStructured(candidate)) {
          setResultObj(candidate);
        } else if (typeof candidate === "string") {
          setResultText(candidate);
        } else {
          // unknown shape: show structured fallback (keeps UI consistent)
          setResultObj(getFallbackStructured(selectedPreset));
        }
      }
    } catch {
      setErrorMsg("Network or server error — showing fallback.");
      setResultObj(getFallbackStructured(selectedPreset));
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = () => {
    if (!resultObj && !resultText) return;
    if (typeof window === "undefined") return;
    window.print();
  };

  const handleShareLink = async () => {
    if (!resultObj && !resultText && !reportPrompt) return;
    if (typeof window === "undefined") return;

    const basePrompt = (reportPrompt ?? prompt).trim();
    if (!basePrompt) return;

    try {
      const url = new URL(window.location.href);
      url.pathname = "/demo";
      url.searchParams.set("preset", selectedPreset);
      url.searchParams.set("prompt", basePrompt);

      const shareUrl = url.toString();

      if (navigator.share) {
        await navigator.share({
          title: "InquistAI Investigation",
          text: "Here’s an InquistAI investigation I ran:",
          url: shareUrl,
        });
        setShareMessage("Share dialog opened.");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setShareMessage("Link copied to clipboard.");
      } else {
        setShareMessage(shareUrl);
      }
    } catch {
      setShareMessage("Could not generate share link.");
    }

    setTimeout(() => setShareMessage(null), 3000);
  };

  const effectivePrompt = reportPrompt ?? prompt;
  const presetLabel = getPresetLabel(selectedPreset);
  const canShare = !!(resultObj || resultText || reportPrompt);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header (hidden in print) */}
        <header className="mb-10 print-hide">
          <a href="/" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
            ← Back to home
          </a>
          <h1 className="text-3xl md:text-4xl font-bold mt-4">Demo: InquistAI Investigation</h1>
          <p className="text-gray-300 mt-3 max-w-2xl">
            Paste a claim or scenario, optionally attach a screenshot, and generate a structured report with a risk dial and action plan.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] items-start">
          {/* Left: Form (hidden in print) */}
          <section className="bg-gray-900/70 border border-gray-800/80 rounded-2xl p-6 md:p-7 shadow-xl shadow-black/40 print-hide">
            <h2 className="text-lg font-semibold mb-4">1. Define the investigation</h2>

            <form onSubmit={runInvestigation} className="space-y-6">
              {/* Preset buttons */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-200">Choose an example scenario</label>
                <div className="flex flex-wrap gap-2">
                  {presets.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(p.id);
                        setPrompt(p.prompt);
                        setResultText(null);
                        setResultObj(null);
                        setErrorMsg(null);
                        setReportPrompt(null);
                        setGeneratedAt(null);
                        setShareMessage(null);
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
                      setResultText(null);
                      setResultObj(null);
                      setErrorMsg(null);
                      setReportPrompt(null);
                      setGeneratedAt(null);
                      setShareMessage(null);
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

              {/* ✅ Prompt textarea (NOW ABOVE screenshot tools) */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-200">Investigation prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    setSelectedPreset("custom");
                    setResultText(null);
                    setResultObj(null);
                    setErrorMsg(null);
                    setReportPrompt(null);
                    setGeneratedAt(null);
                    setShareMessage(null);
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

              {/* ✅ Divider text */}
              <Divider label="Optional: add visual evidence" />

              {/* Screenshot tools (NOW BELOW prompt) */}
              <div className="rounded-2xl border border-gray-800 bg-black/40 p-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-100">Analyze a screenshot</h3>
                    <p className="text-[11px] text-gray-500 mt-1 max-w-md">
                      Upload an image, then use redact/blur to remove sensitive details before running the investigation.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        pushUndo();
                        setToolMode("redact");
                      }}
                      disabled={!imageDataUrl}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                        !imageDataUrl
                          ? "border-gray-800 text-gray-600 cursor-not-allowed"
                          : toolMode === "redact"
                          ? "bg-red-600/80 border-red-400 text-white"
                          : "border-gray-700 text-gray-200 hover:border-red-400"
                      }`}
                    >
                      Redact
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        pushUndo();
                        setToolMode("blur");
                      }}
                      disabled={!imageDataUrl}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                        !imageDataUrl
                          ? "border-gray-800 text-gray-600 cursor-not-allowed"
                          : toolMode === "blur"
                          ? "bg-sky-600/80 border-sky-400 text-white"
                          : "border-gray-700 text-gray-200 hover:border-sky-400"
                      }`}
                    >
                      Blur
                    </button>

                    <button
                      type="button"
                      onClick={() => setToolMode("none")}
                      disabled={!imageDataUrl}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                        !imageDataUrl
                          ? "border-gray-800 text-gray-600 cursor-not-allowed"
                          : toolMode === "none"
                          ? "bg-gray-800 border-gray-600 text-white"
                          : "border-gray-700 text-gray-200 hover:border-gray-500"
                      }`}
                    >
                      Cursor
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2 text-xs text-gray-300">
                    <span className="text-gray-400">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="text-xs"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;

                        pushUndo();

                        const reader = new FileReader();
                        reader.onload = () => {
                          const url = typeof reader.result === "string" ? reader.result : null;
                          setImageDataUrl(url);
                          setRectsRedact([]);
                          setRectsBlur([]);
                          setToolMode("none");
                        };
                        reader.readAsDataURL(f);

                        // reset value so re-uploading same file triggers change
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={undo}
                    className="px-3 py-2 rounded-xl text-xs font-semibold border border-gray-700 text-gray-200 hover:border-gray-500 transition"
                  >
                    Undo
                  </button>

                  <button
                    type="button"
                    onClick={clearEdits}
                    disabled={!imageDataUrl}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                      !imageDataUrl
                        ? "border-gray-800 text-gray-600 cursor-not-allowed"
                        : "border-gray-700 text-gray-200 hover:border-gray-500"
                    }`}
                  >
                    Clear edits
                  </button>

                  <button
                    type="button"
                    onClick={clearImage}
                    disabled={!imageDataUrl}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                      !imageDataUrl
                        ? "border-gray-800 text-gray-600 cursor-not-allowed"
                        : "border-gray-700 text-gray-200 hover:border-gray-500"
                    }`}
                  >
                    Remove image
                  </button>
                </div>

                {/* Blur strength slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Blur strength</span>
                    <span className="text-gray-200 font-semibold">{blurStrength}</span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={40}
                    value={blurStrength}
                    onChange={(e) => setBlurStrength(Number(e.target.value))}
                    className="w-full"
                    disabled={!imageDataUrl}
                  />
                  <p className="text-[11px] text-gray-500">
                    Tip: Select <span className="text-gray-300 font-semibold">Redact</span> or{" "}
                    <span className="text-gray-300 font-semibold">Blur</span>, then drag a box on the image.
                  </p>
                </div>

                {/* Canvas preview */}
                <div className="rounded-xl border border-gray-800 bg-black/50 p-3 overflow-auto">
                  {!imageDataUrl ? (
                    <div className="text-sm text-gray-500">
                      No screenshot uploaded yet. Upload one to enable redact/blur tools.
                    </div>
                  ) : (
                    <canvas
                      ref={canvasRef}
                      className={`max-w-full rounded-lg ${
                        toolMode === "none" ? "cursor-default" : "cursor-crosshair"
                      }`}
                      onMouseDown={onCanvasMouseDown}
                      onMouseMove={onCanvasMouseMove}
                      onMouseUp={onCanvasMouseUp}
                      onMouseLeave={onCanvasMouseUp}
                    />
                  )}
                </div>

                {/* Small status line */}
                {imageDataUrl ? (
                  <div className="text-[11px] text-gray-500">
                    Regions: <span className="text-gray-300">{rectsRedact.length}</span> redactions,{" "}
                    <span className="text-gray-300">{rectsBlur.length}</span> blurs
                  </div>
                ) : null}
              </div>

              {/* Submit + Export + Share buttons */}
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
                  disabled={(!resultObj && !resultText) || loading}
                  onClick={handleExportPdf}
                  className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold border transition
                    ${
                      (!resultObj && !resultText) || loading
                        ? "border-gray-700 text-gray-500 cursor-not-allowed"
                        : "border-gray-600 text-gray-200 hover:border-blue-400 hover:text-blue-200"
                    }`}
                >
                  Export as PDF
                </button>

                <button
                  type="button"
                  disabled={!canShare || loading}
                  onClick={handleShareLink}
                  className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold border transition
                    ${
                      !canShare || loading
                        ? "border-gray-700 text-gray-500 cursor-not-allowed"
                        : "border-gray-600 text-gray-200 hover:border-emerald-400 hover:text-emerald-200"
                    }`}
                >
                  Share investigation link
                </button>

                <span className="text-xs md:text-sm text-gray-400">
                  Share links recreate the same scenario on /demo using preset + prompt.
                </span>
              </div>

              {shareMessage && <p className="text-xs text-emerald-400 mt-1">{shareMessage}</p>}
            </form>
          </section>

          {/* Right: Report / Result (print-optimized) */}
          <section className="bg-black/60 border border-gray-800 rounded-2xl p-6 md:p-7 shadow-xl shadow-black/50 print-report space-y-5">
            {/* Report header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-gray-300 print:text-black">InquistAI Investigation Report</div>
                <div className="text-[11px] text-gray-500 print:text-black/70">Scenario: {presetLabel}</div>
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
              <div className="text-xs md:text-sm">
                <div className="font-semibold mb-1 text-gray-200 print:text-black">Input</div>
                <div className="border border-gray-700 rounded-lg bg-black/40 print:bg-white print:border-black/20 px-3 py-2 text-gray-200 print:text-black whitespace-pre-wrap text-xs md:text-sm">
                  {effectivePrompt}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-100 print:text-black">Analysis</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300 print:bg-black print:text-white">
                Live + fallback
              </span>
            </div>

            {errorMsg && <p className="text-xs text-amber-400 print:text-[11px]">⚠ {errorMsg}</p>}

            {!resultObj && !resultText && !loading && !errorMsg && (
              <div className="text-gray-500 text-sm md:text-base print:text-black">
                <p>
                  Choose a scenario or paste your own, then click{" "}
                  <span className="font-semibold text-gray-200 print:text-black">“Run Investigation”</span>{" "}
                  to generate a report.
                </p>
                <ul className="mt-4 list-disc list-inside space-y-1">
                  <li>🧠 Reasoning across claims, context, and evidence</li>
                  <li>📷 Screenshot analysis + redact/blur tools</li>
                  <li>✅ Clear verdict + action plan</li>
                </ul>
              </div>
            )}

            {loading && (
              <div className="animate-pulse text-gray-300 text-sm md:text-base print:text-black">
                <p>Building reasoning layers and querying the investigation engine…</p>
                <p className="mt-2 text-gray-500 print:text-black/70">
                  In production, this step combines model calls, pattern checks, and reference lookups before generating the report.
                </p>
              </div>
            )}

            {/* Structured result */}
            {resultObj && !loading && (
              <div className="space-y-4 animate-[fadeIn_0.35s_ease-out]">
                <div className="rounded-2xl border border-gray-800 bg-black/40 p-5">
                  <h3 className="text-sm font-semibold text-gray-100 print:text-black mb-2">Summary</h3>
                  <p className="text-sm md:text-base text-gray-100 print:text-black leading-relaxed whitespace-pre-wrap">
                    {resultObj.summary}
                  </p>
                </div>

                <RiskDial risk={resultObj.risk} />

                <div className="rounded-2xl border border-gray-800 bg-black/40 p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-100 print:text-black">Key findings</h3>
                  <div className="space-y-3">
                    {resultObj.findings.map((f, idx) => (
                      <div key={idx} className="rounded-xl border border-gray-800 bg-black/30 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold text-gray-100">{f.title}</div>
                          {f.severity ? (
                            <span className="text-[10px] px-2 py-1 rounded-full bg-gray-800 text-gray-300">
                              {f.severity.toUpperCase()}
                            </span>
                          ) : null}
                        </div>
                        {f.evidence?.length ? (
                          <ul className="mt-2 list-disc list-inside text-sm text-gray-300 space-y-1">
                            {f.evidence.map((e, i) => (
                              <li key={i}>{e}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>

                <ActionPlan plan={resultObj.actionPlan} />

                {resultObj.notes?.length ? (
                  <div className="rounded-2xl border border-gray-800 bg-black/40 p-5">
                    <h3 className="text-sm font-semibold text-gray-100 print:text-black mb-2">Notes</h3>
                    <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                      {resultObj.notes.map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            )}

            {/* Text result fallback (old format) */}
            {resultText && !loading && (
              <div className="mt-3 animate-[fadeIn_0.35s_ease-out]">
                <pre className="whitespace-pre-wrap text-sm md:text-base text-gray-100 print:text-black leading-relaxed">
                  {resultText}
                </pre>
              </div>
            )}

            {(resultObj || resultText) && (
              <p className="text-[10px] text-gray-500 print:text-black/70 border-t border-gray-800 pt-3 print:border-black/20">
                InquistAI is an AI-assisted reasoning tool. Use this report as decision support, not as a substitute for professional legal,
                financial, or security advice.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
