// Main Zuno brand header with manager animal and coach integration
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Zap, 
  Users, 
  Shuffle,
  Settings,
  Target,
  TrendingUp,
  Crown
} from 'lucide-react';
import { useCoach } from '@/contexts/CoachContext';
import { useZunoManager } from '@/contexts/ZunoManagerContext';
import { AdaptiveCoachIndicator } from '@/components/AdaptiveCoachIndicator';
import type { User } from '@/types';

interface ZunoBrandHeaderProps {
  user: User;
  onSettingsClick: () => void;
}

export function ZunoBrandHeader({ user, onSettingsClick }: ZunoBrandHeaderProps) {
  const { currentCoach, coachConfig, theme, getMotivationMessage } = useCoach();
  const { getCoordinationMessage, managerPersonality } = useZunoManager();
  const [showMotivation, setShowMotivation] = useState(false);

  const getCoachIcon = () => {
    switch (currentCoach) {
      case 'elia': return Brain;
      case 'skippy': return Zap;
      case 'lupa': return Users;
      case 'polpo': return Shuffle;
      default: return Brain;
    }
  };

  const CoachIcon = getCoachIcon();

  return (
    <div className="relative mb-8">
      {/* Main Brand Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-6">
          {/* Zuno Main Brand Logo & Identity */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              {/* Main Zuno Manager Animal Logo - Enhanced */}
              <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="relative">
                  <Crown className="h-8 w-8 text-white" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              {/* Coach indicator overlay with enhanced styling */}
              <div 
                className="absolute -bottom-2 -right-2 p-2 rounded-full border-3 border-white shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: theme.primary }}
                title={`Coach ${coachConfig?.displayName} attivo`}
              >
                <CoachIcon className="h-4 w-4 text-white" />
              </div>
              {/* Manager role indicator */}
              <div className="absolute -top-2 -left-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-md">
                Manager
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Zuno://
                </h1>
                <div className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                  {managerPersonality.role}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {managerPersonality.description}
              </p>
            </div>
          </div>

          {/* User Progress Summary */}
          <div className="hidden lg:flex items-center gap-6 ml-8">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-semibold">{user.currentStreak || 0}</div>
                <div className="text-xs text-muted-foreground">giorni di fila</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-semibold">Lv.{user.currentLevel}</div>
                <div className="text-xs text-muted-foreground">{user.totalXp} XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings and Coach Info */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onSettingsClick}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Impostazioni</span>
          </Button>
        </div>
      </div>

      {/* Active Coach Information Bar */}
      {coachConfig && (
        <Card 
          className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md"
          style={{ 
            borderLeftWidth: '4px',
            borderLeftColor: theme.primary,
            backgroundColor: `${theme.primary}05`
          }}
          onClick={() => setShowMotivation(!showMotivation)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${theme.primary}15` }}
                >
                  <CoachIcon className="h-5 w-5" style={{ color: theme.primary }} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold" style={{ color: theme.primary }}>
                      {coachConfig.displayName}
                    </h3>
                    <Badge 
                      variant="secondary" 
                      className="text-xs"
                      style={{ 
                        backgroundColor: `${theme.accent}15`,
                        color: theme.accent 
                      }}
                    >
                      Attivo
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {coachConfig.learningStyle}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">
                  Personalità: {coachConfig.personalityTraits.slice(0, 2).join(', ')}
                </div>
                {showMotivation && (
                  <div className="space-y-2 animate-fade-in">
                    <div 
                      className="text-sm italic font-medium"
                      style={{ color: theme.primary }}
                    >
                      "{getMotivationMessage()}"
                    </div>
                    <div className="text-xs text-muted-foreground border-t pt-2">
                      <span className="font-medium text-blue-600">Zuno Manager:</span> {getCoordinationMessage(currentCoach, 'general')}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Coach Features Preview */}
            {showMotivation && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  {currentCoach === 'elia' && (
                    <>
                      <div className="text-xs">
                        <div className="font-medium" style={{ color: theme.primary }}>Profondità</div>
                        <div className="text-muted-foreground">Analisi completa</div>
                      </div>
                      <div className="text-xs">
                        <div className="font-medium" style={{ color: theme.primary }}>Riflessione</div>
                        <div className="text-muted-foreground">Tempi dedicati</div>
                      </div>
                      <div className="text-xs">
                        <div className="font-medium" style={{ color: theme.primary }}>Stabilità</div>
                        <div className="text-muted-foreground">Approccio metodico</div>
                      </div>
                      <div className="text-xs">
                        <div className="font-medium" style={{ color: theme.primary }}>Contesto</div>
                        <div className="text-muted-foreground">Collegamenti chiari</div>
                      </div>
                    </>
                  )}
                  
                  {currentCoach === 'skippy' && (
                    <>
                      <div className="text-xs">
                        <div className="font-medium" style={{ color: theme.primary }}>Velocità</div>
                        <div className="text-muted-foreground">Apprendimento agile</div>
                      </div>
                      <div className="text-xs">
                        <div className="font-medium" style={{ color: theme.primary }}>Varietà</div>
                        <div className="text-muted-foreground">Contenuti dinamici</div>
                      </div>
                      <div className="text-xs">
                        <div className="font-medium" style={{ color: theme.primary }}>Esplorazione</div>
                        <div className="text-muted-foreground">Scoperte continue</div>
                      </div>
                      <div className="text-xs">
                        <div className="font-medium" style={{ color: theme.primary }}>Feedback</div>
                        <div className="text-muted-foreground">Risposta immediata</div>
                      </div>
                    </>
                  )}

                  {currentCoach === 'lupa' && (
                    <>
                      <div className="text-xs">
                        <div className="font-medium" style={{ color: theme.primary }}>Collaborazione</div>
                        <div className="text-muted-foreground">Apprendimento sociale</div>
                      </div>
                      <div className="text-xs">
                        <div className="font-medium" style={{ color: theme.primary }}>Condivisione</div>
                        <div className="text-muted-foreground">Scambio di idee</div>
                      </div>
                      <div className="text-xs">
                        <div className="font-medium" style={{ color: theme.primary }}>Gruppo</div>
                        <div className="text-muted-foreground">Obiettivi comuni</div>
                      </div>
                      <div className="text-xs">
                        <div className="font-medium" style={{ color: theme.primary }}>Connessione</div>
                        <div className="text-muted-foreground">Rete di apprendimento</div>
                      </div>
                    </>
                  )}

                  {currentCoach === 'polpo' && (
                    <>
                      <div className="text-xs">
                        <div className="font-medium" style={{ color: theme.primary }}>Adattività</div>
                        <div className="text-muted-foreground">Approccio flessibile</div>
                      </div>
                      <div className="text-xs">
                        <div className="font-medium" style={{ color: theme.primary }}>Intelligence</div>
                        <div className="text-muted-foreground">AI-powered</div>
                      </div>
                      <div className="text-xs">
                        <div className="font-medium" style={{ color: theme.primary }}>Personalizzazione</div>
                        <div className="text-muted-foreground">Su misura</div>
                      </div>
                      <div className="text-xs">
                        <div className="font-medium" style={{ color: theme.primary }}>Versatilità</div>
                        <div className="text-muted-foreground">Multi-approccio</div>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Show adaptive indicator for Polpo */}
                {currentCoach === 'polpo' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <AdaptiveCoachIndicator compact={true} />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}