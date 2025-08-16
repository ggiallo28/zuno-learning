// Import Amplify generated types
import {
  CoachNameValues,
  DifficultyLevelValues,
  CourseCategoryValues,
  LessonTypeValues,
  ZunoEntryTypeValues,
  CatalogItemTypeValues,
  RequirementTypeValues,
  GroupActivityTypeValues,
  AssessmentGradingModeValues,
  CatalogResourceTypeValues
} from '../api/amplify';

import type {
  UserProfileObject,
  CourseObject,
  LessonObject,
  AchievementObject,
  ZunoCatalog,
  ZunoEntry,
  QuizObject,
  QuizPossibilityObject,
  CoachObject,
  UserProgressObject,
  UserActivityObject,
  KnowledgeGapObject,
  CoachInteractionObject,
  ScheduledReviewObject,
  LearningAnalyticsObject,
  GroupActivityObject,
  AssessmentResultObject,
  AssessmentTemplateObject,
  EntryMetadataObject,
  CatalogMetadataObject
} from '../api/amplify';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  subscriptionTier?: string;
  totalXp: number;
  currentLevel: number;
  currentStreak?: number;
  longestStreak?: number;
  lastActivityDate?: string;
  enrolledCourses?: number;
  completedCourses?: number;
  coachName?: CoachNameValues;
  onboardingCompleted: boolean;
  learningPreferences?: Record<string, any>;
}

export type CoachType = 'elia' | 'skippy' | 'lupa' | 'polpo';

export interface CoachConfig {
  id: string;
  coachName: CoachNameValues;
  displayName: string;
  description: string;
  learningStyle: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  iconStyle: string;
  personalityTraits: string[];
  motivationMessages: string[];
}

export interface CoachTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  muted: string;
}

export interface Course {
  id: string;
  title?: string;
  description?: string;
  category: CourseCategoryValues;
  difficultyLevel: DifficultyLevelValues;
  estimatedDurationDays?: number;
  coverImageUrl?: string;
  isPremium?: boolean;
  lessonCount?: number;
  progressPercentage?: number;
  enrolledAt?: string;
  completedAt?: string;
  totalLessons?: number;
  completedLessons?: number;
  // Unified properties for compatibility
  difficulty_level?: DifficultyLevelValues; // snake_case alias
  estimated_duration_days?: number; // snake_case alias
  cover_image_url?: string; // snake_case alias
  is_premium?: boolean; // snake_case alias
  lesson_count?: number; // snake_case alias
  progress_percentage?: number; // snake_case alias
  enrolled_at?: string; // snake_case alias
  completed_at?: string; // snake_case alias
  total_lessons?: number; // snake_case alias
  completed_lessons?: number; // snake_case alias
}

export interface Lesson {
  id: string;
  courseId?: string;
  title?: string;
  content?: string;
  lessonOrder?: number;
  lessonType?: LessonTypeValues;
  xpReward?: number;
  estimatedMinutes?: number;
}

export interface Achievement {
  id: string;
  name?: string;
  description?: string;
  icon?: string;
  category?: string;
  requirementType?: string;
  requirementValue?: number;
  xpReward?: number;
  earnedAt?: string;
}

// New interfaces for expanded functionality

export interface KnowledgeGap {
  id: string;
  user_id: string;
  subject_area: string;
  concept_name: string;
  confidence_level: number;
  assessment_date: string;
  last_reviewed_at?: string;
  review_count: number;
  mastery_status: 'unknown' | 'weak' | 'developing' | 'strong' | 'mastered';
}

export interface Assessment {
  id: string;
  user_id: string;
  assessment_type: 'initial' | 'progress' | 'focus_check';
  subject_area?: string;
  questions_data: any[];
  answers_data?: any[];
  score?: number;
  identified_gaps: string[];
  recommendations: string[];
  completed_at?: string;
  created_at: string;
}

export interface LearningGroup {
  id: string;
  name: string;
  description?: string;
  subject_area?: string;
  max_members: number;
  is_active: boolean;
  created_by: string;
  member_count?: number;
  user_role?: 'member' | 'moderator' | 'leader';
}

export interface SpacedRepetitionItem {
  id: string;
  user_id: string;
  content_id: string;
  content_type: 'lesson' | 'quiz' | 'concept';
  next_review_date: string;
  interval_days: number;
  repetition_count: number;
  ease_factor: number;
  last_performance?: number;
}

export interface InteractiveElement {
  type: 'quiz' | 'practice' | 'game' | 'discussion' | 'simulation';
  weight: number;
  config?: Record<string, any>;
}

export interface UserBehaviorData {
  sessionDuration: number;
  accuracy: number;
  completionRate: number;
  preferredContentType: 'text' | 'video' | 'interactive' | 'mixed';
  strugglingAreas: string[];
  strongAreas: string[];
  socialEngagement: number; // 0-1 scale
  timeSpentOnDifficultContent: number;
  helpSeekingBehavior: 'frequent' | 'moderate' | 'rare';
}

// Zuno Manager types
export interface ZunoManagerPersonality {
  name: string;
  role: string;
  description: string;
  characteristics: string[];
  coordinationStyle: string;
  guidanceApproach: string;
}

export interface CoachIntroduction {
  coachType: CoachType;
  introduction: string;
  whenToChoose: string;
  strengths: string[];
  idealFor: string[];
}

// Enhanced lesson interface
export interface EnhancedLesson extends Lesson {
  interactive_elements?: InteractiveElement[];
  difficulty_score?: number;
  prerequisites?: string[];
  learning_objectives?: string[];
}

export {
  CoachNameValues,
  DifficultyLevelValues,
  CourseCategoryValues,
  LessonTypeValues,
  ZunoEntryTypeValues,
  CatalogItemTypeValues,
  RequirementTypeValues,
  GroupActivityTypeValues,
  AssessmentGradingModeValues,
  CatalogResourceTypeValues
};

// Re-export Amplify types for convenience
export type {
  UserProfileObject,
  CourseObject,
  LessonObject,
  AchievementObject,
  ZunoCatalog,
  ZunoEntry,
  QuizObject,
  QuizPossibilityObject,
  CoachObject,
  UserProgressObject,
  UserActivityObject,
  KnowledgeGapObject,
  CoachInteractionObject,
  ScheduledReviewObject,
  LearningAnalyticsObject,
  GroupActivityObject,
  AssessmentResultObject,
  AssessmentTemplateObject,
  EntryMetadataObject,
  CatalogMetadataObject
};
  