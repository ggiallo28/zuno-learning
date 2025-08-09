// Zuno Manager context for overseeing all coaches and coordinating learning experience
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useCoach } from '@/contexts/CoachContext';
import type { CoachType, User } from '@/types';

interface ZunoManagerPersonality {
  name: string;
  role: string;
  description: string;
  characteristics: string[];
  coordinationStyle: string;
  guidanceApproach: string;
}

interface CoachIntroduction {
  coachType: CoachType;
  introduction: string;
  whenToChoose: string;
  strengths: string[];
  idealFor: string[];
}

interface ZunoManagerContextValue {
  managerPersonality: ZunoManagerPersonality;
  getWelcomeMessage: (userName?: string) => string;
  getCoachIntroduction: (coachType: CoachType) => CoachIntroduction;
  getCoordinationMessage: (currentCoach: CoachType, context: 'lesson' | 'assessment' | 'progress' | 'general') => string;
  getTransitionMessage: (fromCoach: CoachType | null, toCoach: CoachType) => string;
  getMotivationalMessage: (user: User, context: 'daily' | 'achievement' | 'struggle' | 'milestone') => string;
  getAllCoachesOverview: () => CoachIntroduction[];
}

const ZunoManagerContext = createContext<ZunoManagerContextValue | undefined>(undefined);

// Zuno Manager personality definition
const managerPersonality: ZunoManagerPersonality = {
  name: 'Zuno Manager',
  role: 'Coordinatore Intelligente dell\'Apprendimento',
  description: 'Il supervisore saggio che coordina tutti i coach e guida la tua esperienza di apprendimento personalizzata',
  characteristics: [
    'Saggio e perspicace',
    'Coordinatore esperto',
    'Supportivo e incoraggiante',
    'Adattivo alle esigenze',
    'Orientato ai risultati',
    'Professionale ma caloroso'
  ],
  coordinationStyle: 'Guida strategica con supporto personalizzato',
  guidanceApproach: 'Combina saggezza, esperienza e intelligenza adattiva per ottimizzare il tuo percorso di apprendimento'
};

// Coach introductions managed by Zuno Manager
const coachIntroductions: Record<CoachType, CoachIntroduction> = {
  elia: {
    coachType: 'elia',
    introduction: 'Elia è il tuo compagno elefante per un apprendimento profondo e riflessivo. Con la sua natura metodica e paziente, ti guiderà attraverso ogni concetto con la profondità che merita.',
    whenToChoose: 'Scegli Elia quando vuoi comprendere a fondo ogni argomento, quando hai tempo per riflettere e quando preferisci un approccio strutturato e completo.',
    strengths: [
      'Analisi approfondita dei concetti',
      'Approccio metodico e strutturato',
      'Pazienza nel processo di apprendimento',
      'Connessioni logiche tra argomenti',
      'Consolidamento delle conoscenze'
    ],
    idealFor: [
      'Argomenti complessi che richiedono comprensione profonda',
      'Studenti che preferiscono tempi di riflessione',
      'Preparazione di esami o certificazioni importanti',
      'Costruzione di basi solide in nuove materie'
    ]
  },
  skippy: {
    coachType: 'skippy',
    introduction: 'Skippy è il tuo compagno canguro per un apprendimento veloce ed esplorativo. Con la sua energia dinamica, ti aiuterà a scoprire rapidamente nuovi orizzonti e mantenere alta la motivazione.',
    whenToChoose: 'Scegli Skippy quando vuoi esplorare rapidamente nuovi argomenti, quando hai poco tempo ma alta motivazione, o quando preferisci varietà e dinamismo.',
    strengths: [
      'Apprendimento rapido e agile',
      'Varietà di contenuti e approcci',
      'Mantenimento dell\'energia e motivazione',
      'Esplorazione di nuovi territori',
      'Feedback immediato e incoraggiante'
    ],
    idealFor: [
      'Panoramiche rapide di nuovi argomenti',
      'Sessioni di studio brevi ma intense',
      'Mantenimento della motivazione',
      'Esplorazione di interessi diversificati'
    ]
  },
  lupa: {
    coachType: 'lupa',
    introduction: 'Lupa è il tuo compagno lupa per un apprendimento collaborativo e sociale. Con il suo spirito di gruppo, ti connette con altri studenti per crescere insieme attraverso la condivisione.',
    whenToChoose: 'Scegli Lupa quando vuoi imparare con altri, quando apprezzi la discussione e il confronto, o quando credi che la conoscenza condivisa sia più preziosa.',
    strengths: [
      'Apprendimento collaborativo e sociale',
      'Condivisione di esperienze e conoscenze',
      'Supporto reciproco nel gruppo',
      'Discussioni arricchenti',
      'Motivazione attraverso la comunità'
    ],
    idealFor: [
      'Progetti di gruppo e collaborazioni',
      'Discussioni e dibattiti su argomenti',
      'Supporto reciproco nello studio',
      'Apprendimento attraverso il confronto'
    ]
  },
  polpo: {
    coachType: 'polpo',
    introduction: 'Polpo è il tuo compagno polpo per un apprendimento adattivo e intelligente. Con la sua capacità di adattarsi, combina il meglio di tutti gli approcci per offrirti l\'esperienza più efficace.',
    whenToChoose: 'Scegli Polpo quando vuoi un approccio che si adatta alle tue esigenze del momento, quando apprezzi la flessibilità, o quando vuoi il meglio di tutti i mondi.',
    strengths: [
      'Adattamento intelligente al contesto',
      'Combinazione di approcci diversi',
      'Personalizzazione basata sui dati',
      'Flessibilità nelle strategie',
      'Ottimizzazione continua dell\'esperienza'
    ],
    idealFor: [
      'Studenti con esigenze variabili',
      'Apprendimento ottimizzato e personalizzato',
      'Situazioni che richiedono flessibilità',
      'Massimizzazione dell\'efficacia di studio'
    ]
  }
};

// Welcome messages from Zuno Manager
const welcomeMessages = [
  'Benvenuto nel tuo ambiente di apprendimento personalizzato! Sono qui per guidarti verso il successo.',
  'Ciao! Sono il tuo coordinatore di apprendimento. Insieme troveremo il percorso perfetto per te.',
  'Benvenuto in Zuno! La mia missione è assicurarmi che tu raggiunga i tuoi obiettivi di apprendimento.',
  'Salve! Sono qui per coordinare la tua esperienza e aiutarti a scegliere il coach giusto per ogni situazione.'
];

// Coordination messages based on context
const coordinationMessages = {
  lesson: {
    elia: 'Il tuo Coach Elia ti accompagnerà in questa lezione con la profondità e l\'attenzione che merita. Prenditi il tempo necessario.',
    skippy: 'Coach Skippy è pronto a guidarti attraverso questa lezione con energia e dinamismo. Mantieni il ritmo!',
    lupa: 'Coach Lupa ti supporterà in questa lezione, ricordando che l\'apprendimento è ancora più ricco quando condiviso.',
    polpo: 'Coach Polpo adatterà l\'approccio di questa lezione alle tue esigenze attuali per massimizzare l\'efficacia.'
  },
  assessment: {
    elia: 'Coach Elia ti guiderà attraverso questa valutazione con metodicità, assicurandosi che ogni risposta sia ben ponderata.',
    skippy: 'Coach Skippy ti accompagnerà in questa valutazione mantenendo alta l\'energia e la fiducia nelle tue capacità.',
    lupa: 'Coach Lupa ti ricorda che ogni valutazione è un\'opportunità di crescita, proprio come nel branco.',
    polpo: 'Coach Polpo analizzerà i tuoi risultati per adattare il percorso futuro alle tue esigenze specifiche.'
  },
  progress: {
    elia: 'Coach Elia celebra ogni progresso con la soddisfazione di chi sa che la conoscenza profonda richiede tempo.',
    skippy: 'Coach Skippy è entusiasta dei tuoi progressi e pronto a esplorare nuovi orizzonti con te!',
    lupa: 'Coach Lupa è orgogliosa dei tuoi progressi e sa che stai contribuendo alla crescita di tutta la comunità.',
    polpo: 'Coach Polpo analizza i tuoi progressi per ottimizzare continuamente la tua esperienza di apprendimento.'
  },
  general: {
    elia: 'Coach Elia è qui per offrirti un apprendimento profondo e riflessivo, sempre con pazienza e metodicità.',
    skippy: 'Coach Skippy porta energia e dinamismo al tuo apprendimento, mantenendo alta la motivazione.',
    lupa: 'Coach Lupa crede nel potere dell\'apprendimento collaborativo e nella forza della comunità.',
    polpo: 'Coach Polpo si adatta alle tue esigenze per offrirti sempre l\'esperienza di apprendimento più efficace.'
  }
};

interface ZunoManagerProviderProps {
  children: ReactNode;
}

export function ZunoManagerProvider({ children }: ZunoManagerProviderProps) {
  const { currentCoach } = useCoach();

  const getWelcomeMessage = (userName?: string): string => {
    const baseMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    return userName ? `${baseMessage.replace('Benvenuto', `Benvenuto ${userName}`)}` : baseMessage;
  };

  const getCoachIntroduction = (coachType: CoachType): CoachIntroduction => {
    return coachIntroductions[coachType];
  };

  const getCoordinationMessage = (
    currentCoach: CoachType, 
    context: 'lesson' | 'assessment' | 'progress' | 'general'
  ): string => {
    return coordinationMessages[context][currentCoach];
  };

  const getTransitionMessage = (fromCoach: CoachType | null, toCoach: CoachType): string => {
    if (!fromCoach) {
      return `Perfetto! Hai scelto ${coachIntroductions[toCoach].introduction.split('.')[0]}. Iniziamo questo percorso insieme!`;
    }
    
    const fromName = coachIntroductions[fromCoach].coachType;
    const toName = coachIntroductions[toCoach].coachType;
    
    return `Ottima scelta! Passiamo da Coach ${fromName.charAt(0).toUpperCase() + fromName.slice(1)} a Coach ${toName.charAt(0).toUpperCase() + toName.slice(1)}. Ogni coach porta il suo valore unico al tuo apprendimento.`;
  };

  const getMotivationalMessage = (
    user: User, 
    context: 'daily' | 'achievement' | 'struggle' | 'milestone'
  ): string => {
    const userName = user.fullName || user.username || 'studente';
    
    switch (context) {
      case 'daily':
        return `Buongiorno ${userName}! Oggi è un nuovo giorno per crescere. Il tuo Coach ${currentCoach.charAt(0).toUpperCase() + currentCoach.slice(1)} è pronto ad accompagnarti.`;
      case 'achievement':
        return `Complimenti ${userName}! Questo traguardo dimostra la tua dedizione. Coach ${currentCoach.charAt(0).toUpperCase() + currentCoach.slice(1)} e io siamo orgogliosi dei tuoi progressi.`;
      case 'struggle':
        return `${userName}, ricorda che ogni sfida è un\'opportunità di crescita. Coach ${currentCoach.charAt(0).toUpperCase() + currentCoach.slice(1)} è qui per supportarti, e io coordino tutto per il tuo successo.`;
      case 'milestone':
        return `${userName}, hai raggiunto un traguardo importante! Questo è il risultato della collaborazione perfetta tra te e Coach ${currentCoach.charAt(0).toUpperCase() + currentCoach.slice(1)}.`;
      default:
        return `${userName}, sono qui per assicurarmi che tu abbia sempre il supporto giusto al momento giusto.`;
    }
  };

  const getAllCoachesOverview = (): CoachIntroduction[] => {
    return Object.values(coachIntroductions);
  };

  const value: ZunoManagerContextValue = {
    managerPersonality,
    getWelcomeMessage,
    getCoachIntroduction,
    getCoordinationMessage,
    getTransitionMessage,
    getMotivationalMessage,
    getAllCoachesOverview
  };

  return (
    <ZunoManagerContext.Provider value={value}>
      {children}
    </ZunoManagerContext.Provider>
  );
}

export function useZunoManager(): ZunoManagerContextValue {
  const context = useContext(ZunoManagerContext);
  if (context === undefined) {
    throw new Error('useZunoManager must be used within a ZunoManagerProvider');
  }
  return context;
}