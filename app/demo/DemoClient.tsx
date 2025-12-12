"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type PresetId = "simulation" | "voicemail" | "brain10" | "custom";
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
  return presets.find((p) => p.id === id)?.prompt ?? presets[0].prompt;
}

function getPresetLabel(id: PresetId): string {
  if (id === "custom") return "Custom scenario";
  return presets.find((p) => p.id === id)?.label ?? "Custom scenario";
}

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0.5;
  return Math.max(0, Math.min(1, n));
}

/** ---------- UI: Risk dial + plan ---------- */

function RiskDial({ level, confidence }: { level: RiskLevel; confidence: number }) {
  const pct = Math.round(clamp01(confidence) * 100);

  const badge =
    level === "HIGH"
      ? "border-red-500/60 text-red-200 bg-red-500/10"
      : level === "MEDIUM"
      ? "border-amber-500/60 text-amber-200 bg-amber-500/10"
      : "border-emerald-500/60 text-emerald-200 bg-emerald-500/10";

  const label =
    level === "HIGH" ? "High risk" : level === "MEDIUM" ? "Medium risk" : "Low risk";

  return (
    <div className={`rounded-2xl border ${badge} p-4`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold opacity-90">Risk</div>
          <div className="text-xl font-bold tracking-tight">{label}</div>
          <div className="text-[11px] text-gray-300/90 mt-1">
            Confidence reflects how strongly the evidence matches known patterns.
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold opacity-90">Confidence</div>
          <div className="text-xl font-bold tabular-nums">{pct}%</div>
        </div>
      </div>

      <div className="mt-3">
        <div className="h-2 rounded-full bg-black/40 border border-white/10 overflow-hidden">
          <div className="h-full bg-white/70" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

function BulletSection({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "good" | "warn" | "neutral";
}) {
  const color =
    tone === "good"
      ? "text-emerald-300"
      : tone === "warn"
      ? "text-red-300"
      : "text-blue-300";

  return (
    <div>
      <h3 className={`text-sm font-semibold mb-2 ${color}`}>{title}</h3>
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-200">
        {items.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

function ActionPlan({ plan }: { plan: InvestigationResult["actionPlan"] }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-black/40 p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-100 print:text-black">
          60-Second Action Plan
        </h2>
        <span className="text-[10px] px-2 py-1 rounded-full bg-gray-800 text-gray-300 print:bg-black print:text-white">
          Do this first
        </span>
      </div>

      <BulletSection title="Do this now" items={plan.doNow} tone="good" />
      <BulletSection title="Do NOT do this" items={plan.doNotDo} tone="warn" />
      <BulletSection title="Verify safely" items={plan.verify} tone="neutral" />
      <BulletSection title="Escalate if" items={plan.escalateWhen} tone="warn" />
    </div>
  );
}

/** ---------- Screenshot editor helpers ---------- */

type ToolMode = "none" | "redact" | "blur";

function getCanvasPoint(e: React.PointerEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);
  return { x, y };
}

function drawCircleRedact(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.save();
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// A fast “blur” approximation: pixelate clipped circle by scaling down/up.
function drawCircleBlur(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const size = Math.max(16, Math.floor(r * 2));
  const sx = Math.floor(x - r);
  const sy = Math.floor(y - r);
  const sw = Math.floor(r * 2);
  const sh = Math.floor(r * 2);

  // Guard
  if (sw <= 0 || sh <= 0) return;

  // Create a temporary canvas and copy region
  const temp = document.createElement("canvas");
  temp.width = sw;
  temp.height = sh;
  const tctx = temp.getContext("2d");
  if (!tctx) return;

  tctx.drawImage(ctx.canvas, sx, sy, sw, sh, 0, 0, sw, sh);

  // Pixelate: downscale then upscale with smoothing disabled
  const small = document.createElement("canvas");
  const factor = 0.12; // smaller => stronger pixelation
  small.width = Math.max(1, Math.floor(sw * factor));
  small.height = Math.max(1, Math.floor(sh * factor));
  const sctx = small.getContext("2d");
  if (!sctx) return;

  sctx.imageSmoothingEnabled = false;
  sctx.drawImage(temp, 0, 0, small.width, small.height);

  tctx.clearRect(0, 0, sw, sh);
  tctx.imageSmoothingEnabled = false;
  tctx.drawImage(small, 0, 0, small.width, small.height, 0, 0, sw, sh);

  // Clip draw onto main ctx as a circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(temp, sx, sy);
  ctx.restore();
}

function dataUrlFromCanvas(canvas: HTMLCanvasElement, quality = 0.92) {
  // jpeg reduces size a lot; if you need transparency, swap to png.
  return canvas.toDataURL("image/jpeg", quality);
}

/** ---------- DemoClient ---------- */

export default function DemoClient({
  initialPreset,
  initialPrompt,
}: {
  initialPreset?: string;
  initialPrompt?: string;
}) {
  // URL-derived values
  const urlPreset: PresetId = useMemo(() => {
    return isPresetId(initialPreset) ? (initialPreset as PresetId) : "simulation";
  }, [initialPreset]);

  const urlPrompt: string = useMemo(() => {
    return typeof initialPrompt === "string" ? initialPrompt : "";
  }, [initialPrompt]);

  // Core state
  const [selectedPreset, setSelectedPreset] = useState<PresetId>(urlPreset);
  const [prompt, setPrompt] = useState<string>(() => {
    const p = (urlPrompt ?? "").trim();
    if (p.length > 0) return p;
    return getPresetPrompt(urlPreset);
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InvestigationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [reportPrompt, setReportPrompt] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  // Screenshot editor state
  const [toolMode, setToolMode] = useState<ToolMode>("none");
  const [brushSize, setBrushSize] = useState<number>(22);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const baseImageRef = useRef<HTMLImageElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);

  const [hasImage, setHasImage] = useState(false);
  const [historyTick, setHistoryTick] = useState(0); // force rerender for undo/redo enabled state

  const lastUrlKeyRef = useRef<string>("");

  /** URL hydration */
  useEffect(() => {
    const p = (urlPrompt ?? "").trim();
    const key = `${urlPreset}::${p}`;
    if (key === lastUrlKeyRef.current) return;

    setSelectedPreset(urlPreset);
    if (p.length > 0) setPrompt(p);
    else setPrompt(getPresetPrompt(urlPreset));

    setResult(null);
    setErrorMsg(null);
    setReportPrompt(null);
    setGeneratedAt(null);
    setShareMessage(null);

    lastUrlKeyRef.current = key;
  }, [urlPreset, urlPrompt]);

  /** History helpers */
  const pushHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const snapshot = dataUrlFromCanvas(canvas);

    // Drop any redo states
    const idx = historyIndexRef.current;
    historyRef.current = historyRef.current.slice(0, idx + 1);

    historyRef.current.push(snapshot);
    historyIndexRef.current = historyRef.current.length - 1;
    setHistoryTick((x) => x + 1);
  };

  const loadDataUrlToCanvas = async (dataUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHasImage(true);
    };
    img.src = dataUrl;
  };

  const undo = async () => {
    const idx = historyIndexRef.current;
    if (idx <= 0) return;
    historyIndexRef.current = idx - 1;
    const snap = historyRef.current[historyIndexRef.current];
    await loadDataUrlToCanvas(snap);
    setHistoryTick((x) => x + 1);
  };

  const redo = async () => {
    const idx = historyIndexRef.current;
    if (idx >= historyRef.current.length - 1) return;
    historyIndexRef.current = idx + 1;
    const snap = historyRef.current[historyIndexRef.current];
    await loadDataUrlToCanvas(snap);
    setHistoryTick((x) => x + 1);
  };

  const resetImage = async () => {
    const base = baseImageRef.current;
    const canvas = canvasRef.current;
    if (!base || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = base.naturalWidth;
    canvas.height = base.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(base, 0, 0);

    historyRef.current = [dataUrlFromCanvas(canvas)];
    historyIndexRef.current = 0;
    setHistoryTick((x) => x + 1);
  };

  const getEditedImageDataUrl = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return dataUrlFromCanvas(canvas);
  };

  /** Upload image */
  const handleUpload = async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Load base image
    const base = new Image();
    base.onload = async () => {
      baseImageRef.current = base;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = base.naturalWidth;
      canvas.height = base.naturalHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(base, 0, 0);

      setHasImage(true);

      // Init history
      historyRef.current = [dataUrlFromCanvas(canvas)];
      historyIndexRef.current = 0;
      setHistoryTick((x) => x + 1);
    };
    base.src = dataUrl;

    // Clear report because inputs changed
    setResult(null);
    setErrorMsg(null);
    setReportPrompt(null);
    setGeneratedAt(null);
    setShareMessage(null);
  };

  /** Drawing logic */
  const applyStroke = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const r = brushSize;

    if (toolMode === "redact") {
      drawCircleRedact(ctx, x, y, r);
    } else if (toolMode === "blur") {
      drawCircleBlur(ctx, x, y, r);
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!hasImage) return;
    if (toolMode === "none") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    isDrawingRef.current = true;
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);

    const pt = getCanvasPoint(e, canvas);
    lastPointRef.current = pt;

    applyStroke(pt.x, pt.y);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    if (!hasImage) return;
    if (toolMode === "none") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const pt = getCanvasPoint(e, canvas);
    const last = lastPointRef.current;

    if (!last) {
      lastPointRef.current = pt;
      applyStroke(pt.x, pt.y);
      return;
    }

    // Interpolate for smooth strokes
    const dx = pt.x - last.x;
    const dy = pt.y - last.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const step = Math.max(6, brushSize * 0.5);
    const steps = Math.max(1, Math.floor(dist / step));

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      applyStroke(last.x + dx * t, last.y + dy * t);
    }

    lastPointRef.current = pt;
  };

  const endStroke = async () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;

    // snapshot for undo/redo
    pushHistory();

    // inputs changed
    setResult(null);
    setErrorMsg(null);
    setReportPrompt(null);
    setGeneratedAt(null);
    setShareMessage(null);
  };

  /** Investigation */
  const runInvestigation = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasPrompt = !!prompt.trim();
    const editedImage = getEditedImageDataUrl();
    const hasEditedImage = !!editedImage;

    if (!hasPrompt && !hasEditedImage) return;

    setLoading(true);
    setResult(null);
    setErrorMsg(null);

    setReportPrompt(prompt);
    setGeneratedAt(new Date());

    try {
      const res = await fetch("/api/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          presetId: selectedPreset,
          imageDataUrl: editedImage, // ✅ send edited image to backend
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErrorMsg(data?.error || "Live investigation unavailable — showing fallback.");
        setResult(data?.result ?? null);
      } else {
        if (data?.error) setErrorMsg(String(data.error));
        setResult(data?.result ?? null);
      }

      if (!data?.result) setErrorMsg((prev) => prev ?? "No result returned from server.");
    } catch {
      setErrorMsg("Network or server error.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = () => {
    if (!result) return;
    if (typeof window === "undefined") return;
    window.print();
  };

  const handleShareLink = async () => {
    if (!result && !reportPrompt) return;
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
  const canShare = !!(result || reportPrompt);

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

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
            Structured investigations for scams, claims, and sketchy messages — with clear risk,
            confidence, and an action plan.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] items-start">
          {/* LEFT: Controls (hidden in print) */}
          <section className="bg-gray-900/70 border border-gray-800/80 rounded-2xl p-6 md:p-7 shadow-xl shadow-black/40 print-hide">
            <h2 className="text-lg font-semibold mb-4">1. Define the investigation</h2>

            <form onSubmit={runInvestigation} className="space-y-6">
              {/* Presets */}
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
                        setShareMessage(null);
                      }}
                      className={`px-3 py-2 rounded-full text-xs md:text-sm border transition ${
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

              {/* Screenshot editor */}
              <div className="rounded-2xl border border-gray-800 bg-black/40 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-100">Analyze a screenshot</div>
                    <div className="text-[11px] text-gray-500 mt-1">
                      Upload a screenshot and redact/blur sensitive data before analysis.
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gray-800 file:text-gray-200 hover:file:bg-gray-700"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      handleUpload(file);
                      // reset tool state for new image
                      setToolMode("none");
                    }}
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setToolMode("redact")}
                    disabled={!hasImage}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                      !hasImage
                        ? "border-gray-800 text-gray-600 cursor-not-allowed"
                        : toolMode === "redact"
                        ? "bg-red-600/80 border-red-400"
                        : "border-gray-700 hover:border-gray-500 hover:bg-gray-800"
                    }`}
                  >
                    Redact
                  </button>

                  <button
                    type="button"
                    onClick={() => setToolMode("blur")}
                    disabled={!hasImage}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                      !hasImage
                        ? "border-gray-800 text-gray-600 cursor-not-allowed"
                        : toolMode === "blur"
                        ? "bg-purple-600/80 border-purple-400"
                        : "border-gray-700 hover:border-gray-500 hover:bg-gray-800"
                    }`}
                  >
                    Blur
                  </button>

                  <button
                    type="button"
                    onClick={() => setToolMode("none")}
                    disabled={!hasImage}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                      !hasImage
                        ? "border-gray-800 text-gray-600 cursor-not-allowed"
                        : toolMode === "none"
                        ? "bg-gray-700 border-gray-500"
                        : "border-gray-700 hover:border-gray-500 hover:bg-gray-800"
                    }`}
                  >
                    Off
                  </button>

                  <div className="mx-2 h-6 w-px bg-gray-800" />

                  <button
                    type="button"
                    onClick={undo}
                    disabled={!hasImage || !canUndo}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                      !hasImage || !canUndo
                        ? "border-gray-800 text-gray-600 cursor-not-allowed"
                        : "border-gray-700 hover:border-gray-500 hover:bg-gray-800"
                    }`}
                  >
                    Undo
                  </button>

                  <button
                    type="button"
                    onClick={redo}
                    disabled={!hasImage || !canRedo}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                      !hasImage || !canRedo
                        ? "border-gray-800 text-gray-600 cursor-not-allowed"
                        : "border-gray-700 hover:border-gray-500 hover:bg-gray-800"
                    }`}
                  >
                    Redo
                  </button>

                  <button
                    type="button"
                    onClick={resetImage}
                    disabled={!hasImage}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                      !hasImage
                        ? "border-gray-800 text-gray-600 cursor-not-allowed"
                        : "border-gray-700 hover:border-gray-500 hover:bg-gray-800"
                    }`}
                  >
                    Reset
                  </button>

                  <div className="ml-auto flex items-center gap-3">
                    <span className="text-xs text-gray-400">Brush</span>
                    <input
                      type="range"
                      min={6}
                      max={60}
                      value={brushSize}
                      disabled={!hasImage}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-40"
                    />
                    <span className="text-xs text-gray-300 tabular-nums w-8 text-right">
                      {brushSize}
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-gray-800 overflow-hidden bg-black/60">
                  <canvas
                    ref={canvasRef}
                    className={`w-full h-auto ${!hasImage ? "opacity-50" : ""}`}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={endStroke}
                    onPointerCancel={endStroke}
                  />
                  {!hasImage && (
                    <div className="px-3 py-3 text-[11px] text-gray-500 border-t border-gray-800">
                      Upload an image to enable redact/blur tools.
                    </div>
                  )}
                  {hasImage && (
                    <div className="px-3 py-2 text-[11px] text-gray-500 border-t border-gray-800">
                      Mode: <span className="text-gray-300">{toolMode}</span> • Drag on the image to{" "}
                      {toolMode === "redact"
                        ? "black out"
                        : toolMode === "blur"
                        ? "blur"
                        : "view"}{" "}
                      sensitive areas.
                    </div>
                  )}
                </div>
              </div>

              {/* Prompt */}
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
                    setShareMessage(null);
                  }}
                  rows={6}
                  className="w-full bg-black/70 border border-gray-700 rounded-xl px-3 py-2 text-sm md:text-base outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  placeholder="Describe what to analyze (e.g., what the screenshot shows, what you want checked, what you suspect)."
                />
                <p className="text-xs text-gray-500 mt-2">
                  Tip: If you upload a screenshot, explicitly say what to focus on (sender, URLs,
                  payment requests, tone, etc.).
                </p>
              </div>

              {/* Submit + Export + Share */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={loading || (!prompt.trim() && !hasImage)}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm md:text-base transition ${
                    loading || (!prompt.trim() && !hasImage)
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
                  className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold border transition ${
                    !result || loading
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
                  className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold border transition ${
                    !canShare || loading
                      ? "border-gray-700 text-gray-500 cursor-not-allowed"
                      : "border-gray-600 text-gray-200 hover:border-emerald-400 hover:text-emerald-200"
                  }`}
                >
                  Share investigation link
                </button>

                <span className="text-xs md:text-sm text-gray-400">
                  Share links recreate the same scenario on /demo (prompt + preset).
                </span>
              </div>

              {shareMessage && <p className="text-xs text-emerald-400 mt-1">{shareMessage}</p>}
            </form>
          </section>

          {/* RIGHT: Report (print-optimized) */}
          <section className="bg-black/60 border border-gray-800 rounded-2xl p-6 md:p-7 shadow-xl shadow-black/50 print-report">
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

            {effectivePrompt && (
              <div className="mb-4 text-xs md:text-sm">
                <div className="font-semibold mb-1 text-gray-200 print:text-black">Input</div>
                <div className="border border-gray-700 rounded-lg bg-black/40 print:bg-white print:border-black/20 px-3 py-2 text-gray-200 print:text-black whitespace-pre-wrap text-xs md:text-sm">
                  {effectivePrompt}
                </div>
              </div>
            )}

            {errorMsg && (
              <p className="mb-3 text-xs text-amber-400 print:text-[11px]">⚠ {errorMsg}</p>
            )}

            {!result && !loading && (
              <div className="text-gray-500 text-sm md:text-base print:text-black">
                <p>
                  Choose a scenario or paste your own, optionally upload a screenshot, then click{" "}
                  <span className="font-semibold text-gray-200 print:text-black">
                    “Run Investigation”
                  </span>
                  .
                </p>
                <ul className="mt-4 list-disc list-inside space-y-1">
                  <li>📊 Risk level + confidence</li>
                  <li>✅ 60-second action plan</li>
                  <li>🧠 Reasoning + authenticity notes</li>
                </ul>
              </div>
            )}

            {loading && (
              <div className="animate-pulse text-gray-300 text-sm md:text-base print:text-black">
                <p>Building reasoning layers and generating your report…</p>
                <p className="mt-2 text-gray-500 print:text-black/70">
                  This can include pattern checks, model calls, and (later) reference lookups.
                </p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-5">
                <RiskDial level={result.risk.level} confidence={result.risk.confidence} />

                <div className="rounded-2xl border border-gray-800 bg-black/40 p-5">
                  <h2 className="text-lg font-semibold mb-2 text-gray-100 print:text-black">
                    Summary
                  </h2>
                  <p className="text-sm md:text-base text-gray-200 print:text-black leading-relaxed">
                    {result.summary}
                  </p>

                  {result.risk.rationale?.length > 0 && (
                    <>
                      <div className="mt-4 text-sm font-semibold text-gray-100 print:text-black">
                        Why this rating
                      </div>
                      <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-gray-200 print:text-black">
                        {result.risk.rationale.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                <ActionPlan plan={result.actionPlan} />

                <div className="rounded-2xl border border-gray-800 bg-black/40 p-5 space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-100 print:text-black">
                      Findings
                    </h2>

                    <div className="mt-3">
                      <div className="text-sm font-semibold text-gray-200 print:text-black">
                        Reasoning
                      </div>
                      <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-gray-200 print:text-black">
                        {result.findings.reasoning.map((x, i) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ul>
                    </div>

                    {result.findings.authenticity && result.findings.authenticity.length > 0 && (
                      <div className="mt-4">
                        <div className="text-sm font-semibold text-gray-200 print:text-black">
                          Authenticity
                        </div>
                        <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-gray-200 print:text-black">
                          {result.findings.authenticity.map((x, i) => (
                            <li key={i}>{x}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {result.notes && (
                    <p className="text-[11px] text-gray-500 print:text-black/70 border-t border-gray-800 pt-3 print:border-black/20">
                      {result.notes}
                    </p>
                  )}
                </div>

                <p className="text-[10px] text-gray-500 print:text-black/70 border-t border-gray-800 pt-3 print:border-black/20">
                  InquistAI is an AI-assisted reasoning tool. Use this report as decision support,
                  not as a substitute for professional legal, financial, or security advice.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
