import { cn } from "@/lib/utils";

export function PacingReminderBanner({
  timeLeftLabel, className,
}: { timeLeftLabel: string; className?: string }) {
  return (
    <div className={cn("rounded-md border bg-amber-50 px-3 py-2 text-amber-900", className)}>
      ⏱️ {timeLeftLabel}
    </div>
  );
}
