import { Button } from "@/components/ui/button";
import { useAssessment } from "@/contexts/AssessmentContext";

export function SessionSummary({ onRestart }: { onRestart?: () => void }) {
  const { state } = useAssessment();
  const total = state.total;
  const answered = state.answered;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Sessione completata</h3>
      <p className="text-sm text-muted-foreground">
        Domande viste: {answered}/{total} · Precisione stimata: {Math.round(state.precision * 100)}%
      </p>
      <p className="text-sm">Punteggio totale: <span className="font-medium">{state.answered * 10}</span></p>
      <div className="pt-2">
        <Button onClick={onRestart}>Ricomincia</Button>
      </div>
    </div>
  );
}
