// src/components/course/LanguagesCard.tsx

export function LanguagesCard({ languages }: { languages: string[] }) {
  return (
    <div className="rounded-xl border bg-white p-4 text-sm">
      <h3 className="font-semibold mb-3">Lingue disponibili</h3>
      <ul className="grid grid-cols-2 gap-2">
        {languages.map((l, i) => <li key={i} className="text-muted-foreground">• {l}</li>)}
      </ul>
    </div>
  );
}
