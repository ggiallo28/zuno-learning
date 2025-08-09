import { client } from '../lib/graphql';
import { createZunoEntryWithMetadata } from '../api/graphql/customMutations';
import type { ZunoEntryTypeValues } from '../types';
import type { GraphQLResult } from '@aws-amplify/api-graphql';

interface CreateAssessmentParams {
  userId: string;
  assessmentType: 'initial' | 'progress' | 'focus_check';
  subjectArea?: string;
  questionsData: any[];
  answersData?: any[];
  score?: number;
  identifiedGaps: string[];
  recommendations: string[];
}

async function createAssessment(params: CreateAssessmentParams): Promise<{ success: boolean; assessmentId: string }> {
  try {
    const assessmentId = `${params.userId}_assessment_${Date.now()}`;
    
    const response = await client.graphql({
      query: createZunoEntryWithMetadata,
      variables: {
        input: {
          id: assessmentId,
          userId: params.userId,
          entryType: 'ASSESSMENT_RESULT' as ZunoEntryTypeValues,
          timestamp: new Date().toISOString(),
          metadata: {
            assessmentResult: {
              score: params.score || 0,
              passed: (params.score || 0) >= 70
            },
            assessmentDefinition: {
              title: `${params.assessmentType.replace('_', ' ')} Assessment`,
              description: `Assessment for ${params.subjectArea || 'general knowledge'}`,
              difficulty: 'BEGINNER',
              passingScore: 70,
              totalScore: 100,
              estimatedDuration: 30,
              gradingMode: 'AUTO',
              objectives: params.recommendations,
              randomizeQuestions: true,
              allowRetry: true,
              maxAttempts: 3,
              resourceItems: []
            },
            userActivity: {
              activityType: 'ASSESSMENT_COMPLETION',
              description: `Completed ${params.assessmentType} assessment with score ${params.score || 0}%`,
              activityDate: new Date().toISOString().split('T')[0]
            }
          }
        }
      }
    }) as GraphQLResult<any>;

    if (response.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
    }

    return {
      success: true,
      assessmentId
    };
  } catch (error) {
    console.error('Error creating assessment:', error);
    throw error;
  }
}

export default createAssessment;