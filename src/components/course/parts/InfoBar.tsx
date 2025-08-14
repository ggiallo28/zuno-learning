import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface InfoBarProps {
  message?: string;
  storageKey?: string;
}

export function InfoBar({ message, storageKey = "course.infoBanner.dismissed" }: InfoBarProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(storageKey);
    setIsDismissed(dismissed === 'true');
  }, [storageKey]);

  const handleDismiss = () => {
    localStorage.setItem(storageKey, 'true');
    setIsDismissed(true);
  };

  if (!message || isDismissed) return null;

  return (
    <Alert className="mx-auto max-w-6xl mb-6 border-l-4 border-l-primary">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDismiss}
          className="ml-4 h-auto p-1"
          aria-label="Chiudi avviso"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </AlertDescription>
    </Alert>
  );
}