
export function DailyStreakBadge({ days }: { days: number }) {
  const flame = days >= 7 ? "🔥" : "✳️";
  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm">
      <span className="text-orange-600">{flame}</span>
      <span className="font-semibold">{days} day streak</span>
    </div>
  );
}
