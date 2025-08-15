import type { User, UserProfile } from '@/types'

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'test-user-id',
  username: 'testuser',
  email: 'test@example.com',
  attributes: {
    email: 'test@example.com',
    name: 'Test User',
    ...overrides.attributes
  },
  ...overrides
})

export const createMockUserProfile = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  userId: 'test-user-id',
  displayName: 'Test User',
  email: 'test@example.com',
  selectedCoach: 'elia',
  subscriptionTier: 'free',
  level: 1,
  experiencePoints: 0,
  streak: {
    current: 0,
    longest: 0,
    lastLessonDate: null
  },
  preferences: {
    notificationSettings: {
      email: true,
      push: true,
      inApp: true
    },
    gamificationLevel: 'moderate',
    focusModeEnabled: false,
    offlineContentEnabled: false
  },
  enrolledCourses: [],
  completedLessons: [],
  achievements: [],
  createdAt: new Date().toISOString(),
  lastActive: new Date().toISOString(),
  ...overrides
})

export const createMockAuthenticatedUser = (overrides: Partial<any> = {}) => ({
  username: 'testuser',
  attributes: {
    email: 'test@example.com',
    name: 'Test User',
    sub: 'test-user-id'
  },
  signInUserSession: {
    accessToken: {
      jwtToken: 'mock-jwt-token'
    }
  },
  ...overrides
})