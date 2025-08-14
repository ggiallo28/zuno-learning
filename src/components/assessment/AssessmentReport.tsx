// import React from 'react';
import { AssessmentSession } from '@/types/assessment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, Zap } from 'lucide-react';

interface AssessmentReportProps {
  session: AssessmentSession;
  onRestart: () => void;
  onComplete?: (results: any) => void;
}

export function AssessmentReport({ session, onRestart, onComplete }: AssessmentReportProps) {
  const totalTime = session.completedAt && session.startedAt 
    ? Math.round((session.completedAt.getTime() - session.startedAt.getTime()) / 1000 / 60)
    : 0;
    
  const avgScore = session.responses.reduce((sum, r) => sum + r.partialScore, 0) / session.responses.length;
  
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">Assessment Completato!</CardTitle>
            <div className="flex justify-center gap-4">
              <Badge variant="default" className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                Punteggio: {Math.round(avgScore * 100)}%
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {totalTime} minuti
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                {session.currentStreak} streak
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(session.topicMastery).map(([topic, mastery]) => (
                <div key={topic} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{topic}</span>
                    <Badge variant={mastery.masteryLevel > 0.7 ? 'default' : 'outline'}>
                      {Math.round(mastery.masteryLevel * 100)}%
                    </Badge>
                  </div>
                  <Progress value={mastery.masteryLevel * 100} />
                </div>
              ))}
            </div>
            
            <div className="flex gap-4 justify-center mt-8">
              <Button onClick={onRestart} variant="outline">
                Ripeti Assessment
              </Button>
              {onComplete && (
                <Button onClick={() => onComplete(session)}>
                  Continua
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}