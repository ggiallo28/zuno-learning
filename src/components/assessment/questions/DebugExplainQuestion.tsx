// React import removed - not needed with new JSX transform
import { AssessmentItem, CoachType } from '@/types/assessment';
import { Textarea } from '@/components/ui/textarea';

interface DebugExplainQuestionProps {
  item: AssessmentItem;
  answer: string | null;
  onAnswerChange: (answer: string) => void;
  disabled?: boolean;
  coachType: CoachType;
}

export function DebugExplainQuestion({ item, answer, onAnswerChange, disabled }: DebugExplainQuestionProps) {
  return (
    <div className="space-y-4">
      <div className="bg-muted p-3 rounded font-mono text-sm">
        <pre>{item.buggyCode}</pre>
      </div>
      <Textarea
        value={answer || ''}
        onChange={(e) => onAnswerChange(e.target.value)}
        disabled={disabled}
        placeholder="Spiega il bug e come risolverlo..."
        className="min-h-[100px]"
      />
    </div>
  );
}