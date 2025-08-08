import { client } from '../lib/graphql';
import { createZunoEntryWithMetadata } from '../api/graphql/customMutations';
import type { ZunoEntryTypeValues } from '../types';
import type { GraphQLResult } from '@aws-amplify/api-graphql';

interface EnrollInCourseParams {
  userId: string;
  courseId: string;
}

async function enrollInCourse(params: EnrollInCourseParams): Promise<{ success: boolean; enrolledAt: string }> {
  try {
    const enrollmentId = `${params.userId}_${params.courseId}_enrollment`;
    
    const response = await client.graphql({
      query: createZunoEntryWithMetadata,
      variables: {
        input: {
          id: enrollmentId,
          userId: params.userId,
          catalogId: params.courseId,
          entryType: 'COURSE_COMPLETION' as ZunoEntryTypeValues,
          timestamp: new Date().toISOString(),
          metadata: {
            userActivity: {
              activityType: 'ENROLLMENT',
              description: `Enrolled in course ${params.courseId}`,
              activityDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
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
      enrolledAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
}

export default enrollInCourse;
