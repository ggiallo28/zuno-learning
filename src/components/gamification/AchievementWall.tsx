
export type Achievement = { id: string; name: string; emoji?: string; desc?: string; earnedAt?: string };

export function AchievementWall({ items }: { items: Achievement[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map(a=>(
        <div key={a.id} className="rounded-lg border bg-white p-3">
          <div className="text-2xl">{a.emoji ?? "🏅"}</div>
          <div className="text-sm font-semibold">{a.name}</div>
          {a.desc && <div className="text-xs text-muted-foreground">{a.desc}</div>}
          {a.earnedAt && <div className="mt-1 text-[10px] text-muted-foreground">Ottenuto: {a.earnedAt}</div>}
        </div>
      ))}
    </div>
  );
}
