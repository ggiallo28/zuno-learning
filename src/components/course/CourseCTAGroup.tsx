// src/components/course/CourseCTAGroup.tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CourseCTAGroup({
  className,
  onPrimary,
  onSecondary,
  onTertiary,
  primaryLabel = "Trova un corso",
  secondaryLabel = "Richiedi per il tuo team",
  tertiaryLabel = "Contatta un esperto",
}: {
  className?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  onTertiary?: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
  tertiaryLabel?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <Button size="lg" onClick={onPrimary} className="shadow">
        {primaryLabel}
      </Button>
      <Button size="lg" variant="secondary" onClick={onSecondary}>
        {secondaryLabel}
      </Button>
      <Button size="lg" variant="outline" onClick={onTertiary}>
        {tertiaryLabel}
      </Button>
    </div>
  );
}
