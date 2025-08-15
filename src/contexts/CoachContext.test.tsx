import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CoachProvider, useCoach } from './CoachContext'
import type { CoachType } from '@/types'

// Test component to use the context
const TestComponent: React.FC = () => {
  const {
    selectedCoach,
    coachPersonality,
    selectCoach,
    getCoachTheme,
    getCoachMessage,
    isCoachSelected
  } = useCoach()

  return (
    <div>
      <div data-testid="selected-coach">{selectedCoach}</div>
      <div data-testid="coach-name">{coachPersonality?.name}</div>
      <div data-testid="coach-approach">{coachPersonality?.approach}</div>
      <button 
        data-testid="select-skippy" 
        onClick={() => selectCoach('skippy')}
      >
        Select Skippy
      </button>
      <button 
        data-testid="select-lupa" 
        onClick={() => selectCoach('lupa')}
      >
        Select Lupa
      </button>
      <div data-testid="theme-primary">
        {getCoachTheme().primary}
      </div>
      <div data-testid="coach-message">
        {getCoachMessage('lesson', { lessonTitle: 'Test Lesson' })}
      </div>
      <div data-testid="is-elia-selected">
        {isCoachSelected('elia').toString()}
      </div>
    </div>
  )
}

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true
})

describe('CoachContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  it('should provide default coach (elia) when no stored preference', () => {
    render(
      <CoachProvider>
        <TestComponent />
      </CoachProvider>
    )

    expect(screen.getByTestId('selected-coach')).toHaveTextContent('elia')
    expect(screen.getByTestId('coach-name')).toHaveTextContent('Elia')
    expect(screen.getByTestId('coach-approach')).toHaveTextContent('deep')
  })

  it('should load stored coach preference from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('skippy')

    render(
      <CoachProvider>
        <TestComponent />
      </CoachProvider>
    )

    expect(screen.getByTestId('selected-coach')).toHaveTextContent('skippy')
    expect(screen.getByTestId('coach-name')).toHaveTextContent('Skippy')
    expect(screen.getByTestId('coach-approach')).toHaveTextContent('fast')
  })

  it('should allow coach selection and persist to localStorage', async () => {
    const user = userEvent.setup()

    render(
      <CoachProvider>
        <TestComponent />
      </CoachProvider>
    )

    // Initially Elia
    expect(screen.getByTestId('selected-coach')).toHaveTextContent('elia')

    // Select Skippy
    await user.click(screen.getByTestId('select-skippy'))

    expect(screen.getByTestId('selected-coach')).toHaveTextContent('skippy')
    expect(screen.getByTestId('coach-name')).toHaveTextContent('Skippy')
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('selectedCoach', 'skippy')
  })

  it('should provide correct coach themes', () => {
    render(
      <CoachProvider>
        <TestComponent />
      </CoachProvider>
    )

    // Elia's theme (default)
    expect(screen.getByTestId('theme-primary')).toHaveTextContent('#8B4513')
  })

  it('should update theme when coach changes', async () => {
    const user = userEvent.setup()

    render(
      <CoachProvider>
        <TestComponent />
      </CoachProvider>
    )

    // Initially Elia's theme
    expect(screen.getByTestId('theme-primary')).toHaveTextContent('#8B4513')

    // Select Skippy
    await user.click(screen.getByTestId('select-skippy'))

    // Should now show Skippy's theme
    expect(screen.getByTestId('theme-primary')).toHaveTextContent('#FF6347')
  })

  it('should provide contextual coach messages', () => {
    render(
      <CoachProvider>
        <TestComponent />
      </CoachProvider>
    )

    const message = screen.getByTestId('coach-message').textContent
    expect(message).toContain('Test Lesson')
    expect(message).toBeTruthy()
  })

  it('should correctly identify selected coach', async () => {
    const user = userEvent.setup()

    render(
      <CoachProvider>
        <TestComponent />
      </CoachProvider>
    )

    // Initially Elia is selected
    expect(screen.getByTestId('is-elia-selected')).toHaveTextContent('true')

    // Select Lupa
    await user.click(screen.getByTestId('select-lupa'))

    // Elia should no longer be selected
    expect(screen.getByTestId('is-elia-selected')).toHaveTextContent('false')
  })

  it('should handle all four coaches', async () => {
    const user = userEvent.setup()

    const TestAllCoaches: React.FC = () => {
      const { selectedCoach, selectCoach, coachPersonality } = useCoach()

      return (
        <div>
          <div data-testid="current-coach">{selectedCoach}</div>
          <div data-testid="current-name">{coachPersonality?.name}</div>
          <button onClick={() => selectCoach('elia')}>Elia</button>
          <button onClick={() => selectCoach('skippy')}>Skippy</button>
          <button onClick={() => selectCoach('lupa')}>Lupa</button>
          <button onClick={() => selectCoach('polpo')}>Polpo</button>
        </div>
      )
    }

    render(
      <CoachProvider>
        <TestAllCoaches />
      </CoachProvider>
    )

    const coaches: Array<{ type: CoachType; name: string }> = [
      { type: 'elia', name: 'Elia' },
      { type: 'skippy', name: 'Skippy' },
      { type: 'lupa', name: 'Lupa' },
      { type: 'polpo', name: 'Polpo' }
    ]

    for (const coach of coaches) {
      await user.click(screen.getByText(coach.name))
      expect(screen.getByTestId('current-coach')).toHaveTextContent(coach.type)
      expect(screen.getByTestId('current-name')).toHaveTextContent(coach.name)
    }
  })

  it('should handle invalid coach selection gracefully', () => {
    const TestInvalidCoach: React.FC = () => {
      const { selectCoach } = useCoach()

      return (
        <button onClick={() => selectCoach('invalid' as CoachType)}>
          Invalid Coach
        </button>
      )
    }

    render(
      <CoachProvider>
        <TestInvalidCoach />
      </CoachProvider>
    )

    // Should not throw error
    expect(() => {
      screen.getByText('Invalid Coach').click()
    }).not.toThrow()
  })

  it('should provide adaptive state for Polpo coach', async () => {
    const user = userEvent.setup()

    const TestAdaptiveState: React.FC = () => {
      const { selectedCoach, selectCoach, adaptiveState } = useCoach()

      return (
        <div>
          <div data-testid="current-coach">{selectedCoach}</div>
          <div data-testid="adaptive-mode">{adaptiveState?.currentMode}</div>
          <button onClick={() => selectCoach('polpo')}>Select Polpo</button>
        </div>
      )
    }

    render(
      <CoachProvider>
        <TestAdaptiveState />
      </CoachProvider>
    )

    await user.click(screen.getByText('Select Polpo'))

    expect(screen.getByTestId('current-coach')).toHaveTextContent('polpo')
    expect(screen.getByTestId('adaptive-mode')).toHaveTextContent('balanced')
  })

  it('should throw error when used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useCoach must be used within a CoachProvider')

    consoleSpy.mockRestore()
  })

  it('should handle localStorage errors gracefully', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage error')
    })

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <CoachProvider>
        <TestComponent />
      </CoachProvider>
    )

    // Should still render with default coach
    expect(screen.getByTestId('selected-coach')).toHaveTextContent('elia')
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('should update CSS custom properties when coach changes', async () => {
    const user = userEvent.setup()

    // Mock document.documentElement.style.setProperty
    const setPropertySpy = vi.spyOn(document.documentElement.style, 'setProperty')

    render(
      <CoachProvider>
        <TestComponent />
      </CoachProvider>
    )

    await user.click(screen.getByTestId('select-skippy'))

    expect(setPropertySpy).toHaveBeenCalledWith('--coach-primary', '#FF6347')
    expect(setPropertySpy).toHaveBeenCalledWith('--coach-secondary', '#98FB98')
    expect(setPropertySpy).toHaveBeenCalledWith('--coach-accent', '#F5DEB3')

    setPropertySpy.mockRestore()
  })
})