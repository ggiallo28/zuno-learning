import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Zap,
  Eye,
  EyeOff,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ItemResponse, ConfidenceLevel } from '@/types/assessment';
import { SkillMap, type SkillStat } from './SkillMap';

interface RealTimeSkillTrackerProps {
  responses: ItemResponse[];
  currentTopic?: string;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  className?: string;
}

interface SkillUpdate {
  topic: string;
  previousMastery: number;
  currentMastery: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  isNew: boolean;
}

interface LiveMetrics {
  totalQuestions: number;
  accuracy: number;
  averageConfidence: number;
  currentStreak: number;
  topicsEncountered: number;
  masteryGrowth: number;
}

export function RealTimeSkillTracker({ 
  responses, 
  currentTopic,
  isVisible = true,
  onToggleVisibility,
  className 
}: RealTimeSkillTrackerProps) {
  const [, setSkillUpdates] = useState<SkillUpdate[]>([]);
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
    totalQuestions: 0,
    accuracy: 0,
    averageConfidence: 0,
    currentStreak: 0,
    topicsEncountered: 0,
    masteryGrowth: 0
  });
  const [skillStats, setSkillStats] = useState<SkillStat[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<SkillUpdate[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);

  // Helper function to convert confidence level to number
  const getConfidenceValue = (conf: ConfidenceLevel): number => {
    switch (conf) {
      case 'high': return 1;
      case 'medium': return 0.5;
      case 'low': return 0;
      default: return 0;
    }
  };

  // Calculate real-time skill statistics
  const calculateSkillStats = useCallback((responses: ItemResponse[]): SkillStat[] => {
    const topicStats: Record<string, {
      correct: number;
      total: number;
      recentCorrect: number;
      recentTotal: number;
      confidenceSum: number;
      confidenceCount: number;
      lastAttempted: Date;
    }> = {};

    responses.forEach((response) => {
      const topic = getResponseTopic(response);
      if (!topicStats[topic]) {
        topicStats[topic] = {
          correct: 0,
          total: 0,
          recentCorrect: 0,
          recentTotal: 0,
          confidenceSum: 0,
          confidenceCount: 0,
          lastAttempted: response.timestamp
        };
      }

      const stats = topicStats[topic];
      stats.total++;
      if (response.isCorrect) stats.correct++;
      
      // Recent performance (last 5 questions for this topic)
      const recentResponses = responses
        .filter(r => getResponseTopic(r) === topic)
        .slice(-5);
      stats.recentTotal = recentResponses.length;
      stats.recentCorrect = recentResponses.filter(r => r.isCorrect).length;

      if (response.confidence !== undefined) {
        stats.confidenceSum += getConfidenceValue(response.confidence);
        stats.confidenceCount++;
      }

      if (response.timestamp > stats.lastAttempted) {
        stats.lastAttempted = response.timestamp;
      }
    });

    return Object.entries(topicStats).map(([topic, stats]) => {
      const overallMastery = (stats.correct / stats.total) * 100;
      const recentMastery = stats.recentTotal > 0 
        ? (stats.recentCorrect / stats.recentTotal) * 100 
        : overallMastery;
      
      const trend: 'up' | 'down' | 'stable' = 
        recentMastery > overallMastery + 10 ? 'up' :
        recentMastery < overallMastery - 10 ? 'down' : 'stable';

      const confidence = stats.confidenceCount > 0 
        ? stats.confidenceSum / stats.confidenceCount 
        : 0.5;

      return {
        tag: topic,
        pct: overallMastery,
        trend,
        confidence,
        attempts: stats.total,
        lastAttempted: stats.lastAttempted,
        masteryLevel: overallMastery >= 80 ? 'expert' :
                     overallMastery >= 60 ? 'proficient' :
                     overallMastery >= 40 ? 'developing' : 'novice'
      };
    });
  }, []);

  // Calculate live metrics
  const calculateLiveMetrics = useCallback((responses: ItemResponse[]): LiveMetrics => {
    if (responses.length === 0) {
      return {
        totalQuestions: 0,
        accuracy: 0,
        averageConfidence: 0,
        currentStreak: 0,
        topicsEncountered: 0,
        masteryGrowth: 0
      };
    }

    const totalQuestions = responses.length;
    const correctAnswers = responses.filter(r => r.isCorrect).length;
    const accuracy = (correctAnswers / totalQuestions) * 100;

    const confidenceResponses = responses.filter(r => r.confidence !== undefined);
    const averageConfidence = confidenceResponses.length > 0
      ? confidenceResponses.reduce((sum, r) => sum + getConfidenceValue(r.confidence), 0) / confidenceResponses.length
      : 0;

    // Calculate current streak
    let currentStreak = 0;
    for (let i = responses.length - 1; i >= 0; i--) {
      if (responses[i].isCorrect) {
        currentStreak++;
      } else {
        break;
      }
    }

    const topicsEncountered = new Set(responses.map(r => getResponseTopic(r))).size;

    // Calculate mastery growth (improvement over time)
    const firstHalf = responses.slice(0, Math.floor(responses.length / 2));
    const secondHalf = responses.slice(Math.floor(responses.length / 2));
    
    const firstHalfAccuracy = firstHalf.length > 0 
      ? (firstHalf.filter(r => r.isCorrect).length / firstHalf.length) * 100 
      : 0;
    const secondHalfAccuracy = secondHalf.length > 0 
      ? (secondHalf.filter(r => r.isCorrect).length / secondHalf.length) * 100 
      : 0;
    
    const masteryGrowth = secondHalfAccuracy - firstHalfAccuracy;

    return {
      totalQuestions,
      accuracy,
      averageConfidence,
      currentStreak,
      topicsEncountered,
      masteryGrowth
    };
  }, []);

  // Update skills when responses change
  useEffect(() => {
    const newSkillStats = calculateSkillStats(responses);
    const newLiveMetrics = calculateLiveMetrics(responses);

    // Detect skill updates
    const updates: SkillUpdate[] = [];
    newSkillStats.forEach(newStat => {
      const oldStat = skillStats.find(s => s.tag === newStat.tag);
      if (oldStat && Math.abs(newStat.pct - oldStat.pct) > 1) {
        updates.push({
          topic: newStat.tag,
          previousMastery: oldStat.pct,
          currentMastery: newStat.pct,
          trend: newStat.trend || 'stable',
          confidence: newStat.confidence || 0,
          isNew: false
        });
      } else if (!oldStat) {
        updates.push({
          topic: newStat.tag,
          previousMastery: 0,
          currentMastery: newStat.pct,
          trend: 'up',
          confidence: newStat.confidence || 0,
          isNew: true
        });
      }
    });

    setSkillStats(newSkillStats);
    setLiveMetrics(newLiveMetrics);
    
    if (updates.length > 0) {
      setSkillUpdates(prev => [...prev, ...updates]);
      setRecentUpdates(updates);
      
      // Clear recent updates after 3 seconds
      setTimeout(() => {
        setRecentUpdates([]);
      }, 3000);
    }
  }, [responses, calculateSkillStats, calculateLiveMetrics, skillStats]);

  // Helper function to get topic from response
  const getResponseTopic = (_response: ItemResponse): string => {
    // This would look up the actual topic from the item
    return 'javascript'; // Placeholder
  };

  const getMetricColor = (value: number, threshold: { good: number; ok: number }) => {
    if (value >= threshold.good) return 'text-green-600';
    if (value >= threshold.ok) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isVisible) return null;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Live Metrics Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Activity className="w-5 h-5" />
              Monitoraggio Live delle Competenze
              <Badge variant="outline" className="animate-pulse">
                <Zap className="w-3 h-3 mr-1" />
                Live
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              {onToggleVisibility && (
                <Button variant="ghost" size="sm" onClick={onToggleVisibility}>
                  ✕
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {liveMetrics.totalQuestions}
                </div>
                <div className="text-xs text-muted-foreground">Domande</div>
              </div>
              <div>
                <div className={cn(
                  "text-2xl font-bold",
                  getMetricColor(liveMetrics.accuracy, { good: 80, ok: 60 })
                )}>
                  {Math.round(liveMetrics.accuracy)}%
                </div>
                <div className="text-xs text-muted-foreground">Precisione</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {liveMetrics.currentStreak}
                </div>
                <div className="text-xs text-muted-foreground">Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {liveMetrics.topicsEncountered}
                </div>
                <div className="text-xs text-muted-foreground">Argomenti</div>
              </div>
              <div>
                <div className={cn(
                  "text-2xl font-bold flex items-center justify-center gap-1",
                  liveMetrics.masteryGrowth > 0 ? "text-green-600" : 
                  liveMetrics.masteryGrowth < 0 ? "text-red-600" : "text-gray-600"
                )}>
                  {liveMetrics.masteryGrowth > 0 ? <TrendingUp className="w-5 h-5" /> : 
                   liveMetrics.masteryGrowth < 0 ? <TrendingDown className="w-5 h-5" /> : null}
                  {liveMetrics.masteryGrowth > 0 ? '+' : ''}{Math.round(liveMetrics.masteryGrowth)}%
                </div>
                <div className="text-xs text-muted-foreground">Crescita</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Recent Skill Updates */}
      {recentUpdates.length > 0 && !isMinimized && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <TrendingUp className="w-5 h-5" />
              Aggiornamenti Recenti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentUpdates.map((update, index) => (
                <div 
                  key={`${update.topic}-${index}`}
                  className="flex items-center justify-between p-2 bg-white rounded border animate-fade-in"
                >
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-green-600" />
                    <span className="font-medium capitalize">{update.topic}</span>
                    {update.isNew && (
                      <Badge variant="outline" className="text-xs">Nuovo!</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {Math.round(update.previousMastery)}% → {Math.round(update.currentMastery)}%
                    </span>
                    {update.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : update.trend === 'down' ? (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Topic Focus */}
      {currentTopic && !isMinimized && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Argomento Corrente:</span>
                <Badge variant="default" className="capitalize">{currentTopic}</Badge>
              </div>
              {skillStats.find(s => s.tag === currentTopic) && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Padronanza:</span>
                  <Badge variant="outline">
                    {Math.round(skillStats.find(s => s.tag === currentTopic)?.pct || 0)}%
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Skill Map */}
      {!isMinimized && skillStats.length > 0 && (
        <SkillMap 
          stats={skillStats}
          responses={responses}
          isRealTime={true}
          showDetails={false}
        />
      )}
    </div>
  );
}