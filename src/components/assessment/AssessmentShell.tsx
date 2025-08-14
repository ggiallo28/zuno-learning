import * as React from "react";
import { AssessmentHeader } from "./AssessmentHeader";

export function AssessmentShell({ left, main, right }: { left?: React.ReactNode; main: React.ReactNode; right?: React.ReactNode; }) {
  return (
    <div className="space-y-4">
      <AssessmentHeader />
      <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_280px] gap-4">
        {left && <aside className="hidden lg:block">{left}</aside>}
        <main>{main}</main>
        {right && <aside className="hidden lg:block">{right}</aside>}
      </div>
    </div>
  );
}
