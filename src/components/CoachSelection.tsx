import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CoachType, CoachConfig } from '@/types';
import { CoachNameValues } from '@/types';
import { Brain, Zap, Users, Octagon } from 'lucide-react';

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
    description: 'Adaptive hybrid approach that intelligently combines multiple learning strategies',
    learningStyle: 'Intelligent adaptive learning',
    primaryColor: '#008080',
    secondaryColor: '#FF7F50',
    accentColor: '#C0C0C0',
    iconStyle: 'multi-faceted-flexible',
    personalityTraits: ['Adaptive', 'Intelligent', 'Flexible', 'Multi-faceted'],
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
  polpo: Octagon
};

export function CoachSelection({ onCoachSelect, selectedCoach, isSubmitting = false }: CoachSelectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {(Object.keys(coachConfigs) as CoachType[]).map((coachType) => {
        const config = coachConfigs[coachType];
        const Icon = coachIcons[coachType];
        const isSelected = selectedCoach === coachType;

        return (
          <Card 
            key={coachType}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
            }`}
            onClick={() => onCoachSelect(coachType)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: config.primaryColor + '20' }}
                >
                  <Icon 
                    className="h-6 w-6" 
                    style={{ color: config.primaryColor }}
                  />
                </div>
                <div>
                  <CardTitle className="text-lg">{config.displayName}</CardTitle>
                  <CardDescription className="text-sm">
                    {config.learningStyle}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3">
                {config.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {config.personalityTraits.map((trait: string) => (
                  <Badge 
                    key={trait} 
                    variant="secondary" 
                    className="text-xs"
                    style={{ 
                      backgroundColor: config.secondaryColor + '20',
                      color: config.primaryColor
                    }}
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
              >
                {isSubmitting ? 'Updating...' : isSelected ? 'Selected' : 'Choose Coach'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default CoachSelection;