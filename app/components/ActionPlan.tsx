export type ActionPlanData = {
  doNow: string[];
  doNotDo: string[];
  verify: string[];
  escalateWhen: string[];
};

function BulletSection({
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

export function ActionPlan({ plan }: { plan: ActionPlanData }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-black/40 p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-100 print:text-black">
          60-Second Action Plan
        </h2>
        <span className="text-[10px] px-2 py-1 rounded-full bg-gray-800 text-gray-300 print:bg-black print:text-white">
          Do this first
        </span>
      </div>

      <BulletSection title="Do this now" items={plan.doNow} tone="good" />
      <BulletSection title="Do NOT do this" items={plan.doNotDo} tone="warn" />
      <BulletSection title="Verify safely" items={plan.verify} tone="neutral" />
      <BulletSection title="Escalate if" items={plan.escalateWhen} tone="warn" />
    </div>
  );
}
