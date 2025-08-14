// src/components/course/AudienceCard.tsx

export function AudienceCard({ audience }: { audience: string[] }) {
  return (
    <div className="rounded-xl border bg-white p-4 text-sm">
      <h3 className="font-semibold mb-3">A chi è rivolto</h3>
      <ul className="space-y-1">
        {audience.map((a, i) => <li key={i}>• {a}</li>)}
      </ul>
    </div>
  );
}
