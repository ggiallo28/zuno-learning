// Assessment system types
export type CoachType = 'elia' | 'skippy' | 'lupa' | 'polpo';

export type TopicType = 'arrays' | 'hooks' | 'types' | 'functions' | 'objects' | 'async';

export type QuestionFormat = 
  | 'multiple_choice' 
  | 'multiple_select' 
  | 'cloze' 
  | 'order_steps' 
  | 'debug_explain' 
  | 'code_run' 
  | 'open_text';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface CodeRunTest {
  id: string;
  input: any[];
  expectedOutput: any;
  isHidden: boolean;
  description?: string;
}

export interface AssessmentItem {
  id: string;
  topic: TopicType;
  format: QuestionFormat;
  difficulty: DifficultyLevel;
  question: string;
  hint?: string;
  scaffoldQuestion?: string; // For when student struggles
  
  // Multiple choice/select options
  options?: string[];
  correctAnswers?: number[]; // Array to support multiple select
  
  // Cloze/fill-in-the-blank
  clozeTemplate?: string; // e.g., "Array.___() adds elements to the end"
  clozeAnswers?: string[]; // Possible correct answers
  
  // Order steps
  steps?: string[];
  correctOrder?: number[];
  
  // Debug/explain
  buggyCode?: string;
  bugExplanation?: string;
  fixedCode?: string;
  
  // Code run
  codeTemplate?: string;
  tests?: CodeRunTest[];
  allowedImports?: string[];
  timeoutMs?: number;
  memoryLimitMB?: number;
  
  // Open text
  rubric?: {
    criteria: string;
    points: number;
  }[];
  
  // Metadata
  timeEstimateMs: number;
  tags: string[];
  variants?: AssessmentItem[]; // For shuffle/anti-abuse
}

export interface ItemResponse {
  id: string;
  itemId: string;
  sessionId: string;
  answer: any; // Could be string, number[], object etc
  isCorrect: boolean;
  partialScore: number; // 0-1
  timeMs: number;
  confidence: ConfidenceLevel;
  hintsUsed: number;
  retryCount: number;
  codeRunLog?: {
    output: string;
    errors: string[];
    testsRun: number;
    testsPassed: number;
    executionTimeMs: number;
  };
  timestamp: Date;
}

export interface TopicMastery {
  topic: TopicType;
  masteryLevel: number; // 0-1
  confidence: number; // 0-1, statistical confidence
  itemsAnswered: number;
  itemsCorrect: number;
  avgDifficulty: number;
  trend: 'improving' | 'stable' | 'declining';
  lastAssessed: Date;
}

export interface AssessmentSession {
  id: string;
  userId: string;
  coachType: CoachType;
  topics: TopicType[];
  startedAt: Date;
  completedAt?: Date;
  currentItemIndex: number;
  totalItems: number;
  
  // Adaptive state
  abilityEstimate: number; // IRT theta
  topicMastery: Record<TopicType, TopicMastery>;
  
  // Coach-specific adaptations
  coachPreferences: {
    preferredFormats: QuestionFormat[];
    feedbackStyle: 'minimal' | 'detailed' | 'encouraging' | 'collaborative';
    hintStrategy: 'proactive' | 'on_request' | 'minimal';
    difficultyProgression: 'gradual' | 'rapid' | 'mixed';
  };
  
  responses: ItemResponse[];
  currentStreak: number;
  totalScore: number;
  
  // State management
  canGoBack: boolean;
  savedState?: any; // For offline persistence
}

export interface AssessmentConfig {
  maxItems: number;
  minItemsPerTopic: number;
  adaptivityThreshold: number; // Performance change needed to adjust difficulty
  hintPenalty: number; // Score reduction per hint
  timeBonus: boolean; // Whether to award bonus for quick correct answers
  allowRetries: boolean;
  offlineSupport: boolean;
}

export interface CoachPersonality {
  name: string;
  emoji: string;
  description: string;
  feedbackStyle: {
    correct: string[];
    incorrect: string[];
    hint: string[];
    encouragement: string[];
  };
  preferences: {
    formats: QuestionFormat[];
    difficultyProgression: 'gradual' | 'rapid' | 'mixed';
    hintFrequency: 'high' | 'medium' | 'low';
    collaborativeElements: boolean;
  };
}

// Assessment analytics
export interface AssessmentAnalytics {
  sessionId: string;
  completionRate: number;
  avgTimePerItem: number;
  difficultyDistribution: Record<DifficultyLevel, number>;
  formatPreferences: Record<QuestionFormat, { attempts: number; success: number }>;
  commonErrors: Array<{
    topic: TopicType;
    errorPattern: string;
    frequency: number;
    suggestedRemediation: string;
  }>;
  masteryProgression: Array<{
    topic: TopicType;
    masteryBefore: number;
    masteryAfter: number;
    confidence: number;
  }>;
}

// Gamification elements
export interface AssessmentReward {
  id: string;
  type: 'skin' | 'badge' | 'title' | 'unlock';
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockConditions: {
    masteryThresholds?: Record<TopicType, number>;
    streakDays?: number;
    speedBonuses?: number;
    perfectSessions?: number;
  };
  isCosmetic: boolean;
  purchasable: boolean;
  cost?: number; // If purchasable
}