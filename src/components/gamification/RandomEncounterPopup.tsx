import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function RandomEncounterPopup({
  open, title = "Random Encounter!", description, onAccept, onDismiss,
}: {
  open: boolean; title?: string; description?: string;
  onAccept: () => void; onDismiss: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v)=>!v && onDismiss()}>
      <DialogContent>
        <DialogHeader><DialogTitle>🎲 {title}</DialogTitle></DialogHeader>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        <div className="flex gap-2 pt-2">
          <Button onClick={onAccept}>Accetta</Button>
          <Button variant="outline" onClick={onDismiss}>Passa</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
