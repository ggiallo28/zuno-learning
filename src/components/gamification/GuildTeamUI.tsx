
export type GuildMember = { id: string; name: string; xp: number; avatar?: string; me?: boolean };

export function GuildTeamUI({
  name, members,
}: { name: string; members: GuildMember[] }) {
  const totalXP = members.reduce((a,b)=>a+b.xp,0);
  return (
    <section className="rounded-xl border bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">🛡️ {name}</h3>
        <div className="text-xs text-muted-foreground">{totalXP} XP totali</div>
      </div>
      <ul className="space-y-2">
        {members.map(m=>(
          <li key={m.id} className={"flex items-center justify-between rounded-md border px-3 py-2 " + (m.me?"bg-blue-50 border-blue-200":"")}>
            <span className="font-medium">{m.avatar ?? "🙂"} {m.name}</span>
            <span className="text-sm text-muted-foreground">{m.xp} XP</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
