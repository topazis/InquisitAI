import { headers } from "next/headers";
import Link from "next/link";

export const runtime = "nodejs";

type RouteParams = { id: string };

// ✅ Next 16: params may be a Promise
type PageProps = {
  params: Promise<RouteParams> | RouteParams;
};

async function getOrigin() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

/** ---- Structured report types (matches your saved result shape) ---- */
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
  return (
    typeof o.summary === "string" &&
    typeof o.risk === "object" &&
    typeof o.risk?.level === "string" &&
    typeof o.risk?.score === "number" &&
    Array.isArray(o.findings) &&
    typeof o.actionPlan === "object"
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function NotFound({ reason }: { reason: string }) {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">Report not found</h1>
        <p className="text-gray-400 mt-2">{reason}</p>
        <Link className="inline-block mt-6 text-blue-400 underline" href="/demo">
          Back to demo
        </Link>
      </div>
    </main>
  );
}

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
  const score = clamp(Math.round(risk.score ?? 0), 0, 100);

  const pill =
    risk.level === "critical"
      ? "bg-red-600"
      : risk.level === "high"
      ? "bg-amber-600"
      : risk.level === "medium"
      ? "bg-blue-600"
      : "bg-emerald-600";

  return (
    <section className="rounded-2xl border border-gray-800 bg-black/40 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-100">Risk Dial</h2>
        <span className={`text-[10px] px-2 py-1 rounded-full text-white ${pill}`}>
          {String(risk.level).toUpperCase()}
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
    </section>
  );
}

function Findings({ findings }: { findings: Finding[] }) {
  return (
    <section className="rounded-2xl border border-gray-800 bg-black/40 p-5 space-y-3">
      <h2 className="text-sm font-semibold text-gray-100">Key findings</h2>

      <div className="space-y-3">
        {(findings ?? []).map((f, idx) => (
          <div key={idx} className="rounded-xl border border-gray-800 bg-black/30 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-gray-100">{f.title}</div>
              {f.severity ? (
                <span className="text-[10px] px-2 py-1 rounded-full bg-gray-800 text-gray-300">
                  {String(f.severity).toUpperCase()}
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
    </section>
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
        <h3 className={`text-sm font-semibold mb-2 ${color}`}>{title}</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-200">
          {items?.length ? items.map((i, idx) => <li key={idx}>{i}</li>) : <li>—</li>}
        </ul>
      </div>
    );
  };

  return (
    <section className="rounded-2xl border border-gray-800 bg-black/40 p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-gray-100">60-Second Action Plan</h2>
        <span className="text-[10px] px-2 py-1 rounded-full bg-gray-800 text-gray-300">
          Do this first
        </span>
      </div>

      <Section title="Do this now" items={plan.doNow ?? []} tone="good" />
      <Section title="Do NOT do this" items={plan.doNotDo ?? []} tone="warn" />
      <Section title="Verify safely" items={plan.verify ?? []} tone="neutral" />
      <Section title="Escalate if" items={plan.escalateWhen ?? []} tone="warn" />
    </section>
  );
}

export default async function ReportPage(props: PageProps) {
  // ✅ handle both Promise + non-Promise to be extra safe
  const resolvedParams = (await (props.params as any)) as RouteParams;
  const id = (resolvedParams?.id ?? "").trim();

  if (!id) return <NotFound reason="Missing report id." />;

  const origin = await getOrigin();

  const res = await fetch(`${origin}/api/reports/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <NotFound reason="That link may be invalid or the report is private." />;
  }

  const json = await res.json();
  const report = json?.report ?? null;

  if (!report) return <NotFound reason="API returned no report." />;

  const preset = String(report.preset ?? "custom");
  const prompt = String(report.prompt ?? "");
  const result = report.result;

  const structured = isStructured(result) ? result : null;
  const looksFallback =
    structured?.notes?.some((n) => String(n).toLowerCase().includes("fallback")) ?? false;

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Investigation Report</h1>
            <p className="text-gray-400 mt-1 text-sm">
              ID: <span className="text-gray-200">{report.id}</span>
            </p>
          </div>

          <Link
            href="/demo"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold"
          >
            Run another
          </Link>
        </header>

        {looksFallback ? (
          <div className="rounded-xl border border-amber-700/40 bg-amber-900/10 px-4 py-3 text-sm text-amber-200">
            ⚠ This report is a <span className="font-semibold">fallback</span> (live investigation
            was unavailable when it was generated).
          </div>
        ) : null}

        <section className="rounded-2xl border border-gray-800 bg-black/40 p-5 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Preset</div>
              <div className="text-gray-100 font-semibold">{preset}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Visibility</div>
              <div className="text-gray-100 font-semibold">
                {report.is_public ? "Public" : "Private"}
              </div>
            </div>
          </div>

          <Divider label="prompt" />

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Prompt</div>
            <div className="text-gray-200 whitespace-pre-wrap">{prompt}</div>
          </div>
        </section>

        {structured ? (
          <div className="space-y-5">
            <section className="rounded-2xl border border-gray-800 bg-black/40 p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Summary</div>
              <p className="text-sm md:text-base text-gray-100 leading-relaxed whitespace-pre-wrap">
                {structured.summary}
              </p>
            </section>

            <RiskDial risk={structured.risk} />
            <Findings findings={structured.findings} />
            <ActionPlan plan={structured.actionPlan} />

            {structured.notes?.length ? (
              <section className="rounded-2xl border border-gray-800 bg-black/40 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Notes</div>
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                  {structured.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        ) : (
          <section className="rounded-2xl border border-gray-800 bg-black/40 p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Result</div>
            <pre className="whitespace-pre-wrap text-sm text-gray-100 leading-relaxed">
              {typeof result === "string" ? result : JSON.stringify(result, null, 2)}
            </pre>
          </section>
        )}

        <p className="text-[10px] text-gray-500 border-t border-gray-800 pt-4">
          InquistAI is an AI-assisted reasoning tool. Use this report as decision support, not as a
          substitute for professional legal, financial, or security advice.
        </p>
      </div>
    </main>
  );
}
