import Link from "next/link";
import { headers } from "next/headers";

export const runtime = "nodejs";

type ParamsMaybePromise = { id?: string } | Promise<{ id?: string }>;

async function unwrapParams(p: ParamsMaybePromise): Promise<{ id?: string }> {
  const anyP = p as any;
  if (anyP && typeof anyP.then === "function") return await anyP;
  return p as { id?: string };
}

async function getOrigin() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export default async function ReportPage({
  params,
}: {
  params: ParamsMaybePromise;
}) {
  const { id } = await unwrapParams(params);
  const reportId = (id ?? "").trim();

  if (!reportId) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold">Report not found</h1>
          <p className="text-gray-400 mt-2">Missing report id.</p>
          <Link className="inline-block mt-6 text-blue-400 underline" href="/demo">
            Back to demo
          </Link>
        </div>
      </main>
    );
  }

  const origin = await getOrigin();

  const res = await fetch(`${origin}/api/reports/${encodeURIComponent(reportId)}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold">Report not found</h1>
          <p className="text-gray-400 mt-2">
            That link may be invalid or the report is private.
          </p>
          <Link className="inline-block mt-6 text-blue-400 underline" href="/demo">
            Back to demo
          </Link>
        </div>
      </main>
    );
  }

  const json = await res.json();
  const report = json?.report ?? null;

  if (!report) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold">Report not found</h1>
          <p className="text-gray-400 mt-2">API returned no report.</p>
          <Link className="inline-block mt-6 text-blue-400 underline" href="/demo">
            Back to demo
          </Link>
        </div>
      </main>
    );
  }

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

        <section className="rounded-2xl border border-gray-800 bg-black/40 p-5 space-y-3">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Preset</div>
            <div className="text-gray-100 font-semibold">{report.preset}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Prompt</div>
            <div className="text-gray-200 whitespace-pre-wrap">{report.prompt}</div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-800 bg-black/40 p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Result</div>
          <pre className="whitespace-pre-wrap text-sm text-gray-100 leading-relaxed">
            {typeof report.result === "string"
              ? report.result
              : JSON.stringify(report.result, null, 2)}
          </pre>
        </section>
      </div>
    </main>
  );
}
