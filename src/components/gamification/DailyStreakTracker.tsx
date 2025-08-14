
export function DailyStreakTracker({
  currentStreak, longestStreak,
}: { currentStreak: number; longestStreak: number }) {
  return (
    <div className="rounded-lg border p-3 bg-white">
      <div className="text-sm font-semibold">Streak</div>
      <div className="mt-1 text-sm text-muted-foreground">
        Corrente: <b>{currentStreak}</b> — Record: <b>{longestStreak}</b>
      </div>
    </div>
  );
}
