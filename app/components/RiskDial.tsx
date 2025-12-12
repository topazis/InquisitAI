export function RiskDial({
  level,
  confidence,
}: {
  level: "LOW" | "MEDIUM" | "HIGH";
  confidence: number;
}) {
  const pct = Math.round(confidence * 100);

  const color =
    level === "HIGH"
      ? "text-red-400 border-red-500"
      : level === "MEDIUM"
      ? "text-amber-400 border-amber-500"
      : "text-emerald-400 border-emerald-500";

  return (
    <div className={`rounded-xl border px-4 py-3 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold">Risk level</div>
          <div className="text-lg font-bold">{level}</div>
        </div>
        <div className="text-right">
          <div className="text-xs">Confidence</div>
          <div className="text-lg font-bold tabular-nums">{pct}%</div>
        </div>
      </div>
    </div>
  );
}
