import { client } from '../lib/graphql';
import { zunoEntriesByUserWithMetadata } from '../api/graphql/customQueries';
import type { ZunoEntryTypeValues, ZunoEntry } from '../types';
import type { GraphQLResult } from '@aws-amplify/api-graphql';

interface Assessment {
  id: string;
  user_id: string;
  assessment_type: 'initial' | 'progress' | 'focus_check';
  subject_area?: string;
  questions_data: any[];
  answers_data?: any[];
  score?: number;
  identified_gaps: string[];
  recommendations: string[];
  completed_at?: string;
  created_at: string;
}

async function loadUserAssessments(userId: string, limit: number = 10): Promise<Assessment[]> {
  try {
    const response = await client.graphql({
      query: zunoEntriesByUserWithMetadata,
      variables: {
        userId,
        entryTypeTimestamp: {
          beginsWith: {
            entryType: 'ASSESSMENT_RESULT' as ZunoEntryTypeValues
          }
        },
        limit
      }
    }) as GraphQLResult<any>;

    const items = response.data?.zunoEntriesByUserIdAndEntryTypeAndTimestamp?.items || [];
    
    const assessments: Assessment[] = items
      .filter((item: ZunoEntry | null) => item?.metadata?.assessmentResult)
      .map((item: ZunoEntry) => {
        const assessmentResult = item.metadata?.assessmentResult;
        const assessmentDefinition = item.metadata?.assessmentDefinition;
        // const userActivity = item.metadata?.userActivity;
        
        // Extract assessment type from activity description or title
        let assessmentType: 'initial' | 'progress' | 'focus_check' = 'initial';
        if (assessmentDefinition?.title?.toLowerCase().includes('progress')) {
          assessmentType = 'progress';
        } else if (assessmentDefinition?.title?.toLowerCase().includes('focus')) {
          assessmentType = 'focus_check';
        }

        return {
          id: item.id,
          user_id: item.userId || '',
          assessment_type: assessmentType,
          subject_area: assessmentDefinition?.description?.replace('Assessment for ', '') || undefined,
          questions_data: [], // Would need to be stored separately in a real implementation
          answers_data: [], // Would need to be stored separately in a real implementation
          score: assessmentResult?.score || 0,
          identified_gaps: assessmentDefinition?.objectives || [],
          recommendations: assessmentDefinition?.objectives || [],
          completed_at: item.timestamp,
          created_at: item.createdAt || item.timestamp || new Date().toISOString()
        };
      });

    return assessments.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    console.error('Error loading user assessments:', error);
    return [];
  }
}

export default loadUserAssessments;