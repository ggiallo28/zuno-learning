// src/components/course/PrerequisitesCard.tsx

export function PrerequisitesCard({ items }: { items: string[] }) {
  return (
    <div className="rounded-xl border bg-white p-4 text-sm">
      <h3 className="font-semibold mb-3">Esperienze necessarie</h3>
      <ul className="space-y-1">
        {items.map((a, i) => <li key={i}>• {a}</li>)}
      </ul>
    </div>
  );
}
