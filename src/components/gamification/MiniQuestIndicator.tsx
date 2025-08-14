import { cn } from "@/lib/utils";

export function MiniQuestIndicator({
  label,
  progress, // 0..1
  rewardHint,
  className,
}: { label: string; progress: number; rewardHint?: string; className?: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  return (
    <div className={cn("rounded-lg border p-3 bg-white", className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{pct}%</div>
      </div>
      <div className="h-2 w-full rounded bg-muted">
        <div className="h-2 rounded bg-blue-600" style={{ width: `${pct}%` }} />
      </div>
      {rewardHint && <div className="mt-2 text-xs text-muted-foreground">{rewardHint}</div>}
    </div>
  );
}
