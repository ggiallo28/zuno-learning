import { cn } from "@/lib/utils";

export function QuestionSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border p-4 space-y-3 animate-pulse", className)}>
      <div className="h-4 w-2/3 bg-muted rounded" />
      <div className="h-4 w-1/2 bg-muted rounded" />
      <div className="space-y-2 pt-2">
        <div className="h-10 w-full bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded" />
      </div>
    </div>
  );
}
