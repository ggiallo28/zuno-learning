import { cn } from "@/lib/utils";

export type CoachKind = "elia" | "skippy" | "lupa" | "polpo";

export function CoachChip({ coach, className }: { coach: CoachKind; className?: string }) {
  const label = { elia: "Elia — Focus", skippy: "Skippy — Blitz", lupa: "Lupa — Peer", polpo: "Polpo — Ibrido" }[coach];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs",
        className
      )}
      aria-label={`Coach attivo: ${label}`}
    >
      <span className="font-medium">{label}</span>
    </span>
  );
}
