import { client } from '../lib/graphql';
import { createZunoEntryWithMetadata } from '../api/graphql/customMutations';
import type { ZunoEntryTypeValues } from '../types';
import type { GraphQLResult } from '@aws-amplify/api-graphql';

interface CompleteLessonProgressParams {
  userId: string;
  lessonId: string;
  score: number;
  attempts: number;
  timeSpent: number;
}

async function completeLessonProgress(params: CompleteLessonProgressParams): Promise<{ success: boolean; xpEarned: number }> {
  try {
    const completionId = `${params.userId}_${params.lessonId}_completion_${Date.now()}`;
    
    const response = await client.graphql({
      query: createZunoEntryWithMetadata,
      variables: {
        input: {
          id: completionId,
          userId: params.userId,
          catalogId: params.lessonId,
          entryType: 'LESSON_COMPLETION' as ZunoEntryTypeValues,
          timestamp: new Date().toISOString(),
          metadata: {
            userProgress: {
              totalXpEarned: Math.round(params.score * 10), // Convert score to XP
              completedLessons: 1,
              currentStreak: 1,
              masteryLevel: params.score >= 80 ? 'MASTERED' : 'IN_PROGRESS'
            },
            userActivity: {
              activityType: 'LESSON_COMPLETION',
              description: `Completed lesson ${params.lessonId} with score ${params.score}%`,
              activityDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
            }
          }
        }
      }
    }) as GraphQLResult<any>;

    if (response.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
    }

    const xpEarned = Math.round(params.score * 10);
    
    return {
      success: true,
      xpEarned
    };
  } catch (error) {
    console.error('Error completing lesson progress:', error);
    throw error;
  }
}

export default completeLessonProgress;
