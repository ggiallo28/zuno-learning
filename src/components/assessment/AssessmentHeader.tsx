import { Timer } from "./Timer";
import { PrecisionBar } from "./PrecisionBar";
import { ScoreWidget } from "./ScoreWidget";

export function AssessmentHeader() {
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between" role="banner">
      <div className="w-full md:max-w-md">
        <PrecisionBar stopAt={0.9} />
      </div>
      <div className="flex items-center gap-4">
        <Timer />
        <ScoreWidget />
      </div>
    </header>
  );
}
