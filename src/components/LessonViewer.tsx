import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, Clock, Award, ArrowRight, ArrowLeft, Crown, Brain } from 'lucide-react';
import { useZunoManager } from '@/contexts/ZunoManagerContext';
import { useCoach } from '@/contexts/CoachContext';
import { QuizSystem } from '@/components/quiz/QuizSystem';
import { useQuizSystem } from '@/hooks/useQuizSystem';
import { useAuth } from '@/contexts/AuthContext';
import type { Lesson } from '@/types';
import { LessonTypeValues } from '@/types';

interface QuizQuestion {
  id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'fill_blank';
  correct_answer: string;
  options?: string[];
  explanation?: string;
  points: number;
}

interface LessonViewerProps {
  lesson: Lesson;
  questions?: QuizQuestion[];
  onComplete: (score?: number) => Promise<void>;
  onNext?: () => void;
  onPrevious?: () => void;
  onBackToCourse?: () => void;
  isCompleting?: boolean;
  useIntegratedQuiz?: boolean; // New prop to use the integrated quiz system
}

export function LessonViewer({ 
  lesson, 
  questions = [], 
  onComplete, 
  onBackToCourse,
  onNext, 
  onPrevious, 
  isCompleting,
  useIntegratedQuiz = true
}: LessonViewerProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number>(0);
  const { getCoordinationMessage } = useZunoManager();
  const { currentCoach } = useCoach();
  const { user } = useAuth();

  // Integrated quiz system
  const {
    questions: integratedQuestions,
    isLoading: quizLoading,
    isCompleting: quizCompleting,
    error: quizError,
    getQuizStats
  } = useQuizSystem({
    lessonId: lesson.id,
    userId: user?.userId || '',
    autoLoad: useIntegratedQuiz && lesson.lessonType === LessonTypeValues.QUIZ
  });

  const lessonType = lesson.lessonType ?? LessonTypeValues.TEXT;
  const quizStats = getQuizStats();

  // Use integrated questions if available and enabled
  const activeQuestions = useIntegratedQuiz && integratedQuestions.length > 0 
    ? integratedQuestions 
    : questions;

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  // Handle integrated quiz completion
  const handleIntegratedQuizComplete = async (score: number, totalQuestions: number, _answers: Record<string, string>) => {
    const finalScore = totalQuestions > 0 ? (score / totalQuestions) * 100 : 100;
    await onComplete(finalScore);
  };

  const handleSubmitQuiz = async () => {
    if (lessonType !== LessonTypeValues.QUIZ) return;

    let correct = 0;
    const total = questions.length;

    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) {
        correct++;
      }
    });

    const finalScore = total > 0 ? (correct / total) * 100 : 100;
    setScore(finalScore);
    setShowResults(true);
    
    await onComplete(finalScore);
  };

  const handleCompleteLesson = async () => {
    await onComplete();
  };

  const getLessonTypeIcon = () => {
    switch (lesson.lessonType) {
      case LessonTypeValues.QUIZ: return '🧠';
      case LessonTypeValues.PRACTICE: return '💪';
      case LessonTypeValues.GAME: return '🎮';
      default: return '📖';
    }
  };

  const getLessonTypeColor = () => {
    switch (lesson.lessonType) {
      case LessonTypeValues.QUIZ: return 'bg-blue-100 text-blue-800';
      case LessonTypeValues.PRACTICE: return 'bg-green-100 text-green-800';
      case LessonTypeValues.GAME: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back to Course Button */}
      {onBackToCourse && (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={onBackToCourse}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Course
          </Button>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getLessonTypeIcon()}</span>
              <div>
                <CardTitle className="text-xl">{lesson.title}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getLessonTypeColor()}>
                    {lesson.lessonType}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {lesson.estimatedMinutes} min
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Award className="h-3 w-3 mr-1" />
                    {lesson.xpReward} XP
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        {/* Zuno Manager Coordination Message */}
        <div className="px-6 pb-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Zuno Manager</span>
            </div>
            <p className="text-sm text-blue-700">
              {getCoordinationMessage(currentCoach, 'lesson')}
            </p>
          </div>
        </div>
        
        <CardContent className="space-y-6">
          {lessonType === LessonTypeValues.TEXT && (
            <div className="prose max-w-none">
              <div className="whitespace-pre-line text-base leading-relaxed">
                {lesson.content}
              </div>
            </div>
          )}

          {lessonType === LessonTypeValues.QUIZ && !showResults && (
            <div className="space-y-6">
              {/* Lesson content */}
              {lesson.content && (
                <div className="prose max-w-none mb-6">
                  <div className="whitespace-pre-line text-base leading-relaxed">
                    {lesson.content}
                  </div>
                </div>
              )}
              
              {/* Integrated Quiz System */}
              {useIntegratedQuiz && (quizStats.hasQuestions || lessonType === LessonTypeValues.QUIZ) ? (
                <div className="space-y-4">
                  {quizLoading && (
                    <Card className="p-6 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <div>Loading quiz questions...</div>
                    </Card>
                  )}
                  
                  {quizError && (
                    <Card className="p-6 text-center border-red-200 bg-red-50">
                      <Brain className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <p className="text-red-700">Error loading quiz: {quizError}</p>
                    </Card>
                  )}
                  
                  {!quizLoading && !quizError && (
                    <QuizSystem
                      lessonId={lesson.id}
                      questions={integratedQuestions.map(q => ({
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
                      onQuizComplete={handleIntegratedQuizComplete}
                      onNext={onNext}
                      onPrevious={onPrevious}
                      isCompleting={isCompleting || quizCompleting}
                      showNavigation={false} // Navigation handled by parent
                    />
                  )}
                </div>
              ) : (
                // Fallback to legacy quiz system
                <div className="space-y-6">
                  {activeQuestions.map((question, index) => (
                    <Card key={question.id} className="p-4">
                      <div className="space-y-4">
                        <h4 className="font-medium">
                          Question {index + 1}: {(question as any).question_text}
                        </h4>
                        
                        {(question as any).question_type === 'multiple_choice' && (question as any).options && (
                          <RadioGroup
                            value={answers[question.id as any] || ''}
                            onValueChange={(value) => handleAnswerChange(question.id as any, value)}
                          >
                            {(question as any).options.map((option: any, optionIndex: number) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`q${question.id}_${optionIndex}`} />
                                <Label htmlFor={`q${question.id}_${optionIndex}`}>{option}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}
                        
                        {(question as any).question_type === 'true_false' && (
                          <RadioGroup
                            value={answers[question.id as any] || ''}
                            onValueChange={(value) => handleAnswerChange(question.id as any, value)}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="true" id={`q${question.id}_true`} />
                              <Label htmlFor={`q${question.id}_true`}>True</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="false" id={`q${question.id}_false`} />
                              <Label htmlFor={`q${question.id}_false`}>False</Label>
                            </div>
                          </RadioGroup>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {lessonType === LessonTypeValues.QUIZ && showResults && (
            <div className="space-y-6">
              <Card className="p-6 text-center">
                <div className="space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <div>
                    <h3 className="text-2xl font-bold">Quiz Complete!</h3>
                    <p className="text-lg text-muted-foreground">
                      You scored {Math.round(score)}%
                    </p>
                  </div>
                  <Progress value={score} className="h-3" />
                  <Badge variant={score >= 70 ? "default" : "secondary"} className="text-sm">
                    {score >= 70 ? 'Passed' : 'Needs Review'}
                  </Badge>
                </div>
              </Card>
              
              <div className="space-y-4">
                {questions.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const isCorrect = userAnswer === question.correct_answer;
                  
                  return (
                    <Card key={question.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {isCorrect ? '✓' : '✗'}
                          </span>
                          <div className="flex-1">
                            <h4 className="font-medium">Question {index + 1}: {question.question_text}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Your answer: <strong>{userAnswer || 'No answer'}</strong>
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-green-700 mt-1">
                                Correct answer: <strong>{question.correct_answer}</strong>
                              </p>
                            )}
                            {question.explanation && (
                              <p className="text-sm text-blue-700 mt-2 italic">
                                {question.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {lessonType === LessonTypeValues.PRACTICE && (
            <div className="space-y-4">
              <div className="prose max-w-none">
                <div className="whitespace-pre-line text-base leading-relaxed">
                  {lesson.content}
                </div>
              </div>
              <Card className="p-6 bg-yellow-50 border-yellow-200">
                <h4 className="font-medium mb-2">Practice Exercise</h4>
                <p className="text-sm text-muted-foreground">
                  Complete the practice exercise described above. Click "Complete" when you're done!
                </p>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          disabled={!onPrevious}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex space-x-2">
          {lessonType === LessonTypeValues.QUIZ && !showResults && !useIntegratedQuiz && (
            <Button 
              onClick={handleSubmitQuiz}
              disabled={Object.keys(answers).length < activeQuestions.length || isCompleting}
            >
              {isCompleting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          )}
          
          {(lessonType !== LessonTypeValues.QUIZ || showResults) && (
            <Button 
              onClick={handleCompleteLesson}
              disabled={isCompleting}
            >
              {isCompleting ? 'Completing...' : 'Complete Lesson'}
            </Button>
          )}
        </div>

        <Button 
          onClick={onNext}
          disabled={!onNext}
        >
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
