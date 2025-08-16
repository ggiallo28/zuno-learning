import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QuizSystem } from './QuizSystem';
import React from 'react';

// Create a test wrapper that provides the required contexts
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  // Mock context values
  const mockZunoManager = {
    getCoordinationMessage: () => 'Great job on the quiz!',
    personality: {
      name: 'Zuno Manager',
      role: 'Learning Coordinator',
      description: 'Master assistant',
      characteristics: [],
      coordinationStyle: 'supportive',
      guidanceApproach: 'adaptive'
    }
  };

  const mockCoach = {
    currentCoach: 'elia' as const,
    coachConfig: {
      id: 'elia',
      coachName: 'ELIA' as any,
      displayName: 'Elia the Elephant',
      description: 'Deep learning coach',
      learningStyle: 'methodical',
      primaryColor: '#8B4513',
      secondaryColor: '#D2B48C',
      accentColor: '#F5F5DC',
      iconStyle: 'solid',
      personalityTraits: ['patient', 'thorough'],
      motivationMessages: ['Take your time']
    },
    theme: {
      primary: '#8B4513',
      secondary: '#D2B48C',
      accent: '#F5F5DC',
      background: '#FFFFFF',
      text: '#000000',
      muted: '#666666'
    },
    setCoach: vi.fn(),
    getCoachMessage: vi.fn()
  };

  return React.createElement(
    'div',
    { 'data-testid': 'test-wrapper' },
    React.cloneElement(children as React.ReactElement, {
      // Pass mock context values as props if needed
    })
  );
};

describe('QuizSystem', () => {
  const mockQuestions = [
    {
      id: '1',
      questionText: 'What is 2 + 2?',
      possibilities: [
        { text: '3', isCorrect: false },
        { text: '4', isCorrect: true },
        { text: '5', isCorrect: false }
      ]
    },
    {
      id: '2',
      questionText: 'What is the capital of France?',
      possibilities: [
        { text: 'London', isCorrect: false },
        { text: 'Paris', isCorrect: true },
        { text: 'Berlin', isCorrect: false }
      ]
    }
  ];

  const mockOnQuizComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseZunoManager.mockReturnValue({
      getCoordinationMessage: mockGetCoordinationMessage.mockReturnValue('Great job on the quiz!'),
      personality: {
        name: 'Zuno Manager',
        role: 'Learning Coordinator',
        description: 'Master assistant',
        characteristics: [],
        coordinationStyle: 'supportive',
        guidanceApproach: 'adaptive'
      }
    });

    mockUseCoach.mockReturnValue({
      currentCoach: 'elia',
      coachConfig: {
        id: 'elia',
        coachName: 'ELIA' as any,
        displayName: 'Elia the Elephant',
        description: 'Deep learning coach',
        learningStyle: 'methodical',
        primaryColor: '#8B4513',
        secondaryColor: '#D2B48C',
        accentColor: '#F5F5DC',
        iconStyle: 'solid',
        personalityTraits: ['patient', 'thorough'],
        motivationMessages: ['Take your time']
      },
      theme: {
        primary: '#8B4513',
        secondary: '#D2B48C',
        accent: '#F5F5DC',
        background: '#FFFFFF',
        text: '#000000',
        muted: '#666666'
      },
      setCoach: vi.fn(),
      getCoachMessage: vi.fn()
    });
  });

  it('renders quiz questions correctly', () => {
    render(
      <QuizSystem
        lessonId="lesson-1"
        questions={mockQuestions}
        onQuizComplete={mockOnQuizComplete}
      />
    );

    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('allows selecting answers', async () => {
    render(
      <QuizSystem
        lessonId="lesson-1"
        questions={mockQuestions}
        onQuizComplete={mockOnQuizComplete}
      />
    );

    const correctAnswer = screen.getByText('4');
    fireEvent.click(correctAnswer);

    await waitFor(() => {
      expect(correctAnswer.closest('button')).toHaveClass('bg-primary');
    });
  });

  it('progresses through questions', async () => {
    render(
      <QuizSystem
        lessonId="lesson-1"
        questions={mockQuestions}
        onQuizComplete={mockOnQuizComplete}
      />
    );

    // Answer first question
    fireEvent.click(screen.getByText('4'));
    fireEvent.click(screen.getByText('Next Question'));

    await waitFor(() => {
      expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
      expect(screen.getByText('Question 2 of 2')).toBeInTheDocument();
    });
  });

  it('completes quiz and shows results', async () => {
    render(
      <QuizSystem
        lessonId="lesson-1"
        questions={mockQuestions}
        onQuizComplete={mockOnQuizComplete}
      />
    );

    // Answer first question correctly
    fireEvent.click(screen.getByText('4'));
    fireEvent.click(screen.getByText('Next Question'));

    await waitFor(() => {
      expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
    });

    // Answer second question correctly
    fireEvent.click(screen.getByText('Paris'));
    fireEvent.click(screen.getByText('Complete Quiz'));

    await waitFor(() => {
      expect(mockOnQuizComplete).toHaveBeenCalledWith(
        2, // score
        2, // total questions
        expect.objectContaining({
          '1': '4',
          '2': 'Paris'
        }) // answers
      );
    });
  });

  it('shows Zuno Manager coordination message', () => {
    render(
      <QuizSystem
        lessonId="lesson-1"
        questions={mockQuestions}
        onQuizComplete={mockOnQuizComplete}
      />
    );

    expect(screen.getByText('Zuno Manager')).toBeInTheDocument();
    expect(screen.getByText('Great job on the quiz!')).toBeInTheDocument();
  });

  it('handles empty questions gracefully', () => {
    render(
      <QuizSystem
        lessonId="lesson-1"
        questions={[]}
        onQuizComplete={mockOnQuizComplete}
      />
    );

    expect(screen.getByText('No Quiz Questions Available')).toBeInTheDocument();
    expect(screen.getByText("This lesson doesn't have any quiz questions yet.")).toBeInTheDocument();
  });

  it('disables next button when no answer is selected', () => {
    render(
      <QuizSystem
        lessonId="lesson-1"
        questions={mockQuestions}
        onQuizComplete={mockOnQuizComplete}
      />
    );

    const nextButton = screen.getByText('Next Question');
    expect(nextButton).toBeDisabled();
  });

  it('enables next button when answer is selected', async () => {
    render(
      <QuizSystem
        lessonId="lesson-1"
        questions={mockQuestions}
        onQuizComplete={mockOnQuizComplete}
      />
    );

    fireEvent.click(screen.getByText('4'));

    await waitFor(() => {
      const nextButton = screen.getByText('Next Question');
      expect(nextButton).not.toBeDisabled();
    });
  });
});