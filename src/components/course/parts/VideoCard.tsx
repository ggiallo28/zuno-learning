import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VideoCardProps {
  video?: { title: string; url: string };
  caption?: string;
}

export function VideoCard({ video, caption }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!video) return null;

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-[16/9] relative bg-muted">
            {!isPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <Button
                  size="lg"
                  className="rounded-full w-16 h-16 p-0"
                  onClick={handlePlayClick}
                  aria-label={`Riproduci video: ${video.title}`}
                >
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </Button>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-sm font-medium text-foreground bg-background/90 backdrop-blur-sm rounded px-3 py-2">
                    {video.title}
                  </h3>
                </div>
              </div>
            ) : (
              <iframe
                src={video.url}
                title={video.title}
                className="w-full h-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      {caption && (
        <p className="text-sm text-muted-foreground text-center italic">
          {caption}
        </p>
      )}
    </div>
  );
}