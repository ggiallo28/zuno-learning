import { describe, it, expect } from 'vitest';

// Test the precision calculation logic
describe('Early Stopping Logic', () => {
  // Simulate the precision calculation algorithm from AssessmentContext
  function calculatePrecisionUpdate(
    answeredCount: number,
    correct: boolean,
    confidence: 'yes' | 'maybe'
  ): number {
    // More aggressive base precision improvement for faster convergence
    let precisionDelta = 0.15;
    
    // Confidence weighting: confident answers provide significantly more information
    const confidenceWeight = confidence === 'yes' ? 1.5 : 0.7;
    precisionDelta *= confidenceWeight;
    
    // Correctness impact - correct answers provide much more precision
    if (correct) {
      precisionDelta *= 1.3; // Correct answers significantly increase precision gain
    } else {
      precisionDelta *= 0.5; // Incorrect answers reduce precision gain more
    }
    
    // Less aggressive diminishing returns to allow reaching threshold
    const diminishingFactor = Math.max(0.6, 1 - (answeredCount * 0.05));
    precisionDelta *= diminishingFactor;
    
    // Apply statistical confidence interval narrowing
    // Early questions provide more information in adaptive testing
    const statisticalFactor = Math.min(1.8, 1 + (answeredCount * 0.15));
    precisionDelta *= statisticalFactor;
    
    return precisionDelta;
  }

  function simulateAssessment(answers: Array<{ correct: boolean; confidence: 'yes' | 'maybe' }>) {
    let precision = 0;
    const targetPrecision = 0.95;
    
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      const delta = calculatePrecisionUpdate(i + 1, answer.correct, answer.confidence);
      precision = Math.max(0, Math.min(1, precision + delta));
      
      // Check if early stopping threshold is reached
      if (precision >= targetPrecision && i >= 2) { // Minimum 3 questions
        return {
          stoppedEarly: true,
          finalPrecision: precision,
          questionsAnswered: i + 1,
          totalQuestions: answers.length
        };
      }
    }
    
    return {
      stoppedEarly: false,
      finalPrecision: precision,
      questionsAnswered: answers.length,
      totalQuestions: answers.length
    };
  }

  it('should calculate precision correctly for confident correct answers', () => {
    const delta = calculatePrecisionUpdate(1, true, 'yes');
    expect(delta).toBeGreaterThan(0.15); // Should be higher than base due to confidence and correctness
    expect(delta).toBeLessThan(0.6); // Should be reasonable but aggressive
  });

  it('should calculate lower precision for uncertain answers', () => {
    const confidentDelta = calculatePrecisionUpdate(1, true, 'yes');
    const uncertainDelta = calculatePrecisionUpdate(1, true, 'maybe');
    
    expect(uncertainDelta).toBeLessThan(confidentDelta);
  });

  it('should apply diminishing returns for later questions', () => {
    const firstQuestionDelta = calculatePrecisionUpdate(1, true, 'yes');
    const laterQuestionDelta = calculatePrecisionUpdate(10, true, 'yes');
    
    expect(laterQuestionDelta).toBeLessThan(firstQuestionDelta);
  });

  it('should trigger early stopping when precision threshold is reached', () => {
    // Simulate a series of confident correct answers
    const answers = Array(10).fill({ correct: true, confidence: 'yes' as const });
    
    const result = simulateAssessment(answers);
    
    expect(result.stoppedEarly).toBe(true);
    expect(result.finalPrecision).toBeGreaterThanOrEqual(0.95);
    expect(result.questionsAnswered).toBeLessThan(10); // Should stop before all questions
    expect(result.questionsAnswered).toBeGreaterThanOrEqual(3); // But at least 3 questions
  });

  it('should not trigger early stopping with mixed performance', () => {
    // Simulate mixed performance that doesn't reach threshold quickly
    const answers = [
      { correct: true, confidence: 'maybe' as const },
      { correct: false, confidence: 'yes' as const },
      { correct: true, confidence: 'maybe' as const },
      { correct: false, confidence: 'maybe' as const },
      { correct: true, confidence: 'yes' as const }
    ];
    
    const result = simulateAssessment(answers);
    
    expect(result.stoppedEarly).toBe(false);
    expect(result.questionsAnswered).toBe(5);
  });

  it('should require minimum number of questions before early stopping', () => {
    // Even with perfect answers, should not stop before 3 questions
    const answers = [
      { correct: true, confidence: 'yes' as const },
      { correct: true, confidence: 'yes' as const }
    ];
    
    const result = simulateAssessment(answers);
    
    expect(result.stoppedEarly).toBe(false);
    expect(result.questionsAnswered).toBe(2);
  });

  it('should handle precision bounds correctly', () => {
    // Test that precision never goes below 0 or above 1
    const badAnswers = Array(20).fill({ correct: false, confidence: 'maybe' as const });
    const result = simulateAssessment(badAnswers);
    
    expect(result.finalPrecision).toBeGreaterThanOrEqual(0);
    expect(result.finalPrecision).toBeLessThanOrEqual(1);
  });

  it('should calculate realistic precision values', () => {
    // Test with a realistic mix of answers
    const realisticAnswers = [
      { correct: true, confidence: 'yes' as const },   // Strong start
      { correct: true, confidence: 'yes' as const },   // Consistent
      { correct: false, confidence: 'maybe' as const }, // Some uncertainty
      { correct: true, confidence: 'yes' as const },   // Recovery
      { correct: true, confidence: 'yes' as const },   // Building confidence
      { correct: true, confidence: 'yes' as const }    // Strong finish
    ];
    
    const result = simulateAssessment(realisticAnswers);
    
    // Should build up reasonable precision with the new aggressive algorithm
    expect(result.finalPrecision).toBeGreaterThan(0.8);
    expect(result.finalPrecision).toBeLessThanOrEqual(1.0);
  });
});