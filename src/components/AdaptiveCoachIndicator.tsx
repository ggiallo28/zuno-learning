
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Zap, Users, Shuffle, TrendingUp } from 'lucide-react';
import { useCoach } from '@/contexts/CoachContext';

interface AdaptiveCoachIndicatorProps {
  showHistory?: boolean;
  compact?: boolean;
}

const modeIcons = {
  deep: Brain,
  fast: Zap,
  collaborative: Users,
  balanced: Shuffle
};

const modeDescriptions = {
  deep: 'Apprendimento metodico e approfondito',
  fast: 'Esplorazione rapida e dinamica',
  collaborative: 'Apprendimento sociale e collaborativo',
  balanced: 'Approccio equilibrato e adattivo'
};

const modeColors = {
  deep: '#8B7355',
  fast: '#E67E22',
  collaborative: '#2C3E50',
  balanced: '#008080'
};

export function AdaptiveCoachIndicator({ showHistory = false, compact = false }: AdaptiveCoachIndicatorProps) {
  const { currentCoach, adaptiveState } = useCoach();

  if (currentCoach !== 'polpo' || !adaptiveState) {
    return null;
  }

  const currentMode = adaptiveState.currentMode;
  const ModeIcon = modeIcons[currentMode];
  const modeColor = modeColors[currentMode];

  if (compact) {
    return (
      <Badge 
        variant="secondary" 
        className="flex items-center gap-1 text-xs"
        style={{ 
          backgroundColor: modeColor + '20',
          color: modeColor,
          borderColor: modeColor + '40'
        }}
      >
        <ModeIcon className="h-3 w-3" />
        {currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}
      </Badge>
    );
  }

  return (
    <Card className="border-l-4" style={{ borderLeftColor: modeColor }}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: modeColor + '20' }}
          >
            <ModeIcon className="h-4 w-4" style={{ color: modeColor }} />
          </div>
          <div>
            <h4 className="font-semibold text-sm">
              Modalità {currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}
            </h4>
            <p className="text-xs text-muted-foreground">
              {modeDescriptions[currentMode]}
            </p>
          </div>
        </div>

        {showHistory && adaptiveState.adaptationHistory.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Adattamenti Recenti
              </span>
            </div>
            <div className="space-y-1">
              {adaptiveState.adaptationHistory.slice(-3).map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {entry.mode} • {entry.trigger.replace(/_/g, ' ')}
                  </span>
                  <span className="text-muted-foreground">
                    {entry.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AdaptiveCoachIndicator;