import { useState, useEffect } from "react";
import { Crown } from "lucide-react";

interface MascotCharacterProps {
  message?: string;
  mood?: "happy" | "encouraging" | "congratulating" | "thinking";
  showMessage?: boolean;
  className?: string;
}

const mascotMessages = {
  happy: [
    "Ready to learn something amazing today?",
    "You're doing great! Keep it up!",
    "Learning is an adventure - let's explore!",
  ],
  encouraging: [
    "Don't give up! You've got this!",
    "Every expert was once a beginner.",
    "Progress, not perfection!",
  ],
  congratulating: [
    "Fantastic work! You nailed it!",
    "Brilliant! You're on fire today!",
    "Amazing progress! I'm proud of you!",
  ],
  thinking: [
    "Hmm, let me think about this...",
    "That's an interesting question!",
    "Great thinking! Let's explore this together.",
  ],
};

export function MascotCharacter({ 
  message, 
  mood = "happy", 
  showMessage = true,
  className = "" 
}: MascotCharacterProps) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
    } else {
      const messages = mascotMessages[mood];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setCurrentMessage(randomMessage);
    }
    
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [message, mood]);

  return (
    <div className={`relative ${className}`}>
      {/* Mascot Icon - Using Crown as Zuno Manager */}
      <div className={`relative transition-transform duration-300 ${isAnimating ? 'animate-bounce' : ''}`}>
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
          <Crown className="w-12 h-12 text-white" />
        </div>
        
        {/* Mood Indicator - Subtle glow effect */}
        <div className={`absolute inset-0 rounded-full opacity-20 animate-pulse ${
          mood === 'happy' ? 'bg-blue-500' :
          mood === 'encouraging' ? 'bg-yellow-500' :
          mood === 'congratulating' ? 'bg-green-500' :
          'bg-purple-500'
        }`} />
      </div>

      {/* Speech Bubble */}
      {showMessage && currentMessage && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 max-w-xs animate-in slide-in-from-bottom-2">
          <div className="bg-card border border-border rounded-xl p-3 shadow-lg relative">
            <p className="text-sm text-card-foreground text-center font-medium">
              {currentMessage}
            </p>
            
            {/* Speech bubble tail */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="border-l-8 border-r-8 border-t-8 border-transparent border-t-card" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}