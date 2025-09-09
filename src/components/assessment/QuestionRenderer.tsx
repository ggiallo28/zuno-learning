import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, Settings, Target } from 'lucide-react';
import type { AssessmentItem, CoachType } from '@/types/assessment';
import type { Confidence } from '@/contexts/AssessmentContext';

// Import question components
import { MultipleChoiceQuestion } from './questions/MultipleChoiceQuestion';
import { MultipleSelectQuestion } from './questions/MultipleSelectQuestion';
import { ClozeQuestion } from './questions/ClozeQuestion';
import { OrderStepsQuestion } from './questions/OrderStepsQuestion';
import { DebugExplainQuestion } from './questions/DebugExplainQuestion';
import { CodeRunQuestion } from './questions/CodeRunQuestion';
import { OpenTextQuestion } from './questions/OpenTextQuestion';
import { CoachSpecificAssessment } from './CoachSpecificAssessment';
import { ConfidencePicker } from './ConfidencePicker';


interface QuestionRendererProps {
  item: AssessmentItem;
  answer: any;
  onAnswerChange: (answer: any) => void;
  onSubmit: (answer: any, confidence?: 'low' | 'medium' | 'high', metadata?: any) => void;
  coachType: CoachType;
  disabled?: boolean;
  useCoachSpecificMode?: boolean;
}

export function QuestionRenderer({
  item,
  answer,
  onAnswerChange,
  onSubmit,
  coachType,
  disabled = false,
  useCoachSpecificMode = true
}: QuestionRendererProps) {
  const [showCoachMode, setShowCoachMode] = useState(useCoachSpecificMode);
  const [selectedConfidence, setSelectedConfidence] = useState<Confidence>('forse');
  
  const isAnswered = answer !== null && answer !== undefined && answer !== '';
  
  // Determine if answer is valid for submission
  const isValidAnswer = () => {
    switch (item.format) {
      case 'multiple_choice':
        return typeof answer === 'number' && answer >= 0;
      case 'multiple_select':
        return Array.isArray(answer) && answer.length > 0;
      case 'cloze':
        return typeof answer === 'string' && answer.trim().length > 0;
      case 'order_steps':
        return Array.isArray(answer) && answer.length === (item.steps?.length || 0);
      case 'debug_explain':
        return answer && typeof answer === 'object' && answer.explanation;
      case 'code_run':
        return answer && typeof answer === 'object' && answer.code;
      case 'open_text':
        return typeof answer === 'string' && answer.trim().length > 10; // Minimum length
      default:
        return false;
    }
  };

  // Get confidence level based on answer characteristics and coach type (unused in new system)
  /*
  const getConfidenceLevel = (): 'low' | 'medium' | 'high' => {
    // For code run questions, use test results
    if (item.format === 'code_run' && answer?.results) {
      const score = answer.results.score || 0;
      if (score >= 0.8) return 'high';
      if (score >= 0.5) return 'medium';
      return 'low';
    }
    
    // For other question types, use coach-specific heuristics
    switch (coachType) {
      case 'elia':
        // Elia encourages thoughtful responses
        return 'medium'; // Always medium confidence for reflective approach
      case 'skippy':
        // Skippy tends toward high confidence for quick responses
        return 'high';
      case 'lupa':
        // Lupa considers community consensus
        return 'medium';
      case 'polpo':
        // Polpo adapts based on question type
        if (item.difficulty === 'beginner') return 'high';
        if (item.difficulty === 'expert') return 'low';
        return 'medium';
      default:
        return 'medium';
    }
  };
  */

  const handleSubmit = () => {
    if (!isValidAnswer()) return;
    const confidence = mapConfidenceToLevel(selectedConfidence);
    onSubmit(answer, confidence, { selectedConfidence });
  };

  // Map Zuno confidence to standard confidence levels
  const mapConfidenceToLevel = (confidence: Confidence): 'low' | 'medium' | 'high' => {
    switch (confidence) {
      case 'certo': return 'high';
      case 'forse': return 'medium';
      default: return 'medium';
    }
  };

  const handleCoachSpecificSubmit = (answer: any, confidence: 'low' | 'medium' | 'high', metadata?: any) => {
    onSubmit(answer, confidence, metadata);
  };

  // Check if coach-specific mode should be used
  const shouldUseCoachMode = () => {
    return showCoachMode && (
      coachType === 'elia' || // Always use for Elia (deep mode)
      coachType === 'lupa' || // Always use for Lupa (collaborative mode)
      (coachType === 'skippy' && item.difficulty !== 'beginner') || // Use for Skippy on harder questions
      coachType === 'polpo' // Always use for Polpo (adaptive mode)
    );
  };

  // If using coach-specific mode, render that instead
  if (shouldUseCoachMode()) {
    return (
      <div className="space-y-4">
        {/* Mode toggle */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="flex items-center gap-1">
            <Settings className="w-3 h-3" />
            Modalità {coachType}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCoachMode(false)}
          >
            Modalità semplice
          </Button>
        </div>
        
        <CoachSpecificAssessment
          item={item}
          coachType={coachType}
          onAnswerSubmit={handleCoachSpecificSubmit}
          onCancel={() => setShowCoachMode(false)}
        />
      </div>
    );
  }

  const renderQuestion = () => {
    const commonProps = {
      item,
      answer,
      onAnswerChange,
      disabled,
      coachType
    };

    switch (item.format) {
      case 'multiple_choice':
        return <MultipleChoiceQuestion {...commonProps} />;
      case 'multiple_select':
        return <MultipleSelectQuestion {...commonProps} />;
      case 'cloze':
        return <ClozeQuestion {...commonProps} />;
      case 'order_steps':
        return <OrderStepsQuestion {...commonProps} />;
      case 'debug_explain':
        return <DebugExplainQuestion {...commonProps} />;
      case 'code_run':
        return <CodeRunQuestion {...commonProps} />;
      case 'open_text':
        return <OpenTextQuestion {...commonProps} />;
      default:
        return (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-center text-muted-foreground">
              Tipo di domanda non supportato: {item.format}
            </p>
          </div>
        );
    }
  };

  const getCoachSubmitMessage = () => {
    const messages = {
      elia: '🐘 Rifletti sulla tua risposta, poi procedi quando sei pronto',
      skippy: '🐿️ Ottimo! Andiamo avanti velocemente!',
      lupa: '🐺 Condividi la tua risposta con il gruppo',
      polpo: '🐙 Risposta adattata - procediamo intelligentemente'
    };
    return messages[coachType];
  };

  return (
    <div className="space-y-6">
      {/* Mode toggle for coach-specific features */}
      {useCoachSpecificMode && (
        <div className="flex items-center justify-between">
          <Badge variant="secondary">Modalità Standard</Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCoachMode(true)}
            className="flex items-center gap-1"
          >
            <Settings className="w-3 h-3" />
            Modalità {coachType}
          </Button>
        </div>
      )}

      {/* Question Content */}
      {renderQuestion()}
      
      {/* Confidence Selection */}
      {isAnswered && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Target className="w-4 h-4" />
            Quanto sei sicuro della tua risposta?
          </div>
          
          <ConfidencePicker
            value={selectedConfidence}
            onChange={setSelectedConfidence}
            showScoring={true}
            disabled={disabled}
          />
        </div>
      )}
      
      {/* Submit Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isAnswered && (
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Risposta fornita
            </Badge>
          )}
          
          {/* Time estimate */}
          <Badge variant="secondary">
            ~{Math.ceil(item.timeEstimateMs / 60000)} min
          </Badge>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={disabled || !isValidAnswer()}
          size="lg"
          className="flex items-center gap-2"
        >
          Conferma Risposta
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Coach-specific encouragement */}
      {isAnswered && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {getCoachSubmitMessage()}
          </p>
        </div>
      )}
      
      {/* Question metadata for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <details className="text-xs text-muted-foreground">
          <summary>Debug Info</summary>
          <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
            {JSON.stringify({ 
              id: item.id, 
              format: item.format, 
              difficulty: item.difficulty,
              topic: item.topic,
              answer,
              isValid: isValidAnswer(),
              coachMode: shouldUseCoachMode()
            }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}