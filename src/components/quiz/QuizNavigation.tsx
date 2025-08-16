import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, BookOpen, Brain, CheckCircle, Clock, Award } from 'lucide-react';
import { QuizSystem } from './QuizSystem';
import { useQuizSystem } from '@/hooks/useQuizSystem';
import { useAuth } from '@/contexts/AuthContext';
import { useCoach } from '@/contexts/CoachContext';
import loadLessons from '@/actions/loadLessons';
import type { Lesson } from '@/types';

interface QuizNavigationProps {
  courseId?: string;
  lessonId?: string;
  onComplete?: (lessonId: string, score: number) => void;
  onNavigateToLesson?: (lessonId: string) => void;
}

export function QuizNavigation({ 
  courseId, 
  lessonId: propLessonId,
  onComplete,
  onNavigateToLesson 
}: QuizNavigationProps) {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { } = useCoach();

  // Get lessonId from props or URL params
  const lessonId = propLessonId || params.lessonId || searchParams.get('lesson') || '';
  const currentCourseId = courseId || params.courseId || searchParams.get('course') || '';

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [lessonsLoading, setLessonsLoading] = useState(false);

  const {
    questions,
    isLoading,
    isCompleting,
    error,
    lastResult,
    loadQuestions,
    completeQuiz,
    resetQuiz,
    getQuizStats
  } = useQuizSystem({
    lessonId,
    userId: user?.userId || '',
    autoLoad: true
  });

  // Load lessons for navigation
  useEffect(() => {
    if (!currentCourseId || !user?.userId) return;

    const loadLessonsData = async () => {
      setLessonsLoading(true);
      try {
        const lessonsData = await loadLessons({ courseId: currentCourseId, userId: user.userId });
        setLessons(lessonsData);
        
        // Find current lesson
        const lesson = lessonsData.find(l => l.id === lessonId);
        setCurrentLesson(lesson || null);
      } catch (err) {
        console.error('Error loading lessons:', err);
      } finally {
        setLessonsLoading(false);
      }
    };

    loadLessonsData();
  }, [currentCourseId, lessonId, user?.userId]);

  // Handle quiz completion
  const handleQuizComplete = async (score: number, totalQuestions: number, answers: Record<string, string>) => {
    if (!user?.userId) return;

    const timeSpent = Math.round((Date.now() - Date.now()) / 1000); // This will be calculated properly in QuizSystem
    const accuracy = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    const result = {
      score,
      totalQuestions,
      answers,
      timeSpent,
      accuracy
    };

    try {
      const completionResult = await completeQuiz(result);
      
      if (completionResult.success) {
        // Call parent completion handler
        onComplete?.(lessonId, score);
        
        // Show success message or navigate
        console.log(`Quiz completed! XP earned: ${completionResult.xpEarned}`);
      }
    } catch (err) {
      console.error('Error completing quiz:', err);
    }
  };

  // Navigation helpers
  const getCurrentLessonIndex = () => {
    return lessons.findIndex(l => l.id === lessonId);
  };

  const getNextLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    return currentIndex >= 0 && currentIndex < lessons.length - 1 
      ? lessons[currentIndex + 1] 
      : null;
  };

  const getPreviousLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    return currentIndex > 0 
      ? lessons[currentIndex - 1] 
      : null;
  };

  const handleNavigateToLesson = (targetLessonId: string) => {
    if (onNavigateToLesson) {
      onNavigateToLesson(targetLessonId);
    } else {
      // Update URL params
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('lesson', targetLessonId);
      if (currentCourseId) {
        newSearchParams.set('course', currentCourseId);
      }
      setSearchParams(newSearchParams);
    }
  };

  const handleNext = () => {
    const nextLesson = getNextLesson();
    if (nextLesson) {
      handleNavigateToLesson(nextLesson.id);
    }
  };

  const handlePrevious = () => {
    const previousLesson = getPreviousLesson();
    if (previousLesson) {
      handleNavigateToLesson(previousLesson.id);
    }
  };

  const handleBackToCourse = () => {
    if (currentCourseId) {
      navigate(`/app/course/${currentCourseId}`);
    } else {
      navigate('/app');
    }
  };

  const quizStats = getQuizStats();

  if (!lessonId) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Lesson Selected</h3>
          <p className="text-muted-foreground mb-4">
            Please select a lesson to view its quiz.
          </p>
          <Button onClick={handleBackToCourse}>
            <BookOpen className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || lessonsLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div>Loading quiz...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <Brain className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Quiz</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="space-x-2">
            <Button onClick={loadQuestions} variant="outline">
              Try Again
            </Button>
            <Button onClick={handleBackToCourse}>
              Back to Course
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quizStats.hasQuestions) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Lesson Header */}
        {currentLesson && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{currentLesson.title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline">
                      {currentLesson.lessonType || 'LESSON'}
                    </Badge>
                    {currentLesson.estimatedMinutes && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {currentLesson.estimatedMinutes} min
                      </div>
                    )}
                    {currentLesson.xpReward && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Award className="h-3 w-3 mr-1" />
                        {currentLesson.xpReward} XP
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="outline" onClick={handleBackToCourse}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Course
                </Button>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* No Quiz Available */}
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-8 text-center">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Quiz Available</h3>
            <p className="text-muted-foreground mb-4">
              This lesson doesn't have a quiz yet. You can still complete the lesson content.
            </p>
            <div className="space-x-2">
              <Button onClick={handleNext} disabled={!getNextLesson()}>
                Next Lesson
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={!getPreviousLesson()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous Lesson
          </Button>

          <Button 
            onClick={handleNext}
            disabled={!getNextLesson()}
          >
            Next Lesson
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Lesson Header */}
      {currentLesson && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{currentLesson.title}</CardTitle>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="outline">
                    Quiz ({quizStats.totalQuestions} questions)
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    ~{quizStats.estimatedDuration} min
                  </div>
                  {currentLesson.xpReward && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Award className="h-3 w-3 mr-1" />
                      {currentLesson.xpReward} XP
                    </div>
                  )}
                  {lastResult && (
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed ({Math.round(lastResult.accuracy)}%)
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {lastResult && (
                  <Button variant="outline" onClick={resetQuiz}>
                    Retake Quiz
                  </Button>
                )}
                <Button variant="outline" onClick={handleBackToCourse}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Course
                </Button>
              </div>
            </div>
            
            {/* Progress indicator */}
            {lessons.length > 1 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>Lesson Progress</span>
                  <span>{getCurrentLessonIndex() + 1} of {lessons.length}</span>
                </div>
                <Progress 
                  value={((getCurrentLessonIndex() + 1) / lessons.length) * 100} 
                  className="h-2" 
                />
              </div>
            )}
          </CardHeader>
        </Card>
      )}

      {/* Quiz System */}
      <QuizSystem
        lessonId={lessonId}
        questions={questions.map(q => ({
          id: q.id,
          lessonId: q.lessonId,
          questionText: q.questionText,
          questionType: q.questionType,
          possibilities: q.possibilities?.map(p => ({
            __typename: "QuizPossibilityObject" as const,
            text: p.text,
            isCorrect: p.isCorrect,
            imageUrl: p.imageUrl,
            audioUrl: p.audioUrl
          })),
          rightAnswerCount: q.rightAnswerCount
        }))}
        onQuizComplete={handleQuizComplete}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isCompleting={isCompleting}
        showNavigation={true}
      />
    </div>
  );
}