import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight toast (no external provider).
 * Render near the root (e.g. in AssessmentShell) so it can position fixed.
 */
export function AchievementToast({
  open,
  title = "Obiettivo raggiunto!",
  message,
  icon,
  onClose,
  durationMs = 3000,
  className,
}: {
  open: boolean;
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  durationMs?: number;
  className?: string;
}) {
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!open) return;
    if (durationMs <= 0) return;
    timerRef.current = window.setTimeout(() => onClose?.(), durationMs);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [open, durationMs, onClose]);

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-4 right-4 z-50",
        "max-w-sm rounded-lg border bg-background shadow-lg",
        "p-3 flex items-start gap-3",
        className
      )}
    >
      <div className="mt-0.5">{icon ?? <span>✨</span>}</div>
      <div className="min-w-0">
        <div className="text-sm font-semibold">{title}</div>
        {message && <div className="text-sm text-muted-foreground">{message}</div>}
      </div>
      <button
        aria-label="Chiudi notifica"
        className="ml-auto text-xs text-muted-foreground hover:text-foreground"
        onClick={onClose}
      >
        Chiudi
      </button>
    </div>
  );
}
