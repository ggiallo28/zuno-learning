import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  Zap, 
  CheckCircle, 
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ItemResponse, ConfidenceLevel } from '@/types/assessment';
import type { Confidence } from '@/contexts/AssessmentContext';

interface ScoringSystemProps {
  responses: ItemResponse[];
  showDetails?: boolean;
  className?: string;
}

interface ScoreBreakdown {
  totalScore: number;
  baseScore: number;
  confidenceBonus: number;
  confidencePenalty: number;
  streakBonus: number;
  difficultyBonus: number;
  breakdown: ScoreDetail[];
}

interface ScoreDetail {
  responseId: string;
  basePoints: number;
  confidenceMultiplier: number;
  finalPoints: number;
  isCorrect: boolean;
  confidence: ConfidenceLevel | Confidence;
  difficulty: string;
  streakPosition?: number;
}

// Confidence-based scoring configuration
const CONFIDENCE_SCORING = {
  certo: {
    correctMultiplier: 1.5,  // 50% bonus
    incorrectPenalty: 0.5,   // 50% penalty
    basePoints: 100
  },
  forse: {
    correctMultiplier: 1.0,  // No bonus
    incorrectPenalty: 0.2,   // 20% penalty
    basePoints: 100
  },
  high: {
    correctMultiplier: 1.3,  // 30% bonus
    incorrectPenalty: 0.4,   // 40% penalty
    basePoints: 100
  },
  medium: {
    correctMultiplier: 1.0,  // No bonus
    incorrectPenalty: 0.3,   // 30% penalty
    basePoints: 100
  },
  low: {
    correctMultiplier: 0.8,  // 20% reduction
    incorrectPenalty: 0.1,   // 10% penalty
    basePoints: 100
  }
};

// Difficulty multipliers
const DIFFICULTY_MULTIPLIERS = {
  beginner: 1.0,
  intermediate: 1.2,
  advanced: 1.5,
  expert: 2.0
};

export function ScoringSystem({ responses, showDetails = false, className }: ScoringSystemProps) {
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown | null>(null);

  // Calculate comprehensive score breakdown
  useEffect(() => {
    if (responses.length === 0) {
      setScoreBreakdown(null);
      return;
    }

    const breakdown = calculateScoreBreakdown(responses);
    setScoreBreakdown(breakdown);
  }, [responses]);

  const calculateScoreBreakdown = (responses: ItemResponse[]): ScoreBreakdown => {
    let totalScore = 0;
    let baseScore = 0;
    let confidenceBonus = 0;
    let confidencePenalty = 0;
    let streakBonus = 0;
    let difficultyBonus = 0;
    const breakdown: ScoreDetail[] = [];

    // Track streaks
    let currentStreak = 0;
    let maxStreak = 0;

    responses.forEach((response) => {
      const confidence = response.confidence as (ConfidenceLevel | Confidence);
      const scoringConfig = (CONFIDENCE_SCORING as any)[confidence] || CONFIDENCE_SCORING.medium;
      
      // Base points from difficulty
      const difficultyMultiplier = DIFFICULTY_MULTIPLIERS.intermediate; // Default, would come from item
      const basePoints = Math.round(scoringConfig.basePoints * difficultyMultiplier);
      
      let finalPoints = 0;
      let confidenceMultiplier = 1;

      if (response.isCorrect) {
        // Correct answer
        confidenceMultiplier = scoringConfig.correctMultiplier;
        finalPoints = Math.round(basePoints * confidenceMultiplier);
        
        // Track streak
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
        
        // Add streak bonus (every 3 correct in a row)
        if (currentStreak > 0 && currentStreak % 3 === 0) {
          const bonus = Math.round(basePoints * 0.2); // 20% bonus
          finalPoints += bonus;
          streakBonus += bonus;
        }
        
        baseScore += basePoints;
        if (confidenceMultiplier > 1) {
          confidenceBonus += finalPoints - basePoints;
        }
      } else {
        // Incorrect answer
        currentStreak = 0; // Reset streak
        confidenceMultiplier = -scoringConfig.incorrectPenalty;
        finalPoints = Math.round(basePoints * confidenceMultiplier);
        
        confidencePenalty += Math.abs(finalPoints);
      }

      totalScore += finalPoints;
      
      breakdown.push({
        responseId: response.id,
        basePoints,
        confidenceMultiplier,
        finalPoints,
        isCorrect: response.isCorrect,
        confidence,
        difficulty: 'intermediate', // Would come from item
        streakPosition: response.isCorrect ? currentStreak : undefined
      });
    });

    // Calculate difficulty bonus (for attempting harder questions)
    difficultyBonus = Math.round(responses.length * 10); // Base difficulty bonus

    return {
      totalScore: Math.max(0, totalScore), // Never negative
      baseScore,
      confidenceBonus,
      confidencePenalty,
      streakBonus,
      difficultyBonus,
      breakdown
    };
  };

  const getConfidenceIcon = (confidence: ConfidenceLevel | Confidence) => {
    if (confidence === 'certo' || confidence === 'high') {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else if (confidence === 'forse' || confidence === 'medium') {
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    } else {
      return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getConfidenceLabel = (confidence: ConfidenceLevel | Confidence) => {
    const labels: Record<string, string> = {
      certo: 'Certo',
      forse: 'Forse',
      high: 'Alta',
      medium: 'Media',
      low: 'Bassa'
    };
    return labels[confidence as string] || confidence;
  };

  if (!scoreBreakdown) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Target className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Nessuna risposta ancora fornita</p>
        </CardContent>
      </Card>
    );
  }

  const correctAnswers = responses.filter(r => r.isCorrect).length;
  const accuracy = responses.length > 0 ? (correctAnswers / responses.length) * 100 : 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Score Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Punteggio Totale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-700">
              {scoreBreakdown.totalScore}
            </div>
            <div className="text-sm text-muted-foreground">
              punti totali
            </div>
          </div>

          {/* Accuracy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Precisione</span>
              <span>{correctAnswers}/{responses.length} ({Math.round(accuracy)}%)</span>
            </div>
            <Progress value={accuracy} className="h-2" />
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Punteggio base</span>
                <span className="font-medium">+{scoreBreakdown.baseScore}</span>
              </div>
              
              {scoreBreakdown.confidenceBonus > 0 && (
                <div className="flex items-center justify-between text-green-700">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Bonus confidenza
                  </span>
                  <span className="font-medium">+{scoreBreakdown.confidenceBonus}</span>
                </div>
              )}
              
              {scoreBreakdown.streakBonus > 0 && (
                <div className="flex items-center justify-between text-purple-700">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Bonus streak
                  </span>
                  <span className="font-medium">+{scoreBreakdown.streakBonus}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {scoreBreakdown.confidencePenalty > 0 && (
                <div className="flex items-center justify-between text-red-700">
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    Penalità
                  </span>
                  <span className="font-medium">-{scoreBreakdown.confidencePenalty}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between text-blue-700">
                <span className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  Bonus difficoltà
                </span>
                <span className="font-medium">+{scoreBreakdown.difficultyBonus}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dettaglio Punteggi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scoreBreakdown.breakdown.map((detail, index) => (
                <div
                  key={detail.responseId}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    detail.isCorrect 
                      ? "bg-green-50 border-green-200" 
                      : "bg-red-50 border-red-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="min-w-[3rem]">
                      Q{index + 1}
                    </Badge>
                    
                    <div className="flex items-center gap-2">
                      {detail.isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm">
                        {detail.isCorrect ? 'Corretto' : 'Sbagliato'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {getConfidenceIcon(detail.confidence)}
                      <span className="text-xs text-muted-foreground">
                        {getConfidenceLabel(detail.confidence)}
                      </span>
                    </div>

                    {detail.streakPosition && detail.streakPosition % 3 === 0 && (
                      <Badge variant="secondary" className="text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        Streak x{detail.streakPosition}
                      </Badge>
                    )}
                  </div>

                  <div className="text-right">
                    <div className={cn(
                      "font-medium",
                      detail.finalPoints > 0 ? "text-green-700" : "text-red-700"
                    )}>
                      {detail.finalPoints > 0 ? '+' : ''}{detail.finalPoints}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {detail.basePoints} × {detail.confidenceMultiplier}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scoring Tips */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Consigli per massimizzare il punteggio
          </h4>
          <div className="space-y-1 text-sm text-yellow-700">
            <div>• Scegli "Certo" solo quando sei davvero sicuro (+50% punti, ma -50% se sbagli)</div>
            <div>• Mantieni streak di risposte corrette per bonus aggiuntivi</div>
            <div>• "Forse" è più sicuro con penalità ridotte (-20% invece di -50%)</div>
            <div>• Domande più difficili danno più punti base</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}