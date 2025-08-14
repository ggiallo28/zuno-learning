// import React from 'react';
import { CoachType } from '@/types/assessment';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CoachSelectorProps {
  selectedCoach: CoachType;
  onSelectCoach: (coach: CoachType) => void;
  className?: string;
}

const coaches = [
  {
    type: 'elia' as CoachType,
    name: 'Elia',
    emoji: '🐘',
    description: 'Approccio profondo e riflessivo',
    personality: 'Metodico e paziente, ti guida attraverso ogni concetto con cura',
    style: 'Domande dettagliate, feedback approfondito, progressione graduale',
    color: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
    badgeColor: 'bg-amber-100 text-amber-800'
  },
  {
    type: 'skippy' as CoachType,
    name: 'Skippy',
    emoji: '🐿️',
    description: 'Veloce ed esplorativo',
    personality: 'Dinamico e interattivo, ti sfida con ritmo sostenuto',
    style: 'Domande rapide, feedback minimo, progressione accelerata',
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    badgeColor: 'bg-orange-100 text-orange-800'
  },
  {
    type: 'lupa' as CoachType,
    name: 'Lupa',
    emoji: '🐺',
    description: 'Collaborativo e di gruppo',
    personality: 'Sociale e cooperativo, incoraggia la discussione e il confronto',
    style: 'Domande collaborative, feedback condiviso, elementi di gruppo',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    badgeColor: 'bg-blue-100 text-blue-800'
  },
  {
    type: 'polpo' as CoachType,
    name: 'Polpo',
    emoji: '🐙',
    description: 'Ibrido e adattivo',
    personality: 'Flessibile e intelligente, si adatta al tuo stile di apprendimento',
    style: 'Mix di formati, feedback personalizzato, adattività massima',
    color: 'bg-teal-50 border-teal-200 hover:bg-teal-100',
    badgeColor: 'bg-teal-100 text-teal-800'
  }
];

export function CoachSelector({ selectedCoach, onSelectCoach, className }: CoachSelectorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Scegli il tuo Coach AI</h2>
        <p className="text-muted-foreground">
          Ogni coach ha un approccio diverso all'assessment e al feedback
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coaches.map((coach) => (
          <Card
            key={coach.type}
            className={cn(
              "cursor-pointer transition-all duration-200",
              coach.color,
              selectedCoach === coach.type && "ring-2 ring-primary ring-offset-2 scale-105"
            )}
            onClick={() => onSelectCoach(coach.type)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl" role="img" aria-label={coach.name}>
                  {coach.emoji}
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{coach.name}</h3>
                    <Badge className={coach.badgeColor} variant="secondary">
                      {coach.description}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {coach.personality}
                  </p>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Stile di Assessment:
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {coach.style}
                    </p>
                  </div>
                  
                  {selectedCoach === coach.type && (
                    <Badge variant="default" className="text-xs">
                      ✓ Selezionato
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        💡 <strong>Consiglio:</strong> Prova coach diversi per scoprire quale si adatta meglio al tuo stile di apprendimento
      </div>
    </div>
  );
}