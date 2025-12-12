// app/demo/page.tsx
import DemoClient from "./DemoClient";

type SearchParams = { [key: string]: string | string[] | undefined };

function firstParam(v: string | string[] | undefined): string | undefined {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return undefined;
}

export default function DemoPage({ searchParams }: { searchParams: SearchParams }) {
  const initialPreset = firstParam(searchParams.preset);
  const initialPrompt = firstParam(searchParams.prompt);

  return <DemoClient initialPreset={initialPreset} initialPrompt={initialPrompt} />;
}
