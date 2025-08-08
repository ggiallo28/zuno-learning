// Coach selection component for onboarding
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Brain, Zap, Users, Sparkles, BookOpen, Target, Heart } from 'lucide-react';
import type { CoachType, CoachConfig } from '@/types';

interface CoachSelectionProps {
  onCoachSelect: (coachType: CoachType) => void;
  selectedCoach?: CoachType;
  isSubmitting?: boolean;
}

const coachData: Record<CoachType, {
  config: Omit<CoachConfig, 'id'>;
  icon: React.ComponentType<any>;
  features: string[];
  bgGradient: string;
  textStyle: string;
}> = {
  elia: {
    config: {
      coach_type: 'elia',
      display_name: 'Coach Elia',
      description: 'Il tuo compagno per un apprendimento profondo e riflessivo',
      learning_style: 'Apprendimento lento, riflessivo, approfondito',
      primary_color: '#8B7355',
      secondary_color: '#A0927B', 
      accent_color: '#6B5B47',
      icon_style: 'solid-stable',
      personality_traits: ['Solido', 'Stabile', 'Paziente', 'Metodico'],
      motivation_messages: ['Prendiamoci il tempo necessario per comprendere a fondo']
    },
    icon: Brain,
    features: ['Spiegazioni dettagliate', 'Tempi di riflessione', 'Approfondimenti contestuali', 'Ripasso strutturato'],
    bgGradient: 'from-amber-50 to-orange-50',
    textStyle: 'text-amber-900'
  },
  skippy: {
    config: {
      coach_type: 'skippy',
      display_name: 'Coach Skippy',
      description: 'Il tuo compagno per un apprendimento veloce e dinamico',
      learning_style: 'Apprendimento veloce, leggero, esplorativo',
      primary_color: '#E67E22',
      secondary_color: '#F39C12',
      accent_color: '#D68910',
      icon_style: 'dynamic-light',
      personality_traits: ['Vivace', 'Dinamico', 'Curioso', 'Agile'],
      motivation_messages: ['Esploriamo insieme nuovi orizzonti!']
    },
    icon: Zap,
    features: ['Lezioni brevi e intense', 'Micro-obiettivi', 'Varietà di contenuti', 'Feedback immediato'],
    bgGradient: 'from-orange-50 to-amber-50',
    textStyle: 'text-orange-900'
  },
  lupa: {
    config: {
      coach_type: 'lupa',
      display_name: 'Coach Lupa',
      description: 'Il tuo compagno per un apprendimento collaborativo e sociale',
      learning_style: 'Apprendimento collaborativo e sociale',
      primary_color: '#2C3E50',
      secondary_color: '#34495E',
      accent_color: '#B7472A',
      icon_style: 'connected-intense',
      personality_traits: ['Intenso', 'Connesso', 'Empatico', 'Sociale'],
      motivation_messages: ['Insieme siamo più forti']
    },
    icon: Users,
    features: ['Discussioni guidate', 'Condivisione insights', 'Obiettivi di gruppo', 'Peer learning'],
    bgGradient: 'from-slate-50 to-blue-50',
    textStyle: 'text-slate-900'
  },
  polpo: {
    config: {
      coach_type: 'polpo',
      display_name: 'Coach Polpo',
      description: 'Il tuo compagno per un apprendimento ibrido e adattivo',
      learning_style: 'Apprendimento ibrido, intelligente, adattivo',
      primary_color: '#008080',
      secondary_color: '#20B2AA',
      accent_color: '#FF6347',
      icon_style: 'adaptive-intelligent',
      personality_traits: ['Intelligente', 'Adattivo', 'Flessibile', 'Analitico', 'Versatile'],
      motivation_messages: ['Adattiamo l\'approccio per massimizzare i tuoi risultati']
    },
    icon: Sparkles,
    features: ['Apprendimento personalizzato', 'Mix di approcci dinamici', 'AI-powered insights', 'Adattamento in tempo reale'],
    bgGradient: 'from-teal-50 to-cyan-50',
    textStyle: 'text-teal-900'
  }
};

export function CoachSelection({ onCoachSelect, selectedCoach, isSubmitting }: CoachSelectionProps) {
  const [hoveredCoach, setHoveredCoach] = useState<CoachType | null>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Scegli il tuo Coach</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Ogni coach rappresenta un approccio diverso all'apprendimento. 
          Seleziona quello che risuona meglio con il tuo stile di apprendimento.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Target className="h-4 w-4" />
          <span>Potrai cambiare coach in qualsiasi momento dalle impostazioni</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(Object.entries(coachData) as [CoachType, typeof coachData[CoachType]][]).map(([coachType, data]) => {
          const isSelected = selectedCoach === coachType;
          const isHovered = hoveredCoach === coachType;
          const IconComponent = data.icon;

          return (
            <Card
              key={coachType}
              className={`cursor-pointer transition-all duration-300 relative overflow-hidden ${
                isSelected 
                  ? 'ring-2 ring-blue-500 shadow-lg transform scale-105' 
                  : 'hover:shadow-md hover:transform hover:scale-102'
              } ${isHovered ? 'shadow-lg' : ''}`}
              onClick={() => onCoachSelect(coachType)}
              onMouseEnter={() => setHoveredCoach(coachType)}
              onMouseLeave={() => setHoveredCoach(null)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${data.bgGradient} opacity-20`} />
              
              {isSelected && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              )}

              <CardHeader className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className={`p-3 rounded-xl bg-gradient-to-br ${data.bgGradient} ${data.textStyle}`}
                    style={{ backgroundColor: `${data.config.primary_color}15` }}
                  >
                    <IconComponent className="h-8 w-8" style={{ color: data.config.primary_color }} />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{data.config.display_name}</CardTitle>
                    <p className="text-sm text-muted-foreground font-medium">
                      {data.config.learning_style}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {data.config.description}
                </p>
              </CardHeader>

              <CardContent className="relative space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Heart className="h-4 w-4" style={{ color: data.config.accent_color }} />
                    Personalità
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.config.personality_traits.map((trait, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs"
                        style={{ 
                          backgroundColor: `${data.config.primary_color}10`,
                          color: data.config.primary_color,
                          borderColor: `${data.config.primary_color}20`
                        }}
                      >
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" style={{ color: data.config.accent_color }} />
                    Caratteristiche
                  </h4>
                  <ul className="space-y-2">
                    {data.features.map((feature, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                        <div 
                          className="w-1.5 h-1.5 rounded-full" 
                          style={{ backgroundColor: data.config.accent_color }}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {isHovered && (
                  <div className="pt-2 border-t border-gray-100">
                    <p 
                      className="text-sm italic font-medium" 
                      style={{ color: data.config.primary_color }}
                    >
                      "{data.config.motivation_messages[0]}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedCoach && (
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={() => selectedCoach && onCoachSelect(selectedCoach)}
            disabled={isSubmitting}
            className="px-8"
            style={{ 
              backgroundColor: coachData[selectedCoach].config.primary_color,
              borderColor: coachData[selectedCoach].config.primary_color 
            }}
          >
            {isSubmitting ? 'Configurazione in corso...' : `Inizia con ${coachData[selectedCoach].config.display_name}`}
          </Button>
        </div>
      )}
    </div>
  );
}
