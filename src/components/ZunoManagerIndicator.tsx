// Zuno Manager indicator component showing oversight and coordination
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, ChevronDown, ChevronUp, Users, Target, TrendingUp } from 'lucide-react';
import { useZunoManager } from '@/contexts/ZunoManagerContext';
import { useCoach } from '@/contexts/CoachContext';
import type { User } from '@/types';

interface ZunoManagerIndicatorProps {
  user: User;
  context?: 'header' | 'lesson' | 'assessment' | 'progress';
  compact?: boolean;
}

export function ZunoManagerIndicator({ user, context = 'header', compact = false }: ZunoManagerIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { managerPersonality, getCoordinationMessage, getMotivationalMessage } = useZunoManager();
  const { currentCoach, coachConfig } = useCoach();

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="p-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md">
          <Crown className="h-3 w-3 text-white" />
        </div>
        <span className="text-xs text-muted-foreground">Manager attivo</span>
      </div>
    );
  }

  const contextMessages = {
    header: getMotivationalMessage(user, 'daily'),
    lesson: getCoordinationMessage(currentCoach, 'lesson'),
    assessment: getCoordinationMessage(currentCoach, 'assessment'),
    progress: getCoordinationMessage(currentCoach, 'progress')
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="relative">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-blue-900">{managerPersonality.name}</h3>
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                  Supervisore
                </Badge>
              </div>
              <p className="text-sm text-blue-700 mb-2">
                {contextMessages[context]}
              </p>
              
              {isExpanded && (
                <div className="space-y-3 mt-4 pt-3 border-t border-blue-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-900">Coach Attivo</div>
                        <div className="text-blue-600">{coachConfig?.displayName}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-900">Coordinamento</div>
                        <div className="text-blue-600">Ottimale</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-900">Supervisione</div>
                        <div className="text-blue-600">Attiva</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Caratteristiche del Manager:</h4>
                    <div className="flex flex-wrap gap-1">
                      {managerPersonality.characteristics.slice(0, 4).map((trait, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}