import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Brain } from "lucide-react";
import { QuizSystem } from "@/components/quiz/QuizSystem";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface LessonQuizProps {
  questions: QuizQuestion[];
  onQuizComplete: (score: number, totalQuestions: number) => void;
  lessonId?: string;
  useNewSystem?: boolean; // Flag to use the new quiz system
}

export function LessonQuiz({ questions, onQuizComplete, lessonId, useNewSystem = false }: LessonQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; selected: number; correct: boolean }[]>([]);

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  // Handle new quiz system completion
  const handleNewQuizComplete = async (score: number, totalQuestions: number, _answers: Record<string, string>) => {
    onQuizComplete(score, totalQuestions);
  };

  // Use new quiz system if enabled and lessonId is provided
  if (useNewSystem && lessonId) {
    return (
      <QuizSystem
        lessonId={lessonId}
        questions={questions.map(q => ({
          id: q.id,
          questionText: q.question,
          options: q.options,
          correctAnswer: q.options[q.correctAnswer],
          explanation: q.explanation
        }))}
        onQuizComplete={handleNewQuizComplete}
        showNavigation={false}
      />
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === question.correctAnswer;
    const newAnswers = [...answers, {
      questionId: question.id,
      selected: selectedAnswer,
      correct: isCorrect
    }];
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);

    setTimeout(() => {
      if (isLastQuestion) {
        onQuizComplete(isCorrect ? score + 1 : score, questions.length);
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 2000);
  };

  const getOptionVariant = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index ? "default" : "outline";
    }
    
    if (index === question.correctAnswer) {
      return "success";
    }
    
    if (selectedAnswer === index && index !== question.correctAnswer) {
      return "destructive";
    }
    
    return "outline";
  };

  return (
    <Card className="bg-gradient-card shadow-card max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="level" size="lg">
            <Brain className="w-4 h-4 mr-1" />
            Question {currentQuestion + 1} of {questions.length}
          </Badge>
          <div className="text-sm text-muted-foreground">
            Score: {score}/{questions.length}
          </div>
        </div>
        <CardTitle className="text-xl">{question.question}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Answer Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant={getOptionVariant(index)}
              size="lg"
              className="w-full text-left justify-start h-auto p-4 relative"
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
            >
              <div className="flex items-center w-full">
                <span className="flex-1">{option}</span>
                {showResult && index === question.correctAnswer && (
                  <CheckCircle className="w-5 h-5 text-success-foreground ml-2" />
                )}
                {showResult && selectedAnswer === index && index !== question.correctAnswer && (
                  <XCircle className="w-5 h-5 text-destructive-foreground ml-2" />
                )}
              </div>
            </Button>
          ))}
        </div>

        {/* Explanation */}
        {showResult && (
          <Card className="bg-muted/50 border-success animate-fade-in">
            <CardContent className="p-4">
              <h4 className="font-semibold text-success mb-2">
                {selectedAnswer === question.correctAnswer ? "Correct!" : "Not quite right"}
              </h4>
              <p className="text-sm text-muted-foreground">{question.explanation}</p>
            </CardContent>
          </Card>
        )}

        {/* Next Button */}
        <Button
          onClick={handleNext}
          disabled={selectedAnswer === null || showResult}
          variant="experience"
          size="lg"
          className="w-full"
        >
          {isLastQuestion ? "Complete Quiz" : "Next Question"}
        </Button>
      </CardContent>
    </Card>
  );
}