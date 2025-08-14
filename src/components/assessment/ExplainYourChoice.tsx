export function ExplainYourChoice({
  value,
  onChange,
  label = "Perché questa scelta?"
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <textarea
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded p-2 text-sm"
        placeholder="1–2 frasi"
      />
    </div>
  );
}
