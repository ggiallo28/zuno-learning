import { useState, useMemo } from 'react';
import { AssessmentSession, ItemResponse, ConfidenceLevel } from '@/types/assessment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Clock, 
  Zap, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Award,
  AlertTriangle,
  CheckCircle,
  Brain,
  BarChart3,
  Download,
  Share2,
  BookOpen,
  Lightbulb,
  Star,
  Calendar
} from 'lucide-react';
import { SkillMap, type SkillStat } from './SkillMap';
import { cn } from '@/lib/utils';

interface AssessmentReportProps {
  session: AssessmentSession;
  onRestart: () => void;
  onComplete?: (results: any) => void;
  onExportReport?: () => void;
  onShareResults?: () => void;
  previousSessions?: AssessmentSession[];
}

interface PerformanceAnalysis {
  overallScore: number;
  accuracy: number;
  speed: number;
  consistency: number;
  improvement: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  confidenceLevel: number;
  masteryAreas: string[];
  developmentAreas: string[];
}

interface DetailedMetrics {
  totalQuestions: number;
  correctAnswers: number;
  partialCredit: number;
  averageTime: number;
  fastestResponse: number;
  slowestResponse: number;
  confidenceAccuracy: number;
  topicDistribution: Record<string, number>;
  difficultyBreakdown: Record<string, { attempted: number; correct: number }>;
}

export function AssessmentReport({ 
  session, 
  onRestart, 
  onComplete, 
  onExportReport,
  onShareResults,
  previousSessions = []
}: AssessmentReportProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate comprehensive metrics
  const metrics = useMemo((): DetailedMetrics => {
    const responses = session.responses;
    const totalQuestions = responses.length;
    const correctAnswers = responses.filter(r => r.isCorrect).length;
    const partialCredit = responses.reduce((sum, r) => sum + r.partialScore, 0);
    
    const times = responses.map(r => r.timeMs).filter(t => t > 0);
    const averageTime = times.reduce((sum, t) => sum + t, 0) / times.length;
    const fastestResponse = Math.min(...times);
    const slowestResponse = Math.max(...times);
    
    // Confidence accuracy (how often high confidence matched correctness)
    const confidenceResponses = responses.filter(r => r.confidence !== undefined);
    const getConfidenceValue = (conf: ConfidenceLevel): number => {
      switch (conf) {
        case 'high': return 1;
        case 'medium': return 0.5;
        case 'low': return 0;
        default: return 0;
      }
    };
    const highConfidenceCorrect = confidenceResponses.filter(r => 
      getConfidenceValue(r.confidence) > 0.7 && r.isCorrect
    ).length;
    const confidenceAccuracy = confidenceResponses.length > 0 
      ? highConfidenceCorrect / confidenceResponses.length 
      : 0;

    // Topic distribution
    const topicDistribution: Record<string, number> = {};
    responses.forEach(r => {
      const topic = getResponseTopic(r); // Helper function
      topicDistribution[topic] = (topicDistribution[topic] || 0) + 1;
    });

    // Difficulty breakdown
    const difficultyBreakdown: Record<string, { attempted: number; correct: number }> = {};
    responses.forEach(r => {
      const difficulty = getResponseDifficulty(r); // Helper function
      if (!difficultyBreakdown[difficulty]) {
        difficultyBreakdown[difficulty] = { attempted: 0, correct: 0 };
      }
      difficultyBreakdown[difficulty].attempted++;
      if (r.isCorrect) difficultyBreakdown[difficulty].correct++;
    });

    return {
      totalQuestions,
      correctAnswers,
      partialCredit,
      averageTime: averageTime / 1000, // Convert to seconds
      fastestResponse: fastestResponse / 1000,
      slowestResponse: slowestResponse / 1000,
      confidenceAccuracy,
      topicDistribution,
      difficultyBreakdown
    };
  }, [session.responses]);

  // Performance analysis
  const analysis = useMemo((): PerformanceAnalysis => {
    const overallScore = (metrics.partialCredit / metrics.totalQuestions) * 100;
    const accuracy = (metrics.correctAnswers / metrics.totalQuestions) * 100;
    
    // Speed score (inverse of average time, normalized)
    const speed = Math.max(0, 100 - (metrics.averageTime - 10) * 2);
    
    // Consistency (based on time variance and confidence accuracy)
    const consistency = metrics.confidenceAccuracy * 100;
    
    // Improvement (compared to previous sessions)
    const improvement = calculateImprovement(session, previousSessions);
    
    // Identify strengths and weaknesses
    const topicMastery = Object.entries(session.topicMastery);
    const strengths = topicMastery
      .filter(([_, mastery]) => mastery.masteryLevel > 0.8)
      .map(([topic]) => topic);
    
    const weaknesses = topicMastery
      .filter(([_, mastery]) => mastery.masteryLevel < 0.6)
      .map(([topic]) => topic);

    // Generate recommendations
    const recommendations = generateRecommendations(metrics, session);
    
    const confidenceLevel = metrics.confidenceAccuracy;
    const masteryAreas = strengths;
    const developmentAreas = weaknesses;

    return {
      overallScore,
      accuracy,
      speed,
      consistency,
      improvement,
      strengths,
      weaknesses,
      recommendations,
      confidenceLevel,
      masteryAreas,
      developmentAreas
    };
  }, [metrics, session, previousSessions]);

  // Convert topic mastery to skill stats for SkillMap
  const skillStats: SkillStat[] = useMemo(() => {
    return Object.entries(session.topicMastery).map(([topic, mastery]) => ({
      tag: topic,
      pct: mastery.masteryLevel * 100,
      trend: mastery.trend as 'up' | 'down' | 'stable',
      confidence: mastery.confidence,
      attempts: mastery.itemsAnswered || 0,
      lastAttempted: mastery.lastAssessed || new Date(),
      masteryLevel: mastery.masteryLevel > 0.8 ? 'expert' : 
                   mastery.masteryLevel > 0.6 ? 'proficient' :
                   mastery.masteryLevel > 0.4 ? 'developing' : 'novice',
      knowledgeGaps: [] // This would be calculated from incorrect responses
    }));
  }, [session.topicMastery]);

  // Helper functions
  const getResponseTopic = (_response: ItemResponse): string => {
    // This would look up the actual topic from the item
    return 'javascript'; // Placeholder
  };

  const getResponseDifficulty = (_response: ItemResponse): string => {
    // This would look up the actual difficulty from the item
    return 'intermediate'; // Placeholder
  };

  const calculateImprovement = (current: AssessmentSession, previous: AssessmentSession[]): number => {
    if (previous.length === 0) return 0;
    const lastSession = previous[previous.length - 1];
    const currentScore = current.responses.reduce((sum, r) => sum + r.partialScore, 0) / current.responses.length;
    const lastScore = lastSession.responses.reduce((sum, r) => sum + r.partialScore, 0) / lastSession.responses.length;
    return ((currentScore - lastScore) / lastScore) * 100;
  };

  const generateRecommendations = (metrics: DetailedMetrics, session: AssessmentSession): string[] => {
    const recommendations: string[] = [];
    
    if (metrics.correctAnswers / metrics.totalQuestions < 0.7) {
      recommendations.push("Concentrati sulla revisione dei concetti fondamentali");
    }
    
    if (metrics.averageTime > 60) {
      recommendations.push("Pratica per migliorare la velocità di risposta");
    }
    
    if (metrics.confidenceAccuracy < 0.6) {
      recommendations.push("Lavora sulla calibrazione della fiducia nelle tue risposte");
    }

    const weakTopics = Object.entries(session.topicMastery)
      .filter(([_, mastery]) => mastery.masteryLevel < 0.6)
      .map(([topic]) => topic);
    
    if (weakTopics.length > 0) {
      recommendations.push(`Dedica più tempo a: ${weakTopics.join(', ')}`);
    }

    return recommendations;
  };

  const totalTime = session.completedAt && session.startedAt 
    ? Math.round((session.completedAt.getTime() - session.startedAt.getTime()) / 1000 / 60)
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'outline';
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4 flex items-center justify-center gap-2">
              <Trophy className="w-8 h-8 text-yellow-600" />
              Assessment Completato!
            </CardTitle>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant={getScoreBadgeVariant(analysis.overallScore)} className="flex items-center gap-1 text-lg px-4 py-2">
                <Award className="w-5 h-5" />
                {Math.round(analysis.overallScore)}%
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 text-lg px-4 py-2">
                <Clock className="w-5 h-5" />
                {totalTime} min
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 text-lg px-4 py-2">
                <Zap className="w-5 h-5" />
                {session.currentStreak} streak
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 text-lg px-4 py-2">
                <Target className="w-5 h-5" />
                {metrics.correctAnswers}/{metrics.totalQuestions}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Panoramica
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Competenze
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analisi
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Consigli
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className={cn("text-3xl font-bold mb-2", getScoreColor(analysis.accuracy))}>
                    {Math.round(analysis.accuracy)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Precisione</div>
                  <Progress value={analysis.accuracy} className="mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className={cn("text-3xl font-bold mb-2", getScoreColor(analysis.speed))}>
                    {Math.round(analysis.speed)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Velocità</div>
                  <Progress value={analysis.speed} className="mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className={cn("text-3xl font-bold mb-2", getScoreColor(analysis.consistency))}>
                    {Math.round(analysis.consistency)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Coerenza</div>
                  <Progress value={analysis.consistency} className="mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className={cn(
                    "text-3xl font-bold mb-2 flex items-center justify-center gap-1",
                    analysis.improvement > 0 ? "text-green-600" : analysis.improvement < 0 ? "text-red-600" : "text-gray-600"
                  )}>
                    {analysis.improvement > 0 ? <TrendingUp className="w-6 h-6" /> : 
                     analysis.improvement < 0 ? <TrendingDown className="w-6 h-6" /> : null}
                    {analysis.improvement > 0 ? '+' : ''}{Math.round(analysis.improvement)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Miglioramento</div>
                </CardContent>
              </Card>
            </div>

            {/* Difficulty Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Performance per Difficoltà
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(metrics.difficultyBreakdown).map(([difficulty, stats]) => {
                    const percentage = (stats.correct / stats.attempted) * 100;
                    return (
                      <div key={difficulty} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">{difficulty}</span>
                          <Badge variant="outline">
                            {stats.correct}/{stats.attempted}
                          </Badge>
                        </div>
                        <Progress value={percentage} />
                        <div className="text-sm text-muted-foreground">
                          {Math.round(percentage)}% di successo
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <SkillMap 
              stats={skillStats}
              responses={session.responses}
              showDetails={true}
            />
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    Punti di Forza
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.strengths.length > 0 ? (
                    <ul className="space-y-2">
                      {analysis.strengths.map(strength => (
                        <li key={strength} className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-green-600" />
                          <span className="capitalize">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">
                      Continua a praticare per sviluppare i tuoi punti di forza!
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Areas for Improvement */}
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="w-5 h-5" />
                    Aree di Miglioramento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.weaknesses.length > 0 ? (
                    <ul className="space-y-2">
                      {analysis.weaknesses.map(weakness => (
                        <li key={weakness} className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-yellow-600" />
                          <span className="capitalize">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">
                      Ottimo lavoro! Non ci sono aree critiche da migliorare.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Detailed Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Metriche Dettagliate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Tempo medio per domanda:</span>
                    <div className="text-lg">{Math.round(metrics.averageTime)}s</div>
                  </div>
                  <div>
                    <span className="font-medium">Risposta più veloce:</span>
                    <div className="text-lg">{Math.round(metrics.fastestResponse)}s</div>
                  </div>
                  <div>
                    <span className="font-medium">Risposta più lenta:</span>
                    <div className="text-lg">{Math.round(metrics.slowestResponse)}s</div>
                  </div>
                  <div>
                    <span className="font-medium">Precisione fiducia:</span>
                    <div className="text-lg">{Math.round(metrics.confidenceAccuracy * 100)}%</div>
                  </div>
                  <div>
                    <span className="font-medium">Credito parziale:</span>
                    <div className="text-lg">{Math.round(metrics.partialCredit * 100) / 100}</div>
                  </div>
                  <div>
                    <span className="font-medium">Domande totali:</span>
                    <div className="text-lg">{metrics.totalQuestions}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Raccomandazioni Personalizzate
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysis.recommendations.length > 0 ? (
                  <ul className="space-y-3">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">
                    Ottima performance! Continua così per mantenere il tuo livello.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Calendar className="w-5 h-5" />
                  Prossimi Passi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span>Rivedi le aree di miglioramento identificate</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span>Pratica regolarmente per mantenere i progressi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span>Ripeti l'assessment tra una settimana</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={onRestart} variant="outline" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Ripeti Assessment
              </Button>
              {onComplete && (
                <Button onClick={() => onComplete(session)} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Continua Apprendimento
                </Button>
              )}
              {onExportReport && (
                <Button onClick={onExportReport} variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Esporta Report
                </Button>
              )}
              {onShareResults && (
                <Button onClick={onShareResults} variant="outline" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Condividi Risultati
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}