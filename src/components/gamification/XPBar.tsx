import { cn } from "@/lib/utils";

export function XPBar({
  current, nextLevel, className,
}: { current: number; nextLevel: number; className?: string }) {
  const pct = Math.round((current / Math.max(1, nextLevel)) * 100);
  return (
    <div className={cn("rounded-lg border p-3 bg-white", className)}>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="font-medium">XP Progress</span>
        <span className="text-muted-foreground">{current}/{nextLevel}</span>
      </div>
      <div className="h-2 rounded bg-muted">
        <div className="h-2 rounded bg-green-600" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
