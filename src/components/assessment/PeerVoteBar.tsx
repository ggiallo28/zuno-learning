import { cn } from "@/lib/utils";

export function PeerVoteBar({
  aPct,
  bPct,
  cPct,
}: {
  aPct: number;
  bPct: number;
  cPct?: number;
}) {
  const safe = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
  const a = safe(aPct), b = safe(bPct), c = safe(cPct ?? 0);
  const total = a + b + c || 1;
  return (
    <div className="space-y-1">
      <div className="flex gap-2 text-xs">
        <span>A {a}%</span><span>B {b}%</span>{cPct != null && <span>C {c}%</span>}
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden bg-muted" role="img" aria-label="Distribuzione voti peer">
        <div className={cn("h-full bg-primary inline-block align-top")} style={{ width: `${(a / total) * 100}%` }} />
        <div className={cn("h-full bg-secondary inline-block align-top")} style={{ width: `${(b / total) * 100}%` }} />
        {cPct != null && (
          <div className={cn("h-full bg-accent inline-block align-top")} style={{ width: `${(c / total) * 100}%` }} />
        )}
      </div>
    </div>
  );
}
