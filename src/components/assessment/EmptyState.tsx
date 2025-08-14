import { Button } from "@/components/ui/button";

export function EmptyState({
  title = "Nessun elemento disponibile",
  description = "Prova a cambiare i tag o riprova più tardi.",
  actionLabel,
  onAction,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-lg border p-8 text-center space-y-2">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}
