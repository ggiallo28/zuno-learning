import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Brain, Clock, Award, ArrowRight, ArrowLeft, Crown } from 'lucide-react';
import { useZunoManager } from '@/contexts/ZunoManagerContext';
import { useCoach } from '@/contexts/CoachContext';

interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  category?: string;
}

interface AssessmentInterfaceProps {
  assessmentType: 'initial' | 'progress' | 'focus_check';
  onComplete: (results: {
    score: number;
    totalQuestions: number;
    answers: Record<string, string>;
    timeSpent: number;
    identifiedGaps: string[];
    recommendations: string[];
  }) => void;
  onCancel: () => void;
}

// Sample assessment questions based on type
const getAssessmentQuestions = (type: 'initial' | 'progress' | 'focus_check'): AssessmentQuestion[] => {
  const baseQuestions: AssessmentQuestion[] = [
    {
      id: '1',
      question: 'Qual è il tuo livello di esperienza con i concetti di programmazione?',
      options: ['Principiante assoluto', 'Qualche esperienza', 'Intermedio', 'Avanzato'],
      correctAnswer: 'Qualche esperienza',
      category: 'Programming Basics',
      explanation: 'Questa domanda aiuta a valutare il punto di partenza.'
    },
    {
      id: '2',
      question: 'Come preferisci apprendere nuovi concetti?',
      options: ['Leggendo documentazione', 'Guardando video', 'Pratica diretta', 'Discussioni di gruppo'],
      correctAnswer: 'Pratica diretta',
      category: 'Learning Style',
      explanation: 'Comprendere il tuo stile di apprendimento aiuta a personalizzare il percorso.'
    },
    {
      id: '3',
      question: 'Quanto tempo puoi dedicare allo studio ogni giorno?',
      options: ['15-30 minuti', '30-60 minuti', '1-2 ore', 'Più di 2 ore'],
      correctAnswer: '30-60 minuti',
      category: 'Time Management',
      explanation: 'Questo aiuta a pianificare sessioni di studio appropriate.'
    }
  ];

  switch (type) {
    case 'initial':
      return [
        ...baseQuestions,
        {
          id: '4',
          question: 'Hai mai utilizzato strumenti di sviluppo come Git?',
          options: ['Mai sentito', 'Ho sentito parlare', 'Uso base', 'Uso avanzato'],
          correctAnswer: 'Uso base',
          category: 'Development Tools',
          explanation: 'Git è fondamentale per lo sviluppo moderno.'
        },
        {
          id: '5',
          question: 'Qual è il tuo obiettivo principale di apprendimento?',
          options: ['Cambiare carriera', 'Migliorare competenze attuali', 'Hobby personale', 'Progetto specifico'],
          correctAnswer: 'Migliorare competenze attuali',
          category: 'Goals',
          explanation: 'Definire obiettivi chiari migliora la motivazione.'
        }
      ];
    case 'progress':
      return [
        {
          id: 'p1',
          question: 'Come valuti i tuoi progressi nell\'ultimo periodo?',
          options: ['Molto lenti', 'Lenti ma costanti', 'Buoni', 'Eccellenti'],
          correctAnswer: 'Buoni',
          category: 'Progress Evaluation',
          explanation: 'L\'autovalutazione è importante per il miglioramento continuo.'
        },
        {
          id: 'p2',
          question: 'Quali aree senti di aver migliorato di più?',
          options: ['Concetti teorici', 'Implementazione pratica', 'Problem solving', 'Tutte le aree'],
          correctAnswer: 'Implementazione pratica',
          category: 'Skill Development',
          explanation: 'Riconoscere i miglioramenti aumenta la fiducia.'
        },
        {
          id: 'p3',
          question: 'Su cosa vorresti concentrarti di più?',
          options: ['Nuovi argomenti', 'Approfondire esistenti', 'Progetti pratici', 'Revisione generale'],
          correctAnswer: 'Progetti pratici',
          category: 'Focus Areas',
          explanation: 'I progetti pratici consolidano l\'apprendimento.'
        }
      ];
    case 'focus_check':
      return [
        {
          id: 'f1',
          question: 'Quale argomento ti sta creando più difficoltà?',
          options: ['Concetti base', 'Implementazione', 'Debugging', 'Architettura'],
          correctAnswer: 'Debugging',
          category: 'Current Challenges',
          explanation: 'Il debugging è una competenza cruciale da sviluppare.'
        },
        {
          id: 'f2',
          question: 'Quanto tempo dedichi alla pratica settimanalmente?',
          options: ['Meno di 2 ore', '2-5 ore', '5-10 ore', 'Più di 10 ore'],
          correctAnswer: '5-10 ore',
          category: 'Practice Time',
          explanation: 'La pratica regolare è essenziale per il progresso.'
        }
      ];
    default:
      return baseQuestions;
  }
};

export function AssessmentInterface({ assessmentType, onComplete, onCancel }: AssessmentInterfaceProps) {
  const [questions] = useState<AssessmentQuestion[]>(getAssessmentQuestions(assessmentType));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startTime] = useState<number>(Date.now());
  const [showResults, setShowResults] = useState(false);
  
  const { getCoordinationMessage } = useZunoManager();
  const { currentCoach } = useCoach();

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Complete assessment
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      const score = calculateScore();
      const results = analyzeResults(score, timeSpent);
      
      setShowResults(true);
      onComplete(results);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = (): number => {
    // For assessment, we don't have "correct" answers in the traditional sense
    // Instead, we evaluate based on learning readiness and engagement
    let score = 0;
    const totalPossible = questions.length;

    questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer) {
        // Give points for answering (engagement)
        score += 1;
        
        // Give bonus points for answers that indicate good learning practices
        if (userAnswer.includes('Pratica') || userAnswer.includes('Buoni') || userAnswer.includes('avanzato')) {
          score += 0.5;
        }
      }
    });

    return Math.min(100, Math.round((score / totalPossible) * 100));
  };

  const analyzeResults = (score: number, timeSpent: number) => {
    const identifiedGaps: string[] = [];
    const recommendations: string[] = [];

    // Analyze answers to identify gaps and provide recommendations
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      
      if (question.category === 'Programming Basics' && userAnswer === 'Principiante assoluto') {
        identifiedGaps.push('Concetti di programmazione di base');
        recommendations.push('Inizia con i fondamenti della programmazione');
      }
      
      if (question.category === 'Development Tools' && (userAnswer === 'Mai sentito' || userAnswer === 'Ho sentito parlare')) {
        identifiedGaps.push('Strumenti di sviluppo');
        recommendations.push('Impara Git e altri strumenti essenziali');
      }
      
      if (question.category === 'Time Management' && userAnswer === '15-30 minuti') {
        recommendations.push('Considera di aumentare il tempo di studio per progressi più rapidi');
      }
    });

    // Add general recommendations based on assessment type
    switch (assessmentType) {
      case 'initial':
        recommendations.push('Inizia con corsi introduttivi adatti al tuo livello');
        recommendations.push('Stabilisci una routine di studio regolare');
        break;
      case 'progress':
        recommendations.push('Continua con progetti pratici per consolidare le competenze');
        recommendations.push('Considera argomenti più avanzati nelle aree di forza');
        break;
      case 'focus_check':
        recommendations.push('Concentrati sulle aree che richiedono più attenzione');
        recommendations.push('Dedica tempo extra alla pratica nelle aree deboli');
        break;
    }

    return {
      score,
      totalQuestions,
      answers,
      timeSpent,
      identifiedGaps,
      recommendations
    };
  };

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
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Progresso</span>
              <span>{currentQuestionIndex + 1} di {totalQuestions}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">
              <Brain className="w-4 h-4 mr-1" />
              Domanda {currentQuestionIndex + 1}
            </Badge>
            {currentQuestion.category && (
              <Badge variant="secondary">
                {currentQuestion.category}
              </Badge>
            )}
          </div>
          <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Answer Options */}
          <div className="space-y-3">
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onValueChange={handleAnswerSelect}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value={option} 
                    id={`q${currentQuestion.id}_${index}`}
                  />
                  <Label 
                    htmlFor={`q${currentQuestion.id}_${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    <Button
                      variant={answers[currentQuestion.id] === option ? "default" : "outline"}
                      size="lg"
                      className="w-full text-left justify-start h-auto p-4"
                      onClick={() => handleAnswerSelect(option)}
                    >
                      {option}
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
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Precedente
            </Button>

            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
              variant="default"
              size="lg"
            >
              {isLastQuestion ? 'Completa Assessment' : 'Prossima Domanda'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Info */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Tempo stimato: {Math.ceil((totalQuestions - currentQuestionIndex) * 1.5)} min rimanenti</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>XP alla completazione: {totalQuestions * 10}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}