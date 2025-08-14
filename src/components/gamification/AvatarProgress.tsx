
export function AvatarProgress({
  emoji, level, flair,
}: { emoji: string; level: number; flair?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-white p-3">
      <div className="text-3xl">{emoji}</div>
      <div className="min-w-0">
        <div className="text-sm font-semibold">Level {level}</div>
        {flair && <div className="text-xs text-muted-foreground">{flair}</div>}
      </div>
    </div>
  );
}
