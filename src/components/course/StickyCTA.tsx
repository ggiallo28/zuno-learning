// src/components/course/StickyCTA.tsx
import { Button } from "@/components/ui/button";

export function StickyCTA({
  label = "Trova un corso",
  onClick,
}: { label?: string; onClick?: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Pronto ad iniziare?</span>
        <Button size="lg" onClick={onClick}>{label}</Button>
      </div>
    </div>
  );
}
