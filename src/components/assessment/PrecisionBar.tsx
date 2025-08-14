import { useAssessment } from "@/contexts/AssessmentContext";

export function PrecisionBar({ stopAt = 0.9 }: { stopAt?: number }) {
  const { state } = useAssessment();
  const pct = Math.round((state.precision ?? 0) * 100);

  return (
    <div aria-label="Precisione stimata" className="w-full">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
        <span>Precisione</span><span>{pct}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      {state.running && state.precision >= stopAt && (
        <p className="mt-1 text-xs text-emerald-600">Soglia raggiunta — puoi terminare con stima affidabile.</p>
      )}
    </div>
  );
}
