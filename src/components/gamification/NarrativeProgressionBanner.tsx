import { cn } from "@/lib/utils";

export function NarrativeProgressionBanner({
  chapter,
  subtitle,
  className,
}: { chapter: string; subtitle?: string; className?: string }) {
  return (
    <aside
      className={cn(
        "rounded-xl border bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 shadow-sm",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="text-xs uppercase tracking-wide text-blue-700">Quest</div>
      <div className="text-sm font-semibold text-blue-900">{chapter}</div>
      {subtitle && <div className="text-xs text-blue-700/80">{subtitle}</div>}
    </aside>
  );
}
