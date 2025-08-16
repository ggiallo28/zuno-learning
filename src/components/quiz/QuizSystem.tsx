import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Brain, Clock, Award, ArrowRight, ArrowLeft, Crown } from 'lucide-react';
import { useZunoManager } from '@/contexts/ZunoManagerContext';
import { useCoach } from '@/contexts/CoachContext';
import type { QuizPossibilityObject } from '@/types';

interface QuizQuestion {
  id: string;
  lessonId?: string;
  questionText?: string;
  questionType?: string;
  possibilities?: QuizPossibilityObject[];
  rightAnswerCount?: number;
  // Legacy support
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  points?: number;
}

interface QuizSystemProps {
  lessonId: string;
  questions: QuizQuestion[];
  onQuizComplete: (score: number, totalQuestions: number, answers: Record<string, string>) => Promise<void>;
  onNext?: () => void;
  onPrevious?: () => void;
  isCompleting?: boolean;
  showNavigation?: boolean;
}

interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

export function QuizSystem({ 
  lessonId,
  questions, 
  onQuizComplete, 
  onNext, 
  onPrevious, 
  isCompleting = false,
  showNavigation = true
}: QuizSystemProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  
  const { getCoordinationMessage } = useZunoManager();
  const { currentCoach } = useCoach();

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // Reset quiz state when questions change
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setShowResults(false);
    setQuizAnswers([]);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
  }, [questions, lessonId]);

  // Update question start time when question changes
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  const handleAnswerSelect = useCallback((answer: string) => {
    if (showResults || !currentQuestion) return;
    
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
  }, [currentQuestion, showResults]);

  const getCorrectAnswer = useCallback((question: QuizQuestion): string => {
    // Try to get correct answer from possibilities
    if (question.possibilities) {
      const correctPossibility = question.possibilities.find(p => p.isCorrect);
      if (correctPossibility) return correctPossibility.text;
    }
    
    // Fallback to legacy correctAnswer
    return question.correctAnswer || '';
  }, []);

  const getQuestionOptions = useCallback((question: QuizQuestion): string[] => {
    // Try to get options from possibilities
    if (question.possibilities) {
      return question.possibilities.map(p => p.text);
    }
    
    // Fallback to legacy options
    return question.options || [];
  }, []);

  const handleNextQuestion = useCallback(() => {
    if (!currentQuestion || !answers[currentQuestion.id]) return;

    const selectedAnswer = answers[currentQuestion.id];
    const correctAnswer = getCorrectAnswer(currentQuestion);
    const isCorrect = selectedAnswer === correctAnswer;
    const timeSpent = Date.now() - questionStartTime;

    // Record the answer
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent
    };

    setQuizAnswers(prev => [...prev, newAnswer]);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    if (isLastQuestion) {
      setShowResults(true);
      // Complete the quiz
      const finalScore = isCorrect ? score + 1 : score;
      onQuizComplete(finalScore, totalQuestions, answers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestion, answers, questionStartTime, isLastQuestion, score, totalQuestions, onQuizComplete, getCorrectAnswer]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const getOptionVariant = useCallback((option: string) => {
    if (!showResults) {
      return answers[currentQuestion?.id || ''] === option ? "default" : "outline";
    }
    
    const correctAnswer = getCorrectAnswer(currentQuestion);
    if (option === correctAnswer) {
      return "success";
    }
    
    if (answers[currentQuestion?.id || ''] === option && option !== correctAnswer) {
      return "destructive";
    }
    
    return "outline";
  }, [showResults, answers, currentQuestion, getCorrectAnswer]);

  const getScorePercentage = useCallback(() => {
    return totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  }, [score, totalQuestions]);

  const getTotalTimeSpent = useCallback(() => {
    return Math.round((Date.now() - startTime) / 1000);
  }, [startTime]);

  if (!currentQuestion && !showResults) {
    return (
      <Card className="bg-gradient-card shadow-card max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Quiz Questions Available</h3>
          <p className="text-muted-foreground">
            This lesson doesn't have any quiz questions yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const scorePercentage = getScorePercentage();
    const totalTime = getTotalTimeSpent();
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Zuno Manager Coordination Message */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Zuno Manager</span>
          </div>
          <p className="text-sm text-blue-700">
            {getCoordinationMessage(currentCoach, 'general')}
          </p>
        </div>

        {/* Quiz Results Summary */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-center">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                {scorePercentage >= 70 ? (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                ) : (
                  <XCircle className="h-16 w-16 text-orange-500" />
                )}
              </div>
              
              <div>
                <h3 className="text-2xl font-bold">Score: {score}/{totalQuestions}</h3>
                <p className="text-lg text-muted-foreground">
                  {scorePercentage}% Correct
                </p>
              </div>
              
              <Progress value={scorePercentage} className="h-3 max-w-md mx-auto" />
              
              <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {totalTime}s
                </div>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  {Math.round(scorePercentage * 0.1)} XP
                </div>
              </div>
              
              <Badge variant={scorePercentage >= 70 ? "default" : "secondary"} className="text-sm">
                {scorePercentage >= 70 ? 'Passed' : 'Needs Review'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Question Review</h3>
          {questions.map((question, index) => {
            const userAnswer = answers[question.id];
            const correctAnswer = getCorrectAnswer(question);
            const isCorrect = userAnswer === correctAnswer;
            const answerData = quizAnswers.find(a => a.questionId === question.id);
            
            return (
              <Card key={question.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-medium">Question {index + 1}: {question.questionText}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your answer: <strong>{userAnswer || 'No answer'}</strong>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-700 mt-1">
                          Correct answer: <strong>{correctAnswer}</strong>
                        </p>
                      )}
                      {question.explanation && (
                        <p className="text-sm text-blue-700 mt-2 italic">
                          {question.explanation}
                        </p>
                      )}
                      {answerData && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Time spent: {Math.round(answerData.timeSpent / 1000)}s
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Navigation */}
        {showNavigation && (
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={onPrevious}
              disabled={!onPrevious}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button 
              onClick={onNext}
              disabled={!onNext || isCompleting}
            >
              {isCompleting ? 'Completing...' : 'Continue'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Zuno Manager Coordination Message */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Zuno Manager</span>
        </div>
        <p className="text-sm text-blue-700">
          {getCoordinationMessage(currentCoach, 'general')}
        </p>
      </div>

      {/* Quiz Question */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="level" size="lg">
              <Brain className="w-4 h-4 mr-1" />
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </Badge>
            <div className="text-sm text-muted-foreground">
              Score: {score}/{totalQuestions}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <CardTitle className="text-xl">{currentQuestion.questionText}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Answer Options */}
          <div className="space-y-3">
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onValueChange={handleAnswerSelect}
            >
              {getQuestionOptions(currentQuestion).map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value={option} 
                    id={`q${currentQuestion.id}_${index}`}
                    disabled={showResults}
                  />
                  <Label 
                    htmlFor={`q${currentQuestion.id}_${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    <Button
                      variant={getOptionVariant(option)}
                      size="lg"
                      className="w-full text-left justify-start h-auto p-4"
                      disabled={showResults}
                      onClick={() => handleAnswerSelect(option)}
                    >
                      <div className="flex items-center w-full">
                        <span className="flex-1">{option}</span>
                        {showResults && option === getCorrectAnswer(currentQuestion) && (
                          <CheckCircle className="w-5 h-5 text-success-foreground ml-2" />
                        )}
                        {showResults && answers[currentQuestion.id] === option && option !== getCorrectAnswer(currentQuestion) && (
                          <XCircle className="w-5 h-5 text-destructive-foreground ml-2" />
                        )}
                      </div>
                    </Button>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={handleNextQuestion}
              disabled={!answers[currentQuestion.id] || isCompleting}
              variant="experience"
              size="lg"
            >
              {isCompleting ? 'Submitting...' : (isLastQuestion ? 'Complete Quiz' : 'Next Question')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Navigation */}
      {showNavigation && (
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={onPrevious}
            disabled={!onPrevious}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous Lesson
          </Button>

          <Button 
            onClick={onNext}
            disabled={!onNext}
            variant="ghost"
          >
            Skip to Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}