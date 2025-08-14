// src/components/course/CourseOverview.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export function CourseOverview({
  children,
  className,
  aside,
}: {
  children: React.ReactNode; // main intro paragraph(s)
  className?: string;
  aside?: React.ReactNode;   // e.g. a video or meta card in the right column
}) {
  return (
    <section className={cn("mx-auto max-w-6xl px-4 py-10", className)}>
      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="prose prose-slate max-w-none">
          {children}
        </div>
        {aside && <div>{aside}</div>}
      </div>
    </section>
  );
}
