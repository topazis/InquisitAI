import Link from "next/link";
import { supabaseAnon } from "@/lib/supabase/server";

export const runtime = "nodejs";

export default async function HistoryPage() {
  const db = supabaseAnon();
  const { data } = await db
    .from("investigations")
    .select("id, created_at, preset, prompt, risk")
    .order("created_at", { ascending: false })
    .limit(20);

  const items = data ?? [];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-200">
            ← Back to home
          </Link>
          <h1 className="text-3xl font-bold mt-3">History</h1>
          <p className="text-gray-400 mt-2">
            Your latest saved investigations (public/unlisted for now).
          </p>
        </header>

        <div className="grid gap-4">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-gray-800 bg-black/40 p-6 text-gray-400">
              No saved reports yet. Run an investigation in <Link className="underline text-blue-300" href="/demo">/demo</Link>.
            </div>
          ) : (
            items.map((x) => (
              <article
                key={x.id}
                className="rounded-2xl border border-gray-800 bg-black/40 p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-gray-400">
                      {new Date(x.created_at).toLocaleString()} • preset:{" "}
                      <span className="text-gray-200">{x.preset}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-200">
                      {x.prompt.length > 160 ? x.prompt.slice(0, 160) + "…" : x.prompt}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-200">
                      Risk {x.risk ?? 0}
                    </span>
                    <Link
                      href={`/r/${x.id}`}
                      className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold"
                    >
                      Open report
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
