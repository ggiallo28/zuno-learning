import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CourseCatalog } from './CourseCatalog'
import { AppDataContext } from '@/contexts/AppDataContext'
import { CoachContext } from '@/contexts/CoachContext'
import { createMockCourse } from '../../tests/factories/courseFactory'
import { createMockCoachContext } from '../../tests/factories/coachFactory'

// Mock the actions
vi.mock('@/actions/loadCourses', () => ({
  loadCourses: vi.fn()
}))

vi.mock('@/actions/enrollInCourse', () => ({
  enrollInCourse: vi.fn()
}))

const mockCourses = [
  createMockCourse({ 
    id: 'course-1', 
    title: 'JavaScript Fundamentals',
    category: 'Technology',
    difficulty: 'Beginner'
  }),
  createMockCourse({ 
    id: 'course-2', 
    title: 'Advanced React',
    category: 'Technology',
    difficulty: 'Advanced'
  }),
  createMockCourse({ 
    id: 'course-3', 
    title: 'Spanish Basics',
    category: 'Language',
    difficulty: 'Beginner'
  })
]

const mockAppDataContext = {
  courses: mockCourses,
  userProfile: null,
  userCourses: [],
  isLoading: false,
  error: null,
  refreshCourses: vi.fn(),
  refreshUserProfile: vi.fn(),
  refreshUserCourses: vi.fn(),
  enrollInCourse: vi.fn(),
  updateUserProgress: vi.fn()
}

const renderWithProviders = (
  component: React.ReactElement,
  appDataValue = mockAppDataContext,
  coachValue = createMockCoachContext()
) => {
  return render(
    <AppDataContext.Provider value={appDataValue}>
      <CoachContext.Provider value={coachValue}>
        {component}
      </CoachContext.Provider>
    </AppDataContext.Provider>
  )
}

describe('CourseCatalog Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render course list', async () => {
    renderWithProviders(<CourseCatalog />)
    
    await waitFor(() => {
      expect(screen.getByText('JavaScript Fundamentals')).toBeInTheDocument()
      expect(screen.getByText('Advanced React')).toBeInTheDocument()
      expect(screen.getByText('Spanish Basics')).toBeInTheDocument()
    })
  })

  it('should show loading state', () => {
    const loadingContext = { ...mockAppDataContext, isLoading: true, courses: [] }
    renderWithProviders(<CourseCatalog />, loadingContext)
    
    expect(screen.getByText(/caricamento/i)).toBeInTheDocument()
  })

  it('should show error state', () => {
    const errorContext = { 
      ...mockAppDataContext, 
      error: 'Failed to load courses',
      courses: []
    }
    renderWithProviders(<CourseCatalog />, errorContext)
    
    expect(screen.getByText(/errore/i)).toBeInTheDocument()
    expect(screen.getByText(/failed to load courses/i)).toBeInTheDocument()
  })

  it('should filter courses by category', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CourseCatalog />)
    
    // Open category filter
    const categoryFilter = screen.getByRole('combobox', { name: /categoria/i })
    await user.click(categoryFilter)
    
    // Select Technology category
    const technologyOption = screen.getByRole('option', { name: /technology/i })
    await user.click(technologyOption)
    
    await waitFor(() => {
      expect(screen.getByText('JavaScript Fundamentals')).toBeInTheDocument()
      expect(screen.getByText('Advanced React')).toBeInTheDocument()
      expect(screen.queryByText('Spanish Basics')).not.toBeInTheDocument()
    })
  })

  it('should filter courses by difficulty', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CourseCatalog />)
    
    // Open difficulty filter
    const difficultyFilter = screen.getByRole('combobox', { name: /difficoltà/i })
    await user.click(difficultyFilter)
    
    // Select Beginner difficulty
    const beginnerOption = screen.getByRole('option', { name: /beginner/i })
    await user.click(beginnerOption)
    
    await waitFor(() => {
      expect(screen.getByText('JavaScript Fundamentals')).toBeInTheDocument()
      expect(screen.getByText('Spanish Basics')).toBeInTheDocument()
      expect(screen.queryByText('Advanced React')).not.toBeInTheDocument()
    })
  })

  it('should search courses by title', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CourseCatalog />)
    
    const searchInput = screen.getByRole('textbox', { name: /cerca corsi/i })
    await user.type(searchInput, 'JavaScript')
    
    await waitFor(() => {
      expect(screen.getByText('JavaScript Fundamentals')).toBeInTheDocument()
      expect(screen.queryByText('Advanced React')).not.toBeInTheDocument()
      expect(screen.queryByText('Spanish Basics')).not.toBeInTheDocument()
    })
  })

  it('should handle course enrollment', async () => {
    const user = userEvent.setup()
    const mockEnroll = vi.fn()
    const contextWithEnroll = { ...mockAppDataContext, enrollInCourse: mockEnroll }
    
    renderWithProviders(<CourseCatalog />, contextWithEnroll)
    
    const enrollButton = screen.getAllByText(/iscriviti/i)[0]
    await user.click(enrollButton)
    
    expect(mockEnroll).toHaveBeenCalledWith('course-1')
  })

  it('should show course details on card click', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CourseCatalog />)
    
    const courseCard = screen.getByText('JavaScript Fundamentals').closest('.course-card')
    await user.click(courseCard!)
    
    // Should show course details modal or navigate to course page
    await waitFor(() => {
      expect(screen.getByText(/dettagli del corso/i)).toBeInTheDocument()
    })
  })

  it('should display course metadata correctly', () => {
    renderWithProviders(<CourseCatalog />)
    
    // Check for course duration
    expect(screen.getByText(/120 min/i)).toBeInTheDocument()
    
    // Check for difficulty badges
    expect(screen.getByText('Beginner')).toBeInTheDocument()
    expect(screen.getByText('Advanced')).toBeInTheDocument()
    
    // Check for category badges
    expect(screen.getAllByText('Technology')).toHaveLength(2)
    expect(screen.getByText('Language')).toBeInTheDocument()
  })

  it('should show empty state when no courses match filters', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CourseCatalog />)
    
    const searchInput = screen.getByRole('textbox', { name: /cerca corsi/i })
    await user.type(searchInput, 'NonexistentCourse')
    
    await waitFor(() => {
      expect(screen.getByText(/nessun corso trovato/i)).toBeInTheDocument()
    })
  })

  it('should clear filters', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CourseCatalog />)
    
    // Apply a filter
    const searchInput = screen.getByRole('textbox', { name: /cerca corsi/i })
    await user.type(searchInput, 'JavaScript')
    
    // Clear filters
    const clearButton = screen.getByRole('button', { name: /cancella filtri/i })
    await user.click(clearButton)
    
    await waitFor(() => {
      expect(screen.getByText('JavaScript Fundamentals')).toBeInTheDocument()
      expect(screen.getByText('Advanced React')).toBeInTheDocument()
      expect(screen.getByText('Spanish Basics')).toBeInTheDocument()
    })
  })

  it('should be accessible', () => {
    renderWithProviders(<CourseCatalog />)
    
    // Check for proper headings
    expect(screen.getByRole('heading', { name: /catalogo corsi/i })).toBeInTheDocument()
    
    // Check for proper form labels
    expect(screen.getByLabelText(/cerca corsi/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/categoria/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/difficoltà/i)).toBeInTheDocument()
    
    // Check for proper button labels
    expect(screen.getByRole('button', { name: /cancella filtri/i })).toBeInTheDocument()
  })

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CourseCatalog />)
    
    // Tab through interactive elements
    await user.tab()
    expect(screen.getByRole('textbox', { name: /cerca corsi/i })).toHaveFocus()
    
    await user.tab()
    expect(screen.getByRole('combobox', { name: /categoria/i })).toHaveFocus()
    
    await user.tab()
    expect(screen.getByRole('combobox', { name: /difficoltà/i })).toHaveFocus()
  })

  it('should refresh courses when refresh button is clicked', async () => {
    const user = userEvent.setup()
    const mockRefresh = vi.fn()
    const contextWithRefresh = { ...mockAppDataContext, refreshCourses: mockRefresh }
    
    renderWithProviders(<CourseCatalog />, contextWithRefresh)
    
    const refreshButton = screen.getByRole('button', { name: /aggiorna/i })
    await user.click(refreshButton)
    
    expect(mockRefresh).toHaveBeenCalled()
  })
})