import { useEffect, useCallback } from 'react';
import { useCoach } from '@/contexts/CoachContext';
import type { UserBehaviorData } from '@/types';

interface UseAdaptiveBehaviorOptions {
  enableAutoAdaptation?: boolean;
  adaptationInterval?: number; // in milliseconds
}

export function useAdaptiveBehavior(options: UseAdaptiveBehaviorOptions = {}) {
  const { 
    currentCoach, 
    adaptPolpoMode, 
    adaptiveState 
  } = useCoach();
  
  const {
    enableAutoAdaptation = true,
    adaptationInterval = 30000 // 30 seconds
  } = options;

  // Simulate user behavior data based on current activity
  const generateBehaviorData = useCallback((): UserBehaviorData => {
    // In a real app, this would come from actual user interaction tracking
    const baseAccuracy = 0.7 + Math.random() * 0.3; // 70-100%
    const baseCompletionRate = 0.6 + Math.random() * 0.4; // 60-100%
    const sessionDuration = 300 + Math.random() * 1200; // 5-25 minutes
    
    return {
      sessionDuration,
      accuracy: baseAccuracy,
      completionRate: baseCompletionRate,
      preferredContentType: ['text', 'video', 'interactive', 'mixed'][Math.floor(Math.random() * 4)] as any,
      strugglingAreas: Math.random() > 0.7 ? ['algebra', 'functions'] : [],
      strongAreas: Math.random() > 0.5 ? ['variables', 'syntax'] : ['basics'],
      socialEngagement: Math.random(),
      timeSpentOnDifficultContent: Math.random(),
      helpSeekingBehavior: ['frequent', 'moderate', 'rare'][Math.floor(Math.random() * 3)] as any
    };
  }, []);

  // Trigger adaptation based on user behavior
  const triggerAdaptation = useCallback((behaviorData?: UserBehaviorData) => {
    if (currentCoach !== 'polpo') return;
    
    const data = behaviorData || generateBehaviorData();
    adaptPolpoMode(data);
  }, [currentCoach, adaptPolpoMode, generateBehaviorData]);

  // Auto-adaptation effect
  useEffect(() => {
    if (!enableAutoAdaptation || currentCoach !== 'polpo') return;

    const interval = setInterval(() => {
      triggerAdaptation();
    }, adaptationInterval);

    return () => clearInterval(interval);
  }, [enableAutoAdaptation, currentCoach, adaptationInterval, triggerAdaptation]);

  // Manual adaptation trigger for specific scenarios
  const adaptToScenario = useCallback((scenario: 'struggling' | 'excelling' | 'social' | 'focused') => {
    if (currentCoach !== 'polpo') return;

    let behaviorData: UserBehaviorData;

    switch (scenario) {
      case 'struggling':
        behaviorData = {
          sessionDuration: 600,
          accuracy: 0.4,
          completionRate: 0.3,
          preferredContentType: 'text',
          strugglingAreas: ['complex_concepts', 'advanced_topics'],
          strongAreas: [],
          socialEngagement: 0.2,
          timeSpentOnDifficultContent: 0.9,
          helpSeekingBehavior: 'frequent'
        };
        break;
      
      case 'excelling':
        behaviorData = {
          sessionDuration: 180,
          accuracy: 0.95,
          completionRate: 0.9,
          preferredContentType: 'interactive',
          strugglingAreas: [],
          strongAreas: ['all_topics'],
          socialEngagement: 0.3,
          timeSpentOnDifficultContent: 0.2,
          helpSeekingBehavior: 'rare'
        };
        break;
      
      case 'social':
        behaviorData = {
          sessionDuration: 450,
          accuracy: 0.75,
          completionRate: 0.7,
          preferredContentType: 'mixed',
          strugglingAreas: ['individual_work'],
          strongAreas: ['group_activities'],
          socialEngagement: 0.9,
          timeSpentOnDifficultContent: 0.5,
          helpSeekingBehavior: 'moderate'
        };
        break;
      
      case 'focused':
        behaviorData = {
          sessionDuration: 900,
          accuracy: 0.85,
          completionRate: 0.8,
          preferredContentType: 'text',
          strugglingAreas: [],
          strongAreas: ['deep_concepts'],
          socialEngagement: 0.1,
          timeSpentOnDifficultContent: 0.8,
          helpSeekingBehavior: 'rare'
        };
        break;
    }

    triggerAdaptation(behaviorData);
  }, [currentCoach, triggerAdaptation]);

  return {
    triggerAdaptation,
    adaptToScenario,
    currentMode: adaptiveState?.currentMode || null,
    adaptationHistory: adaptiveState?.adaptationHistory || []
  };
}

export default useAdaptiveBehavior;