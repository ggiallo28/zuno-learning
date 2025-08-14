
import { Card } from "@/components/ui/card";

export type Snippet = { id: string; text: string; author?: string; topic?: string };

export function CommunitySnippetFeed({ items, onPick }: { items: Snippet[]; onPick?: (id: string) => void; }) {
  if (!items?.length) return null;
  return (
    <div className="space-y-2">
      {items.map(s => (
        <Card
          key={s.id}
          className="p-3 cursor-pointer hover:bg-muted/40"
          onClick={() => onPick?.(s.id)}
          aria-label={`Spiegazione su ${s.topic ?? "argomento"}`}
        >
          <div className="text-sm leading-6">{s.text}</div>
          {s.author && <div className="text-xs text-muted-foreground mt-1">di {s.author}</div>}
        </Card>
      ))}
    </div>
  );
}
