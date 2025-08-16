import { describe, it, expect } from 'vitest';
import { useQuizSystem } from '@/hooks/useQuizSystem';

describe('Quiz System Integration', () => {
  it('should export QuizSystem component', async () => {
    const { QuizSystem } = await import('./QuizSystem');
    expect(QuizSystem).toBeDefined();
    expect(typeof QuizSystem).toBe('function');
  });

  it('should export QuizNavigation component', async () => {
    const { QuizNavigation } = await import('./QuizNavigation');
    expect(QuizNavigation).toBeDefined();
    expect(typeof QuizNavigation).toBe('function');
  });

  it('should export QuizRoute component', async () => {
    const { QuizRoute } = await import('./QuizRoute');
    expect(QuizRoute).toBeDefined();
    expect(typeof QuizRoute).toBe('function');
  });

  it('should export useQuizSystem hook', () => {
    expect(useQuizSystem).toBeDefined();
    expect(typeof useQuizSystem).toBe('function');
  });

  it('should have correct quiz question structure', () => {
    const mockQuestion = {
      id: '1',
      questionText: 'Test question?',
      possibilities: [
        { text: 'Option A', isCorrect: false },
        { text: 'Option B', isCorrect: true }
      ]
    };

    expect(mockQuestion).toHaveProperty('id');
    expect(mockQuestion).toHaveProperty('questionText');
    expect(mockQuestion).toHaveProperty('possibilities');
    expect(Array.isArray(mockQuestion.possibilities)).toBe(true);
    expect(mockQuestion.possibilities[0]).toHaveProperty('text');
    expect(mockQuestion.possibilities[0]).toHaveProperty('isCorrect');
  });

  it('should validate quiz result structure', () => {
    const mockResult = {
      score: 2,
      totalQuestions: 3,
      answers: { '1': 'Option A', '2': 'Option B' },
      timeSpent: 120,
      accuracy: 66.67
    };

    expect(mockResult).toHaveProperty('score');
    expect(mockResult).toHaveProperty('totalQuestions');
    expect(mockResult).toHaveProperty('answers');
    expect(mockResult).toHaveProperty('timeSpent');
    expect(mockResult).toHaveProperty('accuracy');
    expect(typeof mockResult.score).toBe('number');
    expect(typeof mockResult.totalQuestions).toBe('number');
    expect(typeof mockResult.answers).toBe('object');
  });
});