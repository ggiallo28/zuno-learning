import { client } from '../lib/graphql';
import { createZunoEntryWithMetadata } from '../api/graphql/customMutations';
import { getCurrentUser } from 'aws-amplify/auth';
import type { ZunoEntryTypeValues } from '../types';
import type { GraphQLResult } from '@aws-amplify/api-graphql';

interface EnrollInCourseParams {
  userId?: string;
  courseId: string;
}

async function enrollInCourse(params: EnrollInCourseParams): Promise<{ success: boolean; enrolledAt: string }> {
  try {
    // Get current user ID from Cognito if not provided
    let actualUserId = params.userId;
    if (!actualUserId) {
      const cognitoUser = await getCurrentUser();
      actualUserId = cognitoUser.userId;
    }

    const enrollmentId = `${actualUserId}_${params.courseId}_enrollment`;
    
    const response = await client.graphql({
      query: createZunoEntryWithMetadata,
      variables: {
        input: {
          id: enrollmentId,
          userId: actualUserId,
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
