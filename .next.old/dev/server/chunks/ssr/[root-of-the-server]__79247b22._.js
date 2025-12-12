module.exports = [
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/library/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InvestigationLibraryPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
;
;
const libraryCases = [
    {
        id: "ai-voicemail-money",
        title: "“Hey, it’s me, I lost my phone. Can you send $500?”",
        tag: "Voice scam · AI / social engineering",
        severity: "high",
        preset: "voicemail",
        summary: "A rushed voicemail claiming to be from a friend who lost their phone and urgently needs $500 in gift cards. Classic panic + gift card pattern.",
        prompt: "Analyze this voicemail: 'Hey, it's me. I lost my phone. Can you send me $500 right now by gift card? I'll explain later.' Identify scam indicators, emotional manipulation patterns, and what a safe response would be."
    },
    {
        id: "fake-job-offer",
        title: "Too-good-to-be-true remote job offer",
        tag: "Email scam · Employment",
        severity: "high",
        preset: "custom",
        summary: "An unsolicited 'remote admin assistant' offer with high pay, vague duties, and a request for banking details to 'set up direct deposit.'",
        prompt: "Analyze this job offer email:\n\n\"We are pleased to offer you a Remote Administrative Assistant role for $95,000/year working 10–15 hours a week. No interview is required. To get started, please send a photo of your ID and your banking details so we can set up direct deposit. Reply within 24 hours to avoid losing this opportunity.\"\n\nExplain whether this is likely legitimate, outline red flags, and recommend what the recipient should do."
    },
    {
        id: "romance-scam",
        title: "Long-distance ‘romance’ asking for crypto",
        tag: "Romance scam · Crypto",
        severity: "high",
        preset: "custom",
        summary: "A months-long chat relationship where the other person suddenly needs crypto to unlock 'frozen funds.'",
        prompt: "Investigate this situation: The user has been chatting online with someone for several months. The person now claims their investment account is frozen and they need the user to send $2,000 in crypto to help 'unlock' it, promising to pay it back immediately. They refuse video calls, saying their camera is broken, and insist on communicating only via text and voice notes.\n\nAssess whether this is likely a romance scam, identify key red flags, and suggest safe next steps."
    },
    {
        id: "irs-text",
        title: "“You owe the IRS. Pay now or face arrest.”",
        tag: "Government impersonation · SMS",
        severity: "high",
        preset: "custom",
        summary: "A text message claiming to be from the IRS demanding immediate payment via link to avoid arrest.",
        prompt: "Analyze this text message:\n\n\"⚠️ IRS NOTICE: Our records show you have an outstanding tax balance of $1,942.37. Failure to respond within 24 hours will result in a warrant for your arrest. Pay now at https://secure-irs-payments.example to avoid legal action. Reply STOP to opt out.\"\n\nExplain why this is almost certainly a scam, which parts give it away, and how a real IRS communication would differ."
    },
    {
        id: "crypto-giveaway",
        title: "“Send 1 ETH, get 2 ETH back” livestream",
        tag: "Crypto scam · Social",
        severity: "medium",
        preset: "custom",
        summary: "A fake livestream using a stolen celebrity video feed promising to ‘double’ any crypto sent to a wallet address.",
        prompt: "Investigate this scenario: A YouTube livestream shows a well-known tech founder talking about a 'special event.' The overlay text and description say that if viewers send 1 ETH to a specific wallet address, they will receive 2 ETH back as part of a 'community giveaway.' The chat is full of bots posting 'It worked!' and transaction hashes.\n\nExplain how these scams work, why they are fraudulent, and what users should do if they encounter them."
    },
    {
        id: "conspiracy-thread",
        title: "Viral conspiracy thread about a major event",
        tag: "Misinformation · Thread",
        severity: "medium",
        preset: "simulation",
        summary: "A long social media thread making dramatic claims with no sources, urging people not to trust any official information.",
        prompt: "Analyze a viral social media thread that claims a recent major event was 'entirely staged' and that 'nothing you see in the news is real.' The thread uses cherry-picked images, anonymous 'insider' quotes, and urges people to 'wake up' and ignore all official sources.\n\nAssess the argument quality, explain common misinformation tactics used here, and outline a healthier way to evaluate such claims."
    }
];
function severityColor(severity) {
    switch(severity){
        case "high":
            return "text-red-400 border-red-500/40 bg-red-500/5";
        case "medium":
            return "text-amber-300 border-amber-400/40 bg-amber-400/5";
        case "low":
        default:
            return "text-emerald-300 border-emerald-400/40 bg-emerald-400/5";
    }
}
function InvestigationLibraryPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white px-6 py-10",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-5xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "mb-10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "text-sm text-gray-400 hover:text-gray-200 transition-colors",
                            children: "← Back to home"
                        }, void 0, false, {
                            fileName: "[project]/app/library/page.tsx",
                            lineNumber: 99,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl md:text-4xl font-bold mt-4",
                            children: "Investigation Library"
                        }, void 0, false, {
                            fileName: "[project]/app/library/page.tsx",
                            lineNumber: 106,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-300 mt-3 max-w-2xl",
                            children: "A growing set of real-world scenarios that InquistAI is designed to handle: scam messages, suspicious voicemails, fake offers, and more. Use these as examples, or open them directly in the demo to see how the investigation flow works."
                        }, void 0, false, {
                            fileName: "[project]/app/library/page.tsx",
                            lineNumber: 109,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/library/page.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "space-y-6",
                    children: libraryCases.map((c)=>{
                        const href = `/demo?preset=${encodeURIComponent(c.preset)}&prompt=${encodeURIComponent(c.prompt)}`;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            className: "bg-gray-900/70 border border-gray-800 rounded-2xl p-6 md:p-7 shadow-lg shadow-black/40",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-start justify-between gap-3 mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-xl md:text-2xl font-semibold",
                                                    children: c.title
                                                }, void 0, false, {
                                                    fileName: "[project]/app/library/page.tsx",
                                                    lineNumber: 130,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs md:text-sm text-gray-400 mt-1",
                                                    children: c.tag
                                                }, void 0, false, {
                                                    fileName: "[project]/app/library/page.tsx",
                                                    lineNumber: 133,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/library/page.tsx",
                                            lineNumber: 129,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `text-[10px] uppercase tracking-wide px-2 py-1 rounded-full border ${severityColor(c.severity)}`,
                                            children: c.severity === "high" ? "High risk" : c.severity === "medium" ? "Medium risk" : "Low risk"
                                        }, void 0, false, {
                                            fileName: "[project]/app/library/page.tsx",
                                            lineNumber: 137,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/library/page.tsx",
                                    lineNumber: 128,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm md:text-base text-gray-200 mb-4",
                                    children: c.summary
                                }, void 0, false, {
                                    fileName: "[project]/app/library/page.tsx",
                                    lineNumber: 150,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                            href: href,
                                            className: "inline-flex items-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold shadow-md shadow-blue-500/30 transition",
                                            children: [
                                                "Open in demo",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-1.5 text-xs opacity-80",
                                                    children: "↗"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/library/page.tsx",
                                                    lineNumber: 160,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/library/page.tsx",
                                            lineNumber: 155,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-gray-400",
                                            children: [
                                                "Opens",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold text-gray-200",
                                                    children: "/demo"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/library/page.tsx",
                                                    lineNumber: 165,
                                                    columnNumber: 21
                                                }, this),
                                                " ",
                                                "with this scenario pre-filled so you can run the full investigation or tweak the prompt."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/library/page.tsx",
                                            lineNumber: 163,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/library/page.tsx",
                                    lineNumber: 154,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, c.id, true, {
                            fileName: "[project]/app/library/page.tsx",
                            lineNumber: 124,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/app/library/page.tsx",
                    lineNumber: 117,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                    className: "mt-10 text-xs text-gray-500",
                    children: "This library is for educational purposes and pattern recognition. For anything involving real money, legal risk, or safety, combine InquistAI's output with your own judgement and professional advice."
                }, void 0, false, {
                    fileName: "[project]/app/library/page.tsx",
                    lineNumber: 177,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/library/page.tsx",
            lineNumber: 97,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/library/page.tsx",
        lineNumber: 96,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/library/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/library/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__79247b22._.js.map