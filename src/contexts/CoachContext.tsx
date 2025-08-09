// Coach context for managing themes and coaching system
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { CoachType, CoachConfig, CoachTheme, UserBehaviorData } from '@/types';
import { CoachNameValues } from '@/types';

interface AdaptiveState {
  currentMode: 'deep' | 'fast' | 'collaborative' | 'balanced';
  adaptationHistory: Array<{
    mode: string;
    timestamp: Date;
    trigger: string;
    performance?: number;
  }>;
  learningPatterns: {
    preferredPace: 'slow' | 'medium' | 'fast';
    socialPreference: 'solo' | 'mixed' | 'group';
    difficultyPreference: 'gradual' | 'challenging';
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'flexible';
  };
}

interface CoachContextValue {
  currentCoach: CoachType;
  coachConfig: CoachConfig | null;
  theme: CoachTheme;
  adaptiveState: AdaptiveState | null;
  setCoach: (coach: CoachType) => void;
  getMotivationMessage: () => string;
  getCoachIcon: () => React.ComponentType<any>;
  adaptPolpoMode: (userBehavior: UserBehaviorData) => void;
  getAdaptiveTheme: () => CoachTheme;
}

const CoachContext = createContext<CoachContextValue | undefined>(undefined);

// Coach configurations
const coachConfigs: Record<CoachType, CoachConfig> = {
  elia: {
    id: '1',
    coachName: CoachNameValues.ELIA,
    displayName: 'Coach Elia',
    description: 'Il tuo compagno elefante per un apprendimento profondo e riflessivo',
    learningStyle: 'Apprendimento lento, riflessivo, approfondito',
    primaryColor: '#8B7355',
    secondaryColor: '#A0927B',
    accentColor: '#6B5B47',
    iconStyle: 'solid-stable',
    personalityTraits: ['Solido', 'Stabile', 'Paziente', 'Metodico'],
    motivationMessages: [
      'Prendiamoci il tempo necessario per comprendere a fondo',
      'La conoscenza profonda richiede pazienza',
      'Ogni concetto merita la giusta attenzione',
      'Costruiamo solide fondamenta insieme'
    ]
  },
  lupa: {
    id: '2',
    coachName: CoachNameValues.LUPA,
    displayName: 'Coach Lupa',
    description: 'Il tuo compagno lupa per un apprendimento collaborativo e sociale',
    learningStyle: 'Apprendimento collaborativo e sociale',
    primaryColor: '#2C3E50',
    secondaryColor: '#34495E',
    accentColor: '#B7472A',
    iconStyle: 'connected-intense',
    personalityTraits: ['Intenso', 'Connesso', 'Empatico', 'Sociale'],
    motivationMessages: [
      'Insieme siamo più forti',
      'La conoscenza condivisa è più preziosa',
      'Impariamo gli uni dagli altri',
      'Il branco cresce quando tutti crescono'
    ]
  },
  skippy: {
    id: '3',
    coachName: CoachNameValues.SKIPPY,
    displayName: 'Coach Skippy',
    description: 'Il tuo compagno canguro per un apprendimento rapido ed esplorativo',
    learningStyle: 'Apprendimento veloce, leggero, esplorativo',
    primaryColor: '#E67E22',
    secondaryColor: '#F39C12',
    accentColor: '#D68910',
    iconStyle: 'dynamic-light',
    personalityTraits: ['Vivace', 'Dinamico', 'Curioso', 'Agile'],
    motivationMessages: [
      'Esploriamo nuovi orizzonti insieme!',
      'Velocità e agilità mentale sono i nostri punti di forza',
      'Scopriamo rapidamente ciò che ci serve!',
      'Manteniamo il ritmo, con leggerezza'
    ]
  },
  polpo: {
    id: '4',
    coachName: CoachNameValues.POLPO,
    displayName: 'Coach Polpo',
    description: 'Il tuo compagno polpo per un apprendimento adattivo e ibrido',
    learningStyle: 'Apprendimento adattivo e intelligente',
    primaryColor: '#008080',
    secondaryColor: '#FF7F50',
    accentColor: '#C0C0C0',
    iconStyle: 'multi-faceted-flexible',
    personalityTraits: ['Adattivo', 'Intelligente', 'Flessibile', 'Multi-sfaccettato'],
    motivationMessages: [
      'Adattiamo il nostro approccio a quello che funziona meglio',
      'L\'intelligenza significa sapere quando cambiare strategia',
      'La flessibilità è la chiave per un apprendimento efficace',
      'Ogni situazione richiede l\'approccio giusto',
      // Adaptive mode-specific messages
      'Modalità Profonda: Prendiamoci il tempo per comprendere a fondo',
      'Modalità Veloce: Esploriamo rapidamente nuovi concetti',
      'Modalità Collaborativa: Impariamo insieme agli altri',
      'Modalità Bilanciata: Combiniamo il meglio di ogni approccio'
    ]
  }
};

// Theme mappings
const coachThemes: Record<CoachType, CoachTheme> = {
  elia: {
    primary: '#8B7355',
    secondary: '#A0927B',
    accent: '#6B5B47',
    background: '#FEF7ED',
    text: '#78716C',
    muted: '#A8A29E'
  },
  skippy: {
    primary: '#E67E22',
    secondary: '#F39C12',
    accent: '#D68910',
    background: '#FFF7ED',
    text: '#EA580C',
    muted: '#FB923C'
  },
  lupa: {
    primary: '#2C3E50',
    secondary: '#34495E',
    accent: '#B7472A',
    background: '#F1F5F9',
    text: '#475569',
    muted: '#64748B'
  },
  polpo: {
    primary: '#008080',
    secondary: '#FF7F50',
    accent: '#C0C0C0',
    background: '#F0FDFA',
    text: '#0F766E',
    muted: '#5EEAD4'
  }
};

// Adaptive theme variations for Polpo
const polpoAdaptiveThemes: Record<string, CoachTheme> = {
  deep: {
    primary: '#2C5F5F', // Deeper teal for focused learning
    secondary: '#4A7C7C',
    accent: '#8B7355', // Borrowing from Elia for stability
    background: '#F0F8F8',
    text: '#1F4A4A',
    muted: '#5EAAA4'
  },
  fast: {
    primary: '#FF6B47', // More vibrant coral for energy
    secondary: '#FF8C69',
    accent: '#E67E22', // Borrowing from Skippy for dynamism
    background: '#FFF5F0',
    text: '#CC4125',
    muted: '#FF9A7B'
  },
  collaborative: {
    primary: '#4A6B8A', // Blue-teal blend for social connection
    secondary: '#5A7BA0',
    accent: '#B7472A', // Borrowing from Lupa for intensity
    background: '#F2F6FA',
    text: '#2C4A6B',
    muted: '#7A9BC4'
  },
  balanced: {
    primary: '#008080', // Original teal
    secondary: '#FF7F50', // Original coral
    accent: '#C0C0C0', // Original pearl gray
    background: '#F0FDFA',
    text: '#0F766E',
    muted: '#5EEAD4'
  }
};

// Coach icons mapping
import { Brain, Zap, Users, Shuffle } from 'lucide-react';
const coachIcons: Record<CoachType, React.ComponentType<any>> = {
  elia: Brain,
  skippy: Zap,
  lupa: Users,
  polpo: Shuffle // More appropriate for adaptive nature
};

interface CoachProviderProps {
  children: ReactNode;
  initialCoach?: CoachType;
}

export function CoachProvider({ children, initialCoach = 'elia' }: CoachProviderProps) {
  const [currentCoach, setCurrentCoach] = useState<CoachType>(initialCoach);
  const [adaptiveState, setAdaptiveState] = useState<AdaptiveState | null>(null);

  const coachConfig = coachConfigs[currentCoach];
  const baseTheme = coachThemes[currentCoach];

  const setCoach = (coach: CoachType) => {
    setCurrentCoach(coach);
    // Store preference in localStorage
    localStorage.setItem('selectedCoach', coach);
  };

  const getMotivationMessage = () => {
    const messages = coachConfig.motivationMessages;
    
    // For Polpo, provide mode-specific messages
    if (currentCoach === 'polpo' && adaptiveState) {
      const modeMessages: Record<string, string[]> = {
        deep: [
          'Modalità Profonda attiva: Prendiamoci il tempo per comprendere a fondo',
          'Approfondiamo questo concetto con calma e metodicità',
          'La comprensione profonda richiede pazienza - procediamo step by step'
        ],
        fast: [
          'Modalità Veloce attiva: Esploriamo rapidamente nuovi orizzonti!',
          'Il tuo ritmo è ottimo - manteniamo questa energia!',
          'Velocità e agilità mentale sono i nostri punti di forza ora'
        ],
        collaborative: [
          'Modalità Collaborativa attiva: Impariamo insieme agli altri',
          'La conoscenza condivisa è più preziosa - connettiamoci!',
          'Il gruppo cresce quando tutti crescono insieme'
        ],
        balanced: [
          'Modalità Bilanciata: Combiniamo il meglio di ogni approccio',
          'Adattiamo la strategia in base alle tue esigenze',
          'L\'equilibrio è la chiave per un apprendimento ottimale'
        ]
      };
      
      const modeSpecificMessages = modeMessages[adaptiveState.currentMode] || messages;
      return modeSpecificMessages[Math.floor(Math.random() * modeSpecificMessages.length)];
    }
    
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getCoachIcon = () => {
    return coachIcons[currentCoach];
  };

  // Initialize adaptive state for Polpo
  useEffect(() => {
    if (currentCoach === 'polpo' && !adaptiveState) {
      setAdaptiveState({
        currentMode: 'balanced',
        adaptationHistory: [],
        learningPatterns: {
          preferredPace: 'medium',
          socialPreference: 'mixed',
          difficultyPreference: 'gradual',
          timeOfDay: 'flexible'
        }
      });
    } else if (currentCoach !== 'polpo') {
      setAdaptiveState(null);
    }
  }, [currentCoach, adaptiveState]);

  // Adaptive logic for Polpo
  const adaptPolpoMode = (userBehavior: UserBehaviorData) => {
    if (currentCoach !== 'polpo' || !adaptiveState) return;

    let newMode: 'deep' | 'fast' | 'collaborative' | 'balanced' = 'balanced';
    let trigger = 'user_behavior_analysis';

    // Analyze user behavior to determine best mode
    if (userBehavior.accuracy < 0.6 && userBehavior.timeSpentOnDifficultContent > 0.7) {
      // User struggling with difficult content - switch to deep mode (Elia-like)
      newMode = 'deep';
      trigger = 'struggling_with_difficulty';
    } else if (userBehavior.completionRate > 0.8 && userBehavior.sessionDuration < 300) {
      // User completing quickly - switch to fast mode (Skippy-like)
      newMode = 'fast';
      trigger = 'high_completion_fast_pace';
    } else if (userBehavior.socialEngagement > 0.7) {
      // User engaging socially - switch to collaborative mode (Lupa-like)
      newMode = 'collaborative';
      trigger = 'high_social_engagement';
    } else if (userBehavior.accuracy > 0.8 && userBehavior.completionRate > 0.7) {
      // User performing well overall - maintain balanced mode
      newMode = 'balanced';
      trigger = 'optimal_performance';
    }

    // Update adaptive state if mode changed
    if (newMode !== adaptiveState.currentMode) {
      const newAdaptiveState: AdaptiveState = {
        ...adaptiveState,
        currentMode: newMode,
        adaptationHistory: [
          ...adaptiveState.adaptationHistory.slice(-9), // Keep last 10 entries
          {
            mode: newMode,
            timestamp: new Date(),
            trigger,
            performance: userBehavior.accuracy
          }
        ]
      };

      setAdaptiveState(newAdaptiveState);
      
      // Store in localStorage for persistence
      localStorage.setItem('polpoAdaptiveState', JSON.stringify(newAdaptiveState));
    }
  };

  // Get adaptive theme based on current mode
  const getAdaptiveTheme = (): CoachTheme => {
    if (currentCoach === 'polpo' && adaptiveState) {
      return polpoAdaptiveThemes[adaptiveState.currentMode] || baseTheme;
    }
    return baseTheme;
  };

  const theme = getAdaptiveTheme();

  // Apply CSS custom properties for dynamic theming
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--coach-primary', theme.primary);
    root.style.setProperty('--coach-secondary', theme.secondary);
    root.style.setProperty('--coach-accent', theme.accent);
    root.style.setProperty('--coach-background', theme.background);
    root.style.setProperty('--coach-text', theme.text);
    root.style.setProperty('--coach-muted', theme.muted);
  }, [theme]);

  // Load coach preference and adaptive state from localStorage
  useEffect(() => {
    const savedCoach = localStorage.getItem('selectedCoach') as CoachType;
    if (savedCoach && coachConfigs[savedCoach]) {
      setCurrentCoach(savedCoach);
    }

    // Load Polpo adaptive state if available
    if (savedCoach === 'polpo') {
      const savedAdaptiveState = localStorage.getItem('polpoAdaptiveState');
      if (savedAdaptiveState) {
        try {
          const parsedState = JSON.parse(savedAdaptiveState);
          // Convert timestamp strings back to Date objects
          parsedState.adaptationHistory = parsedState.adaptationHistory.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
          }));
          setAdaptiveState(parsedState);
        } catch (error) {
          console.error('Error parsing adaptive state:', error);
        }
      }
    }
  }, []);

  const value: CoachContextValue = {
    currentCoach,
    coachConfig,
    theme,
    adaptiveState,
    setCoach,
    getMotivationMessage,
    getCoachIcon,
    adaptPolpoMode,
    getAdaptiveTheme
  };

  return (
    <CoachContext.Provider value={value}>
      {children}
    </CoachContext.Provider>
  );
}

export function useCoach(): CoachContextValue {
  const context = useContext(CoachContext);
  if (context === undefined) {
    throw new Error('useCoach must be used within a CoachProvider');
  }
  return context;
}
