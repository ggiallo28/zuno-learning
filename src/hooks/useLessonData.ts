import { useState, useEffect, useCallback } from 'react';
import type { Lesson } from '@/types';
import loadLessons from '@/actions/loadLessons';
import loadQuizQuestions from '@/actions/loadQuizQuestions';
import completeLessonProgress from '@/actions/completeLessonProgress';
import { useAppData } from '@/contexts/AppDataContext';
import { useQuizSystem } from './useQuizSystem';

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
}

interface LessonWithStatus extends Lesson {
  isCompleted: boolean;
  score: number;
  attempts: number;
}

interface UseLessonDataReturn {
  lessons: LessonWithStatus[];
  quizQuestions: QuizQuestion[];
  loading: {
    lessons: boolean;
    quiz: boolean;
    completing: boolean;
  };
  error: {
    lessons: string | null;
    quiz: string | null;
    completing: string | null;
  };
  actions: {
    loadLessons: (courseId: string, userId?: string) => Promise<void>;
    loadQuizQuestions: (lessonId: string) => Promise<void>;
    completeLesson: (params: {
      userId: string;
      lessonId: string;
      score: number;
      attempts: number;
      timeSpent: number;
    }) => Promise<{ success: boolean; xpEarned: number }>;
    refreshLessonData: (courseId: string, userId?: string) => Promise<void>;
  };
}

export function useLessonData(): UseLessonDataReturn {
  const { actions: appActions } = useAppData();
  
  const [lessons, setLessons] = useState<LessonWithStatus[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  
  const [loading, setLoading] = useState({
    lessons: false,
    quiz: false,
    completing: false,
  });
  
  const [error, setError] = useState({
    lessons: null as string | null,
    quiz: null as string | null,
    completing: null as string | null,
  });

  // Load lessons for a course
  const loadLessonsData = useCallback(async (courseId: string, userId?: string) => {
    setLoading(prev => ({ ...prev, lessons: true }));
    setError(prev => ({ ...prev, lessons: null }));

    try {
      const lessonsData = await loadLessons({ courseId, userId });
      setLessons(lessonsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load lessons';
      setError(prev => ({ ...prev, lessons: errorMessage }));
      console.error('Error loading lessons:', err);
    } finally {
      setLoading(prev => ({ ...prev, lessons: false }));
    }
  }, []);

  // Load quiz questions for a lesson
  const loadQuizData = useCallback(async (lessonId: string) => {
    setLoading(prev => ({ ...prev, quiz: true }));
    setError(prev => ({ ...prev, quiz: null }));

    try {
      const quizData = await loadQuizQuestions(lessonId);
      setQuizQuestions(quizData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load quiz questions';
      setError(prev => ({ ...prev, quiz: errorMessage }));
      console.error('Error loading quiz questions:', err);
    } finally {
      setLoading(prev => ({ ...prev, quiz: false }));
    }
  }, []);

  // Complete a lesson
  const completeLesson = useCallback(async (params: {
    userId: string;
    lessonId: string;
    score: number;
    attempts: number;
    timeSpent: number;
  }) => {
    setLoading(prev => ({ ...prev, completing: true }));
    setError(prev => ({ ...prev, completing: null }));

    try {
      const result = await completeLessonProgress(params);
      
      // Update lesson completion status locally
      setLessons(prev => prev.map(lesson => 
        lesson.id === params.lessonId 
          ? { ...lesson, isCompleted: true, score: params.score, attempts: params.attempts }
          : lesson
      ));

      // Update user XP in global state
      appActions.updateUserXP(result.xpEarned);

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete lesson';
      setError(prev => ({ ...prev, completing: errorMessage }));
      console.error('Error completing lesson:', err);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, completing: false }));
    }
  }, [appActions]);

  // Refresh lesson data
  const refreshLessonData = useCallback(async (courseId: string, userId?: string) => {
    await loadLessonsData(courseId, userId);
  }, [loadLessonsData]);

  return {
    lessons,
    quizQuestions,
    loading,
    error,
    actions: {
      loadLessons: loadLessonsData,
      loadQuizQuestions: loadQuizData,
      completeLesson,
      refreshLessonData,
    },
  };
}

// Hook for managing a single lesson's state
export function useLesson(lessonId: string) {
  const { lessons, loading, error, actions } = useLessonData();
  
  const currentLesson = lessons.find(lesson => lesson.id === lessonId);
  
  const loadQuizQuestions = useCallback(async () => {
    await actions.loadQuizQuestions(lessonId);
  }, [actions, lessonId]);

  return {
    lesson: currentLesson,
    loading: loading.lessons,
    error: error.lessons,
    loadQuizQuestions,
    completeLesson: actions.completeLesson,
  };
}

// Hook for managing quiz state with integrated quiz system
export function useQuiz(lessonId: string, userId: string) {
  const { quizQuestions, loading, error, actions } = useLessonData();
  
  // Use the new integrated quiz system
  const integratedQuiz = useQuizSystem({
    lessonId,
    userId,
    autoLoad: true
  });
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Use integrated questions if available, fallback to legacy
  const activeQuestions = integratedQuiz.questions.length > 0 
    ? integratedQuiz.questions 
    : quizQuestions;

  const currentQuestion = activeQuestions[currentQuestionIndex];
  const totalQuestions = activeQuestions.length;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  // Load quiz questions when lessonId changes
  useEffect(() => {
    if (lessonId) {
      actions.loadQuizQuestions(lessonId);
    }
  }, [lessonId, actions]);

  // Reset quiz state when questions change
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setIsCompleted(false);
  }, [quizQuestions]);

  const submitAnswer = useCallback((questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    // Check if answer is correct
    const question = quizQuestions.find(q => q.id === questionId);
    if (question && question.correctAnswer === answer) {
      setScore(prev => prev + 1);
    }
  }, [quizQuestions]);

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

  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setIsCompleted(false);
  }, []);

  const getScorePercentage = useCallback(() => {
    return totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  }, [score, totalQuestions]);

  return {
    // Quiz data
    questions: activeQuestions,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progress,
    
    // Quiz state
    answers,
    score,
    isCompleted,
    scorePercentage: getScorePercentage(),
    
    // Loading and error states
    loading: loading.quiz || integratedQuiz.isLoading,
    error: error.quiz || integratedQuiz.error,
    
    // Actions
    submitAnswer,
    nextQuestion,
    previousQuestion,
    resetQuiz,
    
    // Integrated quiz system
    integratedQuiz: {
      completeQuiz: integratedQuiz.completeQuiz,
      getQuizStats: integratedQuiz.getQuizStats,
      lastResult: integratedQuiz.lastResult,
      isCompleting: integratedQuiz.isCompleting
    }
  };
}