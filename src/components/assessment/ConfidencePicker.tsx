import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAssessment, Confidence } from "@/contexts/AssessmentContext";
import { cn } from '@/lib/utils';

interface ConfidenceLevel {
  id: Confidence;
  label: string;
  description: string;
  pointsCorrect: number;
  pointsIncorrect: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

const confidenceLevels: ConfidenceLevel[] = [
  {
    id: "certo",
    label: "Certo",
    description: "Sono sicuro della mia risposta",
    pointsCorrect: 150, // 50% bonus points
    pointsIncorrect: -50, // Higher penalty
    icon: <CheckCircle className="w-4 h-4" />,
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  {
    id: "forse",
    label: "Forse",
    description: "Non sono completamente sicuro",
    pointsCorrect: 100, // Standard points
    pointsIncorrect: -20, // Lower penalty
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200"
  }
];

interface ConfidencePickerProps {
  value?: Confidence;
  onChange?: (confidence: Confidence) => void;
  showScoring?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ConfidencePicker({ 
  value, 
  onChange, 
  showScoring = true, 
  disabled = false,
  className 
}: ConfidencePickerProps) {
  const { state, dispatch } = useAssessment();
  const [selectedConfidence, setSelectedConfidence] = useState<Confidence | null>(
    value || state.confidence || null
  );

  // Update local state when external value changes
  useEffect(() => {
    if (value && value !== selectedConfidence) {
      setSelectedConfidence(value);
    }
  }, [value, selectedConfidence]);

  const handleConfidenceSelect = (confidence: Confidence) => {
    setSelectedConfidence(confidence);
    
    if (onChange) {
      onChange(confidence);
    } else {
      dispatch({ type: "setConfidence", value: confidence });
    }
  };

  const getScorePreview = (level: ConfidenceLevel) => {
    return (
      <div className="flex items-center justify-between text-xs mt-2">
        <div className="flex items-center gap-1 text-green-600">
          <TrendingUp className="w-3 h-3" />
          <span>+{level.pointsCorrect} se corretto</span>
        </div>
        <div className="flex items-center gap-1 text-red-600">
          <TrendingDown className="w-3 h-3" />
          <span>{level.pointsIncorrect} se sbagliato</span>
        </div>
      </div>
    );
  };

  const selectedLevel = confidenceLevels.find(l => l.id === selectedConfidence);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Confidence Selection */}
      <div role="radiogroup" aria-label="Seleziona il tuo livello di confidenza">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {confidenceLevels.map((level) => {
            const isSelected = selectedConfidence === level.id;
            
            return (
              <Card
                key={level.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  isSelected && "ring-2 ring-primary ring-offset-2",
                  level.borderColor,
                  disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !disabled && handleConfidenceSelect(level.id)}
              >
                <CardContent className={cn("p-4", level.bgColor)}>
                  <div className="flex items-start gap-3">
                    <div className={cn("p-2 rounded-full", level.bgColor, level.borderColor, "border")}>
                      <div className={level.color}>
                        {level.icon}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={cn("font-medium", level.color)}>
                          {level.label}
                        </h4>
                        {isSelected && (
                          <Badge variant="default" className="text-xs">
                            Selezionato
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {level.description}
                      </p>
                      
                      {showScoring && getScorePreview(level)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Selected Confidence Summary */}
      {selectedLevel && (
        <Card className={cn("border-2", selectedLevel.borderColor)}>
          <CardContent className={cn("p-4", selectedLevel.bgColor)}>
            <div className="flex items-center gap-3">
              <div className={selectedLevel.color}>
                {selectedLevel.icon}
              </div>
              <div className="flex-1">
                <h4 className={cn("font-medium", selectedLevel.color)}>
                  Confidenza selezionata: {selectedLevel.label}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {selectedLevel.description}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Sistema di punteggio attivo</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scoring Explanation */}
      {showScoring && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Come funziona il punteggio
            </h4>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span><strong>Certo:</strong> Più punti se corretto (+150), ma penalità maggiore se sbagliato (-50)</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3 h-3 text-yellow-600" />
                <span><strong>Forse:</strong> Punti standard se corretto (+100), penalità ridotta se sbagliato (-20)</span>
              </div>
            </div>
            <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-800">
              💡 <strong>Suggerimento:</strong> Scegli "Certo" solo quando sei davvero sicuro per massimizzare i punti!
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
