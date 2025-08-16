import { useState, useEffect, useCallback } from 'react';
import loadQuizQuestions from '@/actions/loadQuizQuestions';
import completeLessonProgress from '@/actions/completeLessonProgress';
import { useAppData } from '@/contexts/AppDataContext';

interface QuizQuestion {
  id: string;
  lessonId?: string;
  questionText?: string;
  questionType?: string;
  possibilities?: Array<{
    text: string;
    isCorrect?: boolean;
    imageUrl?: string;
    audioUrl?: string;
  }>;
  rightAnswerCount?: number;
  // Legacy support
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  points?: number;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  answers: Record<string, string>;
  timeSpent: number;
  accuracy: number;
}

interface UseQuizSystemProps {
  lessonId: string;
  userId: string;
  autoLoad?: boolean;
}

interface UseQuizSystemReturn {
  // Quiz data
  questions: QuizQuestion[];
  
  // Quiz state
  isLoading: boolean;
  isCompleting: boolean;
  error: string | null;
  
  // Quiz results
  lastResult: QuizResult | null;
  
  // Actions
  loadQuestions: () => Promise<void>;
  completeQuiz: (result: QuizResult) => Promise<{ success: boolean; xpEarned: number }>;
  resetQuiz: () => void;
  
  // Quiz statistics
  getQuizStats: () => {
    totalQuestions: number;
    hasQuestions: boolean;
    estimatedDuration: number; // in minutes
  };
}

export function useQuizSystem({ 
  lessonId, 
  userId, 
  autoLoad = true 
}: UseQuizSystemProps): UseQuizSystemReturn {
  const { actions: appActions } = useAppData();
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);

  // Load quiz questions
  const loadQuestions = useCallback(async () => {
    if (!lessonId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const quizData = await loadQuizQuestions(lessonId);
      
      // Transform the data to ensure consistency
      const transformedQuestions: QuizQuestion[] = quizData.map(q => ({
        ...q,
        // Ensure we have options array for compatibility
        options: q.options || (q.possibilities?.map(p => p.text) || []),
        // Ensure we have correctAnswer for compatibility
        correctAnswer: q.correctAnswer || (q.possibilities?.find(p => p.isCorrect)?.text || ''),
        // Add default explanation if missing
        explanation: (q as any).explanation || 'No explanation provided.',
        // Add default points if missing
        points: (q as any).points || 10
      }));
      
      setQuestions(transformedQuestions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load quiz questions';
      setError(errorMessage);
      console.error('Error loading quiz questions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [lessonId]);

  // Complete quiz and update progress
  const completeQuiz = useCallback(async (result: QuizResult): Promise<{ success: boolean; xpEarned: number }> => {
    setIsCompleting(true);
    setError(null);

    try {
      // Calculate XP based on performance
      const baseXP = 50; // Base XP for completing a quiz
      const accuracyBonus = Math.round(result.accuracy * 50); // Up to 50 bonus XP for perfect score
      const speedBonus = result.timeSpent < 300 ? 10 : 0; // 10 XP bonus for completing under 5 minutes
      const totalXP = baseXP + accuracyBonus + speedBonus;

      // Complete the lesson with quiz results
      await completeLessonProgress({
        userId,
        lessonId,
        score: result.score,
        attempts: 1,
        timeSpent: result.timeSpent
      });

      // Update global user XP
      appActions.updateUserXP(totalXP);

      // Store the result
      setLastResult(result);

      return {
        success: true,
        xpEarned: totalXP
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete quiz';
      setError(errorMessage);
      console.error('Error completing quiz:', err);
      
      return {
        success: false,
        xpEarned: 0
      };
    } finally {
      setIsCompleting(false);
    }
  }, [userId, lessonId, appActions]);

  // Reset quiz state
  const resetQuiz = useCallback(() => {
    setLastResult(null);
    setError(null);
  }, []);

  // Get quiz statistics
  const getQuizStats = useCallback(() => {
    return {
      totalQuestions: questions.length,
      hasQuestions: questions.length > 0,
      estimatedDuration: Math.max(1, Math.ceil(questions.length * 1.5)) // 1.5 minutes per question, minimum 1 minute
    };
  }, [questions]);

  // Auto-load questions when lessonId changes
  useEffect(() => {
    if (autoLoad && lessonId) {
      loadQuestions();
    }
  }, [lessonId, autoLoad, loadQuestions]);

  // Reset state when lessonId changes
  useEffect(() => {
    setLastResult(null);
    setError(null);
  }, [lessonId]);

  return {
    // Quiz data
    questions,
    
    // Quiz state
    isLoading,
    isCompleting,
    error,
    
    // Quiz results
    lastResult,
    
    // Actions
    loadQuestions,
    completeQuiz,
    resetQuiz,
    
    // Quiz statistics
    getQuizStats
  };
}

// Hook for managing quiz session state
export function useQuizSession(questions: QuizQuestion[]) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startTime] = useState<number>(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // Reset session when questions change
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsCompleted(false);
  }, [questions]);

  const submitAnswer = useCallback((questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const calculateResults = useCallback((): QuizResult => {
    let correctAnswers = 0;
    
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      const correctAnswer = question.correctAnswer || 
        question.possibilities?.find(p => p.isCorrect)?.text || '';
      
      if (userAnswer === correctAnswer) {
        correctAnswers++;
      }
    });

    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    return {
      score: correctAnswers,
      totalQuestions,
      answers,
      timeSpent,
      accuracy
    };
  }, [questions, answers, startTime, totalQuestions]);

  const resetSession = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsCompleted(false);
  }, []);

  return {
    // Session state
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progress,
    isLastQuestion,
    isCompleted,
    
    // Session data
    answers,
    
    // Actions
    submitAnswer,
    nextQuestion,
    previousQuestion,
    calculateResults,
    resetSession,
    
    // Helpers
    hasAnsweredCurrent: currentQuestion ? !!answers[currentQuestion.id] : false,
    hasAnsweredAll: Object.keys(answers).length === totalQuestions,
    getTimeSpent: () => Math.round((Date.now() - startTime) / 1000)
  };
}