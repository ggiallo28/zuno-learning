import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  FileText, 
  FileJson, 
  FileSpreadsheet,
  CalendarIcon,
  Shield,
  Eye,
  EyeOff,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import type { ProgressData, ExportOptions } from './ProgressDashboard';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (format: 'pdf' | 'json' | 'csv', options: ExportOptions) => void;
  data: ProgressData;
}

const EXPORT_FORMATS = [
  {
    value: 'pdf' as const,
    label: 'PDF Portfolio',
    description: 'Documento professionale per CV e portfolio',
    icon: FileText,
    color: 'text-red-600'
  },
  {
    value: 'json' as const,
    label: 'JSON Data',
    description: 'Dati strutturati per backup o integrazione',
    icon: FileJson,
    color: 'text-blue-600'
  },
  {
    value: 'csv' as const,
    label: 'CSV Spreadsheet',
    description: 'Tabella per analisi in Excel o Google Sheets',
    icon: FileSpreadsheet,
    color: 'text-green-600'
  }
];

const PRIVACY_LEVELS = [
  {
    value: 'public' as const,
    label: 'Pubblico',
    description: 'Include tutti i dati per condivisione pubblica',
    icon: Eye,
    color: 'text-green-600'
  },
  {
    value: 'professional' as const,
    label: 'Professionale',
    description: 'Solo competenze e certificazioni per CV',
    icon: Award,
    color: 'text-blue-600'
  },
  {
    value: 'private' as const,
    label: 'Privato',
    description: 'Dati completi per uso personale',
    icon: EyeOff,
    color: 'text-gray-600'
  }
];

export function ExportDialog({ open, onOpenChange, onExport, data }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'json' | 'csv'>('pdf');
  const [options, setOptions] = useState<ExportOptions>({
    includeSkillMap: true,
    includeTimeline: true,
    includeManualEntries: true,
    includeCertificates: true,
    privacy: 'professional'
  });
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportOptions: ExportOptions = {
        ...options,
        dateRange: dateRange.start && dateRange.end ? {
          start: dateRange.start,
          end: dateRange.end
        } : undefined
      };
      
      await onExport(selectedFormat, exportOptions);
    } finally {
      setIsExporting(false);
    }
  };

  const getPreviewData = () => {
    const stats = {
      totalCourses: data.courses.length,
      completedCourses: data.learningProgress.filter(p => p.completionPercentage === 100).length,
      totalSkills: data.skillStats.length,
      masteredSkills: data.skillStats.filter(s => s.pct >= 80).length,
      manualEntries: data.manualEntries.length,
      certificates: data.manualEntries.filter(e => e.certificateUrl).length,
      totalXP: data.xpData.total,
      currentStreak: data.streakData.current
    };

    // Filter based on privacy level
    if (options.privacy === 'professional') {
      return {
        ...stats,
        manualEntries: options.includeManualEntries ? stats.manualEntries : 0,
        totalXP: 0, // Hide XP for professional export
        currentStreak: 0 // Hide streak for professional export
      };
    }

    return stats;
  };

  const previewData = getPreviewData();

  const getFormatSpecificOptions = () => {
    switch (selectedFormat) {
      case 'pdf':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-900 mb-2">Opzioni PDF</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="skillMap"
                    checked={options.includeSkillMap}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, includeSkillMap: !!checked }))
                    }
                  />
                  <Label htmlFor="skillMap" className="text-sm">Mappa delle Competenze</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="timeline"
                    checked={options.includeTimeline}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, includeTimeline: !!checked }))
                    }
                  />
                  <Label htmlFor="timeline" className="text-sm">Timeline di Apprendimento</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="certificates"
                    checked={options.includeCertificates}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, includeCertificates: !!checked }))
                    }
                  />
                  <Label htmlFor="certificates" className="text-sm">Link ai Certificati</Label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'json':
        return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h4 className="font-medium text-green-900 mb-2">Formato JSON</h4>
            <p className="text-sm text-green-700">
              Esporta tutti i dati in formato JSON strutturato per backup o integrazione con altri sistemi.
            </p>
          </div>
        );

      case 'csv':
        return (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <h4 className="font-medium text-orange-900 mb-2">Formato CSV</h4>
            <p className="text-sm text-orange-700">
              Crea un file CSV con i dati di apprendimento per analisi in Excel o Google Sheets.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Esporta Progressi
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Formato di Esportazione</Label>
            <div className="grid gap-3">
              {EXPORT_FORMATS.map((format) => {
                const Icon = format.icon;
                return (
                  <div
                    key={format.value}
                    className={cn(
                      "flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all",
                      selectedFormat === format.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setSelectedFormat(format.value)}
                  >
                    <div className={cn("p-2 rounded-lg bg-white", format.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{format.label}</div>
                      <div className="text-sm text-muted-foreground">{format.description}</div>
                    </div>
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2",
                      selectedFormat === format.value
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    )}>
                      {selectedFormat === format.value && (
                        <CheckCircle className="w-full h-full text-white" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Privacy Level */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Livello di Privacy</Label>
            <Select 
              value={options.privacy} 
              onValueChange={(value: 'public' | 'professional' | 'private') => 
                setOptions(prev => ({ ...prev, privacy: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIVACY_LEVELS.map((level) => {
                  const Icon = level.icon;
                  return (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex items-center gap-2">
                        <Icon className={cn("w-4 h-4", level.color)} />
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-xs text-muted-foreground">{level.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Content Options */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Contenuti da Includere</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manualEntries"
                  checked={options.includeManualEntries}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, includeManualEntries: !!checked }))
                  }
                />
                <Label htmlFor="manualEntries">Apprendimenti Esterni</Label>
                <Badge variant="outline" className="ml-auto">
                  {previewData.manualEntries} elementi
                </Badge>
              </div>
            </div>
          </div>

          {/* Format-specific options */}
          {getFormatSpecificOptions()}

          <Separator />

          {/* Date Range */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Intervallo di Date (Opzionale)</Label>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Data Inizio</Label>
                <Popover open={showStartCalendar} onOpenChange={setShowStartCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.start && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.start ? (
                        format(dateRange.start, "PPP", { locale: it })
                      ) : (
                        <span>Seleziona data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.start}
                      onSelect={(date) => {
                        setDateRange(prev => ({ ...prev, start: date }));
                        setShowStartCalendar(false);
                      }}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Data Fine</Label>
                <Popover open={showEndCalendar} onOpenChange={setShowEndCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.end && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.end ? (
                        format(dateRange.end, "PPP", { locale: it })
                      ) : (
                        <span>Seleziona data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.end}
                      onSelect={(date) => {
                        setDateRange(prev => ({ ...prev, end: date }));
                        setShowEndCalendar(false);
                      }}
                      disabled={(date) => {
                        if (date > new Date()) return true;
                        if (dateRange.start && date < dateRange.start) return true;
                        return false;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {dateRange.start && dateRange.end && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDateRange({})}
                className="text-muted-foreground"
              >
                Rimuovi filtro date
              </Button>
            )}
          </div>

          <Separator />

          {/* Preview */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Anteprima Contenuti</Label>
            <div className="bg-gray-50 border rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{previewData.completedCourses}</div>
                  <div className="text-xs text-muted-foreground">Corsi Completati</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{previewData.masteredSkills}</div>
                  <div className="text-xs text-muted-foreground">Competenze Padroneggiati</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{previewData.certificates}</div>
                  <div className="text-xs text-muted-foreground">Certificati</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{previewData.manualEntries}</div>
                  <div className="text-xs text-muted-foreground">Apprendimenti Esterni</div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          {options.privacy === 'professional' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-yellow-800">Modalità Professionale</div>
                  <div className="text-yellow-700">
                    Alcuni dati personali (XP, streak, note private) saranno esclusi per mantenere 
                    un formato professionale adatto a CV e portfolio.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Esportando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Esporta {selectedFormat.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}