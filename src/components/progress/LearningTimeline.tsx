import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  BookOpen, 
  Award, 
  ExternalLink, 
  Clock, 

  Search,
  TrendingUp,
  CheckCircle,
  Play,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday, isThisWeek, isThisMonth, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
// LearningProgress type will be imported from ProgressDashboard
import type { ManualLearningEntry } from './ProgressDashboard';

interface TimelineEntry {
  id: string;
  type: 'course' | 'manual';
  title: string;
  description?: string;
  date: Date;
  category?: string;
  source?: string;
  duration?: number;
  xpAwarded?: number;
  completionPercentage?: number;
  certificateUrl?: string;
  skills?: string[];
  courseId?: string;
}

interface LearningProgress {
  userId: string;
  courseId: string;
  courseName?: string;
  completionPercentage: number;
  xpEarned?: number;
  timeSpent?: number;
  lastAccessedAt?: string | null;
}

interface LearningTimelineProps {
  learningProgress: LearningProgress[];
  manualEntries: ManualLearningEntry[];
  className?: string;
}

export function LearningTimeline({ 
  learningProgress, 
  manualEntries, 
  className 
}: LearningTimelineProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'course' | 'manual'>('all');
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'xp'>('date');

  // Convert data to timeline entries
  const timelineEntries = useMemo((): TimelineEntry[] => {
    const entries: TimelineEntry[] = [];

    // Add course progress entries
    learningProgress.forEach(progress => {
      if (progress.lastAccessedAt) {
        entries.push({
          id: `course-${progress.courseId}`,
          type: 'course',
          title: progress.courseName || `Corso ${progress.courseId}`,
          description: `Progresso: ${progress.completionPercentage}%`,
          date: new Date(progress.lastAccessedAt),
          completionPercentage: progress.completionPercentage,
          duration: progress.timeSpent,
          xpAwarded: progress.xpEarned,
          courseId: progress.courseId
        });
      }
    });

    // Add manual entries
    manualEntries.forEach(entry => {
      entries.push({
        id: entry.id,
        type: 'manual',
        title: entry.title,
        description: entry.description,
        date: new Date(entry.completedAt),
        category: entry.category,
        source: entry.source,
        duration: entry.duration,
        xpAwarded: entry.xpAwarded,
        certificateUrl: entry.certificateUrl,
        skills: entry.skills
      });
    });

    return entries;
  }, [learningProgress, manualEntries]);

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    let filtered = timelineEntries;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.source?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(entry => entry.type === filterType);
    }

    // Filter by period
    if (filterPeriod !== 'all') {
      filtered = filtered.filter(entry => {
        switch (filterPeriod) {
          case 'today':
            return isToday(entry.date);
          case 'week':
            return isThisWeek(entry.date);
          case 'month':
            return isThisMonth(entry.date);
          default:
            return true;
        }
      });
    }

    // Sort entries
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'duration':
          return (b.duration || 0) - (a.duration || 0);
        case 'xp':
          return (b.xpAwarded || 0) - (a.xpAwarded || 0);
        case 'date':
        default:
          return b.date.getTime() - a.date.getTime();
      }
    });

    return filtered;
  }, [timelineEntries, searchTerm, filterType, filterPeriod, sortBy]);

  // Group entries by date
  const groupedEntries = useMemo(() => {
    const groups: { [key: string]: TimelineEntry[] } = {};
    
    filteredEntries.forEach(entry => {
      const dateKey = format(entry.date, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(entry);
    });

    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [filteredEntries]);

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Oggi';
    if (isYesterday(date)) return 'Ieri';
    return format(date, 'EEEE, d MMMM yyyy', { locale: it });
  };

  const getEntryIcon = (entry: TimelineEntry) => {
    if (entry.type === 'course') {
      if (entry.completionPercentage === 100) {
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      } else if ((entry.completionPercentage || 0) > 0) {
        return <Play className="w-5 h-5 text-blue-600" />;
      } else {
        return <BookOpen className="w-5 h-5 text-gray-600" />;
      }
    } else {
      return <Award className="w-5 h-5 text-purple-600" />;
    }
  };

  const getEntryColor = (entry: TimelineEntry) => {
    if (entry.type === 'course') {
      if (entry.completionPercentage === 100) {
        return 'border-green-200 bg-green-50';
      } else if ((entry.completionPercentage || 0) > 0) {
        return 'border-blue-200 bg-blue-50';
      } else {
        return 'border-gray-200 bg-gray-50';
      }
    } else {
      return 'border-purple-200 bg-purple-50';
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Timeline di Apprendimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cerca attività..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti</SelectItem>
                <SelectItem value="course">Corsi</SelectItem>
                <SelectItem value="manual">Manuali</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPeriod} onValueChange={(value: any) => setFilterPeriod(value)}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutto</SelectItem>
                <SelectItem value="today">Oggi</SelectItem>
                <SelectItem value="week">Questa Settimana</SelectItem>
                <SelectItem value="month">Questo Mese</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Ordina per" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Data</SelectItem>
                <SelectItem value="duration">Durata</SelectItem>
                <SelectItem value="xp">XP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-6">
        {groupedEntries.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Nessuna attività trovata</h3>
                <p>Prova a modificare i filtri o aggiungi nuove attività di apprendimento</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          groupedEntries.map(([dateStr, entries]) => (
            <div key={dateStr} className="space-y-4">
              {/* Date Header */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-3 h-3 bg-blue-600 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {getDateLabel(dateStr)}
                </h3>
                <div className="flex-1 h-px bg-gray-200"></div>
                <Badge variant="outline" className="text-xs">
                  {entries.length} {entries.length === 1 ? 'attività' : 'attività'}
                </Badge>
              </div>

              {/* Entries for this date */}
              <div className="ml-6 space-y-3">
                {entries.map((entry) => (
                  <Card key={entry.id} className={cn("transition-all hover:shadow-md", getEntryColor(entry))}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getEntryIcon(entry)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">
                                {entry.title}
                              </h4>
                              
                              {entry.description && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  {entry.description}
                                </p>
                              )}
                              
                              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {format(entry.date, 'HH:mm')}
                                </span>
                                
                                {entry.duration && (
                                  <span className="flex items-center gap-1">
                                    <Target className="w-3 h-3" />
                                    {entry.duration} min
                                  </span>
                                )}
                                
                                {entry.source && (
                                  <Badge variant="outline" className="text-xs">
                                    {entry.source}
                                  </Badge>
                                )}
                                
                                {entry.category && (
                                  <Badge variant="secondary" className="text-xs">
                                    {entry.category}
                                  </Badge>
                                )}
                              </div>
                              
                              {entry.skills && entry.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {entry.skills.map((skill, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                              {entry.xpAwarded && (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  {entry.xpAwarded} XP
                                </Badge>
                              )}
                              
                              {entry.completionPercentage !== undefined && (
                                <Badge 
                                  variant={entry.completionPercentage === 100 ? "default" : "outline"}
                                  className="text-xs"
                                >
                                  {entry.completionPercentage}%
                                </Badge>
                              )}
                              
                              {entry.certificateUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => window.open(entry.certificateUrl, '_blank')}
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Certificato
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {filteredEntries.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {filteredEntries.length}
                </div>
                <div className="text-sm text-muted-foreground">Attività Totali</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(filteredEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / 60 * 10) / 10}h
                </div>
                <div className="text-sm text-muted-foreground">Tempo Totale</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {filteredEntries.reduce((sum, entry) => sum + (entry.xpAwarded || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">XP Guadagnati</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {filteredEntries.filter(entry => entry.type === 'manual').length}
                </div>
                <div className="text-sm text-muted-foreground">Apprendimenti Esterni</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}