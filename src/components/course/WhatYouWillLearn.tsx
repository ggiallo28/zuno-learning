// src/components/course/WhatYouWillLearn.tsx
import { cn } from "@/lib/utils";

export function WhatYouWillLearn({
  items,
  title = "Cosa imparerai",
  className,
}: { items: string[]; title?: string; className?: string }) {
  return (
    <section className={cn("mx-auto max-w-6xl px-4", className)}>
      <div className="rounded-xl border bg-white">
        <div className="border-b px-5 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <ul className="space-y-2 px-6 py-5 text-sm">
          {items.map((it, i) => (
            <li key={i} className="list-disc ml-5">{it}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
