// import React from 'react';
import { AssessmentItem, CoachType } from '@/types/assessment';
import { MultipleChoiceQuestion } from './questions/MultipleChoiceQuestion';
import { MultipleSelectQuestion } from './questions/MultipleSelectQuestion';
import { ClozeQuestion } from './questions/ClozeQuestion';
import { OrderStepsQuestion } from './questions/OrderStepsQuestion';
import { DebugExplainQuestion } from './questions/DebugExplainQuestion';
import { CodeRunQuestion } from './questions/CodeRunQuestion';
import { OpenTextQuestion } from './questions/OpenTextQuestion';

interface QuestionRendererProps {
  item: AssessmentItem;
  answer: any;
  onAnswerChange: (answer: any) => void;
  disabled?: boolean;
  coachType: CoachType;
}

export function QuestionRenderer({
  item,
  answer,
  onAnswerChange,
  disabled = false,
  coachType
}: QuestionRendererProps) {
  const commonProps = {
    answer,
    onAnswerChange,
    disabled,
    coachType
  };

  switch (item.format) {
    case 'multiple_choice':
      return (
        <MultipleChoiceQuestion
          item={item}
          {...commonProps}
        />
      );
      
    case 'multiple_select':
      return (
        <MultipleSelectQuestion
          item={item}
          {...commonProps}
        />
      );
      
    case 'cloze':
      return (
        <ClozeQuestion
          item={item}
          {...commonProps}
        />
      );
      
    case 'order_steps':
      return (
        <OrderStepsQuestion
          item={item}
          {...commonProps}
        />
      );
      
    case 'debug_explain':
      return (
        <DebugExplainQuestion
          item={item}
          {...commonProps}
        />
      );
      
    case 'code_run':
      return (
        <CodeRunQuestion
          item={item}
          {...commonProps}
        />
      );
      
    case 'open_text':
      return (
        <OpenTextQuestion
          item={item}
          {...commonProps}
        />
      );
      
    default:
      return (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-center text-muted-foreground">
            Formato domanda non supportato: {item.format}
          </p>
        </div>
      );
  }
}