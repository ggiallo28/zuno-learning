import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type RankItem = { id: string; name: string; xp: number; me?: boolean };

export function LeaderboardPopup({
  open, onClose, items,
}: { open: boolean; onClose: () => void; items: RankItem[] }) {
  const sorted = [...items].sort((a,b)=>b.xp-a.xp).slice(0,20);
  return (
    <Dialog open={open} onOpenChange={(v)=>!v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>🏆 Leaderboard</DialogTitle></DialogHeader>
        <ol className="space-y-2">
          {sorted.map((r,i)=>(
            <li key={r.id} className={"flex items-center justify-between rounded-md border px-3 py-2 " + (r.me?"bg-emerald-50 border-emerald-200":"bg-white")}>
              <div className="flex items-center gap-3">
                <span className="w-6 text-center">{i+1}</span>
                <span className="font-medium">{r.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{r.xp} XP</span>
            </li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
}
