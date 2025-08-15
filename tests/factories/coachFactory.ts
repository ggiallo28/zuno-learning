import type { CoachType, CoachPersonality } from '@/types'

export const createMockCoachPersonality = (
  coachType: CoachType,
  overrides: Partial<CoachPersonality> = {}
): CoachPersonality => {
  const basePersonalities: Record<CoachType, CoachPersonality> = {
    elia: {
      name: 'Elia',
      type: 'elia',
      displayName: 'Elia l\'Elefante',
      description: 'Metodico e riflessivo, perfetto per l\'apprendimento profondo',
      approach: 'deep',
      characteristics: ['Metodico', 'Paziente', 'Dettagliato', 'Riflessivo'],
      colors: {
        primary: '#8B4513',
        secondary: '#D2B48C',
        accent: '#A0522D'
      },
      icon: 'brain',
      strengths: ['Apprendimento approfondito', 'Analisi dettagliata', 'Comprensione completa'],
      idealFor: ['Concetti complessi', 'Studio metodico', 'Approfondimenti teorici']
    },
    skippy: {
      name: 'Skippy',
      type: 'skippy',
      displayName: 'Skippy lo Scoiattolo',
      description: 'Dinamico ed esplorativo, ideale per l\'apprendimento veloce',
      approach: 'fast',
      characteristics: ['Dinamico', 'Veloce', 'Esplorativo', 'Energico'],
      colors: {
        primary: '#FF6347',
        secondary: '#98FB98',
        accent: '#F5DEB3'
      },
      icon: 'zap',
      strengths: ['Apprendimento rapido', 'Esplorazione attiva', 'Varietà di contenuti'],
      idealFor: ['Panoramiche generali', 'Apprendimento esplorativo', 'Sessioni brevi']
    },
    lupa: {
      name: 'Lupa',
      type: 'lupa',
      displayName: 'Lupa la Lupa',
      description: 'Collaborativo e sociale, perfetto per l\'apprendimento di gruppo',
      approach: 'collaborative',
      characteristics: ['Collaborativo', 'Sociale', 'Connesso', 'Supportivo'],
      colors: {
        primary: '#4682B4',
        secondary: '#B8860B',
        accent: '#CD853F'
      },
      icon: 'users',
      strengths: ['Apprendimento sociale', 'Collaborazione', 'Supporto reciproco'],
      idealFor: ['Progetti di gruppo', 'Discussioni', 'Apprendimento peer-to-peer']
    },
    polpo: {
      name: 'Polpo',
      type: 'polpo',
      displayName: 'Polpo il Polpo',
      description: 'Adattivo e intelligente, si adatta al tuo stile di apprendimento',
      approach: 'adaptive',
      characteristics: ['Adattivo', 'Intelligente', 'Flessibile', 'Personalizzato'],
      colors: {
        primary: '#008080',
        secondary: '#FF7F50',
        accent: '#C0C0C0'
      },
      icon: 'shuffle',
      strengths: ['Adattamento intelligente', 'Personalizzazione', 'Approccio ibrido'],
      idealFor: ['Apprendimento personalizzato', 'Adattamento dinamico', 'Ottimizzazione continua']
    }
  }

  return {
    ...basePersonalities[coachType],
    ...overrides
  }
}

export const createMockCoachContext = (
  selectedCoach: CoachType = 'elia',
  overrides: any = {}
) => ({
  selectedCoach,
  coachPersonality: createMockCoachPersonality(selectedCoach),
  selectCoach: vi.fn(),
  getCoachTheme: vi.fn(() => ({
    primary: '#8B4513',
    secondary: '#D2B48C',
    accent: '#A0522D'
  })),
  getCoachMessage: vi.fn(() => 'Test coach message'),
  isCoachSelected: vi.fn(() => true),
  ...overrides
})

export const createMockAdaptiveState = (overrides: any = {}) => ({
  currentMode: 'balanced' as const,
  adaptationHistory: [],
  learningPatterns: {
    sessionDuration: 15,
    accuracy: 0.8,
    completionRate: 0.9,
    contentPreference: 'mixed',
    strugglingAreas: [],
    strongAreas: ['basics'],
    socialEngagement: 0.5,
    helpSeeking: 0.3,
    timeOnDifficultContent: 10
  },
  lastAdaptation: new Date().toISOString(),
  ...overrides
})