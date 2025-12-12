function Section({
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

export function ActionPlan({ plan }: { plan: InvestigationResult["actionPlan"] }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-black/40 p-5 space-y-4">
      <h2 className="text-lg font-semibold">What to do right now</h2>

      <Section title="Do this now" items={plan.doNow} tone="good" />
      <Section title="Do NOT do this" items={plan.doNotDo} tone="warn" />
      <Section title="Verify safely" items={plan.verify} tone="neutral" />
      <Section title="Escalate if" items={plan.escalateWhen} tone="warn" />
    </div>
  );
}
