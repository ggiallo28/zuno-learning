import { useState, useCallback, useRef } from 'react';
import { 
  AssessmentSession, 
  AssessmentItem, 
  ItemResponse, 
  CoachType, 
  TopicType, 
  ConfidenceLevel,
  DifficultyLevel,
  QuestionFormat,
  TopicMastery
} from '@/types/assessment';

// Simple IRT-inspired adaptive logic
class AdaptiveEngine {
  private abilityEstimate: number = 0;
  private topicMastery: Record<string, TopicMastery> = {};

  updateAbility(itemDifficulty: number, isCorrect: boolean, timeMs: number, hintsUsed: number): number {
    const expectedCorrect = this.calculateExpectedCorrect(itemDifficulty);
    const actualCorrect = isCorrect ? 1 : 0;
    
    // Simple learning rate based on surprise
    const surprise = Math.abs(actualCorrect - expectedCorrect);
    const learningRate = 0.1 + (surprise * 0.2);
    
    // Penalty for hints and slow responses
    const timePenalty = timeMs > 30000 ? 0.1 : 0;
    const hintPenalty = hintsUsed * 0.05;
    
    const adjustment = learningRate * (actualCorrect - expectedCorrect) - timePenalty - hintPenalty;
    this.abilityEstimate += adjustment;
    
    // Keep within reasonable bounds
    this.abilityEstimate = Math.max(-3, Math.min(3, this.abilityEstimate));
    
    return this.abilityEstimate;
  }

  calculateExpectedCorrect(itemDifficulty: number): number {
    // Simple logistic function
    const diff = this.abilityEstimate - itemDifficulty;
    return 1 / (1 + Math.exp(-diff));
  }

  updateTopicMastery(topic: TopicType, isCorrect: boolean, difficulty: DifficultyLevel): TopicMastery {
    if (!this.topicMastery[topic]) {
      this.topicMastery[topic] = {
        topic,
        masteryLevel: 0.5,
        confidence: 0.1,
        itemsAnswered: 0,
        itemsCorrect: 0,
        avgDifficulty: 0,
        trend: 'stable',
        lastAssessed: new Date()
      };
    }

    const mastery = this.topicMastery[topic];
    const difficultyValue = { beginner: 0, intermediate: 1, advanced: 2, expert: 3 }[difficulty];
    
    mastery.itemsAnswered++;
    if (isCorrect) mastery.itemsCorrect++;
    
    // Update running averages
    const alpha = 0.1; // Learning rate
    mastery.avgDifficulty = mastery.avgDifficulty * (1 - alpha) + difficultyValue * alpha;
    
    // Calculate new mastery level
    const successRate = mastery.itemsCorrect / mastery.itemsAnswered;
    const difficultyAdjustment = mastery.avgDifficulty * 0.25; // Higher difficulty = higher mastery potential
    mastery.masteryLevel = Math.min(1, successRate + difficultyAdjustment);
    
    // Update confidence (more items = higher confidence)
    mastery.confidence = Math.min(0.95, mastery.itemsAnswered * 0.05);
    
    // Determine trend (simple: compare to previous performance)
    // This would be more sophisticated in a real implementation
    mastery.trend = mastery.masteryLevel > 0.7 ? 'improving' : 
                   mastery.masteryLevel < 0.4 ? 'declining' : 'stable';
    
    mastery.lastAssessed = new Date();
    
    this.topicMastery[topic] = mastery;
    return mastery;
  }

  getNextDifficulty(topic: TopicType, _currentFormat: QuestionFormat): DifficultyLevel {
    const mastery = this.topicMastery[topic];
    if (!mastery) return 'beginner';
    
    // Adaptive difficulty based on mastery and ability
    const combinedScore = (mastery.masteryLevel + (this.abilityEstimate + 3) / 6) / 2;
    
    if (combinedScore < 0.3) return 'beginner';
    if (combinedScore < 0.6) return 'intermediate';
    if (combinedScore < 0.85) return 'advanced';
    return 'expert';
  }

  selectNextFormat(
    coachType: CoachType, 
    recentPerformance: ItemResponse[], 
    _currentFormat: QuestionFormat
  ): QuestionFormat {
    const coachPreferences = this.getCoachFormatPreferences(coachType);
    
    // If struggling with current format, try easier format
    const recentCorrect = recentPerformance.slice(-3).filter(r => r.isCorrect).length;
    if (recentCorrect === 0) {
      return 'multiple_choice'; // Fallback to easiest
    }
    
    // If doing well, progress to more complex formats
    if (recentCorrect === 3) {
      const complexFormats = ['code_run', 'debug_explain', 'order_steps'];
      const availableComplex = complexFormats.filter(f => coachPreferences.includes(f as QuestionFormat));
      if (availableComplex.length > 0) {
        return availableComplex[Math.floor(Math.random() * availableComplex.length)] as QuestionFormat;
      }
    }
    
    // Otherwise, pick from coach preferences
    return coachPreferences[Math.floor(Math.random() * coachPreferences.length)];
  }

  getCoachFormatPreferences(coachType: CoachType): QuestionFormat[] {
    const preferences = {
      elia: ['multiple_choice', 'cloze', 'debug_explain', 'open_text'], // Deep, methodical
      skippy: ['multiple_choice', 'code_run', 'order_steps'], // Fast, interactive
      lupa: ['multiple_select', 'open_text', 'debug_explain'], // Collaborative, discussion
      polpo: ['multiple_choice', 'cloze', 'code_run', 'debug_explain', 'order_steps'] // Adaptive, all formats
    };
    return preferences[coachType] as QuestionFormat[];
  }
}

export function useAssessment(_initialCoach: CoachType = 'skippy') {
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [currentItem, setCurrentItem] = useState<AssessmentItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [confidence, setConfidence] = useState<ConfidenceLevel>('medium');
  
  const adaptiveEngine = useRef(new AdaptiveEngine());
  const startTime = useRef<number>(Date.now());

  const startAssessment = useCallback(async (
    coachType: CoachType, 
    topics: TopicType[],
    config: { maxItems?: number; allowRetries?: boolean } = {}
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Create new session
      const newSession: AssessmentSession = {
        id: `session_${Date.now()}`,
        userId: 'current_user', // Would come from auth
        coachType,
        topics,
        startedAt: new Date(),
        currentItemIndex: 0,
        totalItems: config.maxItems || 20,
        abilityEstimate: 0,
    topicMastery: {
      arrays: { topic: 'arrays', masteryLevel: 0, confidence: 0, itemsAnswered: 0, itemsCorrect: 0, avgDifficulty: 0, trend: 'stable', lastAssessed: new Date() },
      hooks: { topic: 'hooks', masteryLevel: 0, confidence: 0, itemsAnswered: 0, itemsCorrect: 0, avgDifficulty: 0, trend: 'stable', lastAssessed: new Date() },
      types: { topic: 'types', masteryLevel: 0, confidence: 0, itemsAnswered: 0, itemsCorrect: 0, avgDifficulty: 0, trend: 'stable', lastAssessed: new Date() },
      functions: { topic: 'functions', masteryLevel: 0, confidence: 0, itemsAnswered: 0, itemsCorrect: 0, avgDifficulty: 0, trend: 'stable', lastAssessed: new Date() },
      objects: { topic: 'objects', masteryLevel: 0, confidence: 0, itemsAnswered: 0, itemsCorrect: 0, avgDifficulty: 0, trend: 'stable', lastAssessed: new Date() },
      async: { topic: 'async', masteryLevel: 0, confidence: 0, itemsAnswered: 0, itemsCorrect: 0, avgDifficulty: 0, trend: 'stable', lastAssessed: new Date() }
    },
        coachPreferences: {
          preferredFormats: adaptiveEngine.current.getCoachFormatPreferences(coachType),
          feedbackStyle: getFeedbackStyle(coachType),
          hintStrategy: getHintStrategy(coachType),
          difficultyProgression: getDifficultyProgression(coachType)
        },
        responses: [],
        currentStreak: 0,
        totalScore: 0,
        canGoBack: true
      };
      
      setSession(newSession);
      
      // Load first item
      const firstItem = await generateNextItem(newSession);
      setCurrentItem(firstItem);
      startTime.current = Date.now();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start assessment');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitResponse = useCallback(async (answer: any) => {
    if (!session || !currentItem) return;
    
    setLoading(true);
    
    try {
      const timeMs = Date.now() - startTime.current;
      
      // Calculate correctness and score
      const { isCorrect, partialScore } = await evaluateResponse(currentItem, answer);
      
      // Create response record
      const response: ItemResponse = {
        id: `response_${Date.now()}`,
        itemId: currentItem.id,
        sessionId: session.id,
        answer,
        isCorrect,
        partialScore,
        timeMs,
        confidence,
        hintsUsed,
        retryCount: 0,
        timestamp: new Date()
      };
      
      // Update adaptive engine
      const difficultyValue = { beginner: -1, intermediate: 0, advanced: 1, expert: 2 }[currentItem.difficulty];
      adaptiveEngine.current.updateAbility(difficultyValue, isCorrect, timeMs, hintsUsed);
      adaptiveEngine.current.updateTopicMastery(currentItem.topic, isCorrect, currentItem.difficulty);
      
      // Update session
      const updatedSession = {
        ...session,
        responses: [...session.responses, response],
        currentItemIndex: session.currentItemIndex + 1,
        currentStreak: isCorrect ? session.currentStreak + 1 : 0,
        totalScore: session.totalScore + partialScore
      };
      
      setSession(updatedSession);
      
      // Check if assessment is complete
      if (updatedSession.currentItemIndex >= updatedSession.totalItems) {
        updatedSession.completedAt = new Date();
        setSession(updatedSession);
        setCurrentItem(null);
      } else {
        // Generate next item
        const nextItem = await generateNextItem(updatedSession);
        setCurrentItem(nextItem);
        startTime.current = Date.now();
      }
      
      // Reset item-specific state
      setHintsUsed(0);
      setShowHint(false);
      setConfidence('medium');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit response');
    } finally {
      setLoading(false);
    }
  }, [session, currentItem, confidence, hintsUsed]);

  const useHint = useCallback(() => {
    if (currentItem?.hint) {
      setHintsUsed(prev => prev + 1);
      setShowHint(true);
    }
  }, [currentItem]);

  const goToPrevious = useCallback(() => {
    if (session && session.currentItemIndex > 0 && session.canGoBack) {
      // This is simplified - in reality you'd need to restore previous state
      console.log('Going to previous item');
    }
  }, [session]);

  // Helper functions
  async function generateNextItem(session: AssessmentSession): Promise<AssessmentItem> {
    // This would typically call an API to get the next adaptive item
    // For now, we'll return a mock item based on the adaptive logic
    
    const topic = session.topics[Math.floor(Math.random() * session.topics.length)];
    const difficulty = adaptiveEngine.current.getNextDifficulty(topic, 'multiple_choice');
    const format = adaptiveEngine.current.selectNextFormat(
      session.coachType, 
      session.responses.slice(-5), 
      'multiple_choice'
    );
    
    return createMockItem(topic, difficulty, format);
  }

  async function evaluateResponse(item: AssessmentItem, answer: any): Promise<{ isCorrect: boolean; partialScore: number }> {
    switch (item.format) {
      case 'multiple_choice':
        return {
          isCorrect: answer === item.correctAnswers?.[0],
          partialScore: answer === item.correctAnswers?.[0] ? 1 : 0
        };
      
      case 'multiple_select':
        if (!item.correctAnswers || !Array.isArray(answer)) {
          return { isCorrect: false, partialScore: 0 };
        }
        const correctSet = new Set(item.correctAnswers);
        const answerSet = new Set(answer);
        const intersection = new Set([...correctSet].filter(x => answerSet.has(x)));
        const union = new Set([...correctSet, ...answerSet]);
        const partialScore = intersection.size / union.size;
        return {
          isCorrect: intersection.size === correctSet.size && answerSet.size === correctSet.size,
          partialScore
        };
      
      case 'cloze':
        const normalizedAnswer = answer.toLowerCase().trim();
        const isCorrect = item.clozeAnswers?.some(ans => 
          ans.toLowerCase().trim() === normalizedAnswer
        ) || false;
        return { isCorrect, partialScore: isCorrect ? 1 : 0 };
      
      case 'code_run':
        return await evaluateCodeRun(item, answer);
      
      default:
        // For other formats, we'd need more sophisticated evaluation
        return { isCorrect: true, partialScore: 0.5 };
    }
  }

  async function evaluateCodeRun(_item: AssessmentItem, _code: string): Promise<{ isCorrect: boolean; partialScore: number }> {
    // This would use a secure sandbox to execute code
    // For now, return mock results
    return { isCorrect: true, partialScore: 0.8 };
  }

  return {
    // State
    session,
    currentItem,
    loading,
    error,
    hintsUsed,
    showHint,
    confidence,
    
    // Actions
    startAssessment,
    submitResponse,
    useHint,
    goToPrevious,
    setConfidence,
    
    // Computed values
    progress: session ? (session.currentItemIndex / session.totalItems) * 100 : 0,
    canUseHint: currentItem?.hint && !showHint,
    canGoBack: session?.canGoBack && (session?.currentItemIndex || 0) > 0
  };
}

// Helper functions
function getFeedbackStyle(coachType: CoachType): 'minimal' | 'detailed' | 'encouraging' | 'collaborative' {
  const styles = {
    elia: 'detailed',
    skippy: 'minimal', 
    lupa: 'collaborative',
    polpo: 'encouraging'
  } as const;
  return styles[coachType];
}

function getHintStrategy(coachType: CoachType): 'proactive' | 'on_request' | 'minimal' {
  const strategies = {
    elia: 'proactive',
    skippy: 'minimal',
    lupa: 'on_request', 
    polpo: 'on_request'
  } as const;
  return strategies[coachType];
}

function getDifficultyProgression(coachType: CoachType): 'gradual' | 'rapid' | 'mixed' {
  const progressions = {
    elia: 'gradual',
    skippy: 'rapid',
    lupa: 'gradual',
    polpo: 'mixed'
  } as const;
  return progressions[coachType];
}

// Mock item creation for testing
function createMockItem(topic: TopicType, difficulty: DifficultyLevel, format: QuestionFormat): AssessmentItem {
  const baseItem = {
    id: `item_${Date.now()}_${Math.random()}`,
    topic,
    difficulty,
    format,
    timeEstimateMs: 30000,
    tags: [topic, difficulty]
  };

  switch (format) {
    case 'multiple_choice':
      return {
        ...baseItem,
        question: `What is the best way to ${topic === 'arrays' ? 'iterate over an array' : 'handle state'} in React?`,
        options: [
          'Using forEach()',
          'Using map()',
          'Using for loop',
          'Using reduce()'
        ],
        correctAnswers: [1],
        hint: 'Think about which method returns a new array...'
      };
    
    case 'code_run':
      return {
        ...baseItem,
        question: 'Write a function that filters an array to only include even numbers',
        codeTemplate: 'function filterEven(numbers) {\n  // Your code here\n  return [];\n}',
        tests: [
          {
            id: 'test1',
            input: [[1, 2, 3, 4, 5]],
            expectedOutput: [2, 4],
            isHidden: false,
            description: 'Basic case with mixed numbers'
          },
          {
            id: 'test2', 
            input: [[2, 4, 6, 8]],
            expectedOutput: [2, 4, 6, 8],
            isHidden: true,
            description: 'All even numbers'
          }
        ],
        timeoutMs: 5000,
        hint: 'Use the filter() method with the modulo operator...'
      };
    
    default:
      return {
        ...baseItem,
        question: 'Sample question for ' + format,
        hint: 'This is a hint for ' + format
      };
  }
}