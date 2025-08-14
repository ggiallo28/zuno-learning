// React import removed - not needed with new JSX transform
import { AssessmentItem, CoachType } from '@/types/assessment';
import { Checkbox } from '@/components/ui/checkbox';

interface MultipleSelectQuestionProps {
  item: AssessmentItem;
  answer: number[] | null;
  onAnswerChange: (answer: number[]) => void;
  disabled?: boolean;
  coachType: CoachType;
}

export function MultipleSelectQuestion({ item, answer, onAnswerChange, disabled }: MultipleSelectQuestionProps) {
  const selectedOptions = answer || [];
  
  const toggleOption = (index: number) => {
    const newSelection = selectedOptions.includes(index)
      ? selectedOptions.filter(i => i !== index)
      : [...selectedOptions, index];
    onAnswerChange(newSelection);
  };

  return (
    <div className="space-y-3">
      {item.options?.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Checkbox
            checked={selectedOptions.includes(index)}
            onCheckedChange={() => toggleOption(index)}
            disabled={disabled}
          />
          <label className="text-sm">{option}</label>
        </div>
      ))}
    </div>
  );
}