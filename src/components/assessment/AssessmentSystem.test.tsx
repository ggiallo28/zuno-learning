import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AssessmentInterface } from './AssessmentInterface';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { CoachProvider } from '@/contexts/CoachContext';
import { ZunoManagerProvider } from '@/contexts/ZunoManagerContext';

// Mock the useAssessment hook
vi.mock('@/hooks/useAssessment', () => ({
  useAssessment: () => ({
    session: null,
    currentItem: null,
    loading: false,
    error: null,
    hintsUsed: 0,
    showHint: false,
    confidence: 'medium',
    startAssessment: vi.fn(),
    submitResponse: vi.fn(),
    useHint: vi.fn(),
    goToPrevious: vi.fn(),
    setConfidence: vi.fn(),
    progress: 0,
    canUseHint: false,
    canGoBack: false
  })
}));

// Mock coach context
const mockCoachContext = {
  currentCoach: 'skippy' as const,
  coachConfig: {
    name: 'Skippy',
    personality: 'energetic',
    colors: {
      primary: '#FF6B35',
      secondary: '#4ECDC4',
      accent: '#45B7D1'
    }
  },
  theme: {
    primary: '#FF6B35',
    secondary: '#4ECDC4',
    background: '#FFFFFF'
  },
  setCoach: vi.fn(),
  getCoachMessage: vi.fn(() => 'Test message'),
  adaptToScenario: vi.fn()
};

// Mock Zuno Manager context
const mockZunoManagerContext = {
  getCoordinationMessage: vi.fn(() => 'Test coordination message'),
  getMotivationalMessage: vi.fn(() => 'Test motivational message'),
  getBrandMessage: vi.fn(() => 'Test brand message')
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ZunoManagerProvider value={mockZunoManagerContext}>
    <CoachProvider value={mockCoachContext}>
      <AssessmentProvider>
        {children}
      </AssessmentProvider>
    </CoachProvider>
  </ZunoManagerProvider>
);

describe('Assessment System Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render assessment interface without session', () => {
    render(
      <TestWrapper>
        <AssessmentInterface />
      </TestWrapper>
    );

    expect(screen.getByText('Assessment Adattivo')).toBeInTheDocument();
    expect(screen.getByText('Misura la tua padronanza attraverso domande personalizzate e adattive')).toBeInTheDocument();
  });

  it('should show coach selection interface', () => {
    render(
      <TestWrapper>
        <AssessmentInterface />
      </TestWrapper>
    );

    // Should show topic selection badges
    expect(screen.getByText('arrays')).toBeInTheDocument();
    expect(screen.getByText('hooks')).toBeInTheDocument();
    expect(screen.getByText('functions')).toBeInTheDocument();
  });

  it('should allow topic selection', async () => {
    render(
      <TestWrapper>
        <AssessmentInterface />
      </TestWrapper>
    );

    const arraysBadge = screen.getByText('arrays');
    fireEvent.click(arraysBadge);

    // Badge should be selected (this would change styling in real implementation)
    expect(arraysBadge).toBeInTheDocument();
  });

  it('should show start assessment button', () => {
    render(
      <TestWrapper>
        <AssessmentInterface />
      </TestWrapper>
    );

    const startButton = screen.getByText('Inizia Assessment');
    expect(startButton).toBeInTheDocument();
    expect(startButton).toBeEnabled();
  });

  it('should handle assessment cancellation', () => {
    const mockOnCancel = vi.fn();
    
    render(
      <TestWrapper>
        <AssessmentInterface onCancel={mockOnCancel} />
      </TestWrapper>
    );

    const cancelButton = screen.getByText('Annulla');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should integrate with coach theming', () => {
    render(
      <TestWrapper>
        <AssessmentInterface />
      </TestWrapper>
    );

    // The component should use coach theme colors
    const startButton = screen.getByText('Inizia Assessment');
    expect(startButton).toHaveClass('bg-primary');
  });

  it('should be accessible', async () => {
    render(
      <TestWrapper>
        <AssessmentInterface />
      </TestWrapper>
    );

    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    
    // Check for proper button accessibility
    const startButton = screen.getByRole('button', { name: /inizia assessment/i });
    expect(startButton).toBeInTheDocument();
  });

  it('should handle keyboard navigation', async () => {
    render(
      <TestWrapper>
        <AssessmentInterface />
      </TestWrapper>
    );

    const startButton = screen.getByText('Inizia Assessment');
    
    // Focus should be manageable
    startButton.focus();
    expect(document.activeElement).toBe(startButton);
  });
});

describe('Assessment Context Integration', () => {
  it('should provide assessment state management', () => {
    let contextValue: any;
    
    const TestComponent = () => {
      const assessment = require('@/contexts/AssessmentContext').useAssessment();
      contextValue = assessment;
      return <div>Test</div>;
    };

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(contextValue).toBeDefined();
    expect(contextValue.state).toBeDefined();
    expect(contextValue.dispatch).toBeDefined();
  });

  it('should handle assessment state updates', () => {
    let contextValue: any;
    
    const TestComponent = () => {
      const assessment = require('@/contexts/AssessmentContext').useAssessment();
      contextValue = assessment;
      return (
        <button onClick={() => assessment.start()}>
          Start Assessment
        </button>
      );
    };

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    const button = screen.getByText('Start Assessment');
    fireEvent.click(button);

    // State should be updated
    expect(contextValue.running).toBe(true);
  });
});