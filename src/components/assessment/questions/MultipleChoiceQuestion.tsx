import React from 'react';
import { AssessmentItem, CoachType } from '@/types/assessment';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MultipleChoiceQuestionProps {
  item: AssessmentItem;
  answer: number | null;
  onAnswerChange: (answer: number) => void;
  disabled?: boolean;
  coachType: CoachType;
}

export function MultipleChoiceQuestion({
  item,
  answer,
  onAnswerChange,
  disabled = false,
  coachType
}: MultipleChoiceQuestionProps) {
  if (!item.options) {
    return (
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-center text-muted-foreground">
          Opzioni non disponibili per questa domanda
        </p>
      </div>
    );
  }

  // Shuffle options for anti-abuse (in real implementation, this would be done server-side)
  const shuffledOptions = React.useMemo(() => {
    return item.options?.map((option, index) => ({ option, originalIndex: index })) || [];
  }, [item.options]);

  const getCoachFeedback = (isSelected: boolean, coachType: CoachType): string => {
    if (!isSelected) return '';
    
    const feedbacks = {
      elia: '👍 Risposta selezionata - considera attentamente',
      skippy: '⚡ Selezionata!',
      lupa: '🤝 Scelta interessante, cosa ne pensano gli altri?',
      polpo: '🎯 Opzione registrata'
    };
    
    return feedbacks[coachType];
  };

  return (
    <div className="space-y-3" role="radiogroup" aria-label="Opzioni risposta">
      {shuffledOptions.map(({ option, originalIndex }, displayIndex) => {
        const isSelected = answer === originalIndex;
        
        return (
          <Button
            key={displayIndex}
            variant={isSelected ? "default" : "outline"}
            className={cn(
              "w-full text-left justify-start p-4 h-auto min-h-[3rem]",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:ring-2 focus:ring-ring focus:ring-offset-2",
              isSelected && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            onClick={() => onAnswerChange(originalIndex)}
            disabled={disabled}
            role="radio"
            aria-checked={isSelected}
            aria-describedby={isSelected ? `feedback-${displayIndex}` : undefined}
          >
            <div className="flex items-start gap-3 w-full">
              <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                {String.fromCharCode(65 + displayIndex)}
              </span>
              
              <div className="flex-1">
                <div className="text-sm">{option}</div>
                
                {isSelected && (
                  <div 
                    id={`feedback-${displayIndex}`}
                    className="text-xs mt-1 opacity-80"
                  >
                    {getCoachFeedback(isSelected, coachType)}
                  </div>
                )}
              </div>
            </div>
          </Button>
        );
      })}
      
      {answer !== null && coachType === 'elia' && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            💭 <strong>Riflessione:</strong> Sei sicuro di questa scelta? 
            Prenditi un momento per rivedere le opzioni.
          </p>
        </div>
      )}
      
      {answer !== null && coachType === 'skippy' && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800">
            ⚡ <strong>Veloce!</strong> Vai avanti quando sei pronto!
          </p>
        </div>
      )}
    </div>
  );
}