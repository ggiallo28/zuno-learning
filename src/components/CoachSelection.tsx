import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CoachType, CoachConfig } from '@/types';
import { Brain, Zap, Users, Octagon } from 'lucide-react';

interface CoachSelectionProps {
  onCoachSelect: (coach: CoachType) => void;
  selectedCoach?: CoachType;
  isSubmitting?: boolean;
}

// Coach configurations
const coachConfigs: Record<CoachType, CoachConfig> = {
  elia: {
    id: 1,
    coach_type: 'elia',
    display_name: 'Coach Elia',
    description: 'Deep, reflective, methodical learning approach',
    learning_style: 'Slow, reflective, thorough learning',
    primary_color: '#8B7355',
    secondary_color: '#A0927B',
    accent_color: '#6B5B47',
    icon_style: 'solid-stable',
    personality_traits: ['Solid', 'Stable', 'Patient', 'Methodical'],
    motivation_messages: [
      'Let\'s take the time needed to understand deeply',
      'Deep knowledge requires patience',
      'Every concept deserves proper attention',
      'Let\'s build solid foundations together'
    ]
  },
  skippy: {
    id: 2,
    coach_type: 'skippy',
    display_name: 'Coach Skippy',
    description: 'Fast, dynamic, exploratory learning style',
    learning_style: 'Quick, light, exploratory learning',
    primary_color: '#E67E22',
    secondary_color: '#F39C12',
    accent_color: '#D68910',
    icon_style: 'dynamic-light',
    personality_traits: ['Lively', 'Dynamic', 'Curious', 'Agile'],
    motivation_messages: [
      'Let\'s explore new horizons together!',
      'Speed and mental agility are our strengths',
      'Let\'s quickly discover what we need!',
      'Keep the pace, but always with lightness'
    ]
  },
  lupa: {
    id: 3,
    coach_type: 'lupa',
    display_name: 'Coach Lupa',
    description: 'Collaborative, social learning experience',
    learning_style: 'Collaborative and social learning',
    primary_color: '#2C3E50',
    secondary_color: '#34495E',
    accent_color: '#B7472A',
    icon_style: 'connected-intense',
    personality_traits: ['Intense', 'Connected', 'Empathetic', 'Social'],
    motivation_messages: [
      'Together we are stronger',
      'Shared knowledge is more precious',
      'We learn from each other',
      'The pack grows when everyone grows'
    ]
  },
  polpo: {
    id: 4,
    coach_type: 'polpo',
    display_name: 'Coach Polpo',
    description: 'Adaptive hybrid approach that intelligently combines multiple learning strategies',
    learning_style: 'Intelligent adaptive learning',
    primary_color: '#008080',
    secondary_color: '#FF7F50',
    accent_color: '#C0C0C0',
    icon_style: 'multi-faceted-flexible',
    personality_traits: ['Adaptive', 'Intelligent', 'Flexible', 'Multi-faceted'],
    motivation_messages: [
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
                  style={{ backgroundColor: config.primary_color + '20' }}
                >
                  <Icon 
                    className="h-6 w-6" 
                    style={{ color: config.primary_color }}
                  />
                </div>
                <div>
                  <CardTitle className="text-lg">{config.display_name}</CardTitle>
                  <CardDescription className="text-sm">
                    {config.learning_style}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3">
                {config.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {config.personality_traits.map((trait: string) => (
                  <Badge 
                    key={trait} 
                    variant="secondary" 
                    className="text-xs"
                    style={{ 
                      backgroundColor: config.secondary_color + '20',
                      color: config.primary_color
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
                  backgroundColor: config.primary_color,
                  borderColor: config.primary_color
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