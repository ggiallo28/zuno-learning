import { cn } from "@/lib/utils";

export function PersonalizedHelperTip({
  title = "Suggerimento",
  tip,
  variant = "neutral",
  className,
}: {
  title?: string; tip: string; variant?: "neutral"|"success"|"warn"|"danger"; className?: string;
}) {
  const theme = {
    neutral: "border-blue-200 bg-blue-50 text-blue-900",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    warn: "border-amber-200 bg-amber-50 text-amber-900",
    danger: "border-rose-200 bg-rose-50 text-rose-900",
  }[variant];
  return (
    <div className={cn("rounded-lg border px-3 py-2 text-sm", theme, className)}>
      <div className="font-semibold">{title}</div>
      <div className="text-[13px] opacity-90">{tip}</div>
    </div>
  );
}
