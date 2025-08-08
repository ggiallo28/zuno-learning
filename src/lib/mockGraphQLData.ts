// Mock GraphQL data that matches the schema structure
import type { 
  CoachNameValues, 
  DifficultyLevelValues, 
  CourseCategoryValues, 
  LessonTypeValues,
  ZunoEntryTypeValues,
  CatalogItemTypeValues 
} from '../types';

// Mock ZunoCatalog items for courses
export const mockCoursesCatalog = [
  {
    id: 'course_1',
    parentId: null,
    itemType: 'COURSE' as CatalogItemTypeValues,
    timestamp: '2024-01-01T00:00:00Z',
    metadata: {
      course: {
        title: 'Introduction to React',
        category: 'TECHNOLOGY' as CourseCategoryValues,
        difficultyLevel: 'BEGINNER' as DifficultyLevelValues
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'course_2',
    parentId: null,
    itemType: 'COURSE' as CatalogItemTypeValues,
    timestamp: '2024-01-02T00:00:00Z',
    metadata: {
      course: {
        title: 'Advanced TypeScript Patterns',
        category: 'TECHNOLOGY' as CourseCategoryValues,
        difficultyLevel: 'ADVANCED' as DifficultyLevelValues
      }
    },
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 'course_3',
    parentId: null,
    itemType: 'COURSE' as CatalogItemTypeValues,
    timestamp: '2024-01-03T00:00:00Z',
    metadata: {
      course: {
        title: 'UI/UX Design Fundamentals',
        category: 'ART' as CourseCategoryValues,
        difficultyLevel: 'INTERMEDIATE' as DifficultyLevelValues
      }
    },
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    id: 'course_4',
    parentId: null,
    itemType: 'COURSE' as CatalogItemTypeValues,
    timestamp: '2024-01-04T00:00:00Z',
    metadata: {
      course: {
        title: 'Basic Mathematics',
        category: 'MATH' as CourseCategoryValues,
        difficultyLevel: 'BEGINNER' as DifficultyLevelValues
      }
    },
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z'
  },
  {
    id: 'course_5',
    parentId: null,
    itemType: 'COURSE' as CatalogItemTypeValues,
    timestamp: '2024-01-05T00:00:00Z',
    metadata: {
      course: {
        title: 'Introduction to Science',
        category: 'SCIENCE' as CourseCategoryValues,
        difficultyLevel: 'BEGINNER' as DifficultyLevelValues
      }
    },
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  }
];

// Mock ZunoCatalog items for lessons
export const mockLessonsCatalog = [
  {
    id: 'lesson_1_1',
    parentId: 'course_1',
    itemType: 'LESSON' as CatalogItemTypeValues,
    timestamp: '2024-01-01T01:00:00Z',
    metadata: {
      lesson: {
        courseId: 'course_1',
        title: 'Getting Started with React',
        lessonOrder: 1,
        lessonType: 'VIDEO' as LessonTypeValues
      }
    },
    createdAt: '2024-01-01T01:00:00Z',
    updatedAt: '2024-01-01T01:00:00Z'
  },
  {
    id: 'lesson_1_2',
    parentId: 'course_1',
    itemType: 'LESSON' as CatalogItemTypeValues,
    timestamp: '2024-01-01T02:00:00Z',
    metadata: {
      lesson: {
        courseId: 'course_1',
        title: 'Components and Props',
        lessonOrder: 2,
        lessonType: 'READING' as LessonTypeValues
      }
    },
    createdAt: '2024-01-01T02:00:00Z',
    updatedAt: '2024-01-01T02:00:00Z'
  },
  {
    id: 'lesson_1_3',
    parentId: 'course_1',
    itemType: 'LESSON' as CatalogItemTypeValues,
    timestamp: '2024-01-01T03:00:00Z',
    metadata: {
      lesson: {
        courseId: 'course_1',
        title: 'State and Lifecycle',
        lessonOrder: 3,
        lessonType: 'PRACTICE' as LessonTypeValues
      }
    },
    createdAt: '2024-01-01T03:00:00Z',
    updatedAt: '2024-01-01T03:00:00Z'
  }
];

// Mock ZunoCatalog items for coaches
export const mockCoachesCatalog = [
  {
    id: 'coach_elia',
    parentId: null,
    itemType: 'COACH' as CatalogItemTypeValues,
    timestamp: '2024-01-01T00:00:00Z',
    metadata: {
      coach: {
        coachName: 'ELIA' as CoachNameValues,
        displayName: 'Elia the Elephant',
        avatarUrl: null,
        bio: 'Deep, methodical learning approach with thorough explanations'
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'coach_skippy',
    parentId: null,
    itemType: 'COACH' as CatalogItemTypeValues,
    timestamp: '2024-01-01T00:00:00Z',
    metadata: {
      coach: {
        coachName: 'SKIPPY' as CoachNameValues,
        displayName: 'Skippy the Squirrel',
        avatarUrl: null,
        bio: 'Fast, dynamic learning with quick exploration'
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'coach_lupa',
    parentId: null,
    itemType: 'COACH' as CatalogItemTypeValues,
    timestamp: '2024-01-01T00:00:00Z',
    metadata: {
      coach: {
        coachName: 'LUPA' as CoachNameValues,
        displayName: 'Lupa the Wolf',
        avatarUrl: null,
        bio: 'Collaborative learning with social interaction'
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'coach_polpo',
    parentId: null,
    itemType: 'COACH' as CatalogItemTypeValues,
    timestamp: '2024-01-01T00:00:00Z',
    metadata: {
      coach: {
        coachName: 'POLPO' as CoachNameValues,
        displayName: 'Polpo the Octopus',
        avatarUrl: null,
        bio: 'Adaptive hybrid approach that combines multiple strategies'
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock ZunoEntry items for user data
export const mockUserEntries = [
  {
    id: 'demo_user_123_profile',
    userId: 'demo_user_123',
    entryType: 'USER_PROGRESS' as ZunoEntryTypeValues,
    catalogId: null,
    groupId: null,
    timestamp: '2024-01-01T00:00:00Z',
    metadata: {
      userProfile: {
        email: 'demo@zuno.com',
        username: 'demo_user',
        fullName: 'Demo User',
        subscriptionTier: 'premium',
        totalXp: 2450,
        currentLevel: 8,
        coachName: 'ELIA' as CoachNameValues,
        onboardingCompleted: true
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'demo_user_123_course_1_enrollment',
    userId: 'demo_user_123',
    entryType: 'COURSE_COMPLETION' as ZunoEntryTypeValues,
    catalogId: 'course_1',
    groupId: null,
    timestamp: '2024-01-15T00:00:00Z',
    metadata: {
      userActivity: {
        activityType: 'ENROLLMENT',
        description: 'Enrolled in Introduction to React',
        activityDate: '2024-01-15'
      }
    },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'demo_user_123_lesson_1_1_completion',
    userId: 'demo_user_123',
    entryType: 'LESSON_COMPLETION' as ZunoEntryTypeValues,
    catalogId: 'lesson_1_1',
    groupId: null,
    timestamp: '2024-01-16T00:00:00Z',
    metadata: {
      userProgress: {
        totalXpEarned: 50,
        completedLessons: 1,
        currentStreak: 1,
        masteryLevel: 'IN_PROGRESS'
      }
    },
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z'
  }
];

// Helper function to simulate GraphQL responses
export function createMockGraphQLResponse<T>(data: T) {
  return {
    data,
    errors: undefined,
    extensions: undefined
  };
}