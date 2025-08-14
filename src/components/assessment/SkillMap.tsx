export type SkillStat = { tag: string; pct: number }; // 0..100

export function SkillMap({ stats }: { stats: SkillStat[] }) {
  if (!stats?.length) return null;
  return (
    <div className="rounded-md border p-3">
      <div className="text-sm font-semibold mb-2">Mappa competenze</div>
      <ul className="space-y-2">
        {stats.map(s => {
          const pct = Math.round(Math.max(0, Math.min(100, s.pct)));
          return (
            <li key={s.tag}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span>{s.tag}</span><span>{pct}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Competenza ${s.tag}`}>
                <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
