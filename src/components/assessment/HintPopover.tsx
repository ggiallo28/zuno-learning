import * as React from "react";
import { Button } from "@/components/ui/button";

export function HintPopover({
  hints,
  onReveal,
}: {
  hints: string[];
  onReveal?: (index: number) => void;
}) {
  const [i, setI] = React.useState<number>(-1);
  const hasMore = i + 1 < hints.length;

  return (
    <div className="space-y-2">
      <Button size="sm" variant="outline" onClick={() => {
        const next = Math.min(i + 1, hints.length - 1);
        setI(next);
        onReveal?.(next);
      }} disabled={!hasMore}>
        {hasMore ? "Mostra hint" : "Nessun altro hint"}
      </Button>
      {i >= 0 && (
        <div className="rounded-md border p-2 bg-muted/40 text-sm">
          {hints[i]}
        </div>
      )}
    </div>
  );
}
