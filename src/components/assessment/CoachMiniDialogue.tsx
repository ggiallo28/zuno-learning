import { cn } from "@/lib/utils";

type Coach = "elia" | "skippy" | "lupa" | "polpo";

export type DialogueTurn = {
  coach: Coach;
  text: string;
  /** Optional small label like “hint”, “nota”, etc. */
  tone?: "neutral" | "hint" | "warn" | "success";
};

const COACH_THEME: Record<Coach, string> = {
  elia:  "border-blue-300 bg-blue-50 text-blue-900",
  skippy:"border-emerald-300 bg-emerald-50 text-emerald-900",
  lupa:  "border-amber-300 bg-amber-50 text-amber-900",
  polpo: "border-purple-300 bg-purple-50 text-purple-900",
};

const TONE_RING: Record<NonNullable<DialogueTurn["tone"]>, string> = {
  neutral: "",
  hint: "ring-1 ring-offset-1 ring-blue-300",
  warn: "ring-1 ring-offset-1 ring-amber-300",
  success: "ring-1 ring-offset-1 ring-emerald-300",
};

function CoachBadge({ coach }: { coach: Coach }) {
  const label =
    coach === "elia" ? "Elia" :
    coach === "skippy" ? "Skippy" :
    coach === "lupa" ? "Lupa" : "Polpo";
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] border",
      COACH_THEME[coach]
    )}>
      {label}
    </span>
  );
}

export function CoachMiniDialogue({
  turns,
  className,
  dense = true,
  onClose,
}: {
  turns: DialogueTurn[];
  className?: string;
  /** Dense = tighter spacing for inline usage */
  dense?: boolean;
  onClose?: () => void;
}) {
  if (!turns?.length) return null;

  return (
    <section
      className={cn(
        "rounded-lg border p-3 bg-muted/30",
        dense ? "space-y-2" : "space-y-3",
        className
      )}
      aria-label="Commento dei coach"
    >
      {turns.map((t, i) => (
        <div
          key={i}
          className={cn(
            "rounded-md border p-2 text-sm leading-6",
            COACH_THEME[t.coach],
            t.tone ? TONE_RING[t.tone] : ""
          )}
        >
          <div className="mb-1 flex items-center gap-2">
            <CoachBadge coach={t.coach} />
            {t.tone && (
              <span className="text-[11px] uppercase tracking-wide opacity-80">
                {t.tone}
              </span>
            )}
          </div>
          <p>{t.text}</p>
        </div>
      ))}

      {onClose && (
        <div className="pt-1">
          <button
            type="button"
            onClick={onClose}
            className="text-xs underline text-muted-foreground hover:text-foreground"
          >
            Chiudi dialogo
          </button>
        </div>
      )}
    </section>
  );
}
