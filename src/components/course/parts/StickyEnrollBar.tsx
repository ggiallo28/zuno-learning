import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StickyEnrollBarProps {
  title: string;
  level: string;
  deliveryMode: string;
  formatLabel: string;
  duration: string;
  onPrimary: () => void;
  onSecondary: () => void;
}

export function StickyEnrollBar({
  title,
  level,
  deliveryMode,
  formatLabel,
  duration,
  onPrimary,
  onSecondary
}: StickyEnrollBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 480);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t shadow-lg"
      data-testid="sticky-bar"
    >
      <div className="container max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate mb-2">
              {title}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" size="sm">{level}</Badge>
              <Badge variant="outline" size="sm">{deliveryMode}</Badge>
              <Badge variant="outline" size="sm">{formatLabel}</Badge>
              <Badge variant="outline" size="sm">{duration}</Badge>
            </div>
          </div>
          
          <div className="flex gap-3 flex-shrink-0">
            <Button 
              size="sm" 
              className="min-h-[44px] hidden sm:flex"
              onClick={onSecondary}
            >
              Corso team
            </Button>
            <Button 
              size="sm" 
              className="min-h-[44px]"
              onClick={onPrimary}
            >
              Trova corso
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}