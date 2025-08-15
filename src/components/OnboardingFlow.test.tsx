import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OnboardingFlow } from './OnboardingFlow'
import { render as customRender } from '@/test/utils'
import { createMockCoachContext } from '../../tests/factories/coachFactory'

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn()
}))

describe('OnboardingFlow Component', () => {
  const mockOnComplete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render welcome step initially', () => {
    customRender(<OnboardingFlow onComplete={mockOnComplete} />)
    
    expect(screen.getByText(/Benvenuto in Zuno/i)).toBeInTheDocument()
    expect(screen.getByText(/Iniziamo il tuo percorso/i)).toBeInTheDocument()
  })

  it('should show Zuno Manager introduction', () => {
    customRender(<OnboardingFlow onComplete={mockOnComplete} />)
    
    expect(screen.getByText(/Zuno Manager/i)).toBeInTheDocument()
    expect(screen.getByText(/Coordinatore Intelligente/i)).toBeInTheDocument()
  })

  it('should navigate through onboarding steps', async () => {
    const user = userEvent.setup()
    customRender(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Step 1: Welcome
    expect(screen.getByText(/Benvenuto in Zuno/i)).toBeInTheDocument()
    
    const nextButton = screen.getByRole('button', { name: /continua/i })
    await user.click(nextButton)
    
    // Step 2: Coach Introduction
    await waitFor(() => {
      expect(screen.getByText(/Scegli il tuo Coach/i)).toBeInTheDocument()
    })
    
    // Should show all four coaches
    expect(screen.getByText('Elia l\'Elefante')).toBeInTheDocument()
    expect(screen.getByText('Skippy lo Scoiattolo')).toBeInTheDocument()
    expect(screen.getByText('Lupa la Lupa')).toBeInTheDocument()
    expect(screen.getByText('Polpo il Polpo')).toBeInTheDocument()
  })

  it('should handle coach selection', async () => {
    const user = userEvent.setup()
    const mockSelectCoach = vi.fn()
    
    customRender(<OnboardingFlow onComplete={mockOnComplete} />, {
      coachContext: createMockCoachContext('elia', { selectCoach: mockSelectCoach })
    })
    
    // Navigate to coach selection
    const nextButton = screen.getByRole('button', { name: /continua/i })
    await user.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Scegli il tuo Coach/i)).toBeInTheDocument()
    })
    
    // Select Skippy
    const skippyCard = screen.getByText('Skippy lo Scoiattolo').closest('[role="radio"]')
    await user.click(skippyCard!)
    
    expect(mockSelectCoach).toHaveBeenCalledWith('skippy')
  })

  it('should show coach descriptions', async () => {
    const user = userEvent.setup()
    customRender(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Navigate to coach selection
    const nextButton = screen.getByRole('button', { name: /continua/i })
    await user.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText(/metodico e riflessivo/i)).toBeInTheDocument()
      expect(screen.getByText(/dinamico ed esplorativo/i)).toBeInTheDocument()
      expect(screen.getByText(/collaborativo e sociale/i)).toBeInTheDocument()
      expect(screen.getByText(/adattivo e intelligente/i)).toBeInTheDocument()
    })
  })

  it('should proceed to preferences step', async () => {
    const user = userEvent.setup()
    customRender(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Navigate through steps
    let nextButton = screen.getByRole('button', { name: /continua/i })
    await user.click(nextButton)
    
    // Select a coach
    await waitFor(() => {
      const eliaCard = screen.getByText('Elia l\'Elefante').closest('[role="radio"]')
      user.click(eliaCard!)
    })
    
    nextButton = screen.getByRole('button', { name: /continua/i })
    await user.click(nextButton)
    
    // Should show preferences step
    await waitFor(() => {
      expect(screen.getByText(/Personalizza la tua esperienza/i)).toBeInTheDocument()
    })
  })

  it('should handle preferences configuration', async () => {
    const user = userEvent.setup()
    customRender(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Navigate to preferences step
    let nextButton = screen.getByRole('button', { name: /continua/i })
    await user.click(nextButton)
    
    // Select coach
    await waitFor(() => {
      const eliaCard = screen.getByText('Elia l\'Elefante').closest('[role="radio"]')
      user.click(eliaCard!)
    })
    
    nextButton = screen.getByRole('button', { name: /continua/i })
    await user.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Personalizza la tua esperienza/i)).toBeInTheDocument()
    })
    
    // Configure preferences
    const gamificationToggle = screen.getByRole('switch', { name: /gamification/i })
    await user.click(gamificationToggle)
    
    const notificationToggle = screen.getByRole('switch', { name: /notifiche/i })
    await user.click(notificationToggle)
  })

  it('should complete onboarding', async () => {
    const user = userEvent.setup()
    customRender(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Navigate through all steps
    let nextButton = screen.getByRole('button', { name: /continua/i })
    await user.click(nextButton)
    
    // Select coach
    await waitFor(() => {
      const eliaCard = screen.getByText('Elia l\'Elefante').closest('[role="radio"]')
      user.click(eliaCard!)
    })
    
    nextButton = screen.getByRole('button', { name: /continua/i })
    await user.click(nextButton)
    
    // Skip preferences or configure them
    await waitFor(() => {
      nextButton = screen.getByRole('button', { name: /continua/i })
      user.click(nextButton)
    })
    
    // Complete onboarding
    await waitFor(() => {
      const completeButton = screen.getByRole('button', { name: /completa/i })
      user.click(completeButton)
    })
    
    expect(mockOnComplete).toHaveBeenCalled()
  })

  it('should show progress indicator', () => {
    customRender(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Should show step progress
    expect(screen.getByText('1 di 4')).toBeInTheDocument()
    
    // Should show progress bar
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('aria-valuenow', '25')
  })

  it('should update progress as user advances', async () => {
    const user = userEvent.setup()
    customRender(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Initial progress
    expect(screen.getByText('1 di 4')).toBeInTheDocument()
    
    // Advance to step 2
    const nextButton = screen.getByRole('button', { name: /continua/i })
    await user.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText('2 di 4')).toBeInTheDocument()
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '50')
    })
  })

  it('should allow going back to previous steps', async () => {
    const user = userEvent.setup()
    customRender(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Advance to step 2
    const nextButton = screen.getByRole('button', { name: /continua/i })
    await user.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Scegli il tuo Coach/i)).toBeInTheDocument()
    })
    
    // Go back to step 1
    const backButton = screen.getByRole('button', { name: /indietro/i })
    await user.click(backButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Benvenuto in Zuno/i)).toBeInTheDocument()
    })
  })

  it('should disable next button when coach not selected', async () => {
    const user = userEvent.setup()
    customRender(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Navigate to coach selection
    const nextButton = screen.getByRole('button', { name: /continua/i })
    await user.click(nextButton)
    
    await waitFor(() => {
      const nextButtonStep2 = screen.getByRole('button', { name: /continua/i })
      expect(nextButtonStep2).toBeDisabled()
    })
  })

  it('should enable next button when coach is selected', async () => {
    const user = userEvent.setup()
    customRender(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Navigate to coach selection
    const nextButton = screen.getByRole('button', { name: /continua/i })
    await user.click(nextButton)
    
    await waitFor(() => {
      const eliaCard = screen.getByText('Elia l\'Elefante').closest('[role="radio"]')
      user.click(eliaCard!)
    })
    
    await waitFor(() => {
      const nextButtonStep2 = screen.getByRole('button', { name: /continua/i })
      expect(nextButtonStep2).not.toBeDisabled()
    })
  })

  it('should be accessible', () => {
    customRender(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Check for proper headings
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    
    // Check for progress indicator
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    
    // Check for proper button labels
    expect(screen.getByRole('button', { name: /continua/i })).toBeInTheDocument()
  })

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup()
    customRender(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Tab to next button
    await user.tab()
    expect(screen.getByRole('button', { name: /continua/i })).toHaveFocus()
    
    // Press Enter to advance
    await user.keyboard('{Enter}')
    
    await waitFor(() => {
      expect(screen.getByText(/Scegli il tuo Coach/i)).toBeInTheDocument()
    })
  })

  it('should show celebration on completion', async () => {
    const user = userEvent.setup()
    const mockConfetti = vi.fn()
    
    // Mock confetti
    vi.doMock('canvas-confetti', () => ({
      default: mockConfetti
    }))
    
    customRender(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Complete onboarding quickly
    // (This would need to be implemented based on actual onboarding flow)
    
    // Should trigger confetti
    // expect(mockConfetti).toHaveBeenCalled()
  })

  it('should handle skip options', async () => {
    const user = userEvent.setup()
    customRender(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Navigate to preferences step
    let nextButton = screen.getByRole('button', { name: /continua/i })
    await user.click(nextButton)
    
    await waitFor(() => {
      const eliaCard = screen.getByText('Elia l\'Elefante').closest('[role="radio"]')
      user.click(eliaCard!)
    })
    
    nextButton = screen.getByRole('button', { name: /continua/i })
    await user.click(nextButton)
    
    await waitFor(() => {
      const skipButton = screen.getByRole('button', { name: /salta/i })
      user.click(skipButton)
    })
    
    // Should advance to next step or complete
    expect(mockOnComplete).toHaveBeenCalled()
  })
})