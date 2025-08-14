import { Button } from "@/components/ui/button";

export function PauseResumeControls({
  isPaused,
  onPause,
  onResume,
  onReset,
}: {
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onReset?: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {isPaused ? (
        <Button size="sm" onClick={onResume} aria-pressed={!isPaused} aria-label="Riprendi timer">
          Riprendi
        </Button>
      ) : (
        <Button size="sm" variant="outline" onClick={onPause} aria-pressed={isPaused} aria-label="Metti in pausa">
          Pausa
        </Button>
      )}
      {onReset && (
        <Button size="sm" variant="ghost" onClick={onReset} aria-label="Azzera timer">
          Reset
        </Button>
      )}
    </div>
  );
}
