import { Button } from "@/components/ui/button";

export type ReviewItem = {
  id: string;
  title: string;         // breve descrizione/stem
  dueAt: Date;           // quando ripassare (24h/7gg/30gg, ecc.)
};

export function ReviewQueue({
  items,
  onPractice,
}: {
  items: ReviewItem[];
  onPractice: (id: string) => void;
}) {
  if (!items?.length) return null;

  return (
    <div className="rounded-md border p-3">
      <div className="text-sm font-semibold mb-2">Revanche programmata</div>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.id} className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm truncate">{it.title}</div>
              <div className="text-xs text-muted-foreground">
                Scadenza: {it.dueAt.toLocaleDateString()} {it.dueAt.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
              </div>
            </div>
            <Button size="sm" onClick={() => onPractice(it.id)}>Riprova</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
