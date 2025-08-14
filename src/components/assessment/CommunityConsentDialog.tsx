import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function CommunityConsentDialog({
  open,
  onAccept,
  onDecline,
}: {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Condivisione spiegazioni (anonime)</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Possiamo utilizzare in forma anonima le tue spiegazioni per migliorare le attività community (Lupa/Polpo)?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onDecline}>No, grazie</Button>
            <Button onClick={onAccept}>Acconsento</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
