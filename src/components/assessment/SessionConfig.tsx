import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "./ModeToggle";
import { TagSelector } from "./TagSelector";
import { useAssessment } from "@/contexts/AssessmentContext";

export function SessionConfig({
  allTags,
  onStart,
}: {
  allTags: string[];
  onStart: () => void;
}) {
  const { state, dispatch } = useAssessment();
  const [seconds, setSeconds] = React.useState<number>(180);

  const isBlitz = state.mode === "skippy"; // Blitz = Skippy, Focus = Elia
  const canStart = state.tags.length > 0 && !!state.mode;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Configura la sessione</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ModeToggle
          value={isBlitz ? "blitz" : "focus"}
          onChange={(v) =>
            dispatch({ type: "setMode", mode: v === "blitz" ? "skippy" : "elia" })
          }
        />

        <div className="space-y-2">
          <div className="text-sm font-medium">Argomenti</div>
          <TagSelector tags={allTags} />
        </div>

        {isBlitz && (
          <div className="space-y-1">
            <label className="text-sm font-medium">Timer (secondi)</label>
            <Input
              type="number"
              min={60}
              max={1800}
              value={seconds}
              onChange={(e) => setSeconds(Number(e.target.value))}
            />
          </div>
        )}

        <div className="flex justify-end">
          <Button
            disabled={!canStart}
            onClick={() => {
              dispatch({ type: "start" });
              onStart();
            }}
          >
            Inizia
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
