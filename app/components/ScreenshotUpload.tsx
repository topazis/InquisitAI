"use client";

import { useEffect, useRef, useState } from "react";

export type ScreenshotPayload = {
  name: string;
  type: string;
  size: number;
  dataUrl: string; // base64 data URL for preview + transport
};

type Tool = "black" | "blur";
type Rect = { x: number; y: number; w: number; h: number; tool: Tool };

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed reading file"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function normalizeRect(a: { x: number; y: number }, b: { x: number; y: number }) {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  const w = Math.abs(a.x - b.x);
  const h = Math.abs(a.y - b.y);
  return { x, y, w, h };
}

function humanTool(t: Tool) {
  return t === "black" ? "Black" : "Blur";
}

export default function ScreenshotUpload({
  value,
  onChange,
  maxMB = 6,
}: {
  value: ScreenshotPayload | null;
  onChange: (img: ScreenshotPayload | null) => void;
  maxMB?: number;
}) {
  const [error, setError] = useState<string | null>(null);

  // Redaction UI state
  const [redactMode, setRedactMode] = useState(false);
  const [tool, setTool] = useState<Tool>("black");
  const [rects, setRects] = useState<Rect[]>([]);
  const [draft, setDraft] = useState<Rect | null>(null);

  // ✅ Blur strength slider (1..10)
  const [blurStrength, setBlurStrength] = useState<number>(6);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);

  const maxBytes = maxMB * 1024 * 1024;

  const resetRedactionState = () => {
    setRedactMode(false);
    setTool("black");
    setRects([]);
    setDraft(null);
    setBlurStrength(6);
  };

  const onPick = async (file: File | null) => {
    setError(null);
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image (PNG/JPG/WebP).");
      return;
    }
    if (file.size > maxBytes) {
      setError(`Image too large. Max ${maxMB}MB.`);
      return;
    }

    const dataUrl = await fileToDataUrl(file);
    onChange({ name: file.name, type: file.type, size: file.size, dataUrl });

    resetRedactionState();
  };

  // Draw overlay for preview
  const drawOverlay = () => {
    const canvas = overlayRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const w = img.clientWidth;
    const h = img.clientHeight;
    if (w === 0 || h === 0) return;

    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, w, h);

    // slight dim in redact mode
    if (redactMode) {
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, w, h);
    }

    for (const r of rects) drawRect(ctx, r, false);
    if (draft) drawRect(ctx, draft, true);
  };

  const drawRect = (ctx: CanvasRenderingContext2D, r: Rect, isDraft: boolean) => {
    if (r.tool === "black") {
      ctx.fillStyle = isDraft ? "rgba(0,0,0,0.60)" : "rgba(0,0,0,0.92)";
      ctx.fillRect(r.x, r.y, r.w, r.h);
    } else {
      // Blur tool preview: translucent hatch + label
      ctx.fillStyle = isDraft ? "rgba(59,130,246,0.18)" : "rgba(59,130,246,0.22)";
      ctx.fillRect(r.x, r.y, r.w, r.h);

      ctx.strokeStyle = "rgba(59,130,246,0.35)";
      ctx.lineWidth = 1;
      for (let i = -r.h; i < r.w; i += 10) {
        ctx.beginPath();
        ctx.moveTo(r.x + i, r.y);
        ctx.lineTo(r.x + i + r.h, r.y + r.h);
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(r.x, r.y, Math.min(52, r.w), Math.min(18, r.h));
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "10px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
      ctx.fillText("BLUR", r.x + 6, r.y + 12);
    }

    ctx.strokeStyle =
      r.tool === "black" ? "rgba(255,255,255,0.55)" : "rgba(59,130,246,0.8)";
    ctx.lineWidth = 1;
    ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w, r.h);
  };

  useEffect(() => {
    drawOverlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rects, draft, redactMode, tool, blurStrength, value?.dataUrl]);

  useEffect(() => {
    const onResize = () => drawOverlay();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pointer handling
  const dragRef = useRef<{ start: { x: number; y: number } | null }>({ start: null });

  const getLocalPoint = (e: React.PointerEvent) => {
    const canvas = overlayRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = clamp(e.clientX - rect.left, 0, rect.width);
    const y = clamp(e.clientY - rect.top, 0, rect.height);
    return { x, y };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!redactMode) return;
    const pt = getLocalPoint(e);
    dragRef.current.start = pt;
    setDraft({ x: pt.x, y: pt.y, w: 0, h: 0, tool });
    (e.currentTarget as HTMLCanvasElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!redactMode) return;
    const start = dragRef.current.start;
    if (!start) return;
    const pt = getLocalPoint(e);
    const r = normalizeRect(start, pt);
    setDraft({ ...r, tool });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!redactMode) return;
    const start = dragRef.current.start;
    if (!start) return;

    const pt = getLocalPoint(e);
    const r = normalizeRect(start, pt);
    dragRef.current.start = null;

    if (r.w >= 6 && r.h >= 6) {
      setRects((prev) => prev.concat({ ...r, tool }));
    }
    setDraft(null);
  };

  const canRedact = !!value;
  const canApply = !!value && rects.length > 0;

  // Apply onto original pixels
  const applyEdits = async () => {
    if (!value) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = value.dataUrl;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image for editing"));
    });

    const displayImg = imgRef.current;
    if (!displayImg) return;

    const scaleX = img.naturalWidth / displayImg.clientWidth;
    const scaleY = img.naturalHeight / displayImg.clientHeight;

    const out = document.createElement("canvas");
    out.width = img.naturalWidth;
    out.height = img.naturalHeight;

    const ctx = out.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);

    for (const r of rects) {
      const x = Math.round(r.x * scaleX);
      const y = Math.round(r.y * scaleY);
      const w = Math.round(r.w * scaleX);
      const h = Math.round(r.h * scaleY);
      if (w <= 0 || h <= 0) continue;

      if (r.tool === "black") {
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(x, y, w, h);
      } else {
        // ✅ Blur/pixelate: stronger blur = fewer blocks
        // blurStrength: 1 (mild) -> 10 (heavy)
        const minDim = Math.max(1, Math.min(w, h));
        const strength = clamp(blurStrength, 1, 10);

        // Map strength to pixel size
        // mild => small pixels, heavy => larger pixels
        const pixelSize = Math.max(6, Math.floor(minDim / (26 - strength * 2))); // tuned mapping

        const dw = Math.max(1, Math.floor(w / pixelSize));
        const dh = Math.max(1, Math.floor(h / pixelSize));

        const tmp = document.createElement("canvas");
        tmp.width = w;
        tmp.height = h;
        const tctx = tmp.getContext("2d");
        if (!tctx) continue;

        // copy region from current output state
        tctx.drawImage(out, x, y, w, h, 0, 0, w, h);

        const tiny = document.createElement("canvas");
        tiny.width = dw;
        tiny.height = dh;
        const tinyCtx = tiny.getContext("2d");
        if (!tinyCtx) continue;

        tinyCtx.imageSmoothingEnabled = true;
        tinyCtx.drawImage(tmp, 0, 0, dw, dh);

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tiny, 0, 0, dw, dh, x, y, w, h);
        ctx.imageSmoothingEnabled = true;
      }
    }

    const editedDataUrl = out.toDataURL("image/png");
    onChange({
      name: value.name.replace(/\.(png|jpg|jpeg|webp)$/i, "") + "-edited.png",
      type: "image/png",
      size: Math.round((editedDataUrl.length * 3) / 4),
      dataUrl: editedDataUrl,
    });

    resetRedactionState();
  };

  const removeLast = () => setRects((prev) => prev.slice(0, -1));
  const clearAll = () => {
    setRects([]);
    setDraft(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-700 hover:border-gray-500 bg-black/50 cursor-pointer text-sm font-semibold">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPick(e.target.files?.[0] ?? null)}
          />
          Upload screenshot
          <span className="text-xs text-gray-400">(max {maxMB}MB)</span>
        </label>

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange(null);
              resetRedactionState();
            }}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-gray-700 hover:border-gray-500"
          >
            Remove
          </button>
        )}

        <div className="ml-auto flex items-center gap-2 flex-wrap">
          {/* Tool selector */}
          <div
            className={`inline-flex rounded-xl border overflow-hidden ${
              !canRedact ? "border-gray-800 opacity-60" : "border-gray-700"
            }`}
          >
            <button
              type="button"
              disabled={!canRedact || !redactMode}
              onClick={() => setTool("black")}
              className={`px-3 py-2 text-xs font-semibold transition ${
                tool === "black" ? "bg-gray-800 text-white" : "bg-black/40 text-gray-300"
              } ${!redactMode ? "cursor-not-allowed" : "hover:bg-gray-800/70"}`}
              title="Black box redaction"
            >
              Black
            </button>
            <button
              type="button"
              disabled={!canRedact || !redactMode}
              onClick={() => setTool("blur")}
              className={`px-3 py-2 text-xs font-semibold transition ${
                tool === "blur" ? "bg-gray-800 text-white" : "bg-black/40 text-gray-300"
              } ${!redactMode ? "cursor-not-allowed" : "hover:bg-gray-800/70"}`}
              title="Blur / pixelate redaction"
            >
              Blur
            </button>
          </div>

          <button
            type="button"
            disabled={!canRedact}
            onClick={() => {
              setRedactMode((v) => !v);
              setDraft(null);
            }}
            className={`text-xs font-semibold px-3 py-2 rounded-xl border transition
              ${
                !canRedact
                  ? "border-gray-800 text-gray-600 cursor-not-allowed"
                  : redactMode
                  ? "border-amber-400 text-amber-200 bg-amber-500/10"
                  : "border-gray-700 hover:border-gray-500"
              }`}
          >
            {redactMode ? "Redact: ON" : "Redact"}
          </button>

          <button
            type="button"
            disabled={!redactMode || rects.length === 0}
            onClick={removeLast}
            className={`text-xs font-semibold px-3 py-2 rounded-xl border transition
              ${
                !redactMode || rects.length === 0
                  ? "border-gray-800 text-gray-600 cursor-not-allowed"
                  : "border-gray-700 hover:border-gray-500"
              }`}
          >
            Undo
          </button>

          <button
            type="button"
            disabled={!redactMode || rects.length === 0}
            onClick={clearAll}
            className={`text-xs font-semibold px-3 py-2 rounded-xl border transition
              ${
                !redactMode || rects.length === 0
                  ? "border-gray-800 text-gray-600 cursor-not-allowed"
                  : "border-gray-700 hover:border-gray-500"
              }`}
          >
            Clear
          </button>

          <button
            type="button"
            disabled={!canApply}
            onClick={applyEdits}
            className={`text-xs font-semibold px-3 py-2 rounded-xl border transition
              ${
                !canApply
                  ? "border-gray-800 text-gray-600 cursor-not-allowed"
                  : "border-emerald-400 text-emerald-200 bg-emerald-500/10 hover:bg-emerald-500/15"
              }`}
          >
            Apply {rects.length > 0 ? `(${rects.length})` : ""} edits
          </button>
        </div>
      </div>

      {/* ✅ Blur strength slider */}
      {canRedact && redactMode && tool === "blur" && (
        <div className="rounded-2xl border border-gray-800 bg-black/40 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-gray-200">Blur strength</div>
              <div className="text-[11px] text-gray-500">
                Higher = more obscured (stronger pixelation)
              </div>
            </div>
            <div className="text-xs font-semibold text-gray-200 tabular-nums">
              {blurStrength}/10
            </div>
          </div>

          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={blurStrength}
            onChange={(e) => setBlurStrength(Number(e.target.value))}
            className="w-full mt-3"
          />
        </div>
      )}

      {error && <p className="text-xs text-amber-400">{error}</p>}

      {value && (
        <div className="rounded-2xl overflow-hidden border border-gray-800 bg-black/40">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={value.dataUrl}
              alt={value.name}
              className="w-full max-h-[360px] object-contain bg-black select-none"
              onLoad={() => drawOverlay()}
              draggable={false}
            />

            <canvas
              ref={overlayRef}
              className={`absolute inset-0 w-full h-full ${
                redactMode ? "cursor-crosshair" : "pointer-events-none"
              }`}
              style={{ touchAction: "none" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            />
          </div>

          <div className="px-3 py-2 text-[11px] text-gray-400 border-t border-gray-800 flex items-center justify-between gap-3 flex-wrap">
            <span className="truncate">
              {value.name} • {(value.size / 1024 / 1024).toFixed(2)}MB
            </span>

            {redactMode ? (
              <span className="text-amber-200">
                Tool: {humanTool(tool)}
                {tool === "blur" ? ` (${blurStrength}/10)` : ""} • Drag to draw boxes • Boxes:{" "}
                {rects.length}
              </span>
            ) : (
              <span className="text-gray-500">
                Tip: click <span className="text-gray-300">Redact</span> to hide sensitive info
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
