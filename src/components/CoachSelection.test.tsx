import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CoachSelection } from './CoachSelection'
import { CoachContext } from '@/contexts/CoachContext'
import { createMockCoachContext } from '../../tests/factories/coachFactory'

// Mock the CoachContext
const renderWithCoachContext = (
  component: React.ReactElement,
  contextValue = createMockCoachContext()
) => {
  return render(
    <CoachContext.Provider value={contextValue}>
      {component}
    </CoachContext.Provider>
  )
}

describe('CoachSelection Component', () => {
  const mockSelectCoach = vi.fn()
  const defaultContextValue = createMockCoachContext('elia', {
    selectCoach: mockSelectCoach
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all four coaches', () => {
    renderWithCoachContext(<CoachSelection />, defaultContextValue)
    
    expect(screen.getByText('Elia l\'Elefante')).toBeInTheDocument()
    expect(screen.getByText('Skippy lo Scoiattolo')).toBeInTheDocument()
    expect(screen.getByText('Lupa la Lupa')).toBeInTheDocument()
    expect(screen.getByText('Polpo il Polpo')).toBeInTheDocument()
  })

  it('should show coach descriptions', () => {
    renderWithCoachContext(<CoachSelection />, defaultContextValue)
    
    expect(screen.getByText(/metodico e riflessivo/i)).toBeInTheDocument()
    expect(screen.getByText(/dinamico ed esplorativo/i)).toBeInTheDocument()
    expect(screen.getByText(/collaborativo e sociale/i)).toBeInTheDocument()
    expect(screen.getByText(/adattivo e intelligente/i)).toBeInTheDocument()
  })

  it('should highlight selected coach', () => {
    renderWithCoachContext(<CoachSelection />, defaultContextValue)
    
    const eliaCard = screen.getByText('Elia l\'Elefante').closest('[role="radio"]')
    expect(eliaCard).toHaveAttribute('aria-checked', 'true')
    
    const skippyCard = screen.getByText('Skippy lo Scoiattolo').closest('[role="radio"]')
    expect(skippyCard).toHaveAttribute('aria-checked', 'false')
  })

  it('should call selectCoach when a coach is clicked', async () => {
    const user = userEvent.setup()
    renderWithCoachContext(<CoachSelection />, defaultContextValue)
    
    const skippyCard = screen.getByText('Skippy lo Scoiattolo').closest('[role="radio"]')
    await user.click(skippyCard!)
    
    expect(mockSelectCoach).toHaveBeenCalledWith('skippy')
  })

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup()
    renderWithCoachContext(<CoachSelection />, defaultContextValue)
    
    const radioGroup = screen.getByRole('radiogroup')
    radioGroup.focus()
    
    // Arrow keys should navigate between coaches
    await user.keyboard('{ArrowDown}')
    expect(mockSelectCoach).toHaveBeenCalledWith('skippy')
    
    await user.keyboard('{ArrowDown}')
    expect(mockSelectCoach).toHaveBeenCalledWith('lupa')
    
    await user.keyboard('{ArrowUp}')
    expect(mockSelectCoach).toHaveBeenCalledWith('skippy')
  })

  it('should have proper ARIA attributes', () => {
    renderWithCoachContext(<CoachSelection />, defaultContextValue)
    
    const radioGroup = screen.getByRole('radiogroup')
    expect(radioGroup).toHaveAttribute('aria-label', 'Seleziona il tuo coach')
    
    const coaches = screen.getAllByRole('radio')
    expect(coaches).toHaveLength(4)
    
    coaches.forEach(coach => {
      expect(coach).toHaveAttribute('tabindex')
      expect(coach).toHaveAttribute('aria-checked')
    })
  })

  it('should show coach strengths and ideal use cases', () => {
    renderWithCoachContext(<CoachSelection />, defaultContextValue)
    
    // Check for Elia's strengths
    expect(screen.getByText(/apprendimento approfondito/i)).toBeInTheDocument()
    expect(screen.getByText(/concetti complessi/i)).toBeInTheDocument()
    
    // Check for Skippy's strengths
    expect(screen.getByText(/apprendimento rapido/i)).toBeInTheDocument()
    expect(screen.getByText(/panoramiche generali/i)).toBeInTheDocument()
  })

  it('should apply coach-specific styling', () => {
    renderWithCoachContext(<CoachSelection />, defaultContextValue)
    
    const eliaCard = screen.getByText('Elia l\'Elefante').closest('.coach-card')
    expect(eliaCard).toHaveStyle({ '--coach-primary': '#8B4513' })
  })

  it('should handle coach selection with Enter key', async () => {
    const user = userEvent.setup()
    renderWithCoachContext(<CoachSelection />, defaultContextValue)
    
    const skippyCard = screen.getByText('Skippy lo Scoiattolo').closest('[role="radio"]')
    skippyCard?.focus()
    
    await user.keyboard('{Enter}')
    expect(mockSelectCoach).toHaveBeenCalledWith('skippy')
  })

  it('should handle coach selection with Space key', async () => {
    const user = userEvent.setup()
    renderWithCoachContext(<CoachSelection />, defaultContextValue)
    
    const lupaCard = screen.getByText('Lupa la Lupa').closest('[role="radio"]')
    lupaCard?.focus()
    
    await user.keyboard(' ')
    expect(mockSelectCoach).toHaveBeenCalledWith('lupa')
  })

  it('should show adaptive features for Polpo', () => {
    renderWithCoachContext(<CoachSelection />, defaultContextValue)
    
    expect(screen.getByText(/adattamento intelligente/i)).toBeInTheDocument()
    expect(screen.getByText(/personalizzazione/i)).toBeInTheDocument()
    expect(screen.getByText(/approccio ibrido/i)).toBeInTheDocument()
  })

  it('should be accessible to screen readers', () => {
    renderWithCoachContext(<CoachSelection />, defaultContextValue)
    
    const radioGroup = screen.getByRole('radiogroup')
    expect(radioGroup).toBeInTheDocument()
    
    // Each coach should have a proper label
    const eliaRadio = screen.getByRole('radio', { name: /elia l'elefante/i })
    expect(eliaRadio).toBeInTheDocument()
    
    const skippyRadio = screen.getByRole('radio', { name: /skippy lo scoiattolo/i })
    expect(skippyRadio).toBeInTheDocument()
  })

  it('should handle different coach contexts', () => {
    const skippyContext = createMockCoachContext('skippy')
    renderWithCoachContext(<CoachSelection />, skippyContext)
    
    const skippyCard = screen.getByText('Skippy lo Scoiattolo').closest('[role="radio"]')
    expect(skippyCard).toHaveAttribute('aria-checked', 'true')
    
    const eliaCard = screen.getByText('Elia l\'Elefante').closest('[role="radio"]')
    expect(eliaCard).toHaveAttribute('aria-checked', 'false')
  })
})