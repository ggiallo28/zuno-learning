import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AssessmentProvider, useAssessment } from '@/contexts/AssessmentContext';
import { PrecisionBar } from './PrecisionBar';
import { EarlyStopDialog } from './EarlyStopDialog';

function EarlyStoppingDemoContent() {
  const assessment = useAssessment();
  const [showEarlyStopDialog, setShowEarlyStopDialog] = useState(false);
  const [, setQuestionCount] = useState(0);

  const simulateAnswer = (correct: boolean, confidence: 'certo' | 'forse') => {
    assessment.submitAnswer(correct, confidence);
    setQuestionCount(prev => prev + 1);
    
    // Check if precision threshold is reached
    if (assessment.state.precision >= assessment.state.targetPrecision && 
        assessment.state.answered >= 3) {
      setShowEarlyStopDialog(true);
    }
  };

  const handleEarlyStopContinue = () => {
    setShowEarlyStopDialog(false);
  };

  const handleEarlyStopComplete = () => {
    setShowEarlyStopDialog(false);
    assessment.pause();
    alert(`Assessment completed early with ${Math.round(assessment.state.precision * 100)}% precision!`);
  };

  const resetDemo = () => {
    assessment.reset();
    setQuestionCount(0);
    setShowEarlyStopDialog(false);
  };

  const startAssessment = () => {
    assessment.start();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Early Stopping Demo</CardTitle>
          <p className="text-sm text-muted-foreground">
            Simulate answering questions to see precision tracking and early stopping in action.
            Target precision: {Math.round(assessment.state.targetPrecision * 100)}%
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Assessment Status */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Status:</span> {assessment.state.running ? 'Running' : 'Stopped'}
            </div>
            <div>
              <span className="font-medium">Questions Answered:</span> {assessment.state.answered}
            </div>
            <div>
              <span className="font-medium">Current Precision:</span> {Math.round(assessment.state.precision * 100)}%
            </div>
            <div>
              <span className="font-medium">Target Precision:</span> {Math.round(assessment.state.targetPrecision * 100)}%
            </div>
          </div>

          {/* Precision Bar */}
          {assessment.state.answered > 0 && (
            <div>
              <PrecisionBar stopAt={assessment.state.targetPrecision} />
            </div>
          )}

          {/* Controls */}
          <div className="space-y-3">
            {!assessment.state.running ? (
              <Button onClick={startAssessment} className="w-full">
                Start Assessment
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium">Simulate answering questions:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => simulateAnswer(true, 'certo')}
                    variant="outline"
                    size="sm"
                  >
                    Correct + Confident
                  </Button>
                  <Button 
                    onClick={() => simulateAnswer(true, 'forse')}
                    variant="outline"
                    size="sm"
                  >
                    Correct + Uncertain
                  </Button>
                  <Button 
                    onClick={() => simulateAnswer(false, 'certo')}
                    variant="outline"
                    size="sm"
                  >
                    Wrong + Confident
                  </Button>
                  <Button 
                    onClick={() => simulateAnswer(false, 'forse')}
                    variant="outline"
                    size="sm"
                  >
                    Wrong + Uncertain
                  </Button>
                </div>
              </div>
            )}

            <Button onClick={resetDemo} variant="secondary" className="w-full">
              Reset Demo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Early Stop Dialog */}
      <EarlyStopDialog
        open={showEarlyStopDialog}
        precisionPct={Math.round(assessment.state.precision * 100)}
        onContinue={handleEarlyStopContinue}
        onStop={handleEarlyStopComplete}
      />
    </div>
  );
}

export function EarlyStoppingDemo() {
  return (
    <AssessmentProvider>
      <EarlyStoppingDemoContent />
    </AssessmentProvider>
  );
}