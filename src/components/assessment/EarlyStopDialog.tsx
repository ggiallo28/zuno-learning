import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function EarlyStopDialog({
  open,
  precisionPct,
  onContinue,
  onStop,
}: {
  open: boolean;
  precisionPct: number; // 0..100 for display
  onContinue: () => void;
  onStop: () => void;
}) {
  return (
    <Dialog open={open}>
      <DialogContent aria-describedby="early-stop-desc">
        <DialogHeader>
          <DialogTitle>Precisione sufficiente</DialogTitle>
        </DialogHeader>
        <div id="early-stop-desc" className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Abbiamo raggiunto una precisione stimata del <span className="font-medium">{precisionPct}%</span>.
            Vuoi fermarti ora o continuare per affinare ancora?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onContinue}>Continua</Button>
            <Button onClick={onStop}>Termina ora</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
