// React import removed - not needed with new JSX transform
import { AssessmentItem, CoachType } from '@/types/assessment';
import { Input } from '@/components/ui/input';

interface ClozeQuestionProps {
  item: AssessmentItem;
  answer: string | null;
  onAnswerChange: (answer: string) => void;
  disabled?: boolean;
  coachType: CoachType;
}

export function ClozeQuestion({ item, answer, onAnswerChange, disabled }: ClozeQuestionProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm">{item.clozeTemplate?.replace('___', '_____')}</p>
      <Input
        value={answer || ''}
        onChange={(e) => onAnswerChange(e.target.value)}
        disabled={disabled}
        placeholder="Inserisci la risposta..."
      />
    </div>
  );
}