import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import { ConfidenceLevel } from '@/types/assessment';
import { Confidence } from '@/contexts/AssessmentContext';
import { cn } from '@/lib/utils';

interface ConfidenceSliderProps {
  value: ConfidenceLevel | Confidence;
  onChange: (value: ConfidenceLevel | Confidence) => void;
  disabled?: boolean;
  showScoring?: boolean;
  useZunoSystem?: boolean; // Use Certo/Forse system
  className?: string;
}

// Mapping for traditional confidence levels
const traditionalConfidenceMap: Record<number, ConfidenceLevel> = {
  0: 'low',
  1: 'medium', 
  2: 'high'
};

// Mapping for Zuno confidence system
const zunoConfidenceMap: Record<number, Confidence> = {
  0: 'forse',
  1: 'certo'
};

const traditionalLabels = {
  low: 'Bassa certezza',
  medium: 'Media certezza',
  high: 'Alta certezza'
};

const zunoLabels: Partial<Record<Confidence, string>> = {
  forse: 'Forse - Non completamente sicuro',
  certo: 'Certo - Sicuro della risposta'
};

const getScoreInfo = (confidence: Confidence) => {
  const scores: Partial<Record<Confidence, { correct: number; incorrect: number; description: string }>> = {
    certo: { correct: 150, incorrect: -50, description: 'Alto rischio, alta ricompensa' },
    forse: { correct: 100, incorrect: -20, description: 'Rischio moderato, ricompensa standard' }
  };
  return scores[confidence] || scores.forse || { correct: 100, incorrect: -20, description: 'Standard' };
};

export function ConfidenceSlider({ 
  value, 
  onChange, 
  disabled = false, 
  showScoring = true,
  useZunoSystem = true,
  className 
}: ConfidenceSliderProps) {
  const [sliderValue, setSliderValue] = useState<number>(0);
  
  // Initialize slider value based on current confidence
  useEffect(() => {
    if (useZunoSystem) {
      const zunoValue = Object.entries(zunoConfidenceMap).find(([_, conf]) => conf === value)?.[0];
      setSliderValue(parseInt(zunoValue || '0'));
    } else {
      const traditionalValue = Object.entries(traditionalConfidenceMap).find(([_, conf]) => conf === value)?.[0];
      setSliderValue(parseInt(traditionalValue || '1'));
    }
  }, [value, useZunoSystem]);

  const handleSliderChange = (values: number[]) => {
    const newValue = values[0];
    setSliderValue(newValue);
    
    if (useZunoSystem) {
      onChange(zunoConfidenceMap[newValue]);
    } else {
      onChange(traditionalConfidenceMap[newValue]);
    }
  };

  const getCurrentLabel = () => {
    if (useZunoSystem) {
      return zunoLabels[value as Confidence] || zunoLabels.forse;
    } else {
      return traditionalLabels[value as ConfidenceLevel] || traditionalLabels.medium;
    }
  };

  const getConfidencePercentage = () => {
    if (useZunoSystem) {
      return sliderValue === 0 ? 60 : 90; // Forse = 60%, Certo = 90%
    } else {
      return (sliderValue + 1) * 33.33; // Low = 33%, Medium = 66%, High = 100%
    }
  };

  const currentScoreInfo = useZunoSystem ? getScoreInfo(value as Confidence) : null;

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <Label className="text-lg font-medium flex items-center justify-center gap-2">
            <Target className="w-5 h-5" />
            Quanto sei sicuro della tua risposta?
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            {useZunoSystem 
              ? 'Il tuo livello di confidenza influenza il punteggio'
              : 'Indica il tuo livello di certezza'
            }
          </p>
        </div>

        {/* Confidence Visualization */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Livello di confidenza</span>
            <Badge variant={sliderValue === (useZunoSystem ? 1 : 2) ? "default" : "secondary"}>
              {Math.round(getConfidencePercentage())}%
            </Badge>
          </div>
          
          <Progress 
            value={getConfidencePercentage()} 
            className={cn(
              "h-3",
              sliderValue === (useZunoSystem ? 1 : 2) && "bg-green-100"
            )}
          />
        </div>

        {/* Slider */}
        <div className="px-4">
          <Slider
            value={[sliderValue]}
            onValueChange={handleSliderChange}
            max={useZunoSystem ? 1 : 2}
            min={0}
            step={1}
            disabled={disabled}
            className="w-full"
          />
          
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            {useZunoSystem ? (
              <>
                <span>Forse</span>
                <span>Certo</span>
              </>
            ) : (
              <>
                <span>Bassa</span>
                <span>Media</span>
                <span>Alta</span>
              </>
            )}
          </div>
        </div>

        {/* Current Selection */}
        <div className={cn(
          "p-4 rounded-lg border text-center",
          sliderValue === (useZunoSystem ? 1 : 2) 
            ? "bg-green-50 border-green-200" 
            : "bg-yellow-50 border-yellow-200"
        )}>
          <p className="font-medium text-sm">
            {getCurrentLabel()}
          </p>
        </div>

        {/* Scoring Information (Zuno System) */}
        {useZunoSystem && showScoring && currentScoreInfo && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Impatto sul punteggio
              </h4>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-green-700">
                  <TrendingUp className="w-4 h-4" />
                  <div>
                    <div className="font-medium">Se corretto</div>
                    <div>+{currentScoreInfo.correct} punti</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-red-700">
                  <TrendingDown className="w-4 h-4" />
                  <div>
                    <div className="font-medium">Se sbagliato</div>
                    <div>{currentScoreInfo.incorrect} punti</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-800">
                💡 {currentScoreInfo.description}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Traditional System Info */}
        {!useZunoSystem && showScoring && (
          <div className="text-center text-sm text-muted-foreground">
            La tua confidenza aiuta il sistema a personalizzare le prossime domande
          </div>
        )}
      </CardContent>
    </Card>
  );
}