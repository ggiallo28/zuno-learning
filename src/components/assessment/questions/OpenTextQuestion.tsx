// React import removed - not needed with new JSX transform
import { AssessmentItem, CoachType } from '@/types/assessment';
import { Textarea } from '@/components/ui/textarea';

interface OpenTextQuestionProps {
  item: AssessmentItem;
  answer: string | null;
  onAnswerChange: (answer: string) => void;
  disabled?: boolean;
  coachType: CoachType;
}

export function OpenTextQuestion({ item, answer, onAnswerChange, disabled, coachType }: OpenTextQuestionProps) {
  const getPlaceholder = () => {
    const placeholders = {
      elia: "Analizza attentamente e scrivi una risposta dettagliata...",
      skippy: "Vai dritto al punto! Cosa pensi?",
      lupa: "Condividi la tua prospettiva con il gruppo...",
      polpo: "Adatta la tua risposta al contesto..."
    };
    return placeholders[coachType] || "Scrivi la tua risposta dettagliata...";
  };

  return (
    <div className="space-y-4">
      {(item as any).context && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">{(item as any).context}</p>
        </div>
      )}
      
      <Textarea
        value={answer || ''}
        onChange={(e) => onAnswerChange(e.target.value)}
        disabled={disabled}
        placeholder={getPlaceholder()}
        className="min-h-[150px]"
      />
      
      {(item as any).wordLimit && (
        <p className="text-xs text-muted-foreground">
          Limite parole: {(item as any).wordLimit} (attuale: {(answer || '').split(/\s+/).filter(w => w.length > 0).length})
        </p>
      )}
    </div>
  );
}