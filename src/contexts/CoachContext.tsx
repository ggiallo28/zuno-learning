// Coach context for managing themes and coaching system
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { CoachType, CoachConfig, CoachTheme } from '@/types';

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
    id: 1,
    coach_type: 'elia',
    display_name: 'Coach Elia',
    description: 'Il tuo compagno elefante per un apprendimento profondo e riflessivo',
    learning_style: 'Apprendimento lento, riflessivo, approfondito',
    primary_color: '#8B7355',
    secondary_color: '#A0927B',
    accent_color: '#6B5B47',
    icon_style: 'solid-stable',
    personality_traits: ['Solido', 'Stabile', 'Paziente', 'Metodico'],
    motivation_messages: [
      'Prendiamoci il tempo necessario per comprendere a fondo',
      'La conoscenza profonda richiede pazienza',
      'Ogni concetto merita la giusta attenzione',
      'Costruiamo solide fondamenta insieme'
    ]
  },
  skippy: {
    id: 2,
    coach_type: 'skippy',
    display_name: 'Coach Skippy',
    description: 'Il tuo compagno scoiattolo per un apprendimento veloce e dinamico',
    learning_style: 'Apprendimento veloce, leggero, esplorativo',
    primary_color: '#E67E22',
    secondary_color: '#F39C12',
    accent_color: '#D68910',
    icon_style: 'dynamic-light',
    personality_traits: ['Vivace', 'Dinamico', 'Curioso', 'Agile'],
    motivation_messages: [
      'Esploriamo insieme nuovi orizzonti!',
      'Velocità e agilità mentale sono i nostri punti di forza',
      'Scopriamo rapidamente quello che ci serve!',
      'Manteniamo il ritmo, ma sempre con leggerezza'
    ]
  },
  lupa: {
    id: 3,
    coach_type: 'lupa',
    display_name: 'Coach Lupa',
    description: 'Il tuo compagno lupa per un apprendimento collaborativo e sociale',
    learning_style: 'Apprendimento collaborativo e sociale',
    primary_color: '#2C3E50',
    secondary_color: '#34495E',
    accent_color: '#B7472A',
    icon_style: 'connected-intense',
    personality_traits: ['Intenso', 'Connesso', 'Empatico', 'Sociale'],
    motivation_messages: [
      'Insieme siamo più forti',
      'La conoscenza condivisa è più preziosa',
      'Impariamo gli uni dagli altri',
      'Il branco cresce quando tutti crescono'
    ]
  },
  polpo: {
    id: 4,
    coach_type: 'polpo',
    display_name: 'Coach Polpo',
    description: 'Il tuo compagno polpo per un apprendimento adattivo e ibrido',
    learning_style: 'Apprendimento adattivo e intelligente',
    primary_color: '#008080',
    secondary_color: '#FF7F50',
    accent_color: '#C0C0C0',
    icon_style: 'multi-faceted-flexible',
    personality_traits: ['Adattivo', 'Intelligente', 'Flessibile', 'Multi-sfaccettato'],
    motivation_messages: [
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
    const messages = coachConfig.motivation_messages;
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
