import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  RefreshCw,
  Sparkles,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { differenceInDays } from 'date-fns';
import type { ProgressData } from './ProgressDashboard';

interface AIInsight {
  id: string;
  type: 'strength' | 'improvement' | 'recommendation' | 'trend' | 'achievement';
  title: string;
  description: string;
  confidence: number; // 0-1
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  relatedSkills?: string[];
  suggestedActions?: string[];
  dataPoints?: { label: string; value: string | number }[];
}

interface LearningPattern {
  type: 'consistent' | 'sporadic' | 'intensive' | 'declining';
  description: string;
  score: number;
  recommendations: string[];
}

interface SkillGap {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  priority: number;
  relatedSkills: string[];
  suggestedResources: string[];
}

interface AIInsightsProps {
  data: ProgressData;
  className?: string;
  onRefresh?: () => void;
}

export function AIInsights({ data, className, onRefresh }: AIInsightsProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);

  // Analyze learning patterns
  const learningPattern = useMemo((): LearningPattern => {
    const recentDays = 30;
    const activeDays = data.xpData.dailyXP
      .filter(d => differenceInDays(new Date(), d.date) <= recentDays && d.xp > 0)
      .length;
    
    const consistency = activeDays / recentDays;
    const avgXP = data.xpData.dailyXP
      .filter(d => d.xp > 0)
      .reduce((sum, d) => sum + d.xp, 0) / Math.max(1, activeDays);

    if (consistency >= 0.7) {
      return {
        type: 'consistent',
        description: 'Apprendimento costante e regolare',
        score: consistency,
        recommendations: [
          'Mantieni questa eccellente routine di studio',
          'Considera di aumentare gradualmente la difficoltà',
          'Sperimenta con nuove aree di competenza'
        ]
      };
    } else if (consistency >= 0.4) {
      return {
        type: 'sporadic',
        description: 'Apprendimento irregolare ma presente',
        score: consistency,
        recommendations: [
          'Prova a stabilire una routine di studio più regolare',
          'Imposta promemoria giornalieri per lo studio',
          'Inizia con sessioni più brevi ma frequenti'
        ]
      };
    } else if (avgXP > 100) {
      return {
        type: 'intensive',
        description: 'Sessioni intensive ma poco frequenti',
        score: avgXP / 200,
        recommendations: [
          'Distribuisci lo studio su più giorni',
          'Alterna sessioni intensive con ripasso leggero',
          'Usa la tecnica del spaced repetition'
        ]
      };
    } else {
      return {
        type: 'declining',
        description: 'Attività di apprendimento in calo',
        score: consistency,
        recommendations: [
          'Riprendi gradualmente con obiettivi piccoli',
          'Trova nuove fonti di motivazione',
          'Considera di cambiare approccio di studio'
        ]
      };
    }
  }, [data]);

  // Identify skill gaps
  const skillGaps = useMemo((): SkillGap[] => {
    return data.skillStats
      .filter(skill => skill.pct < 70)
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 5)
      .map(skill => ({
        skill: skill.tag,
        currentLevel: skill.pct,
        targetLevel: 80,
        priority: 100 - skill.pct,
        relatedSkills: data.skillStats
          .filter(s => s.tag !== skill.tag && Math.abs(s.pct - skill.pct) < 20)
          .map(s => s.tag)
          .slice(0, 3),
        suggestedResources: getSuggestedResources(skill.tag)
      }));
  }, [data.skillStats]);

  // Generate AI insights
  const generateInsights = async () => {
    setIsAnalyzing(true);
    
    try {
      const newInsights: AIInsight[] = [];

      // Strength insights
      const topSkills = data.skillStats
        .filter(s => s.pct >= 80)
        .sort((a, b) => b.pct - a.pct)
        .slice(0, 3);

      if (topSkills.length > 0) {
        newInsights.push({
          id: 'strength-top-skills',
          type: 'strength',
          title: 'Competenze di Eccellenza',
          description: `Hai raggiunto un livello esperto in ${topSkills.length} competenze. Queste sono i tuoi punti di forza principali.`,
          confidence: 0.95,
          priority: 'high',
          actionable: true,
          relatedSkills: topSkills.map(s => s.tag),
          suggestedActions: [
            'Considera di mentorare altri in queste aree',
            'Cerca progetti che sfruttino queste competenze',
            'Mantieni aggiornate queste competenze con pratica regolare'
          ],
          dataPoints: topSkills.map(s => ({ label: s.tag, value: `${Math.round(s.pct)}%` }))
        });
      }

      // Learning pattern insights
      newInsights.push({
        id: 'pattern-analysis',
        type: 'trend',
        title: `Pattern di Apprendimento: ${learningPattern.description}`,
        description: `Il tuo stile di apprendimento è ${learningPattern.type}. Punteggio di consistenza: ${Math.round(learningPattern.score * 100)}%`,
        confidence: 0.85,
        priority: learningPattern.score < 0.5 ? 'high' : 'medium',
        actionable: true,
        suggestedActions: learningPattern.recommendations,
        dataPoints: [
          { label: 'Consistenza', value: `${Math.round(learningPattern.score * 100)}%` },
          { label: 'Tipo', value: learningPattern.type }
        ]
      });

      // Skill gap insights
      if (skillGaps.length > 0) {
        const topGap = skillGaps[0];
        newInsights.push({
          id: 'skill-gap-priority',
          type: 'improvement',
          title: 'Area Prioritaria di Miglioramento',
          description: `La competenza "${topGap.skill}" ha il maggior potenziale di crescita. Attualmente al ${Math.round(topGap.currentLevel)}%, obiettivo ${topGap.targetLevel}%.`,
          confidence: 0.9,
          priority: 'high',
          actionable: true,
          relatedSkills: [topGap.skill, ...topGap.relatedSkills],
          suggestedActions: [
            `Dedica 30 minuti al giorno a ${topGap.skill}`,
            'Cerca corsi specifici per questa competenza',
            'Pratica con progetti reali'
          ],
          dataPoints: [
            { label: 'Livello Attuale', value: `${Math.round(topGap.currentLevel)}%` },
            { label: 'Obiettivo', value: `${topGap.targetLevel}%` },
            { label: 'Gap da Colmare', value: `${topGap.targetLevel - Math.round(topGap.currentLevel)}%` }
          ]
        });
      }

      // Streak insights
      if (data.streakData.current > 0) {
        const streakInsight: AIInsight = {
          id: 'streak-momentum',
          type: data.streakData.current >= 7 ? 'achievement' : 'trend',
          title: data.streakData.current >= 7 ? 'Momentum Eccellente!' : 'Costruendo Momentum',
          description: `Hai mantenuto una streak di ${data.streakData.current} giorni. ${data.streakData.current >= 7 ? 'Questo è un risultato fantastico!' : 'Continua così per costruire una routine solida.'}`,
          confidence: 0.9,
          priority: 'medium',
          actionable: true,
          suggestedActions: data.streakData.current >= 7 ? [
            'Mantieni questa routine eccellente',
            'Considera di aumentare leggermente la difficoltà',
            'Condividi i tuoi progressi per motivare altri'
          ] : [
            'Punta a raggiungere 7 giorni consecutivi',
            'Imposta promemoria per mantenere la costanza',
            'Celebra ogni piccolo traguardo'
          ],
          dataPoints: [
            { label: 'Streak Attuale', value: `${data.streakData.current} giorni` },
            { label: 'Record Personale', value: `${data.streakData.longest} giorni` }
          ]
        };
        newInsights.push(streakInsight);
      }

      // Recent activity insights
      const recentEntries = data.manualEntries.filter(entry => 
        differenceInDays(new Date(), new Date(entry.completedAt)) <= 7
      );

      if (recentEntries.length > 0) {
        newInsights.push({
          id: 'recent-activity',
          type: 'achievement',
          title: 'Attività Recente Intensa',
          description: `Hai registrato ${recentEntries.length} attività di apprendimento nell'ultima settimana. Ottimo impegno!`,
          confidence: 0.8,
          priority: 'medium',
          actionable: true,
          suggestedActions: [
            'Rifletti su cosa hai imparato questa settimana',
            'Pianifica come applicare le nuove conoscenze',
            'Mantieni questo ritmo sostenibile'
          ],
          dataPoints: [
            { label: 'Attività Settimanali', value: recentEntries.length },
            { label: 'Ore Totali', value: `${Math.round(recentEntries.reduce((sum, e) => sum + (e.duration || 0), 0) / 60)}h` }
          ]
        });
      }

      // Diversification insights
      const uniqueSources = new Set(data.manualEntries.map(e => e.source)).size;
      const uniqueCategories = new Set(data.manualEntries.map(e => e.category)).size;

      if (uniqueSources >= 5 || uniqueCategories >= 4) {
        newInsights.push({
          id: 'learning-diversity',
          type: 'strength',
          title: 'Apprendimento Diversificato',
          description: `Utilizzi ${uniqueSources} fonti diverse e ${uniqueCategories} categorie di apprendimento. Questa diversità arricchisce la tua formazione.`,
          confidence: 0.85,
          priority: 'medium',
          actionable: true,
          suggestedActions: [
            'Continua a esplorare fonti diverse',
            'Sperimenta con nuovi formati di apprendimento',
            'Connetti le conoscenze tra diverse aree'
          ],
          dataPoints: [
            { label: 'Fonti Diverse', value: uniqueSources },
            { label: 'Categorie', value: uniqueCategories }
          ]
        });
      }

      // Time-based recommendations
      const avgSessionTime = data.manualEntries
        .filter(e => e.duration)
        .reduce((sum, e) => sum + (e.duration || 0), 0) / 
        Math.max(1, data.manualEntries.filter(e => e.duration).length);

      if (avgSessionTime > 0) {
        const isOptimal = avgSessionTime >= 25 && avgSessionTime <= 90; // Optimal learning session length
        
        newInsights.push({
          id: 'session-duration',
          type: isOptimal ? 'strength' : 'recommendation',
          title: isOptimal ? 'Durata Sessioni Ottimale' : 'Ottimizza la Durata delle Sessioni',
          description: isOptimal 
            ? `Le tue sessioni durano in media ${Math.round(avgSessionTime)} minuti, che è nell'intervallo ottimale per l'apprendimento.`
            : `Le tue sessioni durano in media ${Math.round(avgSessionTime)} minuti. ${avgSessionTime < 25 ? 'Considera sessioni leggermente più lunghe' : 'Prova a suddividere in sessioni più brevi'} per massimizzare la ritenzione.`,
          confidence: 0.75,
          priority: isOptimal ? 'low' : 'medium',
          actionable: !isOptimal,
          suggestedActions: isOptimal ? [
            'Mantieni questa durata ottimale',
            'Varia occasionalmente per evitare monotonia'
          ] : avgSessionTime < 25 ? [
            'Prova sessioni di 25-45 minuti',
            'Usa la tecnica Pomodoro',
            'Includi brevi pause attive'
          ] : [
            'Suddividi in blocchi di 45-60 minuti',
            'Fai pause di 10-15 minuti tra i blocchi',
            'Mantieni alta la concentrazione'
          ],
          dataPoints: [
            { label: 'Durata Media', value: `${Math.round(avgSessionTime)} min` },
            { label: 'Range Ottimale', value: '25-90 min' }
          ]
        });
      }

      setInsights(newInsights);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    generateInsights();
  }, [data]);

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'strength':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'improvement':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      case 'trend':
        return <BarChart3 className="w-5 h-5 text-purple-600" />;
      case 'achievement':
        return <Award className="w-5 h-5 text-orange-600" />;
      default:
        return <Brain className="w-5 h-5 text-gray-600" />;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'strength':
        return 'border-green-200 bg-green-50';
      case 'improvement':
        return 'border-blue-200 bg-blue-50';
      case 'recommendation':
        return 'border-yellow-200 bg-yellow-50';
      case 'trend':
        return 'border-purple-200 bg-purple-50';
      case 'achievement':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: AIInsight['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Alta Priorità</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Media Priorità</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Bassa Priorità</Badge>;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-indigo-600" />
              <Sparkles className="w-5 h-5 text-purple-600" />
              Analisi AI dei Progressi
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                generateInsights();
                onRefresh?.();
              }}
              disabled={isAnalyzing}
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isAnalyzing && "animate-spin")} />
              {isAnalyzing ? 'Analizzando...' : 'Aggiorna Analisi'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-indigo-700">
            L'AI ha analizzato i tuoi dati di apprendimento per identificare pattern, 
            punti di forza e aree di miglioramento personalizzate.
          </p>
        </CardContent>
      </Card>

      {/* Insights Grid */}
      <div className="grid gap-4">
        {insights.map((insight) => (
          <Card 
            key={insight.id} 
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              getInsightColor(insight.type),
              selectedInsight?.id === insight.id && "ring-2 ring-blue-500"
            )}
            onClick={() => setSelectedInsight(selectedInsight?.id === insight.id ? null : insight)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getInsightIcon(insight.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(insight.priority)}
                      <Badge variant="outline" className="text-xs">
                        {Math.round(insight.confidence * 100)}% sicurezza
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{insight.description}</p>
                  
                  {/* Data Points */}
                  {insight.dataPoints && insight.dataPoints.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-3">
                      {insight.dataPoints.map((point, index) => (
                        <div key={index} className="bg-white rounded-lg px-3 py-1 border">
                          <div className="text-xs text-muted-foreground">{point.label}</div>
                          <div className="font-semibold">{point.value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Related Skills */}
                  {insight.relatedSkills && insight.relatedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {insight.relatedSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Expanded Actions */}
              {selectedInsight?.id === insight.id && insight.suggestedActions && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Azioni Consigliate
                  </h4>
                  <ul className="space-y-2">
                    {insight.suggestedActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Learning Pattern Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Pattern di Apprendimento Identificato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{learningPattern.description}</span>
              <Badge variant={learningPattern.score >= 0.7 ? "default" : "outline"}>
                {learningPattern.type}
              </Badge>
            </div>
            
            <Progress value={learningPattern.score * 100} className="h-3" />
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Raccomandazioni Personalizzate:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {learningPattern.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Lightbulb className="w-3 h-3 mt-1 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Prossimi Obiettivi:</h4>
                <div className="space-y-2">
                  {skillGaps.slice(0, 3).map((gap, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="capitalize">{gap.skill}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={gap.currentLevel} className="w-16 h-2" />
                        <span className="text-xs text-muted-foreground">
                          {Math.round(gap.currentLevel)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Disclaimer */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Nota:</strong> Queste analisi sono generate da algoritmi AI basati sui tuoi dati di apprendimento. 
              Usa questi insights come guida, ma ricorda che il tuo percorso di apprendimento è unico. 
              Adatta sempre i consigli alle tue esigenze e obiettivi personali.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to get suggested resources for a skill
function getSuggestedResources(skill: string): string[] {
  const resourceMap: Record<string, string[]> = {
    javascript: ['MDN Web Docs', 'JavaScript.info', 'Eloquent JavaScript'],
    react: ['React Documentation', 'React Tutorial', 'Full Stack Open'],
    python: ['Python.org Tutorial', 'Automate the Boring Stuff', 'Python Crash Course'],
    css: ['CSS-Tricks', 'Flexbox Froggy', 'CSS Grid Garden'],
    html: ['MDN HTML Guide', 'HTML5 Rocks', 'W3Schools HTML'],
    nodejs: ['Node.js Documentation', 'Node.js Best Practices', 'Express.js Guide'],
    typescript: ['TypeScript Handbook', 'TypeScript Deep Dive', 'TypeScript Exercises'],
    git: ['Pro Git Book', 'Git Tutorial', 'Learn Git Branching'],
    sql: ['SQLBolt', 'W3Schools SQL', 'SQL Tutorial'],
    docker: ['Docker Documentation', 'Docker Tutorial', 'Docker for Beginners']
  };

  return resourceMap[skill.toLowerCase()] || [
    'Documentazione ufficiale',
    'Tutorial online',
    'Corsi specializzati',
    'Progetti pratici'
  ];
}