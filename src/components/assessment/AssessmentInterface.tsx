import { useState } from 'react';
import { useAssessment } from '@/hooks/useAssessment';
import { CoachType, TopicType } from '@/types/assessment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  Clock, 
  Target,
  Zap,
  Trophy,
  AlertCircle
} from 'lucide-react';
import { CoachSelector } from './CoachSelector';
import { QuestionRenderer } from './QuestionRenderer';
import { AssessmentReport } from './AssessmentReport';
import { ConfidenceSlider } from './ConfidenceSlider';

interface AssessmentInterfaceProps {
  onComplete?: (results: any) => void;
  onCancel?: () => void;
}

export function AssessmentInterface({ onComplete, onCancel }: AssessmentInterfaceProps) {
  const {
    session,
    currentItem,
    loading,
    error,
    hintsUsed,
    showHint,
    confidence,
    startAssessment,
    submitResponse,
    useHint,
    goToPrevious,
    setConfidence,
    progress,
    canUseHint,
    canGoBack
  } = useAssessment();

  const [selectedCoach, setSelectedCoach] = useState<CoachType>('skippy');
  const [selectedTopics, setSelectedTopics] = useState<TopicType[]>(['arrays', 'hooks', 'functions']);
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [startTime] = useState(Date.now());

  // Show coach selection if no session started
  if (!session) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Assessment Adattivo</h1>
            <p className="text-muted-foreground text-lg mb-6">
              Misura la tua padronanza attraverso domande personalizzate e adattive
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {(['arrays', 'hooks', 'types', 'functions', 'objects', 'async'] as TopicType[]).map(topic => (
                <Badge
                  key={topic}
                  variant={selectedTopics.includes(topic) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedTopics(prev => 
                    prev.includes(topic) 
                      ? prev.filter(t => t !== topic)
                      : [...prev, topic]
                  )}
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          <CoachSelector
            selectedCoach={selectedCoach}
            onSelectCoach={setSelectedCoach}
            className="mb-8"
          />

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => startAssessment(selectedCoach, selectedTopics)}
              disabled={selectedTopics.length === 0 || loading}
              className="bg-primary hover:bg-primary-variant text-primary-foreground px-8 py-3"
            >
              {loading ? 'Iniziando...' : 'Inizia Assessment'}
            </Button>
            
            {onCancel && (
              <Button
                variant="ghost"
                onClick={onCancel}
                className="ml-4"
              >
                Annulla
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show final report if session completed
  if (session.completedAt) {
    return (
      <AssessmentReport
        session={session}
        onRestart={() => startAssessment(selectedCoach, selectedTopics)}
        onComplete={onComplete}
      />
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Errore</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Riprova
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state
  if (loading || !currentItem) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Caricamento prossima domanda...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
  const isAnswerValid = currentAnswer !== null && currentAnswer !== undefined && currentAnswer !== '';

  return (
    <div className="min-h-screen bg-background">
      {/* Header with progress */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="font-mono">
                {session.currentItemIndex + 1} / {session.totalItems}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {currentItem.topic}
              </Badge>
              <Badge 
                variant={currentItem.difficulty === 'expert' ? 'destructive' : 
                       currentItem.difficulty === 'advanced' ? 'default' : 'secondary'}
              >
                {currentItem.difficulty}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
              </div>
              
              {session.currentStreak > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {session.currentStreak} streak
                </Badge>
              )}
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto p-4">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">
                  {currentItem.question}
                </CardTitle>
                
                {currentItem.format && (
                  <Badge variant="outline" className="text-xs">
                    {currentItem.format.replace('_', ' ')}
                  </Badge>
                )}
              </div>
              
              {canUseHint && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={useHint}
                  className="flex items-center gap-1"
                >
                  <HelpCircle className="w-4 h-4" />
                  Suggerimento
                </Button>
              )}
            </div>
            
            {showHint && currentItem.hint && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Suggerimento:</strong> {currentItem.hint}
                </p>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            <QuestionRenderer
              item={currentItem}
              answer={currentAnswer}
              onAnswerChange={setCurrentAnswer}
              disabled={loading}
              coachType={session.coachType}
            />
          </CardContent>
        </Card>

        {/* Confidence and controls */}
        <div className="space-y-4">
          <ConfidenceSlider
            value={confidence}
            onChange={setConfidence}
            disabled={loading}
          />
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={goToPrevious}
              disabled={!canGoBack || loading}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Precedente
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {hintsUsed > 0 && (
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-4 h-4" />
                  {hintsUsed} suggerimenti usati
                </span>
              )}
              
              <span className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                Punteggio: {Math.round(session.totalScore * 100)}
              </span>
            </div>
            
            <Button
              onClick={() => submitResponse(currentAnswer)}
              disabled={!isAnswerValid || loading}
              className="flex items-center gap-2"
            >
              {loading ? 'Valutando...' : (
                session.currentItemIndex === session.totalItems - 1 ? 'Completa' : 'Avanti'
              )}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}