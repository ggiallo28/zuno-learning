// src/components/course/CourseMetaCard.tsx

export function CourseMetaCard({
  level, type, duration,
}: { level?: string; type?: string; duration?: string }) {
  return (
    <div className="rounded-xl border bg-white p-4 text-sm">
      <h3 className="font-semibold mb-3">Panoramica del corso</h3>
      <dl className="space-y-2">
        {level && (<div className="flex justify-between"><dt className="text-muted-foreground">Livello</dt><dd>{level}</dd></div>)}
        {type && (<div className="flex justify-between"><dt className="text-muted-foreground">Tipo</dt><dd>{type}</dd></div>)}
        {duration && (<div className="flex justify-between"><dt className="text-muted-foreground">Durata</dt><dd>{duration}</dd></div>)}
      </dl>
    </div>
  );
}
