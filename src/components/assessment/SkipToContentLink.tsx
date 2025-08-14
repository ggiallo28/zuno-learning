import { cn } from "@/lib/utils";

/**
 * Place this as the first focusable element in the page (e.g. in Layout).
 * Targets an element by id (e.g., the main MCQ card).
 */
export function SkipToContentLink({
  targetId = "main-content",
  className,
  label = "Salta al contenuto principale",
}: {
  targetId?: string;
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2",
        "focus:z-50 focus:bg-primary focus:text-primary-foreground",
        "focus:px-3 focus:py-2 focus:rounded focus:shadow",
        className
      )}
    >
      {label}
    </a>
  );
}
