import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PrecisionBar } from './PrecisionBar';
import { AssessmentProvider } from '@/contexts/AssessmentContext';

// Mock the useAssessment hook
const mockAssessmentState = {
  precision: 0.75,
  running: true,
  mode: 'skippy' as const,
  targetPrecision: 0.95,
  timeLimitSec: null,
  elapsedSec: 0,
  currentQuestionId: null,
  selectedOptionId: null,
  confidence: null,
  answered: 3,
  total: 10,
  tags: [],
  peerVote: null,
};

const mockAssessmentAPI = {
  state: mockAssessmentState,
  dispatch: vi.fn(),
  setMode: vi.fn(),
  setTargetPrecision: vi.fn(),
  setTimeLimit: vi.fn(),
  tick: vi.fn(),
  start: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  reset: vi.fn(),
  selectOption: vi.fn(),
  setConfidence: vi.fn(),
  toggleTag: vi.fn(),
  votePeerSnippet: vi.fn(),
  updatePrecision: vi.fn(),
  submitAnswer: vi.fn(),
  get precision() { return mockAssessmentState.precision; },
  get running() { return mockAssessmentState.running; },
};

vi.mock('@/contexts/AssessmentContext', async () => {
  const actual = await vi.importActual('@/contexts/AssessmentContext');
  return {
    ...actual,
    useAssessment: () => mockAssessmentAPI,
  };
});

describe('PrecisionBar', () => {
  it('renders precision percentage correctly', () => {
    render(
      <AssessmentProvider>
        <PrecisionBar />
      </AssessmentProvider>
    );

    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('Precisione')).toBeInTheDocument();
  });

  it('shows threshold reached message when precision meets target', () => {
    // Update mock to show precision at threshold
    mockAssessmentState.precision = 0.95;
    
    render(
      <AssessmentProvider>
        <PrecisionBar stopAt={0.9} />
      </AssessmentProvider>
    );

    expect(screen.getByText(/Soglia raggiunta/)).toBeInTheDocument();
  });

  it('does not show threshold message when precision is below target', () => {
    mockAssessmentState.precision = 0.75;
    
    render(
      <AssessmentProvider>
        <PrecisionBar stopAt={0.9} />
      </AssessmentProvider>
    );

    expect(screen.queryByText(/Soglia raggiunta/)).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <AssessmentProvider>
        <PrecisionBar />
      </AssessmentProvider>
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('uses custom stopAt threshold', () => {
    mockAssessmentState.precision = 0.85;
    
    render(
      <AssessmentProvider>
        <PrecisionBar stopAt={0.8} />
      </AssessmentProvider>
    );

    expect(screen.getByText(/Soglia raggiunta/)).toBeInTheDocument();
  });
});