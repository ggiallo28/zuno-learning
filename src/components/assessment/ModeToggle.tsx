import { cn } from "@/lib/utils";

export function ModeToggle({
  value,
  onChange,
}: {
  value: "blitz" | "focus";
  onChange: (v: "blitz" | "focus") => void;
}) {
  return (
    <div role="radiogroup" aria-label="Modalità sessione" className="flex gap-2">
      {[
        { id: "blitz", label: "Blitz (Skippy)", desc: "Timer, ritmo rapido" },
        { id: "focus", label: "Focus (Elia)", desc: "Senza timer, calma" },
      ].map((m) => {
        const on = value === (m.id as any);
        return (
          <button
            key={m.id}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(m.id as any)}
            className={cn(
              "text-left border rounded p-3 min-w-[180px] transition",
              on ? "border-primary ring-1 ring-primary" : "hover:bg-muted"
            )}
            title={m.desc}
          >
            <div className="font-medium">{m.label}</div>
            <div className="text-xs text-muted-foreground">{m.desc}</div>
          </button>
        );
      })}
    </div>
  );
}
