import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function LevelUpModal({
  open, level, onClose, cta = "Continua",
}: { open: boolean; level: number; onClose: () => void; cta?: string }) {
  return (
    <Dialog open={open} onOpenChange={(v)=>!v && onClose()}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-2xl">🎉 Level {level}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Hai sbloccato nuove sfide e ricompense.
        </p>
        <div className="pt-4">
          <Button onClick={onClose}>{cta}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
