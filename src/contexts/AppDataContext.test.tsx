import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppDataProvider, useAppData } from './AppDataContext'
import { createMockCourse, createMockUserProfile } from '../../tests/factories'
import * as loadCoursesAction from '@/actions/loadCourses'
import * as loadUserProfileAction from '@/actions/loadUserProfile'
import * as loadUserCoursesAction from '@/actions/loadUserCourses'

// Mock the actions
vi.mock('@/actions/loadCourses')
vi.mock('@/actions/loadUserProfile')
vi.mock('@/actions/loadUserCourses')
vi.mock('@/actions/enrollInCourse')

const mockLoadCourses = vi.mocked(loadCoursesAction.loadCourses)
const mockLoadUserProfile = vi.mocked(loadUserProfileAction.loadUserProfile)
const mockLoadUserCourses = vi.mocked(loadUserCoursesAction.loadUserCourses)

// Test component to use the context
const TestComponent: React.FC = () => {
  const {
    courses,
    userProfile,
    userCourses,
    isLoading,
    error,
    refreshCourses,
    refreshUserProfile,
    refreshUserCourses,
    enrollInCourse,
    updateUserProgress
  } = useAppData()

  return (
    <div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      <div data-testid="courses-count">{courses.length}</div>
      <div data-testid="user-name">{userProfile?.displayName || 'no-user'}</div>
      <div data-testid="user-courses-count">{userCourses.length}</div>
      
      <button data-testid="refresh-courses" onClick={refreshCourses}>
        Refresh Courses
      </button>
      <button data-testid="refresh-profile" onClick={refreshUserProfile}>
        Refresh Profile
      </button>
      <button data-testid="refresh-user-courses" onClick={refreshUserCourses}>
        Refresh User Courses
      </button>
      <button 
        data-testid="enroll-course" 
        onClick={() => enrollInCourse('course-1')}
      >
        Enroll in Course
      </button>
      <button 
        data-testid="update-progress" 
        onClick={() => updateUserProgress('lesson-1', 50)}
      >
        Update Progress
      </button>
    </div>
  )
}

describe('AppDataContext', () => {
  const mockCourses = [
    createMockCourse({ id: 'course-1', title: 'Course 1' }),
    createMockCourse({ id: 'course-2', title: 'Course 2' })
  ]

  const mockUserProfile = createMockUserProfile({
    displayName: 'Test User',
    email: 'test@example.com'
  })

  const mockUserCourses = [
    { courseId: 'course-1', progress: 50, enrolledAt: new Date().toISOString() }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup default mock implementations
    mockLoadCourses.mockResolvedValue(mockCourses)
    mockLoadUserProfile.mockResolvedValue(mockUserProfile)
    mockLoadUserCourses.mockResolvedValue(mockUserCourses)
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('should provide initial loading state', () => {
    render(
      <AppDataProvider>
        <TestComponent />
      </AppDataProvider>
    )

    expect(screen.getByTestId('loading')).toHaveTextContent('true')
    expect(screen.getByTestId('error')).toHaveTextContent('no-error')
    expect(screen.getByTestId('courses-count')).toHaveTextContent('0')
    expect(screen.getByTestId('user-name')).toHaveTextContent('no-user')
  })

  it('should load initial data successfully', async () => {
    render(
      <AppDataProvider>
        <TestComponent />
      </AppDataProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    expect(screen.getByTestId('courses-count')).toHaveTextContent('2')
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User')
    expect(screen.getByTestId('user-courses-count')).toHaveTextContent('1')
    expect(screen.getByTestId('error')).toHaveTextContent('no-error')
  })

  it('should handle loading errors', async () => {
    const errorMessage = 'Failed to load courses'
    mockLoadCourses.mockRejectedValue(new Error(errorMessage))

    render(
      <AppDataProvider>
        <TestComponent />
      </AppDataProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    expect(screen.getByTestId('error')).toHaveTextContent(errorMessage)
  })

  it('should refresh courses when requested', async () => {
    const user = userEvent.setup()

    render(
      <AppDataProvider>
        <TestComponent />
      </AppDataProvider>
    )

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    // Clear the mock to track new calls
    mockLoadCourses.mockClear()

    // Refresh courses
    await user.click(screen.getByTestId('refresh-courses'))

    expect(mockLoadCourses).toHaveBeenCalledTimes(1)
  })

  it('should refresh user profile when requested', async () => {
    const user = userEvent.setup()

    render(
      <AppDataProvider>
        <TestComponent />
      </AppDataProvider>
    )

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    // Clear the mock to track new calls
    mockLoadUserProfile.mockClear()

    // Refresh profile
    await user.click(screen.getByTestId('refresh-profile'))

    expect(mockLoadUserProfile).toHaveBeenCalledTimes(1)
  })

  it('should refresh user courses when requested', async () => {
    const user = userEvent.setup()

    render(
      <AppDataProvider>
        <TestComponent />
      </AppDataProvider>
    )

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    // Clear the mock to track new calls
    mockLoadUserCourses.mockClear()

    // Refresh user courses
    await user.click(screen.getByTestId('refresh-user-courses'))

    expect(mockLoadUserCourses).toHaveBeenCalledTimes(1)
  })

  it('should handle course enrollment', async () => {
    const user = userEvent.setup()
    const mockEnrollInCourse = vi.fn().mockResolvedValue(undefined)
    
    // Mock the enroll action
    vi.doMock('@/actions/enrollInCourse', () => ({
      enrollInCourse: mockEnrollInCourse
    }))

    render(
      <AppDataProvider>
        <TestComponent />
      </AppDataProvider>
    )

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    // Enroll in course
    await user.click(screen.getByTestId('enroll-course'))

    expect(mockEnrollInCourse).toHaveBeenCalledWith('course-1')
  })

  it('should handle progress updates', async () => {
    const user = userEvent.setup()
    const mockCompleteLessonProgress = vi.fn().mockResolvedValue(undefined)
    
    // Mock the progress action
    vi.doMock('@/actions/completeLessonProgress', () => ({
      completeLessonProgress: mockCompleteLessonProgress
    }))

    render(
      <AppDataProvider>
        <TestComponent />
      </AppDataProvider>
    )

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    // Update progress
    await user.click(screen.getByTestId('update-progress'))

    expect(mockCompleteLessonProgress).toHaveBeenCalledWith('lesson-1', 50)
  })

  it('should implement caching mechanism', async () => {
    render(
      <AppDataProvider>
        <TestComponent />
      </AppDataProvider>
    )

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    // Verify initial calls
    expect(mockLoadCourses).toHaveBeenCalledTimes(1)
    expect(mockLoadUserProfile).toHaveBeenCalledTimes(1)
    expect(mockLoadUserCourses).toHaveBeenCalledTimes(1)

    // Unmount and remount within cache period
    const { unmount } = render(
      <AppDataProvider>
        <TestComponent />
      </AppDataProvider>
    )

    unmount()

    render(
      <AppDataProvider>
        <TestComponent />
      </AppDataProvider>
    )

    // Should use cached data, not make new API calls
    expect(mockLoadCourses).toHaveBeenCalledTimes(1)
    expect(mockLoadUserProfile).toHaveBeenCalledTimes(1)
    expect(mockLoadUserCourses).toHaveBeenCalledTimes(1)
  })

  it('should handle concurrent data loading', async () => {
    const slowLoadCourses = vi.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockCourses), 100))
    )
    const slowLoadProfile = vi.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockUserProfile), 150))
    )

    mockLoadCourses.mockImplementation(slowLoadCourses)
    mockLoadUserProfile.mockImplementation(slowLoadProfile)

    render(
      <AppDataProvider>
        <TestComponent />
      </AppDataProvider>
    )

    // Should show loading initially
    expect(screen.getByTestId('loading')).toHaveTextContent('true')

    // Wait for all data to load
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    }, { timeout: 300 })

    expect(screen.getByTestId('courses-count')).toHaveTextContent('2')
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User')
  })

  it('should throw error when used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAppData must be used within an AppDataProvider')

    consoleSpy.mockRestore()
  })

  it('should handle partial data loading failures', async () => {
    // Make courses fail but profile succeed
    mockLoadCourses.mockRejectedValue(new Error('Courses failed'))
    mockLoadUserProfile.mockResolvedValue(mockUserProfile)

    render(
      <AppDataProvider>
        <TestComponent />
      </AppDataProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    // Should show error but still load successful data
    expect(screen.getByTestId('error')).toHaveTextContent('Courses failed')
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User')
    expect(screen.getByTestId('courses-count')).toHaveTextContent('0')
  })

  it('should clear errors on successful refresh', async () => {
    const user = userEvent.setup()

    // Initial failure
    mockLoadCourses.mockRejectedValueOnce(new Error('Initial error'))

    render(
      <AppDataProvider>
        <TestComponent />
      </AppDataProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Initial error')
    })

    // Successful refresh
    mockLoadCourses.mockResolvedValueOnce(mockCourses)
    await user.click(screen.getByTestId('refresh-courses'))

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('no-error')
    })

    expect(screen.getByTestId('courses-count')).toHaveTextContent('2')
  })
})