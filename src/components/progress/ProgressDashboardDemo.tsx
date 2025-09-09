import { useState } from 'react';
import { ProgressDashboard, type ProgressData, type ManualLearningEntry, type ExportOptions } from './ProgressDashboard';
import { exportProgressData } from '@/utils/exportUtils';
import { CoachNameValues, CourseCategoryValues, DifficultyLevelValues } from '@/api/amplify';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, RefreshCw } from 'lucide-react';

// Mock data for demonstration
const createMockData = (): ProgressData => {
  const mockUser = {
    id: 'demo-user',
    email: 'mario.rossi@example.com',
    username: 'mario.rossi',
    fullName: 'Mario Rossi',
    subscriptionTier: 'premium',
    totalXp: 1285,
    currentLevel: 8,
    currentStreak: 12,
    longestStreak: 28,
    onboardingCompleted: true,
    coachName: CoachNameValues.ELIA
  };

  const mockCourses = [
    { id: '1', title: 'React Fundamentals', category: CourseCategoryValues.TECHNOLOGY, difficultyLevel: DifficultyLevelValues.BEGINNER },
    { id: '2', title: 'Advanced JavaScript', category: CourseCategoryValues.TECHNOLOGY, difficultyLevel: DifficultyLevelValues.ADVANCED },
    { id: '3', title: 'Node.js Backend', category: CourseCategoryValues.TECHNOLOGY, difficultyLevel: DifficultyLevelValues.INTERMEDIATE },
    { id: '4', title: 'TypeScript Mastery', category: CourseCategoryValues.TECHNOLOGY, difficultyLevel: DifficultyLevelValues.ADVANCED },
    { id: '5', title: 'CSS Grid & Flexbox', category: CourseCategoryValues.TECHNOLOGY, difficultyLevel: DifficultyLevelValues.INTERMEDIATE }
  ];

  const mockLearningProgress = [
    {
      userId: 'demo-user',
      courseId: '1',
      courseName: 'React Fundamentals',
      completionPercentage: 100,
      xpEarned: 250,
      timeSpent: 1200, // minutes
      lastAccessedAt: new Date(2024, 11, 15).toISOString()
    },
    {
      userId: 'demo-user',
      courseId: '2',
      courseName: 'Advanced JavaScript',
      completionPercentage: 75,
      xpEarned: 180,
      timeSpent: 900,
      lastAccessedAt: new Date(2024, 11, 20).toISOString()
    },
    {
      userId: 'demo-user',
      courseId: '3',
      courseName: 'Node.js Backend',
      completionPercentage: 45,
      xpEarned: 120,
      timeSpent: 600,
      lastAccessedAt: new Date(2024, 11, 18).toISOString()
    },
    {
      userId: 'demo-user',
      courseId: '4',
      courseName: 'TypeScript Mastery',
      completionPercentage: 30,
      xpEarned: 80,
      timeSpent: 400,
      lastAccessedAt: new Date(2024, 11, 10).toISOString()
    },
    {
      userId: 'demo-user',
      courseId: '5',
      courseName: 'CSS Grid & Flexbox',
      completionPercentage: 0,
      xpEarned: 0,
      timeSpent: 0,
      lastAccessedAt: null
    }
  ];

  const mockSkillStats = [
    { tag: 'react', pct: 85, trend: 'up' as const, confidence: 0.9, attempts: 15, lastAttempted: new Date(2024, 11, 20) },
    { tag: 'javascript', pct: 78, trend: 'up' as const, confidence: 0.85, attempts: 25, lastAttempted: new Date(2024, 11, 19) },
    { tag: 'typescript', pct: 65, trend: 'stable' as const, confidence: 0.8, attempts: 12, lastAttempted: new Date(2024, 11, 15) },
    { tag: 'nodejs', pct: 55, trend: 'up' as const, confidence: 0.75, attempts: 8, lastAttempted: new Date(2024, 11, 18) },
    { tag: 'css', pct: 70, trend: 'stable' as const, confidence: 0.8, attempts: 18, lastAttempted: new Date(2024, 11, 16) },
    { tag: 'html', pct: 90, trend: 'stable' as const, confidence: 0.95, attempts: 20, lastAttempted: new Date(2024, 11, 12) },
    { tag: 'git', pct: 60, trend: 'up' as const, confidence: 0.7, attempts: 10, lastAttempted: new Date(2024, 11, 14) },
    { tag: 'docker', pct: 40, trend: 'down' as const, confidence: 0.6, attempts: 5, lastAttempted: new Date(2024, 10, 28) }
  ];

  const mockManualEntries: ManualLearningEntry[] = [
    {
      id: '1',
      title: 'Advanced React Patterns Workshop',
      description: 'Approfondimento su render props, HOCs e hooks personalizzati',
      category: 'workshop',
      source: 'React Conference 2024',
      completedAt: new Date(2024, 11, 18),
      duration: 180,
      skills: ['react', 'javascript', 'patterns'],
      certificateUrl: 'https://example.com/cert1',
      notes: 'Ottimo workshop, molti pattern utili per progetti complessi',
      xpAwarded: 150
    },
    {
      id: '2',
      title: 'TypeScript Deep Dive Course',
      description: 'Corso completo su TypeScript avanzato',
      category: 'course',
      source: 'Udemy',
      completedAt: new Date(2024, 11, 15),
      duration: 480,
      skills: ['typescript', 'javascript'],
      certificateUrl: 'https://example.com/cert2',
      xpAwarded: 200
    },
    {
      id: '3',
      title: 'Clean Code Principles',
      description: 'Lettura del libro di Robert Martin',
      category: 'book',
      source: 'Libro',
      completedAt: new Date(2024, 11, 10),
      duration: 600,
      skills: ['clean-code', 'best-practices'],
      notes: 'Principi fondamentali per scrivere codice mantenibile',
      xpAwarded: 100
    },
    {
      id: '4',
      title: 'Docker Containerization Basics',
      description: 'Tutorial introduttivo su Docker',
      category: 'video',
      source: 'YouTube',
      completedAt: new Date(2024, 11, 8),
      duration: 120,
      skills: ['docker', 'devops'],
      xpAwarded: 75
    },
    {
      id: '5',
      title: 'GraphQL API Design',
      description: 'Webinar su best practices per API GraphQL',
      category: 'conference',
      source: 'GraphQL Summit',
      completedAt: new Date(2024, 11, 5),
      duration: 90,
      skills: ['graphql', 'api-design'],
      certificateUrl: 'https://example.com/cert3',
      xpAwarded: 80
    }
  ];

  const mockStreakData = {
    current: 12,
    longest: 28,
    lastActivity: new Date(2024, 11, 20),
    weeklyStreak: [true, true, false, true, true, true, true]
  };

  // Generate daily XP data for the last 30 days
  const dailyXP = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const xp = Math.random() > 0.3 ? Math.floor(Math.random() * 150) + 25 : 0; // Some days with no activity
    dailyXP.push({ date, xp });
  }

  const mockXpData = {
    total: 1285,
    thisWeek: 320,
    thisMonth: 850,
    level: 8,
    nextLevelXP: 1500,
    dailyXP
  };

  return {
    user: mockUser,
    courses: mockCourses,
    learningProgress: mockLearningProgress,
    skillStats: mockSkillStats,
    manualEntries: mockManualEntries,
    streakData: mockStreakData,
    xpData: mockXpData
  };
};

export function ProgressDashboardDemo() {
  const [data, setData] = useState<ProgressData>(createMockData());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate slightly different mock data
    setData(createMockData());
    setIsRefreshing(false);
  };

  const handleManualEntryAdd = (entry: Omit<ManualLearningEntry, 'id'>) => {
    const newEntry: ManualLearningEntry = {
      ...entry,
      id: Date.now().toString()
    };
    
    setData(prev => ({
      ...prev,
      manualEntries: [newEntry, ...prev.manualEntries],
      xpData: {
        ...prev.xpData,
        total: prev.xpData.total + (entry.xpAwarded || 0),
        thisWeek: prev.xpData.thisWeek + (entry.xpAwarded || 0),
        thisMonth: prev.xpData.thisMonth + (entry.xpAwarded || 0)
      }
    }));
  };

  const handleExport = async (format: 'pdf' | 'json' | 'csv', options: ExportOptions) => {
    try {
      await exportProgressData(data, format, options);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Errore durante l\'esportazione. Controlla la console per i dettagli.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Demo Header */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="w-6 h-6 text-blue-600" />
            Demo: Sistema di Tracciamento Progressi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-700">
              Questa è una dimostrazione completa del sistema di tracciamento progressi di Zuno. 
              Include dashboard interattiva, timeline di apprendimento, analytics avanzate, 
              insights AI e funzionalità di esportazione.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-100 text-green-800">✓ Dashboard Completa</Badge>
              <Badge className="bg-blue-100 text-blue-800">✓ Timeline Interattiva</Badge>
              <Badge className="bg-purple-100 text-purple-800">✓ Analytics Avanzate</Badge>
              <Badge className="bg-orange-100 text-orange-800">✓ AI Insights</Badge>
              <Badge className="bg-red-100 text-red-800">✓ Export PDF/JSON/CSV</Badge>
              <Badge className="bg-yellow-100 text-yellow-800">✓ Apprendimenti Manuali</Badge>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Rigenera Dati Demo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Dashboard */}
      <ProgressDashboard
        data={data}
        onRefresh={handleRefresh}
        onManualEntryAdd={handleManualEntryAdd}
        onExport={handleExport}
      />
    </div>
  );
}