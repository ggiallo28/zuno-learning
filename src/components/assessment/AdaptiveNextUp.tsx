

export function AdaptiveNextUp({
  topic,
  reason,
}: {
  topic?: string;
  reason?: string; // e.g. "Massima informatività vicino al tuo livello stimato"
}) {
  if (!topic && !reason) return null;
  return (
    <div className="rounded-md border p-3 bg-muted/40">
      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Prossimo</div>
      {topic && <div className="text-sm"><span className="font-medium">Argomento:</span> {topic}</div>}
      {reason && <div className="text-xs text-muted-foreground mt-1">{reason}</div>}
    </div>
  );
}
