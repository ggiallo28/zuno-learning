import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Target, 
  Award, 
  Clock,
  BookOpen,
  Zap,
  Brain,
  Activity,
  Download,
  Plus,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SkillMap, type SkillStat } from '@/components/assessment/SkillMap';
import { LearningTimeline } from './LearningTimeline';
import { ProgressCharts } from './ProgressCharts';
import { ManualEntryDialog } from './ManualEntryDialog';
import { ExportDialog } from './ExportDialog';
import { AIInsights } from './AIInsights';
import type { User, Course } from '@/types';

export interface LearningProgress {
  userId: string;
  courseId: string;
  courseName?: string;
  completionPercentage: number;
  xpEarned?: number;
  timeSpent?: number;
  lastAccessedAt?: string | null;
}

export interface ProgressData {
  user: User;
  courses: Course[];
  learningProgress: LearningProgress[];
  skillStats: SkillStat[];
  manualEntries: ManualLearningEntry[];
  streakData: StreakData;
  xpData: XPData;
}

export interface ManualLearningEntry {
  id: string;
  title: string;
  description?: string;
  category: string;
  source: string; // e.g., "Coursera", "YouTube", "Book", "Conference"
  completedAt: Date;
  duration?: number; // in minutes
  skills?: string[];
  certificateUrl?: string;
  notes?: string;
  xpAwarded?: number;
}

export interface StreakData {
  current: number;
  longest: number;
  lastActivity: Date;
  weeklyStreak: boolean[];
}

export interface XPData {
  total: number;
  thisWeek: number;
  thisMonth: number;
  level: number;
  nextLevelXP: number;
  dailyXP: { date: Date; xp: number }[];
}

interface ProgressDashboardProps {
  data: ProgressData;
  onRefresh?: () => void;
  onManualEntryAdd?: (entry: Omit<ManualLearningEntry, 'id'>) => void;
  onExport?: (format: 'pdf' | 'json' | 'csv', options: ExportOptions) => void;
  className?: string;
}

export interface ExportOptions {
  includeSkillMap: boolean;
  includeTimeline: boolean;
  includeManualEntries: boolean;
  includeCertificates: boolean;
  dateRange?: { start: Date; end: Date };
  privacy: 'public' | 'professional' | 'private';
}

export function ProgressDashboard({ 
  data, 
  onRefresh, 
  onManualEntryAdd,
  onExport,
  className 
}: ProgressDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate overall progress metrics
  const metrics = useMemo(() => {
    const totalCourses = data.courses.length;
    const completedCourses = data.learningProgress.filter(p => p.completionPercentage === 100).length;
    const inProgressCourses = data.learningProgress.filter(p => p.completionPercentage > 0 && p.completionPercentage < 100).length;
    const averageProgress = data.learningProgress.reduce((sum, p) => sum + p.completionPercentage, 0) / Math.max(1, data.learningProgress.length);
    
    const totalSkills = data.skillStats.length;
    const masteredSkills = data.skillStats.filter(s => s.pct >= 80).length;
    const averageSkillMastery = data.skillStats.reduce((sum, s) => sum + s.pct, 0) / Math.max(1, totalSkills);
    
    const totalManualEntries = data.manualEntries.length;
    const thisMonthEntries = data.manualEntries.filter(e => {
      const entryDate = new Date(e.completedAt);
      const now = new Date();
      return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
    }).length;

    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      averageProgress,
      totalSkills,
      masteredSkills,
      averageSkillMastery,
      totalManualEntries,
      thisMonthEntries,
      totalLearningHours: Math.round(
        (data.learningProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0) +
         data.manualEntries.reduce((sum, e) => sum + (e.duration || 0), 0)) / 60
      )
    };
  }, [data]);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleManualEntrySubmit = (entry: Omit<ManualLearningEntry, 'id'>) => {
    onManualEntryAdd?.(entry);
    setShowManualEntry(false);
  };

  const handleExport = (format: 'pdf' | 'json' | 'csv', options: ExportOptions) => {
    onExport?.(format, options);
    setShowExport(false);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Progressi</h1>
          <p className="text-muted-foreground">
            Monitora il tuo percorso di apprendimento e i tuoi risultati
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
            Aggiorna
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowManualEntry(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Aggiungi Apprendimento
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExport(true)}
          >
            <Download className="w-4 h-4 mr-2" />
            Esporta
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{metrics.completedCourses}</div>
                <div className="text-sm text-muted-foreground">Corsi Completati</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{metrics.inProgressCourses}</div>
                <div className="text-sm text-muted-foreground">In Corso</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{metrics.masteredSkills}</div>
                <div className="text-sm text-muted-foreground">Competenze Padroneggiati</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{metrics.totalLearningHours}h</div>
                <div className="text-sm text-muted-foreground">Ore di Studio</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{data.streakData.current}</div>
                <div className="text-sm text-muted-foreground">Giorni Consecutivi</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold">{data.xpData.level}</div>
                <div className="text-sm text-muted-foreground">Livello</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Progresso Corsi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progresso Medio</span>
                <span>{Math.round(metrics.averageProgress)}%</span>
              </div>
              <Progress value={metrics.averageProgress} className="h-3" />
              
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="font-semibold text-green-600">{metrics.completedCourses}</div>
                  <div className="text-muted-foreground">Completati</div>
                </div>
                <div>
                  <div className="font-semibold text-blue-600">{metrics.inProgressCourses}</div>
                  <div className="text-muted-foreground">In Corso</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-600">{metrics.totalCourses - metrics.completedCourses - metrics.inProgressCourses}</div>
                  <div className="text-muted-foreground">Non Iniziati</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Padronanza Competenze
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Padronanza Media</span>
                <span>{Math.round(metrics.averageSkillMastery)}%</span>
              </div>
              <Progress value={metrics.averageSkillMastery} className="h-3" />
              
              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                  <div className="font-semibold text-green-600">{metrics.masteredSkills}</div>
                  <div className="text-muted-foreground">Padroneggiati</div>
                </div>
                <div>
                  <div className="font-semibold text-blue-600">{metrics.totalSkills - metrics.masteredSkills}</div>
                  <div className="text-muted-foreground">In Sviluppo</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Panoramica</TabsTrigger>
          <TabsTrigger value="skills">Competenze</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Attività Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.manualEntries
                  .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                  .slice(0, 5)
                  .map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{entry.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.source} • {new Date(entry.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant="outline">{entry.category}</Badge>
                    </div>
                  ))}
                
                {data.manualEntries.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Nessuna attività recente</p>
                    <p className="text-sm">Aggiungi i tuoi apprendimenti esterni per tracciare tutti i progressi</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* XP Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Progressione XP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Livello {data.xpData.level}</span>
                  <span className="text-sm text-muted-foreground">
                    {data.xpData.total} / {data.xpData.nextLevelXP} XP
                  </span>
                </div>
                <Progress 
                  value={(data.xpData.total / data.xpData.nextLevelXP) * 100} 
                  className="h-3" 
                />
                
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div>
                    <div className="font-semibold text-blue-600">{data.xpData.thisWeek}</div>
                    <div className="text-muted-foreground">XP Questa Settimana</div>
                  </div>
                  <div>
                    <div className="font-semibold text-purple-600">{data.xpData.thisMonth}</div>
                    <div className="text-muted-foreground">XP Questo Mese</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <SkillMap 
            stats={data.skillStats}
            isRealTime={false}
            showDetails={true}
            className="space-y-4"
          />
        </TabsContent>

        <TabsContent value="timeline">
          <LearningTimeline 
            learningProgress={data.learningProgress}
            manualEntries={data.manualEntries}
            className="space-y-4"
          />
        </TabsContent>

        <TabsContent value="analytics">
          <ProgressCharts 
            data={data}
            className="space-y-6"
          />
        </TabsContent>

        <TabsContent value="insights">
          <AIInsights 
            data={data}
            onRefresh={onRefresh}
            className="space-y-6"
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ManualEntryDialog
        open={showManualEntry}
        onOpenChange={setShowManualEntry}
        onSubmit={handleManualEntrySubmit}
      />

      <ExportDialog
        open={showExport}
        onOpenChange={setShowExport}
        onExport={handleExport}
        data={data}
      />
    </div>
  );
}