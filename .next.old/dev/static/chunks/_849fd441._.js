(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/components/ScreenshotUpload.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ScreenshotUpload
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function fileToDataUrl(file) {
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onerror = ()=>reject(new Error("Failed reading file"));
        reader.onload = ()=>resolve(String(reader.result));
        reader.readAsDataURL(file);
    });
}
function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}
function normalizeRect(a, b) {
    const x = Math.min(a.x, b.x);
    const y = Math.min(a.y, b.y);
    const w = Math.abs(a.x - b.x);
    const h = Math.abs(a.y - b.y);
    return {
        x,
        y,
        w,
        h
    };
}
function humanTool(t) {
    return t === "black" ? "Black" : "Blur";
}
function ScreenshotUpload({ value, onChange, maxMB = 6 }) {
    _s();
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Redaction UI state
    const [redactMode, setRedactMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tool, setTool] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("black");
    const [rects, setRects] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // ✅ Blur strength slider (1..10)
    const [blurStrength, setBlurStrength] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(6);
    const imgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const overlayRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const maxBytes = maxMB * 1024 * 1024;
    const resetRedactionState = ()=>{
        setRedactMode(false);
        setTool("black");
        setRects([]);
        setDraft(null);
        setBlurStrength(6);
    };
    const onPick = async (file)=>{
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
        onChange({
            name: file.name,
            type: file.type,
            size: file.size,
            dataUrl
        });
        resetRedactionState();
    };
    // Draw overlay for preview
    const drawOverlay = ()=>{
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
        for (const r of rects)drawRect(ctx, r, false);
        if (draft) drawRect(ctx, draft, true);
    };
    const drawRect = (ctx, r, isDraft)=>{
        if (r.tool === "black") {
            ctx.fillStyle = isDraft ? "rgba(0,0,0,0.60)" : "rgba(0,0,0,0.92)";
            ctx.fillRect(r.x, r.y, r.w, r.h);
        } else {
            // Blur tool preview: translucent hatch + label
            ctx.fillStyle = isDraft ? "rgba(59,130,246,0.18)" : "rgba(59,130,246,0.22)";
            ctx.fillRect(r.x, r.y, r.w, r.h);
            ctx.strokeStyle = "rgba(59,130,246,0.35)";
            ctx.lineWidth = 1;
            for(let i = -r.h; i < r.w; i += 10){
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
        ctx.strokeStyle = r.tool === "black" ? "rgba(255,255,255,0.55)" : "rgba(59,130,246,0.8)";
        ctx.lineWidth = 1;
        ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w, r.h);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScreenshotUpload.useEffect": ()=>{
            drawOverlay();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["ScreenshotUpload.useEffect"], [
        rects,
        draft,
        redactMode,
        tool,
        blurStrength,
        value?.dataUrl
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScreenshotUpload.useEffect": ()=>{
            const onResize = {
                "ScreenshotUpload.useEffect.onResize": ()=>drawOverlay()
            }["ScreenshotUpload.useEffect.onResize"];
            window.addEventListener("resize", onResize);
            return ({
                "ScreenshotUpload.useEffect": ()=>window.removeEventListener("resize", onResize)
            })["ScreenshotUpload.useEffect"];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["ScreenshotUpload.useEffect"], []);
    // Pointer handling
    const dragRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        start: null
    });
    const getLocalPoint = (e)=>{
        const canvas = overlayRef.current;
        if (!canvas) return {
            x: 0,
            y: 0
        };
        const rect = canvas.getBoundingClientRect();
        const x = clamp(e.clientX - rect.left, 0, rect.width);
        const y = clamp(e.clientY - rect.top, 0, rect.height);
        return {
            x,
            y
        };
    };
    const onPointerDown = (e)=>{
        if (!redactMode) return;
        const pt = getLocalPoint(e);
        dragRef.current.start = pt;
        setDraft({
            x: pt.x,
            y: pt.y,
            w: 0,
            h: 0,
            tool
        });
        e.currentTarget.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e)=>{
        if (!redactMode) return;
        const start = dragRef.current.start;
        if (!start) return;
        const pt = getLocalPoint(e);
        const r = normalizeRect(start, pt);
        setDraft({
            ...r,
            tool
        });
    };
    const onPointerUp = (e)=>{
        if (!redactMode) return;
        const start = dragRef.current.start;
        if (!start) return;
        const pt = getLocalPoint(e);
        const r = normalizeRect(start, pt);
        dragRef.current.start = null;
        if (r.w >= 6 && r.h >= 6) {
            setRects((prev)=>prev.concat({
                    ...r,
                    tool
                }));
        }
        setDraft(null);
    };
    const canRedact = !!value;
    const canApply = !!value && rects.length > 0;
    // Apply onto original pixels
    const applyEdits = async ()=>{
        if (!value) return;
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = value.dataUrl;
        await new Promise((resolve, reject)=>{
            img.onload = ()=>resolve();
            img.onerror = ()=>reject(new Error("Failed to load image for editing"));
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
        for (const r of rects){
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
            size: Math.round(editedDataUrl.length * 3 / 4),
            dataUrl: editedDataUrl
        });
        resetRedactionState();
    };
    const removeLast = ()=>setRects((prev)=>prev.slice(0, -1));
    const clearAll = ()=>{
        setRects([]);
        setDraft(null);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 flex-wrap",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-700 hover:border-gray-500 bg-black/50 cursor-pointer text-sm font-semibold",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "file",
                                accept: "image/*",
                                className: "hidden",
                                onChange: (e)=>onPick(e.target.files?.[0] ?? null)
                            }, void 0, false, {
                                fileName: "[project]/app/components/ScreenshotUpload.tsx",
                                lineNumber: 306,
                                columnNumber: 11
                            }, this),
                            "Upload screenshot",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-400",
                                children: [
                                    "(max ",
                                    maxMB,
                                    "MB)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/ScreenshotUpload.tsx",
                                lineNumber: 313,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/ScreenshotUpload.tsx",
                        lineNumber: 305,
                        columnNumber: 9
                    }, this),
                    value && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>{
                            onChange(null);
                            resetRedactionState();
                        },
                        className: "text-xs font-semibold px-3 py-2 rounded-xl border border-gray-700 hover:border-gray-500",
                        children: "Remove"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ScreenshotUpload.tsx",
                        lineNumber: 317,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "ml-auto flex items-center gap-2 flex-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `inline-flex rounded-xl border overflow-hidden ${!canRedact ? "border-gray-800 opacity-60" : "border-gray-700"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        disabled: !canRedact || !redactMode,
                                        onClick: ()=>setTool("black"),
                                        className: `px-3 py-2 text-xs font-semibold transition ${tool === "black" ? "bg-gray-800 text-white" : "bg-black/40 text-gray-300"} ${!redactMode ? "cursor-not-allowed" : "hover:bg-gray-800/70"}`,
                                        title: "Black box redaction",
                                        children: "Black"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/ScreenshotUpload.tsx",
                                        lineNumber: 336,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        disabled: !canRedact || !redactMode,
                                        onClick: ()=>setTool("blur"),
                                        className: `px-3 py-2 text-xs font-semibold transition ${tool === "blur" ? "bg-gray-800 text-white" : "bg-black/40 text-gray-300"} ${!redactMode ? "cursor-not-allowed" : "hover:bg-gray-800/70"}`,
                                        title: "Blur / pixelate redaction",
                                        children: "Blur"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/ScreenshotUpload.tsx",
                                        lineNumber: 347,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/ScreenshotUpload.tsx",
                                lineNumber: 331,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                disabled: !canRedact,
                                onClick: ()=>{
                                    setRedactMode((v)=>!v);
                                    setDraft(null);
                                },
                                className: `text-xs font-semibold px-3 py-2 rounded-xl border transition
              ${!canRedact ? "border-gray-800 text-gray-600 cursor-not-allowed" : redactMode ? "border-amber-400 text-amber-200 bg-amber-500/10" : "border-gray-700 hover:border-gray-500"}`,
                                children: redactMode ? "Redact: ON" : "Redact"
                            }, void 0, false, {
                                fileName: "[project]/app/components/ScreenshotUpload.tsx",
                                lineNumber: 360,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                disabled: !redactMode || rects.length === 0,
                                onClick: removeLast,
                                className: `text-xs font-semibold px-3 py-2 rounded-xl border transition
              ${!redactMode || rects.length === 0 ? "border-gray-800 text-gray-600 cursor-not-allowed" : "border-gray-700 hover:border-gray-500"}`,
                                children: "Undo"
                            }, void 0, false, {
                                fileName: "[project]/app/components/ScreenshotUpload.tsx",
                                lineNumber: 379,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                disabled: !redactMode || rects.length === 0,
                                onClick: clearAll,
                                className: `text-xs font-semibold px-3 py-2 rounded-xl border transition
              ${!redactMode || rects.length === 0 ? "border-gray-800 text-gray-600 cursor-not-allowed" : "border-gray-700 hover:border-gray-500"}`,
                                children: "Clear"
                            }, void 0, false, {
                                fileName: "[project]/app/components/ScreenshotUpload.tsx",
                                lineNumber: 393,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                disabled: !canApply,
                                onClick: applyEdits,
                                className: `text-xs font-semibold px-3 py-2 rounded-xl border transition
              ${!canApply ? "border-gray-800 text-gray-600 cursor-not-allowed" : "border-emerald-400 text-emerald-200 bg-emerald-500/10 hover:bg-emerald-500/15"}`,
                                children: [
                                    "Apply ",
                                    rects.length > 0 ? `(${rects.length})` : "",
                                    " edits"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/ScreenshotUpload.tsx",
                                lineNumber: 407,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/ScreenshotUpload.tsx",
                        lineNumber: 329,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ScreenshotUpload.tsx",
                lineNumber: 304,
                columnNumber: 7
            }, this),
            canRedact && redactMode && tool === "blur" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-gray-800 bg-black/40 px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs font-semibold text-gray-200",
                                        children: "Blur strength"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/ScreenshotUpload.tsx",
                                        lineNumber: 428,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[11px] text-gray-500",
                                        children: "Higher = more obscured (stronger pixelation)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/ScreenshotUpload.tsx",
                                        lineNumber: 429,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/ScreenshotUpload.tsx",
                                lineNumber: 427,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs font-semibold text-gray-200 tabular-nums",
                                children: [
                                    blurStrength,
                                    "/10"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/ScreenshotUpload.tsx",
                                lineNumber: 433,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/ScreenshotUpload.tsx",
                        lineNumber: 426,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "range",
                        min: 1,
                        max: 10,
                        step: 1,
                        value: blurStrength,
                        onChange: (e)=>setBlurStrength(Number(e.target.value)),
                        className: "w-full mt-3"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ScreenshotUpload.tsx",
                        lineNumber: 438,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ScreenshotUpload.tsx",
                lineNumber: 425,
                columnNumber: 9
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-amber-400",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/components/ScreenshotUpload.tsx",
                lineNumber: 450,
                columnNumber: 17
            }, this),
            value && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl overflow-hidden border border-gray-800 bg-black/40",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                ref: imgRef,
                                src: value.dataUrl,
                                alt: value.name,
                                className: "w-full max-h-[360px] object-contain bg-black select-none",
                                onLoad: ()=>drawOverlay(),
                                draggable: false
                            }, void 0, false, {
                                fileName: "[project]/app/components/ScreenshotUpload.tsx",
                                lineNumber: 456,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                                ref: overlayRef,
                                className: `absolute inset-0 w-full h-full ${redactMode ? "cursor-crosshair" : "pointer-events-none"}`,
                                style: {
                                    touchAction: "none"
                                },
                                onPointerDown: onPointerDown,
                                onPointerMove: onPointerMove,
                                onPointerUp: onPointerUp
                            }, void 0, false, {
                                fileName: "[project]/app/components/ScreenshotUpload.tsx",
                                lineNumber: 465,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/ScreenshotUpload.tsx",
                        lineNumber: 454,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-3 py-2 text-[11px] text-gray-400 border-t border-gray-800 flex items-center justify-between gap-3 flex-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate",
                                children: [
                                    value.name,
                                    " • ",
                                    (value.size / 1024 / 1024).toFixed(2),
                                    "MB"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/ScreenshotUpload.tsx",
                                lineNumber: 478,
                                columnNumber: 13
                            }, this),
                            redactMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-amber-200",
                                children: [
                                    "Tool: ",
                                    humanTool(tool),
                                    tool === "blur" ? ` (${blurStrength}/10)` : "",
                                    " • Drag to draw boxes • Boxes:",
                                    " ",
                                    rects.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/ScreenshotUpload.tsx",
                                lineNumber: 483,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-500",
                                children: [
                                    "Tip: click ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-300",
                                        children: "Redact"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/ScreenshotUpload.tsx",
                                        lineNumber: 490,
                                        columnNumber: 28
                                    }, this),
                                    " to hide sensitive info"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/ScreenshotUpload.tsx",
                                lineNumber: 489,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/ScreenshotUpload.tsx",
                        lineNumber: 477,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ScreenshotUpload.tsx",
                lineNumber: 453,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ScreenshotUpload.tsx",
        lineNumber: 303,
        columnNumber: 5
    }, this);
}
_s(ScreenshotUpload, "ZRBga5shNtlLY7JLucVhJ/FlpHw=");
_c = ScreenshotUpload;
var _c;
__turbopack_context__.k.register(_c, "ScreenshotUpload");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/demo/DemoClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DemoClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ScreenshotUpload$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ScreenshotUpload.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const presets = [
    {
        id: "screenshot",
        label: "Analyze a screenshot (scam check)",
        prompt: "Analyze this screenshot. Extract the message content, identify scam indicators and emotional manipulation, and give a safe response plan. Include a clear risk verdict and confidence score."
    },
    {
        id: "simulation",
        label: "Is the universe a simulation?",
        prompt: "Explain the simulation hypothesis and whether it is scientifically plausible. Include key arguments for and against."
    },
    {
        id: "voicemail",
        label: "Is this voicemail real or AI-generated?",
        prompt: "Analyze this voicemail: 'Hey, it's me. I lost my phone. Can you send me $500 right now by gift card? I'll explain later.'"
    },
    {
        id: "brain10",
        label: "Do we use only 10% of our brain?",
        prompt: "Evaluate the claim that humans only use 10% of their brains. Explain where this idea comes from and whether it is accurate."
    }
];
function isPresetId(x) {
    return x === "simulation" || x === "voicemail" || x === "brain10" || x === "screenshot" || x === "custom";
}
function getPresetPrompt(id) {
    if (id === "custom") return "";
    const found = presets.find((p)=>p.id === id);
    return found?.prompt ?? presets[0].prompt;
}
function getPresetLabel(id) {
    if (id === "custom") return "Custom scenario";
    const found = presets.find((p)=>p.id === id);
    return found?.label ?? "Custom scenario";
}
function getFallbackResult(presetId) {
    if (presetId === "screenshot") {
        return `
🔎 InquistAI Investigation — Screenshot Analysis (Fallback)

📝 Summary
Live image analysis is unavailable right now. This is a structured fallback.

🧠 Reasoning Layer
• I would extract the text/content from the screenshot.
• I would flag urgency, impersonation, payment method red flags, and link risks.
• I would suggest safe verification steps.

🎤 Authenticity Layer
If the screenshot includes identity/branding, I would check for inconsistencies.

✅ Verdict
Fallback only — try again when live analysis is available.
    `;
    }
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
Would analyze authenticity signals if available.

✅ Verdict
Fallback only.
  `;
}
function DemoClient({ initialPreset, initialPrompt }) {
    _s();
    // Normalize URL values
    const urlPreset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DemoClient.useMemo[urlPreset]": ()=>{
            return isPresetId(initialPreset) ? initialPreset : "screenshot";
        }
    }["DemoClient.useMemo[urlPreset]"], [
        initialPreset
    ]);
    const urlPrompt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DemoClient.useMemo[urlPrompt]": ()=>{
            return typeof initialPrompt === "string" ? initialPrompt : "";
        }
    }["DemoClient.useMemo[urlPrompt]"], [
        initialPrompt
    ]);
    // State
    const [selectedPreset, setSelectedPreset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(urlPreset);
    const [prompt, setPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "DemoClient.useState": ()=>{
            const p = (urlPrompt ?? "").trim();
            if (p.length > 0) return p;
            return getPresetPrompt(urlPreset);
        }
    }["DemoClient.useState"]);
    // ✅ Screenshot state
    const [screenshot, setScreenshot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [errorMsg, setErrorMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [reportPrompt, setReportPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [generatedAt, setGeneratedAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [shareMessage, setShareMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // URL hydration (preset + prompt)
    const lastUrlKeyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DemoClient.useEffect": ()=>{
            const p = (urlPrompt ?? "").trim();
            const key = `${urlPreset}::${p}`;
            if (key === lastUrlKeyRef.current) return;
            setSelectedPreset(urlPreset);
            if (p.length > 0) {
                setPrompt(p);
            } else {
                setPrompt(getPresetPrompt(urlPreset));
            }
            // Clear stale outputs
            setResult(null);
            setErrorMsg(null);
            setReportPrompt(null);
            setGeneratedAt(null);
            setShareMessage(null);
            lastUrlKeyRef.current = key;
        }
    }["DemoClient.useEffect"], [
        urlPreset,
        urlPrompt
    ]);
    const resetReportState = ()=>{
        setResult(null);
        setErrorMsg(null);
        setReportPrompt(null);
        setGeneratedAt(null);
        setShareMessage(null);
    };
    const runInvestigation = async (e)=>{
        e.preventDefault();
        if (!prompt.trim()) return;
        // For screenshot preset, gently require an image (optional, but better UX)
        if (selectedPreset === "screenshot" && !screenshot) {
            setErrorMsg("Please upload a screenshot for this scenario.");
            return;
        }
        setLoading(true);
        setResult(null);
        setErrorMsg(null);
        setReportPrompt(prompt);
        setGeneratedAt(new Date());
        try {
            const res = await fetch("/api/investigate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                // ✅ include screenshot payload
                body: JSON.stringify({
                    prompt,
                    presetId: selectedPreset,
                    screenshot
                })
            });
            if (!res.ok) {
                setErrorMsg("Live investigation unavailable — showing fallback.");
                setResult(getFallbackResult(selectedPreset));
            } else {
                const data = await res.json();
                setResult(data.result ?? getFallbackResult(selectedPreset));
            }
        } catch  {
            setErrorMsg("Network or server error — showing fallback.");
            setResult(getFallbackResult(selectedPreset));
        } finally{
            setLoading(false);
        }
    };
    const handleExportPdf = ()=>{
        if (!result) return;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        window.print();
    };
    const handleShareLink = async ()=>{
        if (!result && !reportPrompt) return;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const basePrompt = (reportPrompt ?? prompt).trim();
        if (!basePrompt) return;
        try {
            const url = new URL(window.location.href);
            url.pathname = "/demo";
            url.searchParams.set("preset", selectedPreset);
            url.searchParams.set("prompt", basePrompt);
            // Note: we DO NOT put screenshot data in share links (too large + privacy)
            const shareUrl = url.toString();
            if (navigator.share) {
                await navigator.share({
                    title: "InquistAI Investigation",
                    text: "Here’s an InquistAI investigation I ran:",
                    url: shareUrl
                });
                setShareMessage("Share dialog opened.");
            } else if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(shareUrl);
                setShareMessage("Link copied to clipboard.");
            } else {
                setShareMessage(shareUrl);
            }
        } catch  {
            setShareMessage("Could not generate share link.");
        }
        setTimeout(()=>setShareMessage(null), 3000);
    };
    const effectivePrompt = reportPrompt ?? prompt;
    const presetLabel = getPresetLabel(selectedPreset);
    const canShare = !!(result || reportPrompt);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white px-6 py-10",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-5xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "mb-10 print-hide",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/",
                            className: "text-sm text-gray-400 hover:text-gray-200 transition-colors",
                            children: "← Back to home"
                        }, void 0, false, {
                            fileName: "[project]/app/demo/DemoClient.tsx",
                            lineNumber: 323,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl md:text-4xl font-bold mt-4",
                            children: "Demo: InquistAI Investigation"
                        }, void 0, false, {
                            fileName: "[project]/app/demo/DemoClient.tsx",
                            lineNumber: 329,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-300 mt-3 max-w-2xl",
                            children: "Upload a screenshot or paste a scenario. InquistAI returns a structured report (live when available, fallback when not)."
                        }, void 0, false, {
                            fileName: "[project]/app/demo/DemoClient.tsx",
                            lineNumber: 332,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/demo/DemoClient.tsx",
                    lineNumber: 322,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] items-start",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "bg-gray-900/70 border border-gray-800/80 rounded-2xl p-6 md:p-7 shadow-xl shadow-black/40 print-hide",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-semibold mb-4",
                                    children: "1. Define the investigation"
                                }, void 0, false, {
                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                    lineNumber: 341,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: runInvestigation,
                                    className: "space-y-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-semibold mb-2 text-gray-200",
                                                    children: "Choose an example scenario"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                                    lineNumber: 346,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap gap-2",
                                                    children: [
                                                        presets.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>{
                                                                    setSelectedPreset(p.id);
                                                                    setPrompt(p.prompt);
                                                                    // For presets other than screenshot, clear image to avoid confusion
                                                                    if (p.id !== "screenshot") setScreenshot(null);
                                                                    resetReportState();
                                                                },
                                                                className: `px-3 py-2 rounded-full text-xs md:text-sm border transition 
                        ${selectedPreset === p.id ? "bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30" : "border-gray-700 hover:border-gray-500 hover:bg-gray-800"}`,
                                                                children: p.label
                                                            }, p.id, false, {
                                                                fileName: "[project]/app/demo/DemoClient.tsx",
                                                                lineNumber: 351,
                                                                columnNumber: 21
                                                            }, this)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>{
                                                                setSelectedPreset("custom");
                                                                resetReportState();
                                                            },
                                                            className: `px-3 py-2 rounded-full text-xs md:text-sm border transition ${selectedPreset === "custom" ? "bg-purple-600 border-purple-400 shadow-lg shadow-purple-500/30" : "border-gray-700 hover:border-gray-500 hover:bg-gray-800"}`,
                                                            children: "Custom"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/demo/DemoClient.tsx",
                                                            lineNumber: 372,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                                    lineNumber: 349,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/demo/DemoClient.tsx",
                                            lineNumber: 345,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-semibold mb-2 text-gray-200",
                                                    children: "Investigation prompt"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                                    lineNumber: 391,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    value: prompt,
                                                    onChange: (e)=>{
                                                        setPrompt(e.target.value);
                                                        setSelectedPreset("custom");
                                                        resetReportState();
                                                    },
                                                    rows: 6,
                                                    className: "w-full bg-black/70 border border-gray-700 rounded-xl px-3 py-2 text-sm md:text-base outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition",
                                                    placeholder: "Describe the claim, message, or scenario you want InquistAI to investigate."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                                    lineNumber: 394,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 mt-2",
                                                    children: [
                                                        "Templates from",
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: "/templates",
                                                            className: "underline text-blue-300",
                                                            children: "/templates"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/demo/DemoClient.tsx",
                                                            lineNumber: 407,
                                                            columnNumber: 19
                                                        }, this),
                                                        " ",
                                                        "can pre-fill this with common scenarios."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                                    lineNumber: 405,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/demo/DemoClient.tsx",
                                            lineNumber: 390,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-semibold mb-2 text-gray-200",
                                                    children: "Screenshot (optional — recommended for screenshot analysis)"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                                    lineNumber: 416,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ScreenshotUpload$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    value: screenshot,
                                                    onChange: setScreenshot
                                                }, void 0, false, {
                                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                                    lineNumber: 419,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 mt-2",
                                                    children: "Tip: Blur or crop out sensitive info before uploading."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                                    lineNumber: 420,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/demo/DemoClient.tsx",
                                            lineNumber: 415,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "submit",
                                                    disabled: loading || !prompt.trim(),
                                                    className: `px-6 py-3 rounded-xl font-semibold text-sm md:text-base transition 
                    ${loading || !prompt.trim() ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30"}`,
                                                    children: loading ? "Running investigation…" : "Run Investigation"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                                    lineNumber: 427,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    disabled: !result || loading,
                                                    onClick: handleExportPdf,
                                                    className: `px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold border transition
                    ${!result || loading ? "border-gray-700 text-gray-500 cursor-not-allowed" : "border-gray-600 text-gray-200 hover:border-blue-400 hover:text-blue-200"}`,
                                                    children: "Export as PDF"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                                    lineNumber: 440,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    disabled: !canShare || loading,
                                                    onClick: handleShareLink,
                                                    className: `px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold border transition
                    ${!canShare || loading ? "border-gray-700 text-gray-500 cursor-not-allowed" : "border-gray-600 text-gray-200 hover:border-emerald-400 hover:text-emerald-200"}`,
                                                    children: "Share investigation link"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                                    lineNumber: 454,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs md:text-sm text-gray-400",
                                                    children: "Share links recreate the scenario on /demo (images are not included)."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                                    lineNumber: 468,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/demo/DemoClient.tsx",
                                            lineNumber: 426,
                                            columnNumber: 15
                                        }, this),
                                        shareMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-emerald-400 mt-1",
                                            children: shareMessage
                                        }, void 0, false, {
                                            fileName: "[project]/app/demo/DemoClient.tsx",
                                            lineNumber: 474,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                    lineNumber: 343,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/demo/DemoClient.tsx",
                            lineNumber: 340,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "bg-black/60 border border-gray-800 rounded-2xl p-6 md:p-7 shadow-xl shadow-black/50 print-report",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs font-semibold text-gray-300 print:text-black",
                                                    children: "InquistAI Investigation Report"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                                    lineNumber: 483,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-[11px] text-gray-500 print:text-black/70",
                                                    children: [
                                                        "Scenario: ",
                                                        presetLabel
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                                    lineNumber: 486,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/demo/DemoClient.tsx",
                                            lineNumber: 482,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[11px] text-gray-500 text-right print:text-black/70",
                                            children: generatedAt ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: "Generated:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/demo/DemoClient.tsx",
                                                        lineNumber: 493,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: generatedAt.toLocaleString()
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/demo/DemoClient.tsx",
                                                        lineNumber: 494,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Run an investigation to generate a report."
                                            }, void 0, false, {
                                                fileName: "[project]/app/demo/DemoClient.tsx",
                                                lineNumber: 497,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/demo/DemoClient.tsx",
                                            lineNumber: 490,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                    lineNumber: 481,
                                    columnNumber: 13
                                }, this),
                                effectivePrompt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-4 text-xs md:text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "font-semibold mb-1 text-gray-200 print:text-black",
                                            children: "Input"
                                        }, void 0, false, {
                                            fileName: "[project]/app/demo/DemoClient.tsx",
                                            lineNumber: 504,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border border-gray-700 rounded-lg bg-black/40 print:bg-white print:border-black/20 px-3 py-2 text-gray-200 print:text-black whitespace-pre-wrap text-xs md:text-sm",
                                            children: effectivePrompt
                                        }, void 0, false, {
                                            fileName: "[project]/app/demo/DemoClient.tsx",
                                            lineNumber: 507,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                    lineNumber: 503,
                                    columnNumber: 15
                                }, this),
                                screenshot && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-4 text-xs md:text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "font-semibold mb-1 text-gray-200 print:text-black",
                                            children: "Screenshot attached"
                                        }, void 0, false, {
                                            fileName: "[project]/app/demo/DemoClient.tsx",
                                            lineNumber: 515,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[11px] text-gray-500 print:text-black/70",
                                            children: [
                                                screenshot.name,
                                                " • ",
                                                (screenshot.size / 1024 / 1024).toFixed(2),
                                                "MB"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/demo/DemoClient.tsx",
                                            lineNumber: 518,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                    lineNumber: 514,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-lg font-semibold text-gray-100 print:text-black",
                                            children: "Analysis"
                                        }, void 0, false, {
                                            fileName: "[project]/app/demo/DemoClient.tsx",
                                            lineNumber: 525,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300 print:bg-black print:text-white",
                                            children: "Live + fallback"
                                        }, void 0, false, {
                                            fileName: "[project]/app/demo/DemoClient.tsx",
                                            lineNumber: 528,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                    lineNumber: 524,
                                    columnNumber: 13
                                }, this),
                                errorMsg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mb-3 text-xs text-amber-400 print:text-[11px]",
                                    children: [
                                        "⚠ ",
                                        errorMsg
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                    lineNumber: 534,
                                    columnNumber: 15
                                }, this),
                                !result && !loading && !errorMsg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-gray-500 text-sm md:text-base print:text-black",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                "Upload a screenshot (optional), then click",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold text-gray-200 print:text-black",
                                                    children: "“Run Investigation”"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                                    lineNumber: 543,
                                                    columnNumber: 19
                                                }, this),
                                                " ",
                                                "to generate a report you can export as PDF or share."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/demo/DemoClient.tsx",
                                            lineNumber: 541,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "mt-4 list-disc list-inside space-y-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "🧠 Reasoning across claims, context, and evidence"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                                    lineNumber: 549,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "🖼️ Screenshot extraction + risk signals"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                                    lineNumber: 550,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "✅ Clear verdicts with confidence scores"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                                    lineNumber: 551,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/demo/DemoClient.tsx",
                                            lineNumber: 548,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                    lineNumber: 540,
                                    columnNumber: 15
                                }, this),
                                loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "animate-pulse text-gray-300 text-sm md:text-base print:text-black",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Building reasoning layers and querying the investigation engine…"
                                        }, void 0, false, {
                                            fileName: "[project]/app/demo/DemoClient.tsx",
                                            lineNumber: 558,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 text-gray-500 print:text-black/70",
                                            children: "In production, this step can combine model calls, pattern checks, and reference lookups before generating the report."
                                        }, void 0, false, {
                                            fileName: "[project]/app/demo/DemoClient.tsx",
                                            lineNumber: 559,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                    lineNumber: 557,
                                    columnNumber: 15
                                }, this),
                                result && !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-3 animate-[fadeIn_0.35s_ease-out]",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                        className: "whitespace-pre-wrap text-sm md:text-base text-gray-100 print:text-black leading-relaxed",
                                        children: result
                                    }, void 0, false, {
                                        fileName: "[project]/app/demo/DemoClient.tsx",
                                        lineNumber: 568,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                    lineNumber: 567,
                                    columnNumber: 15
                                }, this),
                                result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-6 text-[10px] text-gray-500 print:text-black/70 border-t border-gray-800 pt-3 print:border-black/20",
                                    children: "InquistAI is an AI-assisted reasoning tool. Use this report as decision support, not as a substitute for professional legal, financial, or security advice."
                                }, void 0, false, {
                                    fileName: "[project]/app/demo/DemoClient.tsx",
                                    lineNumber: 575,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/demo/DemoClient.tsx",
                            lineNumber: 480,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/demo/DemoClient.tsx",
                    lineNumber: 338,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/demo/DemoClient.tsx",
            lineNumber: 320,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/demo/DemoClient.tsx",
        lineNumber: 319,
        columnNumber: 5
    }, this);
}
_s(DemoClient, "BREAQnpFCUyvgy+NnK4/0MAmJgc=");
_c = DemoClient;
var _c;
__turbopack_context__.k.register(_c, "DemoClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_849fd441._.js.map