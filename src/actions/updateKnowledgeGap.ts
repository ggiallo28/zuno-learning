import { client } from '../lib/graphql';
import { createZunoEntryWithMetadata } from '../api/graphql/customMutations';
import type { ZunoEntryTypeValues } from '../types';
import type { GraphQLResult } from '@aws-amplify/api-graphql';

interface UpdateKnowledgeGapParams {
  userId: string;
  subjectArea: string;
  conceptName: string;
  confidenceLevel: number;
  masteryStatus: 'unknown' | 'weak' | 'developing' | 'strong' | 'mastered';
}

async function updateKnowledgeGap(params: UpdateKnowledgeGapParams): Promise<{ success: boolean; gapId: string }> {
  try {
    const gapId = `${params.userId}_gap_${params.subjectArea}_${params.conceptName}_${Date.now()}`;
    
    // Convert mastery status to severity for storage
    let severity: string;
    switch (params.masteryStatus) {
      case 'mastered':
        severity = 'none';
        break;
      case 'strong':
        severity = 'low';
        break;
      case 'developing':
        severity = 'medium';
        break;
      case 'weak':
        severity = 'high';
        break;
      default:
        severity = 'unknown';
    }
    
    const response = await client.graphql({
      query: createZunoEntryWithMetadata,
      variables: {
        input: {
          id: gapId,
          userId: params.userId,
          entryType: 'KNOWLEDGE_GAP' as ZunoEntryTypeValues,
          timestamp: new Date().toISOString(),
          metadata: {
            knowledgeGap: {
              subjectArea: params.subjectArea,
              conceptName: params.conceptName,
              severity: severity
            },
            userActivity: {
              activityType: 'KNOWLEDGE_GAP_UPDATE',
              description: `Updated knowledge gap for ${params.conceptName} in ${params.subjectArea}`,
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
      gapId
    };
  } catch (error) {
    console.error('Error updating knowledge gap:', error);
    throw error;
  }
}

export default updateKnowledgeGap;