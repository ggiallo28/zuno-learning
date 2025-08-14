
export function ItemCounter({
  current,
  total,
  ariaLabel = "Avanzamento domande",
}: {
  current: number; // 1-based
  total: number;
  ariaLabel?: string;
}) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground">Q {current} di {total}</div>
      <div
        className="h-2 bg-muted rounded-full overflow-hidden"
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
