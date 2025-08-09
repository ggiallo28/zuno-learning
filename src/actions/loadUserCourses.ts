import { client } from '../lib/graphql';
import { zunoEntriesByUserWithMetadata, getZunoCatalogWithMetadata } from '../api/graphql/customQueries';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Course, ZunoEntryTypeValues, ZunoEntry, ZunoCatalog, CourseCategoryValues, DifficultyLevelValues } from '../types';
import type { GraphQLResult } from '@aws-amplify/api-graphql';

async function loadUserCourses(userId?: string): Promise<Course[]> {
  try {
    // Get current user ID from Cognito if not provided
    let actualUserId = userId;
    if (!actualUserId) {
      const cognitoUser = await getCurrentUser();
      actualUserId = cognitoUser.userId;
    }

    // Get user's course enrollments
    const enrollmentResponse = await client.graphql({
      query: zunoEntriesByUserWithMetadata,
      variables: {
        userId: actualUserId,
        entryTypeTimestamp: {
          beginsWith: {
            entryType: 'COURSE_COMPLETION' as ZunoEntryTypeValues
          }
        }
      }
    }) as GraphQLResult<any>;

    const enrollmentItems = enrollmentResponse.data?.zunoEntriesByUserIdAndEntryTypeAndTimestamp?.items || [];
    const enrolledCourseIds = enrollmentItems
      .map((item: ZunoEntry) => item?.catalogId)
      .filter(Boolean);

    // Get course details for each enrolled course
    const courses: Course[] = [];
    
    for (const courseId of enrolledCourseIds) {
      try {
        const courseResponse = await client.graphql({
          query: getZunoCatalogWithMetadata,
          variables: { id: courseId }
        }) as GraphQLResult<any>;

        const courseData = courseResponse.data?.getZunoCatalog as ZunoCatalog;
        if (courseData?.metadata?.course) {
          const course = courseData.metadata.course;
          
          // Get lesson completion count
          const lessonCompletionResponse = await client.graphql({
            query: zunoEntriesByUserWithMetadata,
            variables: {
              userId: actualUserId,
              entryTypeTimestamp: {
                beginsWith: {
                  entryType: 'LESSON_COMPLETION' as ZunoEntryTypeValues
                }
              }
            }
          }) as GraphQLResult<any>;

          const completionItems = lessonCompletionResponse.data?.zunoEntriesByUserIdAndEntryTypeAndTimestamp?.items || [];
          const completedLessons = completionItems
            .filter((item: ZunoEntry) => item?.catalogId?.startsWith(courseId)).length;

          courses.push({
            id: courseData.id,
            title: course.title || 'Untitled Course',
            category: course.category || 'OTHER' as CourseCategoryValues,
            difficultyLevel: course.difficultyLevel || 'BEGINNER' as DifficultyLevelValues,
            description: `Learn about ${course.title || 'this course'}`,
            estimatedDurationDays: 14,
            isPremium: false,
            lessonCount: 10, // Default value
            totalLessons: 10,
            completedLessons,
            progressPercentage: Math.round((completedLessons / 10) * 100),
            enrolledAt: courseData.createdAt,
            completedAt: completedLessons >= 10 ? new Date().toISOString() : undefined
          });
        }
      } catch (error) {
        console.error(`Error loading course ${courseId}:`, error);
      }
    }

    return courses.sort((a: Course, b: Course) => 
      new Date(b.enrolledAt || 0).getTime() - new Date(a.enrolledAt || 0).getTime()
    );
  } catch (error) {
    console.error('Error loading user courses:', error);
    return [];
  }
}

export default loadUserCourses;
