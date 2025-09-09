import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Brain,
  BarChart3,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ItemResponse } from '@/types/assessment';

export type SkillStat = { 
  tag: string; 
  pct: number; // 0..100
  trend?: 'up' | 'down' | 'stable';
  confidence?: number; // 0..1
  attempts?: number;
  lastAttempted?: Date;
  masteryLevel?: 'novice' | 'developing' | 'proficient' | 'expert';
  knowledgeGaps?: string[];
};

interface SkillMapProps {
  stats: SkillStat[];
  responses?: ItemResponse[];
  isRealTime?: boolean;
  showDetails?: boolean;
  onSkillClick?: (skill: SkillStat) => void;
  className?: string;
}

interface SkillAnalysis {
  totalSkills: number;
  masteredSkills: number;
  developingSkills: number;
  weakSkills: number;
  averageMastery: number;
  topStrengths: SkillStat[];
  knowledgeGaps: SkillStat[];
  recentProgress: SkillStat[];
}

export function SkillMap({ 
  stats, 
  responses: _responses = [], 
  isRealTime = false, 
  showDetails = true,
  onSkillClick,
  className 
}: SkillMapProps) {
  const [expandedView, setExpandedView] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillStat | null>(null);
  const [animatedStats, setAnimatedStats] = useState<SkillStat[]>(stats);

  // Animate skill changes in real-time
  useEffect(() => {
    if (isRealTime) {
      const timer = setTimeout(() => {
        setAnimatedStats(stats);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAnimatedStats(stats);
    }
  }, [stats, isRealTime]);

  // Calculate skill analysis
  const analysis = useMemo((): SkillAnalysis => {
    const totalSkills = animatedStats.length;
    const masteredSkills = animatedStats.filter(s => s.pct >= 80).length;
    const developingSkills = animatedStats.filter(s => s.pct >= 50 && s.pct < 80).length;
    const weakSkills = animatedStats.filter(s => s.pct < 50).length;
    const averageMastery = animatedStats.reduce((sum, s) => sum + s.pct, 0) / totalSkills;
    
    const topStrengths = [...animatedStats]
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 3);
    
    const knowledgeGaps = [...animatedStats]
      .filter(s => s.pct < 60)
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 3);
    
    const recentProgress = [...animatedStats]
      .filter(s => s.trend === 'up')
      .sort((a, b) => (b.lastAttempted?.getTime() || 0) - (a.lastAttempted?.getTime() || 0))
      .slice(0, 3);

    return {
      totalSkills,
      masteredSkills,
      developingSkills,
      weakSkills,
      averageMastery,
      topStrengths,
      knowledgeGaps,
      recentProgress
    };
  }, [animatedStats]);

  const getMasteryColor = (pct: number) => {
    if (pct >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (pct >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (pct >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getMasteryIcon = (pct: number) => {
    if (pct >= 80) return <CheckCircle className="w-4 h-4" />;
    if (pct >= 60) return <Target className="w-4 h-4" />;
    if (pct >= 40) return <Clock className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-600" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-600" />;
      default: return null;
    }
  };

  const handleSkillClick = (skill: SkillStat) => {
    setSelectedSkill(selectedSkill?.tag === skill.tag ? null : skill);
    onSkillClick?.(skill);
  };

  if (!animatedStats?.length) {
    return (
      <Card className={cn("border-dashed", className)}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center text-muted-foreground">
            <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Nessun dato sulle competenze disponibile</p>
            <p className="text-sm">Completa alcune valutazioni per vedere la tua mappa delle competenze</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Skill Analysis Overview */}
      {showDetails && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Analisi Competenze
                {isRealTime && (
                  <Badge variant="outline" className="ml-2 animate-pulse">
                    <Zap className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                )}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedView(!expandedView)}
              >
                {expandedView ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{analysis.masteredSkills}</div>
                <div className="text-sm text-muted-foreground">Padroneggiati</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{analysis.developingSkills}</div>
                <div className="text-sm text-muted-foreground">In Sviluppo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{analysis.weakSkills}</div>
                <div className="text-sm text-muted-foreground">Da Migliorare</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.round(analysis.averageMastery)}%</div>
                <div className="text-sm text-muted-foreground">Media Generale</div>
              </div>
            </div>
            
            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso Complessivo</span>
                <span>{Math.round(analysis.averageMastery)}%</span>
              </div>
              <Progress value={analysis.averageMastery} className="h-3" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Skill Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Mappa delle Competenze
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {animatedStats.map((skill, index) => {
              const pct = Math.round(Math.max(0, Math.min(100, skill.pct)));
              const isSelected = selectedSkill?.tag === skill.tag;
              
              return (
                <div key={skill.tag} className="space-y-2">
                  <div 
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all duration-200",
                      isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50",
                      getMasteryColor(pct)
                    )}
                    onClick={() => handleSkillClick(skill)}
                    style={{
                      animationDelay: isRealTime ? `${index * 100}ms` : '0ms'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getMasteryIcon(pct)}
                        <span className="font-medium capitalize">{skill.tag}</span>
                        {getTrendIcon(skill.trend)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {pct}%
                        </Badge>
                        {skill.confidence && (
                          <Badge variant="secondary" className="text-xs">
                            ±{Math.round(skill.confidence * 100)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Progress 
                        value={pct} 
                        className={cn(
                          "h-2 transition-all duration-500",
                          isRealTime && "animate-pulse"
                        )}
                      />
                      {skill.attempts && (
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{skill.attempts} tentativi</span>
                          {skill.lastAttempted && (
                            <span>
                              Ultimo: {skill.lastAttempted.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded Skill Details */}
                  {isSelected && expandedView && (
                    <div className="ml-4 p-3 bg-white border rounded-lg shadow-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">Livello di Padronanza:</span>
                          <Badge variant={pct >= 80 ? "default" : "outline"}>
                            {skill.masteryLevel || (pct >= 80 ? 'Esperto' : pct >= 60 ? 'Competente' : pct >= 40 ? 'In Sviluppo' : 'Principiante')}
                          </Badge>
                        </div>
                        
                        {skill.knowledgeGaps && skill.knowledgeGaps.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-red-600">Lacune Identificate:</span>
                            <ul className="text-sm text-muted-foreground ml-4">
                              {skill.knowledgeGaps.map((gap, i) => (
                                <li key={i}>• {gap}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="text-xs text-muted-foreground">
                          {pct >= 80 && "🎉 Competenza padroneggiata! Continua a praticare per mantenere il livello."}
                          {pct >= 60 && pct < 80 && "📈 Buon progresso! Ancora qualche pratica per la padronanza completa."}
                          {pct >= 40 && pct < 60 && "🎯 In sviluppo. Concentrati su questa area per migliorare."}
                          {pct < 40 && "🚀 Area di crescita. Dedica più tempo a questa competenza."}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      {showDetails && (
        <div className="grid md:grid-cols-3 gap-4">
          {/* Top Strengths */}
          {analysis.topStrengths.length > 0 && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-green-800">
                  <Award className="w-4 h-4" />
                  Punti di Forza
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {analysis.topStrengths.map(skill => (
                  <div key={skill.tag} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{skill.tag}</span>
                    <Badge variant="outline" className="text-green-700">
                      {Math.round(skill.pct)}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Knowledge Gaps */}
          {analysis.knowledgeGaps.length > 0 && (
            <Card className="bg-red-50 border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-red-800">
                  <AlertTriangle className="w-4 h-4" />
                  Aree da Migliorare
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {analysis.knowledgeGaps.map(skill => (
                  <div key={skill.tag} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{skill.tag}</span>
                    <Badge variant="outline" className="text-red-700">
                      {Math.round(skill.pct)}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recent Progress */}
          {analysis.recentProgress.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-blue-800">
                  <TrendingUp className="w-4 h-4" />
                  Progressi Recenti
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {analysis.recentProgress.map(skill => (
                  <div key={skill.tag} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{skill.tag}</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <Badge variant="outline" className="text-blue-700">
                        {Math.round(skill.pct)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
