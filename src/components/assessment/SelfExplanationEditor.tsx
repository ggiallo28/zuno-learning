export function SelfExplanationEditor({ value, onChange }: { value: string; onChange: (v: string) => void; }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">Spiega in 1–2 frasi il perché</label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded p-2 text-sm"
        aria-label="Spiegazione personale"
      />
    </div>
  );
}
