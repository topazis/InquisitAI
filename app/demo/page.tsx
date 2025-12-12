import DemoClient from "./DemoClient";

type SearchParams = Record<string, string | string[] | undefined>;

function firstParam(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const initialPreset = firstParam(sp.preset);
  const initialPrompt = firstParam(sp.prompt);

  return <DemoClient initialPreset={initialPreset} initialPrompt={initialPrompt} />;
}
