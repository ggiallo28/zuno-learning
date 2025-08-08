// Coach context for managing themes and coaching system
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { CoachType, CoachConfig, CoachTheme } from '@/types';
import { CoachNameValues } from '@/types';

interface CoachContextValue {
  currentCoach: CoachType;
  coachConfig: CoachConfig | null;
  theme: CoachTheme;
  setCoach: (coach: CoachType) => void;
  getMotivationMessage: () => string;
  getCoachIcon: () => React.ComponentType<any>;
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
      'Ogni situazione richiede l\'approccio giusto'
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

// Coach icons mapping
import { Brain, Zap, Users, Octagon } from 'lucide-react';
const coachIcons: Record<CoachType, React.ComponentType<any>> = {
  elia: Brain,
  skippy: Zap,
  lupa: Users,
  polpo: Octagon
};

interface CoachProviderProps {
  children: ReactNode;
  initialCoach?: CoachType;
}

export function CoachProvider({ children, initialCoach = 'elia' }: CoachProviderProps) {
  const [currentCoach, setCurrentCoach] = useState<CoachType>(initialCoach);

  const coachConfig = coachConfigs[currentCoach];
  const theme = coachThemes[currentCoach];

  const setCoach = (coach: CoachType) => {
    setCurrentCoach(coach);
    // Store preference in localStorage
    localStorage.setItem('selectedCoach', coach);
  };

  const getMotivationMessage = () => {
    const messages = coachConfig.motivationMessages;
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getCoachIcon = () => {
    return coachIcons[currentCoach];
  };

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

  // Load coach preference from localStorage
  useEffect(() => {
    const savedCoach = localStorage.getItem('selectedCoach') as CoachType;
    if (savedCoach && coachConfigs[savedCoach]) {
      setCurrentCoach(savedCoach);
    }
  }, []);

  const value: CoachContextValue = {
    currentCoach,
    coachConfig,
    theme,
    setCoach,
    getMotivationMessage,
    getCoachIcon
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
