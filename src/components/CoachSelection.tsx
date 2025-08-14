import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CoachType, CoachConfig } from '@/types';
import { CoachNameValues } from '@/types';
import { Brain, Zap, Users, Shuffle, Crown } from 'lucide-react';
import { useCoach } from '@/contexts/CoachContext';
import { useZunoManager } from '@/contexts/ZunoManagerContext';
// import { useKeyboardNavigation } from '@/hooks/useAccessibility';

interface CoachSelectionProps {
  onCoachSelect: (coach: CoachType) => void;
  selectedCoach?: CoachType;
  isSubmitting?: boolean;
}

// Coach configurations
const coachConfigs: Record<CoachType, CoachConfig> = {
  elia: {
    id: '1',
    coachName: CoachNameValues.ELIA,
    displayName: 'Coach Elia',
    description: 'Deep, reflective, methodical learning approach',
    learningStyle: 'Slow, reflective, thorough learning',
    primaryColor: '#8B7355',
    secondaryColor: '#A0927B',
    accentColor: '#6B5B47',
    iconStyle: 'solid-stable',
    personalityTraits: ['Solid', 'Stable', 'Patient', 'Methodical'],
    motivationMessages: [
      'Let\'s take the time needed to understand deeply',
      'Deep knowledge requires patience',
      'Every concept deserves proper attention',
      'Let\'s build solid foundations together'
    ]
  },
  skippy: {
    id: '2',
    coachName: CoachNameValues.SKIPPY,
    displayName: 'Coach Skippy',
    description: 'Fast, dynamic, exploratory learning style',
    learningStyle: 'Quick, light, exploratory learning',
    primaryColor: '#E67E22',
    secondaryColor: '#F39C12',
    accentColor: '#D68910',
    iconStyle: 'dynamic-light',
    personalityTraits: ['Lively', 'Dynamic', 'Curious', 'Agile'],
    motivationMessages: [
      'Let\'s explore new horizons together!',
      'Speed and mental agility are our strengths',
      'Let\'s quickly discover what we need!',
      'Keep the pace, but always with lightness'
    ]
  },
  lupa: {
    id: '3',
    coachName: CoachNameValues.LUPA,
    displayName: 'Coach Lupa',
    description: 'Collaborative, social learning experience',
    learningStyle: 'Collaborative and social learning',
    primaryColor: '#2C3E50',
    secondaryColor: '#34495E',
    accentColor: '#B7472A',
    iconStyle: 'connected-intense',
    personalityTraits: ['Intense', 'Connected', 'Empathetic', 'Social'],
    motivationMessages: [
      'Together we are stronger',
      'Shared knowledge is more precious',
      'We learn from each other',
      'The pack grows when everyone grows'
    ]
  },
  polpo: {
    id: '4',
    coachName: CoachNameValues.POLPO,
    displayName: 'Coach Polpo',
    description: 'Adaptive hybrid approach that intelligently combines multiple learning strategies based on your behavior and performance',
    learningStyle: 'Intelligent adaptive learning with dynamic mode switching',
    primaryColor: '#008080',
    secondaryColor: '#FF7F50',
    accentColor: '#C0C0C0',
    iconStyle: 'multi-faceted-flexible',
    personalityTraits: ['Adaptive', 'Intelligent', 'Flexible', 'Multi-faceted', 'Dynamic'],
    motivationMessages: [
      'Let\'s adapt our approach to what works best',
      'Intelligence means knowing when to change strategy',
      'Flexibility is the key to effective learning',
      'Every situation calls for the right approach'
    ]
  }
};

// Coach icons mapping
const coachIcons: Record<CoachType, React.ComponentType<any>> = {
  elia: Brain,
  skippy: Zap,
  lupa: Users,
  polpo: Shuffle // More appropriate for adaptive nature
};

export function CoachSelection({ onCoachSelect, selectedCoach, isSubmitting = false }: CoachSelectionProps) {
  const { adaptiveState } = useCoach();
  const { getCoachIntroduction, managerPersonality } = useZunoManager();
  const [focusedCoach, setFocusedCoach] = useState<CoachType | null>(selectedCoach || null);
  
  const coachTypes = Object.keys(coachConfigs) as CoachType[];
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const currentIndex = focusedCoach ? coachTypes.indexOf(focusedCoach) : 0;
    let newIndex = currentIndex;
    
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        newIndex = (currentIndex + 1) % coachTypes.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = currentIndex === 0 ? coachTypes.length - 1 : currentIndex - 1;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = coachTypes.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedCoach) {
          onCoachSelect(focusedCoach);
        }
        return;
      default:
        return;
    }
    
    const newCoach = coachTypes[newIndex];
    setFocusedCoach(newCoach);
    
    // Focus the corresponding card
    const cardElement = document.getElementById(`coach-card-${newCoach}`);
    cardElement?.focus();
  }, [focusedCoach, coachTypes, onCoachSelect]);

  return (
    <div className="space-y-6">
      {/* Zuno Manager Oversight Message */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" aria-hidden="true">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">{managerPersonality.name}</h3>
              <p className="text-sm text-blue-700">
                Come tuo coordinatore di apprendimento, ho selezionato questi quattro coach specializzati. 
                Ognuno porta competenze uniche e io supervisionerò la tua esperienza per garantire risultati ottimali.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        role="radiogroup"
        aria-labelledby="coach-selection-heading"
        aria-describedby="coach-selection-description"
        onKeyDown={handleKeyDown}
      >
        <h2 id="coach-selection-heading" className="sr-only">
          Choose your learning coach
        </h2>
        <p id="coach-selection-description" className="sr-only">
          Select one of four specialized learning coaches. Use arrow keys to navigate between options and Enter or Space to select.
        </p>
        
        {coachTypes.map((coachType) => {
        const config = coachConfigs[coachType];
        const Icon = coachIcons[coachType];
        const isSelected = selectedCoach === coachType;
        const coachIntro = getCoachIntroduction(coachType);

        return (
          <Card 
            key={coachType}
            id={`coach-card-${coachType}`}
            interactive
            className={`transition-all duration-200 hover:shadow-lg focus-within:shadow-lg ${
              isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
            } ${focusedCoach === coachType ? 'ring-2 ring-blue-300' : ''}`}
            role="radio"
            aria-checked={isSelected}
            aria-labelledby={`coach-${coachType}-title`}
            aria-describedby={`coach-${coachType}-description`}
            tabIndex={focusedCoach === coachType || (!focusedCoach && coachType === coachTypes[0]) ? 0 : -1}
            onClick={() => onCoachSelect(coachType)}
            onFocus={() => setFocusedCoach(coachType)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCoachSelect(coachType);
              }
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: config.primaryColor + '20' }}
                  aria-hidden="true"
                >
                  <Icon 
                    className="h-6 w-6" 
                    style={{ color: config.primaryColor }}
                  />
                </div>
                <div>
                  <CardTitle id={`coach-${coachType}-title`} className="text-lg">
                    {config.displayName}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {config.learningStyle}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div 
                id={`coach-${coachType}-description`}
                className="mb-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-3 w-3 text-blue-600" aria-hidden="true" />
                  <span className="text-xs font-medium text-blue-700">Zuno Manager presenta:</span>
                </div>
                <p className="text-sm text-gray-700 italic">
                  "{coachIntro.introduction}"
                </p>
              </div>
              
              {/* Show adaptive state for Polpo */}
              {coachType === 'polpo' && adaptiveState && (
                <div className="mb-3 p-2 rounded-lg bg-gradient-to-r from-teal-50 to-orange-50 border border-teal-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Shuffle className="h-3 w-3 text-teal-600" aria-hidden="true" />
                    <span className="text-xs font-medium text-teal-700">
                      Current Mode: {adaptiveState.currentMode.charAt(0).toUpperCase() + adaptiveState.currentMode.slice(1)}
                    </span>
                  </div>
                  <div className="text-xs text-teal-600">
                    Adapts automatically based on your learning patterns
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-1 mb-3" role="list" aria-label="Coach personality traits">
                {config.personalityTraits.map((trait: string) => (
                  <Badge 
                    key={trait} 
                    variant="secondary" 
                    className="text-xs"
                    style={{ 
                      backgroundColor: config.secondaryColor + '20',
                      color: config.primaryColor
                    }}
                    role="listitem"
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
              <Button
                variant={isSelected ? "default" : "outline"}
                className="w-full"
                disabled={isSubmitting}
                style={isSelected ? {
                  backgroundColor: config.primaryColor,
                  borderColor: config.primaryColor
                } : {}}
                aria-label={`${isSelected ? 'Selected' : 'Choose'} ${config.displayName} as your learning coach`}
                loading={isSubmitting}
                loadingText="Updating..."
                tabIndex={-1} // Card handles focus
              >
                {isSelected ? 'Selected' : 'Choose Coach'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
      </div>
    </div>
  );
}

export default CoachSelection;