import { useAssessment } from "@/contexts/AssessmentContext";

export function ScoreWidget({ lastDelta }: { lastDelta?: number }) {
  const { state } = useAssessment();
  return (
    <div className="text-sm">
      <div className="font-medium">Punteggio: {state.answered * 10}</div>
      {lastDelta != null && (
        <div className={`text-xs ${lastDelta >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
          {lastDelta >= 0 ? "+" : ""}{lastDelta} punti
        </div>
      )}
    </div>
  );
}
