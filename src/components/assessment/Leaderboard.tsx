export type Leader = { id: string; name: string; score: number };

export function Leaderboard({ leaders, title = "Leaderboard" }: { leaders: Leader[]; title?: string }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-sm font-semibold mb-2">{title}</div>
      <ol className="space-y-1">
        {leaders.map((l, i) => (
          <li key={l.id} className="flex justify-between text-sm">
            <span>{i + 1}. {l.name}</span>
            <span className="font-medium">{l.score}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
