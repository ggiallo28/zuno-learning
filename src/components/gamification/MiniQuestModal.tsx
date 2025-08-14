import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function MiniQuestModal({
  open, title, goalLabel, timeLimitSec, rewardLabel, onStart, onClose,
}: {
  open: boolean; title: string; goalLabel: string; timeLimitSec?: number;
  rewardLabel?: string; onStart: () => void; onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v)=>!v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>🎯 {title}</DialogTitle></DialogHeader>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>Obiettivo: <b>{goalLabel}</b></li>
          {timeLimitSec && <li>Tempo: <b>{timeLimitSec}s</b></li>}
          {rewardLabel && <li>Ricompensa: <b>{rewardLabel}</b></li>}
        </ul>
        <div className="pt-3">
          <Button onClick={onStart}>Inizia la mini-quest</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
