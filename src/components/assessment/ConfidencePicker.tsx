import { useAssessment, Confidence } from "@/contexts/AssessmentContext";

const levels: { id: Confidence; label: string; help: string }[] = [
  { id: "certo", label: "Certo", help: "Punti extra se giusto, penalità maggiore se sbagli." },
  { id: "forse", label: "Forse", help: "Punti ridotti, rischio minore." },
];

export function ConfidencePicker() {
  const { state, dispatch } = useAssessment();

  return (
    <div role="radiogroup" aria-label="Livello di confidenza" className="flex gap-2">
      {levels.map(l => {
        const on = state.confidence === l.id;
        return (
          <button
            key={l.id}
            role="radio"
            aria-checked={on}
            type="button"
            onClick={() => dispatch({ type: "setConfidence", value: l.id })}
            className={`px-3 py-1.5 rounded border text-sm ${on ? "bg-primary text-primary-foreground border-primary" : "bg-card"}`}
            title={l.help}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
