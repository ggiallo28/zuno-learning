import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  CalendarIcon, 
  Plus, 
  X, 
  BookOpen, 
  Video, 
  Users, 
  Award,
  ExternalLink,
  Clock,
  Tag,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import type { ManualLearningEntry } from './ProgressDashboard';

interface ManualEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (entry: Omit<ManualLearningEntry, 'id'>) => void;
}

const LEARNING_CATEGORIES = [
  { value: 'course', label: 'Corso Online', icon: BookOpen },
  { value: 'video', label: 'Video Tutorial', icon: Video },
  { value: 'book', label: 'Libro/Articolo', icon: BookOpen },
  { value: 'workshop', label: 'Workshop/Seminario', icon: Users },
  { value: 'certification', label: 'Certificazione', icon: Award },
  { value: 'conference', label: 'Conferenza', icon: Users },
  { value: 'practice', label: 'Pratica/Progetto', icon: BookOpen },
  { value: 'other', label: 'Altro', icon: BookOpen }
];

const COMMON_SOURCES = [
  'Coursera', 'Udemy', 'edX', 'LinkedIn Learning', 'Pluralsight',
  'YouTube', 'Khan Academy', 'FreeCodeCamp', 'Codecademy',
  'Libro', 'Articolo', 'Blog', 'Podcast', 'Conferenza',
  'Workshop', 'Mentoring', 'Progetto Personale', 'Altro'
];

const SKILL_SUGGESTIONS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript',
  'HTML/CSS', 'SQL', 'Git', 'Docker', 'AWS',
  'Machine Learning', 'Data Analysis', 'UI/UX Design',
  'Project Management', 'Leadership', 'Communication',
  'Problem Solving', 'Critical Thinking', 'Creativity'
];

export function ManualEntryDialog({ open, onOpenChange, onSubmit }: ManualEntryDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    source: '',
    completedAt: new Date(),
    duration: '',
    skills: [] as string[],
    certificateUrl: '',
    notes: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [customSource, setCustomSource] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCalendar, setShowCalendar] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Il titolo è obbligatorio';
    }

    if (!formData.category) {
      newErrors.category = 'Seleziona una categoria';
    }

    if (!formData.source && !customSource) {
      newErrors.source = 'Specifica la fonte di apprendimento';
    }

    if (formData.duration && (isNaN(Number(formData.duration)) || Number(formData.duration) < 0)) {
      newErrors.duration = 'Inserisci una durata valida in minuti';
    }

    if (formData.certificateUrl && !isValidUrl(formData.certificateUrl)) {
      newErrors.certificateUrl = 'Inserisci un URL valido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const entry: Omit<ManualLearningEntry, 'id'> = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      category: formData.category,
      source: customSource || formData.source,
      completedAt: formData.completedAt,
      duration: formData.duration ? Number(formData.duration) : undefined,
      skills: formData.skills.length > 0 ? formData.skills : undefined,
      certificateUrl: formData.certificateUrl.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      xpAwarded: calculateXP()
    };

    onSubmit(entry);
    resetForm();
  };

  const calculateXP = () => {
    let baseXP = 50; // Base XP for any learning activity
    
    // Add XP based on duration
    if (formData.duration) {
      const hours = Number(formData.duration) / 60;
      baseXP += Math.round(hours * 25); // 25 XP per hour
    }
    
    // Bonus for certifications
    if (formData.category === 'certification') {
      baseXP += 100;
    }
    
    // Bonus for skills
    baseXP += formData.skills.length * 10;
    
    return baseXP;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      source: '',
      completedAt: new Date(),
      duration: '',
      skills: [],
      certificateUrl: '',
      notes: ''
    });
    setNewSkill('');
    setCustomSource('');
    setErrors({});
  };

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill]
      }));
    }
    setNewSkill('');
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Aggiungi Apprendimento Esterno
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Titolo *</Label>
            <Input
              id="title"
              placeholder="es. Corso React Avanzato, Certificazione AWS..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrizione</Label>
            <Textarea
              id="description"
              placeholder="Descrivi brevemente cosa hai imparato..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Category and Source */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleziona categoria" />
                </SelectTrigger>
                <SelectContent>
                  {LEARNING_CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    return (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {category.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.category}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Fonte *</Label>
              <Select 
                value={formData.source} 
                onValueChange={(value) => {
                  if (value === 'custom') {
                    setFormData(prev => ({ ...prev, source: '' }));
                  } else {
                    setFormData(prev => ({ ...prev, source: value }));
                    setCustomSource('');
                  }
                }}
              >
                <SelectTrigger className={errors.source ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleziona fonte" />
                </SelectTrigger>
                <SelectContent>
                  {COMMON_SOURCES.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Altro (specifica)</SelectItem>
                </SelectContent>
              </Select>
              
              {formData.source === '' && (
                <Input
                  placeholder="Specifica la fonte..."
                  value={customSource}
                  onChange={(e) => setCustomSource(e.target.value)}
                  className={errors.source ? 'border-red-500' : ''}
                />
              )}
              
              {errors.source && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.source}
                </p>
              )}
            </div>
          </div>

          {/* Date and Duration */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data Completamento</Label>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.completedAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.completedAt ? (
                      format(formData.completedAt, "PPP", { locale: it })
                    ) : (
                      <span>Seleziona data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.completedAt}
                    onSelect={(date) => {
                      if (date) {
                        setFormData(prev => ({ ...prev, completedAt: date }));
                        setShowCalendar(false);
                      }
                    }}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Durata (minuti)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="duration"
                  type="number"
                  placeholder="es. 120"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className={cn("pl-10", errors.duration ? 'border-red-500' : '')}
                  min="0"
                />
              </div>
              {errors.duration && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.duration}
                </p>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label>Competenze Acquisite</Label>
            <div className="space-y-3">
              {/* Skill input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Aggiungi competenza..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, () => addSkill(newSkill))}
                    className="pl-10"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addSkill(newSkill)}
                  disabled={!newSkill.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Skill suggestions */}
              <div className="flex flex-wrap gap-1">
                {SKILL_SUGGESTIONS
                  .filter(skill => !formData.skills.includes(skill))
                  .slice(0, 8)
                  .map((skill) => (
                    <Button
                      key={skill}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => addSkill(skill)}
                    >
                      + {skill}
                    </Button>
                  ))}
              </div>

              {/* Selected skills */}
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeSkill(skill)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Certificate URL */}
          <div className="space-y-2">
            <Label htmlFor="certificateUrl">URL Certificato</Label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="certificateUrl"
                type="url"
                placeholder="https://..."
                value={formData.certificateUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, certificateUrl: e.target.value }))}
                className={cn("pl-10", errors.certificateUrl ? 'border-red-500' : '')}
              />
            </div>
            {errors.certificateUrl && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.certificateUrl}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Note Aggiuntive</Label>
            <Textarea
              id="notes"
              placeholder="Riflessioni, punti chiave, prossimi passi..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          {/* XP Preview */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-800">
              <Award className="w-4 h-4" />
              <span className="font-medium">XP Stimati: {calculateXP()}</span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              Basato su durata, categoria e competenze acquisite
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button onClick={handleSubmit}>
            Aggiungi Apprendimento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}