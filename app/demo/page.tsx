import DemoClient from "./DemoClient";

type SearchParams = { [key: string]: string | string[] | undefined };

export default function DemoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const presetParam = searchParams.preset;
  const promptParam = searchParams.prompt;

  const initialPreset =
    typeof presetParam === "string" ? presetParam : undefined;
  const initialPrompt =
    typeof promptParam === "string" ? promptParam : undefined;

  return (
    <DemoClient
      initialPreset={initialPreset}
      initialPrompt={initialPrompt}
    />
  );
}
