import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, Clock, Award, ArrowRight, ArrowLeft } from 'lucide-react';
import type { Lesson } from '@/types';

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
  isCompleting?: boolean;
}

export function LessonViewer({ 
  lesson, 
  questions = [], 
  onComplete, 
  onNext, 
  onPrevious, 
  isCompleting 
}: LessonViewerProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number>(0);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitQuiz = async () => {
    if (lesson.lesson_type !== 'quiz') return;

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
    switch (lesson.lesson_type) {
      case 'quiz': return '🧠';
      case 'practice': return '💪';
      case 'game': return '🎮';
      default: return '📖';
    }
  };

  const getLessonTypeColor = () => {
    switch (lesson.lesson_type) {
      case 'quiz': return 'bg-blue-100 text-blue-800';
      case 'practice': return 'bg-green-100 text-green-800';
      case 'game': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getLessonTypeIcon()}</span>
              <div>
                <CardTitle className="text-xl">{lesson.title}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getLessonTypeColor()}>
                    {lesson.lesson_type}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {lesson.estimated_minutes} min
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Award className="h-3 w-3 mr-1" />
                    {lesson.xp_reward} XP
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {lesson.lesson_type === 'text' && (
            <div className="prose max-w-none">
              <div className="whitespace-pre-line text-base leading-relaxed">
                {lesson.content}
              </div>
            </div>
          )}

          {lesson.lesson_type === 'quiz' && !showResults && (
            <div className="space-y-6">
              <div className="prose max-w-none mb-6">
                <div className="whitespace-pre-line text-base leading-relaxed">
                  {lesson.content}
                </div>
              </div>
              
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <Card key={question.id} className="p-4">
                    <div className="space-y-4">
                      <h4 className="font-medium">
                        Question {index + 1}: {question.question_text}
                      </h4>
                      
                      {question.question_type === 'multiple_choice' && question.options && (
                        <RadioGroup
                          value={answers[question.id] || ''}
                          onValueChange={(value) => handleAnswerChange(question.id, value)}
                        >
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`q${question.id}_${optionIndex}`} />
                              <Label htmlFor={`q${question.id}_${optionIndex}`}>{option}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                      
                      {question.question_type === 'true_false' && (
                        <RadioGroup
                          value={answers[question.id] || ''}
                          onValueChange={(value) => handleAnswerChange(question.id, value)}
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
            </div>
          )}

          {lesson.lesson_type === 'quiz' && showResults && (
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

          {lesson.lesson_type === 'practice' && (
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
          {lesson.lesson_type === 'quiz' && !showResults && (
            <Button 
              onClick={handleSubmitQuiz}
              disabled={Object.keys(answers).length < questions.length || isCompleting}
            >
              {isCompleting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          )}
          
          {(lesson.lesson_type !== 'quiz' || showResults) && (
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
