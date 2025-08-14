import { Dialog, DialogContent } from "@/components/ui/dialog";

export function AdaptiveHintPopup({
  open, hint, onClose,
}: { open: boolean; hint: string; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(v)=>!v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <div className="text-sm">💡 {hint}</div>
      </DialogContent>
    </Dialog>
  );
}
