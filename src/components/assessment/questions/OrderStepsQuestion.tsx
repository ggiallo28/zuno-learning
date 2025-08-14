// React import removed - not needed with new JSX transform
import { useState } from 'react';
import { AssessmentItem, CoachType } from '@/types/assessment';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';

interface OrderStepsQuestionProps {
  item: AssessmentItem;
  answer: number[] | null;
  onAnswerChange: (answer: number[]) => void;
  disabled?: boolean;
  coachType: CoachType;
}

export function OrderStepsQuestion({ item, answer, onAnswerChange, disabled, coachType }: OrderStepsQuestionProps) {
  const [currentOrder, setCurrentOrder] = useState<number[]>(
    answer || (item.steps ? Array.from({ length: item.steps.length }, (_, i) => i) : [])
  );

  const moveStep = (fromIndex: number, toIndex: number) => {
    if (disabled || toIndex < 0 || toIndex >= currentOrder.length) return;
    
    const newOrder = [...currentOrder];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    
    setCurrentOrder(newOrder);
    onAnswerChange(newOrder);
  };

  const resetOrder = () => {
    if (disabled) return;
    const originalOrder = item.steps ? Array.from({ length: item.steps.length }, (_, i) => i) : [];
    setCurrentOrder(originalOrder);
    onAnswerChange(originalOrder);
  };

  const getCoachGuidance = () => {
    const guidance = {
      elia: "Analizza attentamente la sequenza logica di ogni passo.",
      skippy: "Trova l'ordine più efficiente! Vai veloce!",
      lupa: "Pensa a come il team eseguirebbe questi passi insieme.",
      polpo: "Adatta l'ordine al contesto specifico del problema."
    };
    return guidance[coachType];
  };

  if (!item.steps) {
    return <div className="text-muted-foreground">Nessun passo disponibile</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {getCoachGuidance()}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetOrder}
          disabled={disabled}
          className="flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </Button>
      </div>

      <div className="space-y-2">
        {currentOrder.map((stepIndex: number, position: number) => (
          <div
            key={`${stepIndex}-${position}`}
            className="flex items-center gap-2 p-3 border rounded-lg bg-background"
          >
            <Badge variant="outline" className="min-w-[2rem] text-center">
              {position + 1}
            </Badge>
            
            <div className="flex-1 text-sm">
              {item.steps?.[stepIndex] || `Step ${stepIndex + 1}`}
            </div>
            
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveStep(position, position - 1)}
                disabled={disabled || position === 0}
                className="h-6 w-6 p-0"
              >
                <ArrowUp className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveStep(position, position + 1)}
                disabled={disabled || position === currentOrder.length - 1}
                className="h-6 w-6 p-0"
              >
                <ArrowDown className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground">
        Usa le frecce per riordinare i passi nella sequenza corretta.
      </p>
    </div>
  );
}