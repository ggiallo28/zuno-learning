import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function BadgeModal({
  open,
  onClose,
  badgeName,
  description,
  emoji = "🏅",
  ctaLabel = "Grande!",
}: {
  open: boolean;
  onClose: () => void;
  badgeName: string;
  description?: string;
  emoji?: string;
  ctaLabel?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={(v)=>!v && onClose()}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2">
            <span className="text-3xl">{emoji}</span>
            Nuovo Badge
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Badge className="px-3 py-1 text-sm">{badgeName}</Badge>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          <div className="pt-1">
            <Button onClick={onClose}>{ctaLabel}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
