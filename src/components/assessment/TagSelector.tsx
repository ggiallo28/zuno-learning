import { useAssessment } from "@/contexts/AssessmentContext";
import { cn } from "@/lib/utils";

export function TagSelector({ tags, className }: { tags: string[]; className?: string }) {
  const { state, dispatch } = useAssessment();
  const selected = new Set(state.tags);

  function toggle(tag: string) {
    const arr = Array.from(selected);
    const i = arr.indexOf(tag);
    if (i >= 0) arr.splice(i, 1); else arr.push(tag);
    // Update tags one by one using toggleTag
    arr.forEach(tag => {
      if (!state.tags.includes(tag)) {
        dispatch({ type: "toggleTag", tag });
      }
    });
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="group" aria-label="Seleziona argomenti">
      {tags.map((t) => {
        const on = selected.has(t);
        return (
          <button
            key={t}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(t)}
            className={cn(
              "px-3 py-1.5 rounded-full border text-sm transition",
              on ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"
            )}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
