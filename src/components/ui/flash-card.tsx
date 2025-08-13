// src/components/ui/flash-card.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, type CardProps } from "@/components/ui/card";
import { HiRefresh } from "react-icons/hi";
import { CornerUpLeft } from "lucide-react";

export interface FlashCardProps extends Omit<CardProps, "children"> {
  front: React.ReactNode;
  back: React.ReactNode;
  axis?: "x" | "y";
  durationMs?: number;
  initiallyFlipped?: boolean;
  /** Use a FIXED height on desktop (e.g. h-[170px]) and min height on mobile if you want */
  heightClassName?: string;
  showHint?: boolean;
}

const FlashCardInner = (
  {
    front,
    back,
    axis = "y",
    durationMs = 500,
    initiallyFlipped = false,
    heightClassName = "h-[170px]",
    showHint = true,
    className,
    ...rest
  }: FlashCardProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const [flipped, setFlipped] = React.useState(initiallyFlipped);

  // --- measure for MOBILE only (so front/back fit nicely on small screens) ---
  const measureFrontRef = React.useRef<HTMLDivElement>(null);
  const measureBackRef = React.useRef<HTMLDivElement>(null);
  const [measuredHeight, setMeasuredHeight] = React.useState<number | null>(null);
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  React.useLayoutEffect(() => {
    if (isDesktop) return; // <-- no auto-height on desktop
    const frontEl = measureFrontRef.current;
    const backEl = measureBackRef.current;
    if (!frontEl || !backEl) return;

    const measureNow = () => {
      const hFront = frontEl.offsetHeight || 0;
      const hBack = backEl.offsetHeight || 0;
      setMeasuredHeight(Math.max(hFront, hBack));
    };

    measureNow();
    const RO = (window as any).ResizeObserver;
    const ro = RO ? new RO(measureNow) : null;
    ro?.observe(frontEl);
    ro?.observe(backEl);
    window.addEventListener("resize", measureNow);
    return () => {
      ro?.disconnect?.();
      window.removeEventListener("resize", measureNow);
    };
  }, [front, back, isDesktop]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setFlipped((v) => !v);
    }
  };

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const effectiveDuration = prefersReduced ? 0 : durationMs;

  return (
    <div
      ref={ref}
      className={cn("relative w-full", heightClassName, className)}
      style={{
        perspective: "1200px",
        // MOBILE: grow to fit; DESKTOP: keep fixed class height
        height: !isDesktop && measuredHeight ? `${measuredHeight}px` : undefined,
      }}
      {...rest}
    >
      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        onClick={() => setFlipped((v) => !v)}
        onKeyDown={onKeyDown}
        className="relative h-full w-full cursor-pointer select-none outline-none group"
        style={{
          transformStyle: "preserve-3d",
          transitionProperty: "transform",
          transitionTimingFunction: "cubic-bezier(0.2,0.6,0.2,1)",
          transitionDuration: `${effectiveDuration}ms`,
          transform: flipped
            ? axis === "x"
              ? "rotateX(180deg)"
              : "rotateY(180deg)"
            : "none",
        }}
      >
        {/* FRONT (no scrollbar) */}
        <Card className="absolute inset-0 h-full w-full [backface-visibility:hidden] shadow-sm overflow-hidden">
          <div className="relative h-full">
            {front}
            {showHint && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[11px] text-muted-foreground opacity-80 group-hover:opacity-100 transition-opacity">
                <HiRefresh className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                <span>Gira</span>
              </div>
            )}
          </div>
        </Card>

        {/* BACK (allow text scroll only) */}
        <Card
          className={cn(
            "absolute inset-0 h-full w-full [backface-visibility:hidden] shadow-sm overflow-hidden",
            axis === "x" ? "[transform:rotateX(180deg)]" : "[transform:rotateY(180deg)]"
          )}
        >
          <div className="relative h-full">
            <button
              type="button"
              className="absolute top-2 right-2 p-1 text-muted-foreground/80 hover:text-foreground transition-colors bg-transparent border-0"
              aria-label="Torna al fronte"
              onClick={(e) => {
                e.stopPropagation();
                setFlipped(false);
              }}
            >
              <CornerUpLeft className="w-4 h-4" />
            </button>
            {back}
          </div>
        </Card>
      </div>

      {/* invisible measurers (for mobile only sizing) */}
      <div className="invisible pointer-events-none overflow-hidden">
        <div ref={measureFrontRef} className="w-full">{front}</div>
        <div ref={measureBackRef} className="w-full">{back}</div>
      </div>
    </div>
  );
};

export const FlashCard = React.forwardRef<HTMLDivElement, FlashCardProps>(FlashCardInner);
FlashCard.displayName = "FlashCard";