import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Users, 
  Zap, 
  MessageSquare, 
  Lightbulb,
  Timer as TimerIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AssessmentItem, CoachType } from '@/types/assessment';

// Import existing components
import { QuestionRenderer } from './QuestionRenderer';
import { ModelExplanation } from './ModelExplanation';
import { Timer } from './Timer';
import { PeerSnippetsCompare } from './PeerSnippetsCompare';

interface CoachSpecificAssessmentProps {
  item: AssessmentItem;
  coachType: CoachType;
  onAnswerSubmit: (answer: any, confidence: 'low' | 'medium' | 'high', metadata?: any) => void;
  onCancel: () => void;
}

type PhaseType = 'question' | 'explanation' | 'peer_review' | 'model_explanation' | 'reflection';

interface AssessmentPhase {
  phase: PhaseType;
  data?: any;
}

interface CoachConfig {
  name: string;
  emoji: string;
  mode: string;
  hasTimer: boolean;
  timerPerQuestion?: number;
  globalTimer?: number;
  requiresExplanation?: boolean;
  requiresReflection?: boolean;
  requiresPeerReview?: boolean;
  adaptivePhases?: boolean;
  confidenceLevels: string[];
  phases: PhaseType[];
  description: string;
}

export function CoachSpecificAssessment({
  item,
  coachType,
  onAnswerSubmit,
  onCancel
}: CoachSpecificAssessmentProps) {
  const [currentPhase, setCurrentPhase] = useState<AssessmentPhase>({ phase: 'question' });
  const [answer, setAnswer] = useState<any>(null);
  const [personalExplanation, setPersonalExplanation] = useState<string>('');
  const [peerJudgment, setPeerJudgment] = useState<{ bestId: string; rationale: string } | null>(null);
  const [reflectionNotes, setReflectionNotes] = useState<string>('');
  const [startTime] = useState<number>(Date.now());
  const [phaseStartTime, setPhaseStartTime] = useState<number>(Date.now());
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});

  // Coach-specific configuration
  const getCoachConfig = useCallback((): CoachConfig => {
    const configs: Record<CoachType, CoachConfig> = {
      elia: {
        name: 'Elia (Elefante)',
        emoji: '🐘',
        mode: 'deep_reflective',
        hasTimer: false,
        requiresExplanation: true,
        requiresReflection: true,
        confidenceLevels: ['Certo', 'Forse'],
        phases: ['question', 'reflection', 'model_explanation'],
        description: 'Modalità riflessiva con spiegazioni dettagliate'
      },
      skippy: {
        name: 'Skippy (Scoiattolo)',
        emoji: '🐿️',
        mode: 'fast_timed',
        hasTimer: true,
        timerPerQuestion: 60, // seconds
        globalTimer: 300, // 5 minutes total
        requiresExplanation: false,
        requiresReflection: false,
        confidenceLevels: ['Alto', 'Medio', 'Basso'],
        phases: ['question'],
        description: 'Modalità veloce con timer e feedback immediato'
      },
      lupa: {
        name: 'Lupa (Lupo)',
        emoji: '🐺',
        mode: 'collaborative',
        hasTimer: false,
        requiresExplanation: true,
        requiresPeerReview: true,
        confidenceLevels: ['Sicuro', 'Incerto'],
        phases: ['question', 'explanation', 'peer_review', 'model_explanation'],
        description: 'Modalità collaborativa con revisione tra pari'
      },
      polpo: {
        name: 'Polpo (Polipo)',
        emoji: '🐙',
        mode: 'adaptive_hybrid',
        hasTimer: false,
        requiresExplanation: false,
        requiresReflection: false,
        adaptivePhases: true,
        confidenceLevels: ['Ottimo', 'Buono', 'Migliorabile'],
        phases: ['question'], // Will adapt based on performance
        description: 'Modalità adattiva che combina approcci dinamicamente'
      }
    };
    return configs[coachType];
  }, [coachType]);

  const config = getCoachConfig();

  // Track time spent in each phase
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => ({
        ...prev,
        [currentPhase.phase]: (prev[currentPhase.phase] || 0) + 1000
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPhase.phase, phaseStartTime]);

  // Handle phase transitions
  const moveToNextPhase = useCallback(() => {
    const currentIndex = config.phases.indexOf(currentPhase.phase);
    
    // For Polpo (adaptive), decide next phase based on performance
    if (coachType === 'polpo' && config.adaptivePhases) {
      // Adaptive logic for Polpo
      if (currentPhase.phase === 'question') {
        // If answer was quick and confident, skip to model explanation
        const responseTime = Date.now() - phaseStartTime;
        if (responseTime < 30000 && answer) { // Less than 30 seconds
          setCurrentPhase({ phase: 'model_explanation' });
        } else {
          setCurrentPhase({ phase: 'reflection' });
        }
      } else if (currentPhase.phase === 'reflection') {
        setCurrentPhase({ phase: 'model_explanation' });
      } else {
        completeAssessment();
      }
      return;
    }

    // Standard phase progression for other coaches
    if (currentIndex < config.phases.length - 1) {
      const nextPhase = config.phases[currentIndex + 1] as PhaseType;
      setCurrentPhase({ phase: nextPhase });
      setPhaseStartTime(Date.now());
    } else {
      completeAssessment();
    }
  }, [config.phases, currentPhase.phase, coachType, phaseStartTime, answer]);

  // Complete the assessment
  const completeAssessment = useCallback(() => {
    const totalTime = Date.now() - startTime;
    const confidence = determineConfidence();
    
    const metadata = {
      coachType,
      phases: Object.keys(timeSpent),
      timeSpentPerPhase: timeSpent,
      totalTime,
      personalExplanation: personalExplanation || undefined,
      peerJudgment: peerJudgment || undefined,
      reflectionNotes: reflectionNotes || undefined
    };

    onAnswerSubmit(answer, confidence, metadata);
  }, [startTime, timeSpent, coachType, answer, personalExplanation, peerJudgment, reflectionNotes, onAnswerSubmit]);

  // Determine confidence based on coach type and user behavior
  const determineConfidence = (): 'low' | 'medium' | 'high' => {
    switch (coachType) {
      case 'elia':
        // Elia: Based on reflection depth
        return reflectionNotes.length > 50 ? 'high' : 'medium';
      case 'skippy':
        // Skippy: Based on response speed
        const responseTime = timeSpent.question || 0;
        return responseTime < 30000 ? 'high' : responseTime < 60000 ? 'medium' : 'low';
      case 'lupa':
        // Lupa: Based on peer interaction quality
        return peerJudgment && peerJudgment.rationale.length > 20 ? 'high' : 'medium';
      case 'polpo':
        // Polpo: Adaptive based on multiple factors
        const hasExplanation = personalExplanation.length > 0;
        const hasReflection = reflectionNotes.length > 0;
        const quickResponse = (timeSpent.question || 0) < 45000;
        
        if (hasExplanation && hasReflection) return 'high';
        if (quickResponse || hasExplanation) return 'medium';
        return 'low';
      default:
        return 'medium';
    }
  };

  // Handle answer submission from question phase
  const handleQuestionAnswer = (questionAnswer: any) => {
    setAnswer(questionAnswer);
    
    // For Skippy (fast mode), complete immediately
    if (coachType === 'skippy') {
      completeAssessment();
    } else {
      moveToNextPhase();
    }
  };

  // Handle peer review submission
  const handlePeerJudgment = (bestId: string, rationale: string) => {
    setPeerJudgment({ bestId, rationale });
    moveToNextPhase();
  };

  // Render current phase
  const renderCurrentPhase = () => {
    switch (currentPhase.phase) {
      case 'question':
        return (
          <div className="space-y-6">
            {/* Timer for Skippy */}
            {config.hasTimer && (
              <div className="flex items-center justify-center">
                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-4 flex items-center gap-2">
                    <TimerIcon className="w-4 h-4 text-orange-600" />
                    <Timer />
                    <span className="text-sm text-orange-700">
                      Modalità veloce attiva!
                    </span>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Question */}
            <QuestionRenderer
              item={item}
              answer={answer}
              onAnswerChange={setAnswer}
              onSubmit={handleQuestionAnswer}
              coachType={coachType}
              disabled={false}
            />
          </div>
        );

      case 'explanation':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Spiega la tua risposta
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {coachType === 'lupa' 
                    ? 'Condividi il tuo ragionamento con il gruppo'
                    : 'Descrivi come sei arrivato a questa risposta'
                  }
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={personalExplanation}
                  onChange={(e) => setPersonalExplanation(e.target.value)}
                  placeholder="Spiega il tuo ragionamento..."
                  className="min-h-[120px]"
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {personalExplanation.length} caratteri
                  </span>
                  <Button 
                    onClick={moveToNextPhase}
                    disabled={personalExplanation.length < 10}
                  >
                    Continua
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'peer_review':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Revisione tra Pari
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Confronta le spiegazioni e scegli la migliore
                </p>
              </CardHeader>
              <CardContent>
                <PeerSnippetsCompare onJudge={handlePeerJudgment} />
              </CardContent>
            </Card>
          </div>
        );

      case 'reflection':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  {coachType === 'elia' ? 'Riflessione Profonda' : 'Riflessione Rapida'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {coachType === 'elia' 
                    ? 'Prenditi tempo per riflettere sulla domanda e la tua risposta'
                    : 'Cosa hai imparato da questa domanda?'
                  }
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={reflectionNotes}
                  onChange={(e) => setReflectionNotes(e.target.value)}
                  placeholder={
                    coachType === 'elia' 
                      ? 'Rifletti sui concetti, le connessioni e le implicazioni...'
                      : 'Note rapide sui punti chiave...'
                  }
                  className={cn(
                    coachType === 'elia' ? 'min-h-[150px]' : 'min-h-[80px]'
                  )}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {reflectionNotes.length} caratteri
                  </span>
                  <Button 
                    onClick={moveToNextPhase}
                    disabled={coachType === 'elia' && reflectionNotes.length < 20}
                  >
                    {coachType === 'elia' ? 'Completa Riflessione' : 'Continua'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'model_explanation':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Spiegazione del Modello
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ModelExplanation 
                  text={`Spiegazione dettagliata per la domanda "${item.question}". 
                        La risposta corretta considera i seguenti aspetti chiave...`} 
                />
                
                {/* Coach-specific insights */}
                <div className={cn(
                  'p-4 rounded-lg border',
                  coachType === 'elia' && 'bg-amber-50 border-amber-200',
                  coachType === 'skippy' && 'bg-orange-50 border-orange-200',
                  coachType === 'lupa' && 'bg-blue-50 border-blue-200',
                  coachType === 'polpo' && 'bg-purple-50 border-purple-200'
                )}>
                  <p className="text-sm">
                    <strong>{config.emoji} {config.name}:</strong>{' '}
                    {getCoachInsight()}
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={completeAssessment}>
                    Completa Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  // Get coach-specific insights
  const getCoachInsight = () => {
    const insights = {
      elia: 'Ottimo lavoro nella riflessione! Questo tipo di analisi profonda ti aiuterà a comprendere meglio i concetti fondamentali.',
      skippy: 'Veloce e preciso! Hai dimostrato una buona padronanza del concetto. Continua così per massimizzare il tuo apprendimento!',
      lupa: 'La collaborazione e il confronto con i pari arricchisce la comprensione. Hai contribuito positivamente al processo di apprendimento collettivo.',
      polpo: 'Il tuo approccio si è adattato bene al tipo di domanda. Questa flessibilità ti permetterà di affrontare diverse sfide di apprendimento.'
    };
    return insights[coachType];
  };

  // Calculate progress
  const currentPhaseIndex = config.phases.indexOf(currentPhase.phase);
  const progress = ((currentPhaseIndex + 1) / config.phases.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Coach Mode Header */}
      <Card className={cn(
        'border-2',
        coachType === 'elia' && 'border-amber-200 bg-amber-50/50',
        coachType === 'skippy' && 'border-orange-200 bg-orange-50/50',
        coachType === 'lupa' && 'border-blue-200 bg-blue-50/50',
        coachType === 'polpo' && 'border-purple-200 bg-purple-50/50'
      )}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{config.emoji}</span>
              <div>
                <CardTitle className="text-lg">{config.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{config.description}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onCancel}>
              Annulla
            </Button>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Fase: {currentPhase.phase}</span>
              <span>{currentPhaseIndex + 1} di {config.phases.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Current Phase Content */}
      {renderCurrentPhase()}

      {/* Coach-specific features */}
      {coachType === 'skippy' && config.hasTimer && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-600" />
                <span className="text-orange-700">Modalità Veloce</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Tempo per domanda: {config.timerPerQuestion || 60}s</span>
                <span>Tempo totale: {Math.floor((config.globalTimer || 300) / 60)}min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Development info */}
      {process.env.NODE_ENV === 'development' && (
        <details className="text-xs text-muted-foreground">
          <summary>Debug Info</summary>
          <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
            {JSON.stringify({ 
              coachType,
              currentPhase,
              config,
              timeSpent,
              answer: answer ? 'provided' : 'none'
            }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}