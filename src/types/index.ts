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
  