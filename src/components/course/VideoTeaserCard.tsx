// src/components/course/VideoTeaserCard.tsx
import { cn } from "@/lib/utils";

export function VideoTeaserCard({
  thumbnailUrl,
  caption,
  onPlay,
  className,
}: {
  thumbnailUrl: string;
  caption?: string;
  onPlay?: () => void;
  className?: string;
}) {
  return (
    <figure className={cn("rounded-xl border bg-white overflow-hidden", className)}>
      <button
        type="button"
        className="relative w-full"
        onClick={onPlay}
        aria-label="Riproduci anteprima corso"
      >
        <img src={thumbnailUrl} alt="" className="w-full object-cover" />
        <div className="absolute inset-0 grid place-items-center">
          <div className="h-14 w-14 rounded-full bg-white/90 shadow flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </button>
      {caption && (
        <figcaption className="px-4 py-3 text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
