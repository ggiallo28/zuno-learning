export function ModelExplanation({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div className="rounded-md border p-3 bg-muted/40">
      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Spiegazione modello</div>
      <p className="text-sm leading-6">{text}</p>
    </div>
  );
}
