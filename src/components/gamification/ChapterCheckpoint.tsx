
export function ChapterCheckpoint({ title, done }: { title: string; done?: boolean }) {
  return (
    <div className={"rounded-lg border px-3 py-2 " + (done ? "bg-green-50 border-green-200" : "bg-white")}>
      <span className="text-sm font-medium">{done ? "Checkpoint raggiunto:" : "Checkpoint:"}</span>{" "}
      <span className="text-sm">{title}</span>
    </div>
  );
}
