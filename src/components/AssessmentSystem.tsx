// Assessment-driven learning system component
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Brain, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp,
  BookOpen,
  Clock,
  Lightbulb,
  Crown
} from 'lucide-react';
import { useCoach } from '@/contexts/CoachContext';
import { useZunoManager } from '@/contexts/ZunoManagerContext';

interface KnowledgeGap {
  id: string;
  user_id: string;
  subject_area: string;
  concept_name: string;
  confidence_level: number;
  assessment_date: string;
  last_reviewed_at?: string;
  review_count: number;
  mastery_status: 'unknown' | 'weak' | 'developing' | 'strong' | 'mastered';
}

interface Assessment {
  id: string;
  user_id: string;
  assessment_type: 'initial' | 'progress' | 'focus_check';
  subject_area?: string;
  questions_data: any[];
  answers_data?: any[];
  score?: number;
  identified_gaps: string[];
  recommendations: string[];
  completed_at?: string;
  created_at: string;
}

interface AssessmentSystemProps {
  userId: string;
  onStartAssessment: (type: 'initial' | 'progress' | 'focus_check') => Promise<void> | void;
  onViewSkillMap: () => void;
  knowledgeGaps?: KnowledgeGap[];
  recentAssessments?: Assessment[];
  isLoading?: boolean;
}

export function AssessmentSystem({ 
  // userId, 
  onStartAssessment, 
  onViewSkillMap,
  knowledgeGaps = [],
  recentAssessments = [],
  isLoading = false 
}: AssessmentSystemProps) {
  const { currentCoach, theme, coachConfig } = useCoach();
  const { getCoordinationMessage } = useZunoManager();
  const [focusAreas, setFocusAreas] = useState<string[]>([]);

  // Analyze knowledge gaps to identify focus areas
  useEffect(() => {
    const weakAreas = knowledgeGaps
      .filter(gap => gap.mastery_status === 'weak' || gap.mastery_status === 'unknown')
      .slice(0, 3)
      .map(gap => gap.concept_name);
    setFocusAreas(weakAreas);
  }, [knowledgeGaps]);

  const masteryStats = {
    mastered: knowledgeGaps.filter(gap => gap.mastery_status === 'mastered').length,
    strong: knowledgeGaps.filter(gap => gap.mastery_status === 'strong').length,
    developing: knowledgeGaps.filter(gap => gap.mastery_status === 'developing').length,
    weak: knowledgeGaps.filter(gap => gap.mastery_status === 'weak').length,
    unknown: knowledgeGaps.filter(gap => gap.mastery_status === 'unknown').length
  };

  const totalConcepts = knowledgeGaps.length;
  const masteryPercentage = totalConcepts > 0 
    ? Math.round(((masteryStats.mastered + masteryStats.strong) / totalConcepts) * 100)
    : 0;

  const getCoachMessage = () => {
    if (!coachConfig) return '';
    
    switch (currentCoach) {
      case 'elia':
        return 'Analizziamo con calma le tue conoscenze per costruire basi solide.';
      case 'skippy':
        return 'Identifichiamo rapidamente cosa sapere per andare dritti al punto!';
      case 'lupa':
        return 'Scopriamo insieme dove il gruppo può aiutarti di più.';
      case 'polpo':
        return 'Adattiamo la strategia in base ai tuoi punti di forza e debolezza.';
      default:
        return 'Focalizziamo l\'apprendimento su ciò che serve davvero.';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Caricamento sistema di valutazione...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Zuno Manager Coordination */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">Zuno Manager - Sistema di Valutazione</h3>
              <p className="text-sm text-blue-700">
                {getCoordinationMessage(currentCoach, 'assessment')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header with Coach Message */}
      <Card style={{ borderLeftColor: theme.primary, borderLeftWidth: '4px' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Target className="h-6 w-6" style={{ color: theme.primary }} />
            Focus Learning System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${theme.primary}15` }}
            >
              <Brain className="h-6 w-6" style={{ color: theme.primary }} />
            </div>
            <div>
              <p className="text-muted-foreground mb-2">
                {getCoachMessage()}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>{masteryStats.mastered + masteryStats.strong} concetti acquisiti</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span>{masteryStats.weak + masteryStats.unknown} da rivedere</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div 
              className="p-4 rounded-full w-fit mx-auto mb-4"
              style={{ backgroundColor: `${theme.primary}15` }}
            >
              <Target className="h-8 w-8" style={{ color: theme.primary }} />
            </div>
            <h3 className="font-semibold mb-2">Assessment Iniziale</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Identifica le tue conoscenze attuali per creare un piano di studio mirato.
            </p>
            <Button 
              onClick={() => onStartAssessment('initial')}
              className="w-full"
              style={{ backgroundColor: theme.primary }}
            >
              Inizia Assessment
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div 
              className="p-4 rounded-full w-fit mx-auto mb-4"
              style={{ backgroundColor: `${theme.secondary}15` }}
            >
              <TrendingUp className="h-8 w-8" style={{ color: theme.secondary }} />
            </div>
            <h3 className="font-semibold mb-2">Check Progressi</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Verifica i tuoi miglioramenti e aggiorna le aree di focus.
            </p>
            <Button 
              onClick={() => onStartAssessment('progress')}
              variant="outline"
              className="w-full"
            >
              Valuta Progressi
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div 
              className="p-4 rounded-full w-fit mx-auto mb-4"
              style={{ backgroundColor: `${theme.accent}15` }}
            >
              <Lightbulb className="h-8 w-8" style={{ color: theme.accent }} />
            </div>
            <h3 className="font-semibold mb-2">Focus Check</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Rapida verifica per riallineare il tuo percorso di apprendimento.
            </p>
            <Button 
              onClick={() => onStartAssessment('focus_check')}
              variant="outline"
              className="w-full"
            >
              Quick Check
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge Overview */}
      {totalConcepts > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Mappa delle Conoscenze
              </CardTitle>
              <Button variant="outline" size="sm" onClick={onViewSkillMap}>
                Visualizza Completa
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Padronanza Generale</span>
                  <span className="text-sm font-semibold">{masteryPercentage}%</span>
                </div>
                <Progress value={masteryPercentage} className="h-3" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{masteryStats.mastered}</div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    Padroneggiati
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{masteryStats.strong}</div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                    Solidi
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{masteryStats.developing}</div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">
                    In Sviluppo
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{masteryStats.weak}</div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                    Da Rafforzare
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{masteryStats.unknown}</div>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                    Da Esplorare
                  </Badge>
                </div>
              </div>

              {focusAreas.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Prossime Aree di Focus
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {focusAreas.map((area, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        style={{ 
                          borderColor: theme.accent,
                          color: theme.accent 
                        }}
                      >
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Assessments */}
      {recentAssessments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Assessments Recenti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAssessments.slice(0, 3).map((assessment) => (
                <div key={assessment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium capitalize">{assessment.assessment_type.replace('_', ' ')}</div>
                    <div className="text-sm text-muted-foreground">
                      {assessment.subject_area || 'Valutazione generale'}
                    </div>
                  </div>
                  <div className="text-right">
                    {assessment.score && (
                      <div className="font-semibold">{assessment.score}%</div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {new Date(assessment.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}