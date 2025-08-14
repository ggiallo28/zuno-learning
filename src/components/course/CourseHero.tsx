// src/components/course/CourseHero.tsx
import { cn } from "@/lib/utils";
import { CourseMetaPills } from "./CourseMetaPills";
import { CourseCTAGroup } from "./CourseCTAGroup";

type Pill = { label: string };

export interface CourseHeroProps {
  title: string;
  subtitle?: string;
  pills?: Pill[];
  imageUrl?: string; // optional decorative bg
  onPrimary?: () => void;
  onSecondary?: () => void;
  onTertiary?: () => void;
}

export function CourseHero({
  title, subtitle, pills = [],
  imageUrl,
  onPrimary, onSecondary, onTertiary,
}: CourseHeroProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        "bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white"
      )}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
        />
      )}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {pills.length > 0 && <CourseMetaPills pills={pills} className="mb-6" inverted />}
        <h1 className="text-3xl sm:text-5xl font-bold">{title}</h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-slate-200 text-lg">{subtitle}</p>
        )}
        <CourseCTAGroup
          className="mt-8"
          onPrimary={onPrimary}
          onSecondary={onSecondary}
          onTertiary={onTertiary}
        />
      </div>
    </section>
  );
}
