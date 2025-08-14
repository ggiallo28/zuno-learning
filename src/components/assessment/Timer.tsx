import { useAssessment } from "@/contexts/AssessmentContext";

export function Timer({ className }: { className?: string }) {
  const { state } = useAssessment();
  if (state.timeLimitSec == null) return null;
  const remaining = Math.max(0, state.timeLimitSec - state.elapsedSec);
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  return <div className={className} aria-live="polite">⏱ {m}:{s.toString().padStart(2, "0")}</div>;
}
