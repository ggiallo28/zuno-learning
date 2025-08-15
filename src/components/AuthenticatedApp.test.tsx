import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthenticatedApp } from './AuthenticatedApp'
import { render as customRender } from '@/test/utils'
import { createMockUserProfile } from '../../tests/factories/userFactory'
import { createMockCoachContext } from '../../tests/factories/coachFactory'

// Mock the lazy-loaded components
vi.mock('./CourseCatalog', () => ({
  default: () => <div data-testid="course-catalog">Course Catalog</div>
}))

vi.mock('./AssessmentSystem', () => ({
  default: () => <div data-testid="assessment-system">Assessment System</div>
}))

vi.mock('./OnboardingFlow', () => ({
  default: ({ onComplete }: { onComplete: () => void }) => (
    <div data-testid="onboarding-flow">
      <button onClick={onComplete}>Complete Onboarding</button>
    </div>
  )
}))

vi.mock('./CoachSelection', () => ({
  default: ({ onCoachSelect }: { onCoachSelect: (coach: string) => void }) => (
    <div data-testid="coach-selection">
      <button onClick={() => onCoachSelect('elia')}>Select Elia</button>
    </div>
  )
}))

vi.mock('./UserProfile', () => ({
  default: () => <div data-testid="user-profile">User Profile</div>
}))

describe('AuthenticatedApp Component', () => {
  const mockUserProfile = createMockUserProfile({
    displayName: 'Test User',
    selectedCoach: 'elia',
    level: 5,
    experiencePoints: 1250,
    streak: { current: 7, longest: 15, lastLessonDate: new Date().toISOString() }
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show onboarding for new users', () => {
    const newUserProfile = createMockUserProfile({
      selectedCoach: null,
      level: 1,
      experiencePoints: 0
    })

    customRender(<AuthenticatedApp />, {
      appDataContext: {
        userProfile: newUserProfile,
        courses: [],
        userCourses: [],
        isLoading: false,
        error: null,
        refreshCourses: vi.fn(),
        refreshUserProfile: vi.fn(),
        refreshUserCourses: vi.fn(),
        enrollInCourse: vi.fn(),
        updateUserProgress: vi.fn()
      }
    })

    expect(screen.getByTestId('onboarding-flow')).toBeInTheDocument()
  })

  it('should show main app for existing users', () => {
    customRender(<AuthenticatedApp />, {
      appDataContext: {
        userProfile: mockUserProfile,
        courses: [],
        userCourses: [],
        isLoading: false,
        error: null,
        refreshCourses: vi.fn(),
        refreshUserProfile: vi.fn(),
        refreshUserCourses: vi.fn(),
        enrollInCourse: vi.fn(),
        updateUserProgress: vi.fn()
      }
    })

    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('should display user stats in header', () => {
    customRender(<AuthenticatedApp />, {
      appDataContext: {
        userProfile: mockUserProfile,
        courses: [],
        userCourses: [],
        isLoading: false,
        error: null,
        refreshCourses: vi.fn(),
        refreshUserProfile: vi.fn(),
        refreshUserCourses: vi.fn(),
        enrollInCourse: vi.fn(),
        updateUserProgress: vi.fn()
      }
    })

    expect(screen.getByText('Livello 5')).toBeInTheDocument()
    expect(screen.getByText('1250 XP')).toBeInTheDocument()
    expect(screen.getByText('7 giorni')).toBeInTheDocument()
  })

  it('should navigate between tabs', async () => {
    const user = userEvent.setup()

    customRender(<AuthenticatedApp />, {
      appDataContext: {
        userProfile: mockUserProfile,
        courses: [],
        userCourses: [],
        isLoading: false,
        error: null,
        refreshCourses: vi.fn(),
        refreshUserProfile: vi.fn(),
        refreshUserCourses: vi.fn(),
        enrollInCourse: vi.fn(),
        updateUserProgress: vi.fn()
      }
    })

    // Should start on Dashboard tab
    expect(screen.getByTestId('course-catalog')).toBeInTheDocument()

    // Navigate to Focus tab
    const focusTab = screen.getByRole('tab', { name: /focus/i })
    await user.click(focusTab)

    expect(screen.getByTestId('assessment-system')).toBeInTheDocument()

    // Navigate to Profile tab
    const profileTab = screen.getByRole('tab', { name: /profilo/i })
    await user.click(profileTab)

    expect(screen.getByTestId('user-profile')).toBeInTheDocument()
  })

  it('should show coach indicator', () => {
    customRender(<AuthenticatedApp />, {
      appDataContext: {
        userProfile: mockUserProfile,
        courses: [],
        userCourses: [],
        isLoading: false,
        error: null,
        refreshCourses: vi.fn(),
        refreshUserProfile: vi.fn(),
        refreshUserCourses: vi.fn(),
        enrollInCourse: vi.fn(),
        updateUserProgress: vi.fn()
      },
      coachContext: createMockCoachContext('elia')
    })

    expect(screen.getByText('Elia')).toBeInTheDocument()
  })

  it('should handle onboarding completion', async () => {
    const user = userEvent.setup()
    const mockRefreshProfile = vi.fn()

    const newUserProfile = createMockUserProfile({
      selectedCoach: null,
      level: 1,
      experiencePoints: 0
    })

    customRender(<AuthenticatedApp />, {
      appDataContext: {
        userProfile: newUserProfile,
        courses: [],
        userCourses: [],
        isLoading: false,
        error: null,
        refreshCourses: vi.fn(),
        refreshUserProfile: mockRefreshProfile,
        refreshUserCourses: vi.fn(),
        enrollInCourse: vi.fn(),
        updateUserProgress: vi.fn()
      }
    })

    const completeButton = screen.getByText('Complete Onboarding')
    await user.click(completeButton)

    expect(mockRefreshProfile).toHaveBeenCalled()
  })

  it('should handle coach selection during onboarding', async () => {
    const user = userEvent.setup()
    const mockSelectCoach = vi.fn()

    const newUserProfile = createMockUserProfile({
      selectedCoach: null,
      level: 1,
      experiencePoints: 0
    })

    customRender(<AuthenticatedApp />, {
      appDataContext: {
        userProfile: newUserProfile,
        courses: [],
        userCourses: [],
        isLoading: false,
        error: null,
        refreshCourses: vi.fn(),
        refreshUserProfile: vi.fn(),
        refreshUserCourses: vi.fn(),
        enrollInCourse: vi.fn(),
        updateUserProgress: vi.fn()
      },
      coachContext: createMockCoachContext('elia', { selectCoach: mockSelectCoach })
    })

    // Should show coach selection during onboarding
    expect(screen.getByTestId('onboarding-flow')).toBeInTheDocument()
  })

  it('should show loading state', () => {
    customRender(<AuthenticatedApp />, {
      appDataContext: {
        userProfile: null,
        courses: [],
        userCourses: [],
        isLoading: true,
        error: null,
        refreshCourses: vi.fn(),
        refreshUserProfile: vi.fn(),
        refreshUserCourses: vi.fn(),
        enrollInCourse: vi.fn(),
        updateUserProgress: vi.fn()
      }
    })

    expect(screen.getByText(/caricamento/i)).toBeInTheDocument()
  })

  it('should show error state', () => {
    customRender(<AuthenticatedApp />, {
      appDataContext: {
        userProfile: null,
        courses: [],
        userCourses: [],
        isLoading: false,
        error: 'Failed to load user data',
        refreshCourses: vi.fn(),
        refreshUserProfile: vi.fn(),
        refreshUserCourses: vi.fn(),
        enrollInCourse: vi.fn(),
        updateUserProgress: vi.fn()
      }
    })

    expect(screen.getByText(/errore/i)).toBeInTheDocument()
    expect(screen.getByText(/failed to load user data/i)).toBeInTheDocument()
  })

  it('should handle tab keyboard navigation', async () => {
    const user = userEvent.setup()

    customRender(<AuthenticatedApp />, {
      appDataContext: {
        userProfile: mockUserProfile,
        courses: [],
        userCourses: [],
        isLoading: false,
        error: null,
        refreshCourses: vi.fn(),
        refreshUserProfile: vi.fn(),
        refreshUserCourses: vi.fn(),
        enrollInCourse: vi.fn(),
        updateUserProgress: vi.fn()
      }
    })

    const tabList = screen.getByRole('tablist')
    tabList.focus()

    // Navigate with arrow keys
    await user.keyboard('{ArrowRight}')
    
    const focusTab = screen.getByRole('tab', { name: /focus/i })
    expect(focusTab).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(screen.getByTestId('assessment-system')).toBeInTheDocument()
  })

  it('should be accessible', () => {
    customRender(<AuthenticatedApp />, {
      appDataContext: {
        userProfile: mockUserProfile,
        courses: [],
        userCourses: [],
        isLoading: false,
        error: null,
        refreshCourses: vi.fn(),
        refreshUserProfile: vi.fn(),
        refreshUserCourses: vi.fn(),
        enrollInCourse: vi.fn(),
        updateUserProgress: vi.fn()
      }
    })

    // Check for proper ARIA attributes
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(4) // Dashboard, Focus, Collaborativo, Profilo

    // Check for proper headings
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('should handle responsive layout', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })

    customRender(<AuthenticatedApp />, {
      appDataContext: {
        userProfile: mockUserProfile,
        courses: [],
        userCourses: [],
        isLoading: false,
        error: null,
        refreshCourses: vi.fn(),
        refreshUserProfile: vi.fn(),
        refreshUserCourses: vi.fn(),
        enrollInCourse: vi.fn(),
        updateUserProgress: vi.fn()
      }
    })

    // Should render mobile-friendly layout
    expect(screen.getByRole('navigation')).toBeInTheDocument()

    // Restore viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  it('should handle coach theme changes', async () => {
    const user = userEvent.setup()
    const mockSelectCoach = vi.fn()

    customRender(<AuthenticatedApp />, {
      appDataContext: {
        userProfile: mockUserProfile,
        courses: [],
        userCourses: [],
        isLoading: false,
        error: null,
        refreshCourses: vi.fn(),
        refreshUserProfile: vi.fn(),
        refreshUserCourses: vi.fn(),
        enrollInCourse: vi.fn(),
        updateUserProgress: vi.fn()
      },
      coachContext: createMockCoachContext('elia', { selectCoach: mockSelectCoach })
    })

    // Should show current coach
    expect(screen.getByText('Elia')).toBeInTheDocument()

    // Theme should be applied (this would need to check CSS custom properties)
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })

  it('should handle sign out', async () => {
    const user = userEvent.setup()
    const mockSignOut = vi.fn()

    // Mock auth context
    vi.mock('@/contexts/AuthContext', () => ({
      useAuth: () => ({
        signOut: mockSignOut,
        user: { username: 'testuser' }
      })
    }))

    customRender(<AuthenticatedApp />, {
      appDataContext: {
        userProfile: mockUserProfile,
        courses: [],
        userCourses: [],
        isLoading: false,
        error: null,
        refreshCourses: vi.fn(),
        refreshUserProfile: vi.fn(),
        refreshUserCourses: vi.fn(),
        enrollInCourse: vi.fn(),
        updateUserProgress: vi.fn()
      }
    })

    // Find and click sign out button (might be in a dropdown)
    const userMenu = screen.getByText('Test User')
    await user.click(userMenu)

    const signOutButton = screen.getByText(/esci/i)
    await user.click(signOutButton)

    expect(mockSignOut).toHaveBeenCalled()
  })
})