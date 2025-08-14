import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAssessment } from "@/contexts/AssessmentContext";
import { ConfidencePicker } from "./ConfidencePicker";

type Props = { onSubmit: (deltaScore: number, wasCorrect: boolean) => void };

export function MCQQuestion({ onSubmit }: Props) {
  const { state, dispatch } = useAssessment();
  // For now, create a mock item since the current context doesn't have items array
  const item = {
    id: state.currentQuestionId || "mock-question",
    stem: "Sample Question",
    options: [
      { id: "a", label: "Option A" },
      { id: "b", label: "Option B" },
      { id: "c", label: "Option C" },
      { id: "d", label: "Option D" }
    ],
    correctOptionId: "a"
  };

  const choose = (id: string) => dispatch({ type: "selectOption", optionId: id });

  function scoreCBM(correct: boolean): number {
    // Simple 2-level CBM: adjust to your rubric later
    // Correct: +2 (certo) / +1 (forse); Wrong: -2 (certo) / 0 (forse)
    const c = state.confidence ?? "forse";
    if (correct) return c === "certo" ? 2 : 1;
    return c === "certo" ? -2 : 0;
  }

  function handleSubmit() {
    if (!state.selectedOptionId || !state.confidence) return;
    const correct = state.selectedOptionId === item.correctOptionId;
    const delta = scoreCBM(correct);
    onSubmit(delta, correct);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base">{item.stem}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div role="radiogroup" aria-label="Opzioni di risposta" className="grid gap-2">
          {item.options.map((o: any) => {
            const on = state.selectedOptionId === o.id;
            return (
              <button
                key={o.id}
                role="radio"
                aria-checked={on}
                onClick={() => choose(o.id)}
                className={`text-left border rounded p-3 hover:bg-muted transition ${on ? "border-primary ring-1 ring-primary" : ""}`}
              >
                {o.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <ConfidencePicker />
          <Button onClick={handleSubmit} disabled={!state.selectedOptionId || !state.confidence}>
            Conferma
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
