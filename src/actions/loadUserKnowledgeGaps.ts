import { client } from '../lib/graphql';
import { zunoEntriesByUserWithMetadata } from '../api/graphql/customQueries';
import type { ZunoEntryTypeValues, ZunoEntry } from '../types';
import type { GraphQLResult } from '@aws-amplify/api-graphql';

interface KnowledgeGap {
  id: string;
  user_id: string;
  subject_area: string;
  concept_name: string;
  confidence_level: number;
  assessment_date: string;
  last_reviewed_at?: string;
  review_count: number;
  mastery_status: 'unknown' | 'weak' | 'developing' | 'strong' | 'mastered';
  created_at: string;
  updated_at: string;
}

async function loadUserKnowledgeGaps(userId: string): Promise<KnowledgeGap[]> {
  try {
    const response = await client.graphql({
      query: zunoEntriesByUserWithMetadata,
      variables: {
        userId,
        entryTypeTimestamp: {
          beginsWith: {
            entryType: 'KNOWLEDGE_GAP' as ZunoEntryTypeValues
          }
        }
      }
    }) as GraphQLResult<any>;

    const items = response.data?.zunoEntriesByUserIdAndEntryTypeAndTimestamp?.items || [];
    
    const knowledgeGaps: KnowledgeGap[] = items
      .filter((item: ZunoEntry | null) => item?.metadata?.knowledgeGap)
      .map((item: ZunoEntry) => {
        const gap = item.metadata?.knowledgeGap;
        
        // Determine mastery status based on severity
        let masteryStatus: 'unknown' | 'weak' | 'developing' | 'strong' | 'mastered' = 'unknown';
        if (gap?.severity) {
          switch (gap.severity.toLowerCase()) {
            case 'high':
              masteryStatus = 'weak';
              break;
            case 'medium':
              masteryStatus = 'developing';
              break;
            case 'low':
              masteryStatus = 'strong';
              break;
            case 'none':
              masteryStatus = 'mastered';
              break;
            default:
              masteryStatus = 'unknown';
          }
        }

        return {
          id: item.id,
          user_id: item.userId || '',
          subject_area: gap?.subjectArea || 'General',
          concept_name: gap?.conceptName || 'Unknown Concept',
          confidence_level: masteryStatus === 'mastered' ? 100 : 
                           masteryStatus === 'strong' ? 80 :
                           masteryStatus === 'developing' ? 60 :
                           masteryStatus === 'weak' ? 40 : 20,
          assessment_date: item.timestamp || new Date().toISOString(),
          last_reviewed_at: item.updatedAt,
          review_count: 1, // Default value, would need separate tracking
          mastery_status: masteryStatus,
          created_at: item.createdAt || item.timestamp || new Date().toISOString(),
          updated_at: item.updatedAt || item.timestamp || new Date().toISOString()
        };
      });

    return knowledgeGaps.sort((a, b) => 
      new Date(b.assessment_date).getTime() - new Date(a.assessment_date).getTime()
    );
  } catch (error) {
    console.error('Error loading user knowledge gaps:', error);
    return [];
  }
}

export default loadUserKnowledgeGaps;