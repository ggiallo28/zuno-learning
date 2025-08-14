// src/components/course/CourseMetaPills.tsx

import { cn } from "@/lib/utils";

function CourseMetaPills({
  pills,
  className,
  inverted = false,
}: {
  pills: { label: string }[];
  className?: string;
  inverted?: boolean; // white-on-dark in hero
}) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {pills.map((p, i) => (
        <span
          key={i}
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border",
            inverted
              ? "border-white/40 text-white/90"
              : "border-slate-300 bg-white text-slate-800"
          )}
        >
          {p.label}
        </span>
      ))}
    </div>
  );
}

export { CourseMetaPills };
export default CourseMetaPills;
