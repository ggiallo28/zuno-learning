import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Badge import removed as it's not used
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Activity,
  Target,
  Zap,
  Clock,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, subDays } from 'date-fns';
import { it } from 'date-fns/locale';
import type { ProgressData } from './ProgressDashboard';

interface ProgressChartsProps {
  data: ProgressData;
  className?: string;
}

type ChartType = 'line' | 'bar' | 'area' | 'pie' | 'radar';
type TimeRange = '7d' | '30d' | '90d' | '1y';

export function ProgressCharts({ data, className }: ProgressChartsProps) {
  const [selectedChart, setSelectedChart] = useState<ChartType>('line');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  // Color palette for charts
  const colors = {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4',
    gray: '#6b7280'
  };

  // Generate time-based data for charts
  const timeBasedData = useMemo(() => {
    const now = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const dailyData: Array<{
      date: string;
      displayDate: string;
      xp: number;
      activities: number;
      studyTime: number;
      cumulativeXP: number;
    }> = [];
    for (let i = 0; i < days; i++) {
      const date = subDays(now, days - 1 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Find XP for this day
      const dayXP = data.xpData.dailyXP.find(d => 
        format(d.date, 'yyyy-MM-dd') === dateStr
      )?.xp || 0;
      
      // Count manual entries for this day
      const manualEntries = data.manualEntries.filter(entry => 
        format(new Date(entry.completedAt), 'yyyy-MM-dd') === dateStr
      ).length;
      
      // Calculate study time for this day
      const studyTime = data.manualEntries
        .filter(entry => format(new Date(entry.completedAt), 'yyyy-MM-dd') === dateStr)
        .reduce((sum, entry) => sum + (entry.duration || 0), 0);
      
      dailyData.push({
        date: dateStr,
        displayDate: format(date, timeRange === '7d' ? 'EEE' : 'dd/MM', { locale: it }),
        xp: dayXP,
        activities: manualEntries,
        studyTime: Math.round(studyTime / 60 * 10) / 10, // Convert to hours
        cumulativeXP: dailyData.reduce((sum, d) => sum + d.xp, 0) + dayXP
      });
    }
    
    return dailyData;
  }, [data, timeRange]);

  // Skill distribution data for pie chart
  const skillDistributionData = useMemo(() => {
    const skillCategories = data.skillStats.reduce((acc, skill) => {
      const category = skill.masteryLevel || (
        skill.pct >= 80 ? 'Esperto' : 
        skill.pct >= 60 ? 'Competente' : 
        skill.pct >= 40 ? 'In Sviluppo' : 
        'Principiante'
      );
      
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(skillCategories).map(([name, value]) => ({
      name,
      value,
      color: name === 'Esperto' ? colors.success :
             name === 'Competente' ? colors.primary :
             name === 'In Sviluppo' ? colors.warning :
             colors.gray
    }));
  }, [data.skillStats]);

  // Course progress data
  const courseProgressData = useMemo(() => {
    return data.learningProgress
      .slice(0, 10) // Show top 10 courses
      .map(progress => ({
        name: progress.courseName?.substring(0, 20) + (progress.courseName && progress.courseName.length > 20 ? '...' : '') || `Corso ${progress.courseId}`,
        progress: progress.completionPercentage,
        timeSpent: Math.round((progress.timeSpent || 0) / 60 * 10) / 10,
        xpEarned: progress.xpEarned || 0
      }));
  }, [data.learningProgress]);

  // Skill radar data
  const skillRadarData = useMemo(() => {
    const topSkills = data.skillStats
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 6)
      .map(skill => ({
        skill: skill.tag.charAt(0).toUpperCase() + skill.tag.slice(1),
        mastery: skill.pct,
        fullMark: 100
      }));
    
    return topSkills;
  }, [data.skillStats]);

  // Learning source distribution
  const sourceDistributionData = useMemo(() => {
    const sources = data.manualEntries.reduce((acc, entry) => {
      acc[entry.source] = (acc[entry.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(sources).map(([name, value]) => ({
      name,
      value,
      color: colors.primary
    }));
  }, [data.manualEntries]);

  const renderChart = () => {
    switch (selectedChart) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={timeBasedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayDate" />
              <YAxis />
              <Tooltip 
                labelFormatter={(label) => `Data: ${label}`}
                formatter={(value, name) => [
                  value, 
                  name === 'xp' ? 'XP Giornalieri' : 
                  name === 'studyTime' ? 'Ore di Studio' : 
                  'Attività'
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="xp" 
                stroke={colors.primary} 
                strokeWidth={2}
                dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
                name="XP"
              />
              <Line 
                type="monotone" 
                dataKey="studyTime" 
                stroke={colors.secondary} 
                strokeWidth={2}
                dot={{ fill: colors.secondary, strokeWidth: 2, r: 4 }}
                name="Ore Studio"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={courseProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  value, 
                  name === 'progress' ? 'Progresso %' : 
                  name === 'timeSpent' ? 'Ore Spese' : 
                  'XP Guadagnati'
                ]}
              />
              <Legend />
              <Bar dataKey="progress" fill={colors.primary} name="Progresso %" />
              <Bar dataKey="xpEarned" fill={colors.success} name="XP" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={timeBasedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayDate" />
              <YAxis />
              <Tooltip 
                labelFormatter={(label) => `Data: ${label}`}
                formatter={(value) => [value, 'XP Cumulativi']}
              />
              <Area 
                type="monotone" 
                dataKey="cumulativeXP" 
                stroke={colors.primary} 
                fill={colors.primary}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-4 text-center">Distribuzione Competenze</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={skillDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {skillDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {sourceDistributionData.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-4 text-center">Fonti di Apprendimento</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sourceDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sourceDistributionData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={Object.values(colors)[index % Object.values(colors).length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={skillRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={false}
              />
              <Radar
                name="Padronanza"
                dataKey="mastery"
                stroke={colors.primary}
                fill={colors.primary}
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Padronanza']}
              />
            </RadarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getChartIcon = (type: ChartType) => {
    switch (type) {
      case 'line':
      case 'area':
        return <TrendingUp className="w-4 h-4" />;
      case 'bar':
        return <BarChart3 className="w-4 h-4" />;
      case 'pie':
        return <PieChartIcon className="w-4 h-4" />;
      case 'radar':
        return <Target className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getChartTitle = (type: ChartType) => {
    switch (type) {
      case 'line':
        return 'Progresso Giornaliero';
      case 'bar':
        return 'Progresso per Corso';
      case 'area':
        return 'XP Cumulativi';
      case 'pie':
        return 'Distribuzione Competenze';
      case 'radar':
        return 'Mappa Competenze';
      default:
        return 'Grafico';
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Chart Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Analytics Avanzate
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 giorni</SelectItem>
                  <SelectItem value="30d">30 giorni</SelectItem>
                  <SelectItem value="90d">90 giorni</SelectItem>
                  <SelectItem value="1y">1 anno</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(['line', 'bar', 'area', 'pie', 'radar'] as ChartType[]).map((type) => (
              <Button
                key={type}
                variant={selectedChart === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedChart(type)}
                className="flex items-center gap-2"
              >
                {getChartIcon(type)}
                {getChartTitle(type)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getChartIcon(selectedChart)}
            {getChartTitle(selectedChart)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-900">
                  {timeBasedData.reduce((sum, d) => sum + d.xp, 0)}
                </div>
                <div className="text-sm text-blue-700">XP nel Periodo</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-900">
                  {Math.round(timeBasedData.reduce((sum, d) => sum + d.studyTime, 0) * 10) / 10}h
                </div>
                <div className="text-sm text-green-700">Ore di Studio</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-900">
                  {timeBasedData.reduce((sum, d) => sum + d.activities, 0)}
                </div>
                <div className="text-sm text-purple-700">Attività Completate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600 rounded-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-900">
                  {Math.round(timeBasedData.reduce((sum, d) => sum + d.xp, 0) / Math.max(1, timeBasedData.filter(d => d.xp > 0).length))}
                </div>
                <div className="text-sm text-orange-700">XP Medi/Giorno</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-900">
            <TrendingUp className="w-5 h-5" />
            Insights e Tendenze
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-indigo-900">Tendenze Positive</h4>
              <ul className="text-sm text-indigo-700 space-y-1">
                {data.skillStats.filter(s => s.trend === 'up').length > 0 && (
                  <li>• {data.skillStats.filter(s => s.trend === 'up').length} competenze in miglioramento</li>
                )}
                {data.streakData.current > 0 && (
                  <li>• Streak attuale di {data.streakData.current} giorni</li>
                )}
                {data.xpData.thisWeek > 0 && (
                  <li>• {data.xpData.thisWeek} XP guadagnati questa settimana</li>
                )}
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-indigo-900">Aree di Miglioramento</h4>
              <ul className="text-sm text-indigo-700 space-y-1">
                {data.skillStats.filter(s => s.pct < 50).length > 0 && (
                  <li>• {data.skillStats.filter(s => s.pct < 50).length} competenze da sviluppare</li>
                )}
                {timeBasedData.filter(d => d.xp === 0).length > 0 && (
                  <li>• {timeBasedData.filter(d => d.xp === 0).length} giorni senza attività</li>
                )}
                {data.learningProgress.filter(p => p.completionPercentage === 0).length > 0 && (
                  <li>• {data.learningProgress.filter(p => p.completionPercentage === 0).length} corsi non iniziati</li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}