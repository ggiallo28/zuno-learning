import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Brain, Clock, Award, Crown, Target, Zap } from 'lucide-react';
import { useZunoManager } from '@/contexts/ZunoManagerContext';
import { useCoach } from '@/contexts/CoachContext';
import { useAssessment } from '@/contexts/AssessmentContext';
import { PrecisionBar } from './PrecisionBar';
import { EarlyStopDialog } from './EarlyStopDialog';
import { ProgressAnnouncer } from './ProgressAnnouncer';
import { ItemCounter } from './ItemCounter';
import { QuestionRenderer } from './QuestionRenderer';
import { TagSelector } from './TagSelector';
import { RealTimeSkillTracker } from './RealTimeSkillTracker';
import type { AssessmentItem, ItemResponse, DifficultyLevel, CoachType } from '@/types/assessment';

interface AssessmentInterfaceProps {
  assessmentType: 'initial' | 'progress' | 'focus_check';
  selectedTopics?: string[];
  targetQuestions?: number;
  onComplete: (results: {
    score: number;
    totalQuestions: number;
    responses: ItemResponse[];
    timeSpent: number;
    identifiedGaps: string[];
    recommendations: string[];
    topicMastery: Record<string, number>;
    adaptiveDifficulty: DifficultyLevel;
  }) => void;
  onCancel: () => void;
}

// Adaptive Assessment Item Pool - Real assessment questions with multiple formats
const getAssessmentItemPool = (type: 'initial' | 'progress' | 'focus_check'): AssessmentItem[] => {
  const baseItems: AssessmentItem[] = [
    // Multiple Choice Questions
    {
      id: 'mc_react_hooks_1',
      topic: 'hooks',
      format: 'multiple_choice',
      difficulty: 'beginner',
      question: 'Quale hook React utilizzi per gestire lo stato locale in un componente funzionale?',
      options: ['useEffect', 'useState', 'useContext', 'useReducer'],
      correctAnswers: [1],
      hint: 'Pensa all\'hook più semplice per memorizzare un valore che può cambiare',
      timeEstimateMs: 30000,
      tags: ['react', 'hooks', 'state']
    },
    {
      id: 'mc_js_arrays_1',
      topic: 'arrays',
      format: 'multiple_choice',
      difficulty: 'intermediate',
      question: 'Quale metodo array NON modifica l\'array originale?',
      options: ['push()', 'map()', 'splice()', 'sort()'],
      correctAnswers: [1],
      hint: 'Alcuni metodi restituiscono un nuovo array, altri modificano quello esistente',
      timeEstimateMs: 45000,
      tags: ['javascript', 'arrays', 'immutability']
    },
    // Cloze Questions
    {
      id: 'cloze_async_1',
      topic: 'async',
      format: 'cloze',
      difficulty: 'intermediate',
      question: 'Completa il codice per gestire una Promise:',
      clozeTemplate: 'fetch("/api/data").___((response) => response.json()).then((data) => console.log(data));',
      clozeAnswers: ['then', '.then'],
      hint: 'Quale metodo usi per gestire il risultato di una Promise?',
      timeEstimateMs: 60000,
      tags: ['javascript', 'promises', 'async']
    },
    // Code Run Questions
    {
      id: 'code_functions_1',
      topic: 'functions',
      format: 'code_run',
      difficulty: 'beginner',
      question: 'Scrivi una funzione che calcola la somma di due numeri:',
      codeTemplate: 'function sum(a, b) {\n  // Il tuo codice qui\n  \n}',
      tests: [
        {
          id: 'test1',
          input: [2, 3],
          expectedOutput: 5,
          isHidden: false,
          description: 'sum(2, 3) dovrebbe restituire 5'
        },
        {
          id: 'test2',
          input: [0, 0],
          expectedOutput: 0,
          isHidden: false,
          description: 'sum(0, 0) dovrebbe restituire 0'
        },
        {
          id: 'test3',
          input: [-1, 1],
          expectedOutput: 0,
          isHidden: true,
          description: 'Test con numeri negativi'
        }
      ],
      timeEstimateMs: 120000,
      tags: ['javascript', 'functions', 'basic']
    }
  ];

  // Add type-specific items
  switch (type) {
    case 'initial':
      return [
        ...baseItems,
        {
          id: 'mc_experience_1',
          topic: 'types',
          format: 'multiple_choice',
          difficulty: 'beginner',
          question: 'Qual è il tuo livello di esperienza con TypeScript?',
          options: ['Mai usato', 'Principiante', 'Intermedio', 'Avanzato'],
          correctAnswers: [1], // No "correct" answer for self-assessment
          timeEstimateMs: 20000,
          tags: ['typescript', 'experience', 'self-assessment']
        }
      ];
    case 'progress':
      return [
        ...baseItems.filter(item => item.difficulty !== 'beginner'),
        {
          id: 'mc_progress_1',
          topic: 'hooks',
          format: 'multiple_choice',
          difficulty: 'advanced',
          question: 'Quando useresti useCallback invece di useMemo?',
          options: [
            'Per memorizzare valori calcolati',
            'Per memorizzare funzioni e prevenire re-render',
            'Per gestire effetti collaterali',
            'Per gestire lo stato globale'
          ],
          correctAnswers: [1],
          hint: 'useCallback è specifico per le funzioni',
          timeEstimateMs: 60000,
          tags: ['react', 'hooks', 'optimization', 'advanced']
        }
      ];
    case 'focus_check':
      return baseItems.filter(item => 
        item.difficulty === 'intermediate' || item.difficulty === 'advanced'
      );
    default:
      return baseItems;
  }
};

export function AssessmentInterface({ 
  assessmentType, 
  selectedTopics = [], 
  targetQuestions = 10,
  onComplete, 
  onCancel 
}: AssessmentInterfaceProps) {
  // Assessment state
  const [itemPool] = useState<AssessmentItem[]>(getAssessmentItemPool(assessmentType));
  const [currentItem, setCurrentItem] = useState<AssessmentItem | null>(null);
  const [responses, setResponses] = useState<ItemResponse[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [startTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [showResults, setShowResults] = useState(false);
  const [showEarlyStopDialog, setShowEarlyStopDialog] = useState(false);
  const [progressAnnouncement, setProgressAnnouncement] = useState<string>('');
  
  // Tag selection state
  const [showTagSelection, setShowTagSelection] = useState(selectedTopics.length === 0);
  const [selectedTags, setSelectedTags] = useState<string[]>(selectedTopics);
  
  // Adaptive difficulty tracking
  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>('beginner');
  const [abilityEstimate, setAbilityEstimate] = useState<number>(0); // IRT theta parameter
  const [topicMastery, setTopicMastery] = useState<Record<string, number>>({});
  // Real-time skill tracking state
  const [showSkillTracker, setShowSkillTracker] = useState(true);
  const [currentItemTopic, setCurrentItemTopic] = useState<string | undefined>();
  
  const { getCoordinationMessage } = useZunoManager();
  const { currentCoach } = useCoach();
  const assessment = useAssessment();

  const totalQuestions = targetQuestions;
  const currentQuestionNumber = responses.length + 1;

  // Handle tag selection completion
  const handleTagSelectionComplete = (tags: string[]) => {
    setSelectedTags(tags);
    setShowTagSelection(false);
    
    // Start assessment with selected tags
    const firstItem = selectNextItemWithTags(tags);
    if (firstItem) {
      setCurrentItemWithTopic(firstItem);
      setQuestionStartTime(Date.now());
    }
  };

  // Adaptive item selection algorithm with tag filtering
  const selectNextItemWithTags = useCallback((tags: string[]): AssessmentItem | null => {
    if (responses.length >= targetQuestions) return null;
    
    // Filter items by selected tags
    let availableItems = itemPool;
    if (tags.length > 0) {
      availableItems = itemPool.filter(item => 
        tags.includes(item.topic) || 
        item.tags.some(tag => tags.includes(tag))
      );
    }
    
    // Filter out already answered items
    const answeredIds = responses.map(r => r.itemId);
    availableItems = availableItems.filter(item => 
      !answeredIds.includes(item.id)
    );
    
    if (availableItems.length === 0) return null;
    
    // Adaptive selection based on current ability estimate and difficulty
    const targetDifficulty = getDifficultyFromAbility(abilityEstimate);
    
    // Prefer items matching target difficulty, but allow some variation
    const preferredItems = availableItems.filter(item => 
      item.difficulty === targetDifficulty
    );
    
    const itemsToChooseFrom = preferredItems.length > 0 ? preferredItems : availableItems;
    
    // Select item with some randomization to prevent predictability
    const randomIndex = Math.floor(Math.random() * itemsToChooseFrom.length);
    return itemsToChooseFrom[randomIndex];
  }, [itemPool, responses, targetQuestions, abilityEstimate]);

  // Adaptive item selection algorithm
  const selectNextItem = useCallback((): AssessmentItem | null => {
    return selectNextItemWithTags(selectedTags);
  }, [selectNextItemWithTags, selectedTags]);

  // Helper function to set current item and track topic
  const setCurrentItemWithTopic = useCallback((item: AssessmentItem | null) => {
    setCurrentItem(item);
    setCurrentItemTopic(item?.topic);
  }, []);

  // Convert ability estimate to difficulty level
  const getDifficultyFromAbility = (ability: number): DifficultyLevel => {
    if (ability < -1) return 'beginner';
    if (ability < 0) return 'intermediate';
    if (ability < 1) return 'advanced';
    return 'expert';
  };

  // Update ability estimate based on response (simplified IRT)
  const updateAbilityEstimate = useCallback((isCorrect: boolean, itemDifficulty: DifficultyLevel) => {
    const difficultyValue = {
      'beginner': -1,
      'intermediate': 0,
      'advanced': 1,
      'expert': 2
    }[itemDifficulty];
    
    // Simplified IRT update (in real implementation, use proper IRT algorithms)
    const learningRate = 0.3;
    const expectedCorrect = 1 / (1 + Math.exp(-(abilityEstimate - difficultyValue)));
    const error = (isCorrect ? 1 : 0) - expectedCorrect;
    
    const newAbility = abilityEstimate + learningRate * error;
    setAbilityEstimate(Math.max(-3, Math.min(3, newAbility))); // Clamp between -3 and 3
    
    // Update current difficulty based on new ability
    setCurrentDifficulty(getDifficultyFromAbility(newAbility));
  }, [abilityEstimate]);

  // Initialize assessment when component mounts
  useEffect(() => {
    assessment.start();
    
    // Only start if we have selected tags (skip tag selection)
    if (!showTagSelection && selectedTags.length > 0) {
      const firstItem = selectNextItem();
      if (firstItem) {
        setCurrentItemWithTopic(firstItem);
        setQuestionStartTime(Date.now());
      }
    }
    
    return () => {
      assessment.reset();
    };
  }, [assessment, selectNextItem, showTagSelection, selectedTags]);

  // Check for early stopping when precision threshold is reached
  useEffect(() => {
    if (assessment.state.running && 
        assessment.state.precision >= assessment.state.targetPrecision && 
        responses.length >= 3 && // Minimum questions before early stopping
        !showEarlyStopDialog && 
        !showResults) {
      setShowEarlyStopDialog(true);
    }
  }, [assessment.state.precision, responses.length, assessment.state.running, showEarlyStopDialog, showResults]);

  // Handle answer submission
  const handleAnswerSubmit = useCallback((answer: any, confidence: 'low' | 'medium' | 'high' = 'medium', metadata?: any) => {
    if (!currentItem) return;
    
    const responseTime = Date.now() - questionStartTime;
    const isCorrect = evaluateAnswer(currentItem, answer);
    const partialScore = calculatePartialScore(currentItem, answer, isCorrect);
    
    // Create response record
    const response: ItemResponse = {
      id: `response_${Date.now()}`,
      itemId: currentItem.id,
      sessionId: 'session_' + Date.now(),
      answer,
      isCorrect,
      partialScore,
      timeMs: responseTime,
      confidence,
      hintsUsed: 0, // TODO: Track hints
      retryCount: 0, // TODO: Track retries
      timestamp: new Date(),
      // Add coach-specific metadata if provided
      ...(metadata && { metadata })
    };
    
    // Update responses
    setResponses(prev => [...prev, response]);
    
    // Update ability estimate and topic mastery
    updateAbilityEstimate(isCorrect, currentItem.difficulty);
    updateTopicMastery(currentItem.topic, isCorrect, partialScore);
    
    // Update assessment context
    assessment.submitAnswer(isCorrect, confidence === 'high' ? 'certo' : 'forse');
    
    // Update progress announcement for screen readers
    const newProgress = Math.round(((responses.length + 1) / totalQuestions) * 100);
    setProgressAnnouncement(`Domanda ${responses.length + 1} di ${totalQuestions} completata. Progresso: ${newProgress}%`);
    
    // Clear current answer
    setCurrentAnswer(null);
    
    // Move to next question after a brief delay
    setTimeout(() => {
      if (responses.length + 1 >= targetQuestions) {
        completeAssessment();
      } else {
        const nextItem = selectNextItem();
        if (nextItem) {
          setCurrentItemWithTopic(nextItem);
          setQuestionStartTime(Date.now());
        } else {
          completeAssessment();
        }
      }
    }, 1000);
  }, [currentItem, questionStartTime, responses.length, targetQuestions, assessment, updateAbilityEstimate, selectNextItem]);

  // Evaluate if answer is correct
  const evaluateAnswer = (item: AssessmentItem, answer: any): boolean => {
    switch (item.format) {
      case 'multiple_choice':
        return item.correctAnswers?.includes(answer) || false;
      case 'multiple_select':
        if (!Array.isArray(answer) || !item.correctAnswers) return false;
        return answer.length === item.correctAnswers.length && 
               answer.every(a => item.correctAnswers!.includes(a));
      case 'cloze':
        if (!item.clozeAnswers) return false;
        return item.clozeAnswers.some(correct => 
          answer.toLowerCase().trim() === correct.toLowerCase().trim()
        );
      case 'code_run':
        // For code run, check if tests passed
        return answer?.results?.score >= 0.8; // 80% of tests must pass
      default:
        return false; // For open text and other formats, manual evaluation needed
    }
  };

  // Calculate partial score for answer
  const calculatePartialScore = (item: AssessmentItem, answer: any, isCorrect: boolean): number => {
    if (isCorrect) return 1.0;
    
    // Partial credit for code run questions
    if (item.format === 'code_run' && answer?.results?.score) {
      return answer.results.score;
    }
    
    // Partial credit for multiple select (some correct answers)
    if (item.format === 'multiple_select' && Array.isArray(answer) && item.correctAnswers) {
      const correctCount = answer.filter(a => item.correctAnswers!.includes(a)).length;
      const incorrectCount = answer.filter(a => !item.correctAnswers!.includes(a)).length;
      return Math.max(0, (correctCount - incorrectCount) / item.correctAnswers.length);
    }
    
    return 0.0;
  };

  // Update topic mastery based on response
  const updateTopicMastery = useCallback((topic: string, _isCorrect: boolean, partialScore: number) => {
    setTopicMastery(prev => {
      const currentMastery = prev[topic] || 0;
      const learningRate = 0.2;
      const newMastery = currentMastery + learningRate * (partialScore - currentMastery);
      return {
        ...prev,
        [topic]: Math.max(0, Math.min(1, newMastery))
      };
    });
  }, []);

  const completeAssessment = useCallback(() => {
    assessment.pause();
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const results = analyzeResults(timeSpent);
    
    setShowResults(true);
    onComplete(results);
  }, [assessment, startTime, onComplete]);

  const handleEarlyStopContinue = () => {
    setShowEarlyStopDialog(false);
    // User chooses to continue, no action needed
  };

  const handleEarlyStopComplete = () => {
    setShowEarlyStopDialog(false);
    completeAssessment();
  };

  const analyzeResults = useCallback((timeSpent: number) => {
    const correctAnswers = responses.filter(r => r.isCorrect).length;
    const totalAnswered = responses.length;
    const score = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;
    
    const identifiedGaps: string[] = [];
    const recommendations: string[] = [];

    // Analyze topic mastery to identify gaps
    Object.entries(topicMastery).forEach(([topic, mastery]) => {
      if (mastery < 0.6) {
        identifiedGaps.push(`Competenze in ${topic}`);
        recommendations.push(`Dedica più tempo alla pratica di ${topic}`);
      } else if (mastery > 0.8) {
        recommendations.push(`Ottima padronanza di ${topic}! Considera argomenti più avanzati`);
      }
    });

    // Analyze difficulty progression
    const avgDifficulty = responses.reduce((sum, r) => {
      const item = itemPool.find(i => i.id === r.itemId);
      const diffValue = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 }[item?.difficulty || 'beginner'];
      return sum + diffValue;
    }, 0) / responses.length;

    if (avgDifficulty < 2) {
      recommendations.push('Sei pronto per sfide più impegnative');
    } else if (avgDifficulty > 3) {
      recommendations.push('Consolida le basi prima di affrontare argomenti avanzati');
    }

    // Add assessment type specific recommendations
    switch (assessmentType) {
      case 'initial':
        recommendations.push('Il tuo percorso di apprendimento è stato personalizzato');
        if (score > 70) {
          recommendations.push('Ottimo punto di partenza! Puoi iniziare con contenuti intermedi');
        } else {
          recommendations.push('Inizia con i fondamenti per costruire basi solide');
        }
        break;
      case 'progress':
        if (score > 80) {
          recommendations.push('Eccellenti progressi! Continua così');
        } else if (score > 60) {
          recommendations.push('Buoni progressi, continua a praticare regolarmente');
        } else {
          recommendations.push('Dedica più tempo alla revisione degli argomenti base');
        }
        break;
      case 'focus_check':
        recommendations.push('Focus check completato - il tuo piano di studio è stato aggiornato');
        break;
    }

    return {
      score,
      totalQuestions: totalAnswered,
      responses,
      timeSpent,
      identifiedGaps,
      recommendations,
      topicMastery,
      adaptiveDifficulty: currentDifficulty
    };
  }, [responses, topicMastery, assessmentType, currentDifficulty, itemPool]);

  const getAssessmentTitle = () => {
    switch (assessmentType) {
      case 'initial': return 'Assessment Iniziale';
      case 'progress': return 'Valutazione Progressi';
      case 'focus_check': return 'Focus Check';
      default: return 'Assessment';
    }
  };

  const getAssessmentDescription = () => {
    switch (assessmentType) {
      case 'initial': return 'Valutiamo il tuo livello attuale per creare un percorso personalizzato';
      case 'progress': return 'Verifichiamo i tuoi progressi e aggiorniamo il piano di studio';
      case 'focus_check': return 'Identifichiamo rapidamente le aree che necessitano attenzione';
      default: return 'Valutazione delle tue competenze e preferenze di apprendimento';
    }
  };

  // Show tag selection if needed
  if (showTagSelection) {
    const availableTags = [...new Set(itemPool.flatMap(item => [item.topic, ...item.tags]))];
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Zuno Manager Coordination Message */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Zuno Manager</span>
          </div>
          <p className="text-sm text-blue-700">
            Prima di iniziare, seleziona gli argomenti su cui vuoi concentrarti. 
            Il tuo coach {currentCoach} ti aiuterà a scegliere i più adatti al tuo livello.
          </p>
        </div>

        {/* Tag Selection */}
        <TagSelector
          tags={availableTags}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          maxRecommended={5}
          showRecommendations={true}
        />

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={onCancel}>
                Annulla
              </Button>
              <Button 
                onClick={() => handleTagSelectionComplete(selectedTags)}
                disabled={selectedTags.length === 0}
                size="lg"
              >
                Inizia Assessment ({selectedTags.length} argomenti)
              </Button>
            </div>
            {selectedTags.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Seleziona almeno un argomento per continuare
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Don't render anything if no current item and not showing results
  if (!currentItem && !showResults) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Caricamento Assessment...</h2>
            <p className="text-muted-foreground">
              Stiamo preparando le domande personalizzate per te.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Assessment Completato!</h2>
            <p className="text-muted-foreground">
              I tuoi risultati sono stati analizzati e il tuo percorso di apprendimento è stato aggiornato.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Announcer for Screen Readers */}
      <ProgressAnnouncer text={progressAnnouncement} />

      {/* Zuno Manager Coordination Message */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Zuno Manager</span>
        </div>
        <p className="text-sm text-blue-700">
          {getCoordinationMessage(currentCoach, 'assessment')}
        </p>
      </div>

      {/* Assessment Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{getAssessmentTitle()}</CardTitle>
              <p className="text-muted-foreground mt-1">{getAssessmentDescription()}</p>
            </div>
            <Button variant="outline" onClick={onCancel}>
              Annulla
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {/* Item Counter */}
            <ItemCounter 
              current={currentQuestionNumber} 
              total={totalQuestions}
              ariaLabel="Progresso assessment"
            />
            
            {/* Precision Tracking */}
            {responses.length > 0 && (
              <div>
                <PrecisionBar stopAt={assessment.state.targetPrecision} />
              </div>
            )}
            
            {/* Adaptive Difficulty Indicator */}
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-muted-foreground">
                Difficoltà adattiva: 
                <Badge variant="outline" className="ml-2">
                  {currentDifficulty === 'beginner' && 'Principiante'}
                  {currentDifficulty === 'intermediate' && 'Intermedio'}
                  {currentDifficulty === 'advanced' && 'Avanzato'}
                  {currentDifficulty === 'expert' && 'Esperto'}
                </Badge>
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Real-time Skill Tracker */}
      {responses.length > 0 && showSkillTracker && (
        <RealTimeSkillTracker
          responses={responses}
          currentTopic={currentItemTopic}
          isVisible={showSkillTracker}
          onToggleVisibility={() => setShowSkillTracker(!showSkillTracker)}
        />
      )}

      {/* Single Question Display */}
      {currentItem && (
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline">
                <Brain className="w-4 h-4 mr-1" />
                Domanda {currentQuestionNumber}
              </Badge>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {currentItem.topic}
                </Badge>
                <Badge variant={
                  currentItem.difficulty === 'beginner' ? 'default' :
                  currentItem.difficulty === 'intermediate' ? 'secondary' :
                  currentItem.difficulty === 'advanced' ? 'destructive' : 'outline'
                }>
                  <Zap className="w-3 h-3 mr-1" />
                  {currentItem.difficulty}
                </Badge>
              </div>
            </div>
            <CardTitle className="text-xl">{currentItem.question}</CardTitle>
            {currentItem.hint && (
              <p className="text-sm text-muted-foreground mt-2">
                💡 {currentItem.hint}
              </p>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Question Renderer */}
            <QuestionRenderer
              item={currentItem}
              answer={currentAnswer}
              onAnswerChange={setCurrentAnswer}
              onSubmit={handleAnswerSubmit}
              coachType={currentCoach as CoachType}
              disabled={false}
            />
          </CardContent>
        </Card>
      )}

      {/* Progress Info */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                Tempo stimato: {Math.ceil((totalQuestions - currentQuestionNumber) * 1.5)} min rimanenti
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>XP alla completazione: {totalQuestions * 10}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Early Stop Dialog */}
      <EarlyStopDialog
        open={showEarlyStopDialog}
        precisionPct={Math.round(assessment.state.precision * 100)}
        onContinue={handleEarlyStopContinue}
        onStop={handleEarlyStopComplete}
      />
    </div>
  );
}