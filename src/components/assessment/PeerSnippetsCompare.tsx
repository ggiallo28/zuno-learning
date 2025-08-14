import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  onJudge: (bestId: string, rationale: string) => void;
};

export function PeerSnippetsCompare({ onJudge }: Props) {
  // Mock item for current context compatibility
  const item = {
    peerSnippets: [
      { id: "a", text: "Sample explanation A" },
      { id: "b", text: "Sample explanation B" }
    ]
  };
  const peers = item?.peerSnippets ?? [];
  const [choice, setChoice] = React.useState<string | null>(null);
  const [why, setWhy] = React.useState("");

  if (!item || peers.length < 2) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Quale spiegazione è migliore?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div role="radiogroup" aria-label="Seleziona la spiegazione migliore" className="grid gap-2">
          {peers.map((p: any) => {
            const on = choice === p.id;
            return (
              <button
                key={p.id}
                role="radio"
                aria-checked={on}
                onClick={() => setChoice(p.id)}
                className={`text-left border rounded p-3 hover:bg-muted ${on ? "border-primary ring-1 ring-primary" : ""}`}
              >
                {p.text}
              </button>
            );
          })}
        </div>

        <textarea
          className="w-full border rounded p-2 text-sm"
          placeholder="Spiega in 1–2 frasi il perché"
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          rows={3}
        />

        <div className="flex justify-end">
          <Button disabled={!choice} onClick={() => choice && onJudge(choice, why.trim())}>
            Invia valutazione
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
