
export function PointsCounter({ points }: { points: number }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm">
      <span className="text-yellow-600">★</span>
      <span className="font-semibold">{points}</span>
      <span className="text-muted-foreground">XP</span>
    </div>
  );
}
