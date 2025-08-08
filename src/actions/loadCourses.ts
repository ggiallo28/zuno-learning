import { client } from '../lib/graphql';
import { zunoCatalogsByItemTypeWithMetadata } from '../api/graphql/customQueries';
import type { Course, CatalogItemTypeValues, ZunoCatalog } from '../types';
import type { GraphQLResult } from '@aws-amplify/api-graphql';

async function loadCourses(category?: string): Promise<Course[]> {
  try {
    const response = await client.graphql({
      query: zunoCatalogsByItemTypeWithMetadata,
      variables: {
        itemType: 'COURSE' as CatalogItemTypeValues
      }
    }) as GraphQLResult<any>;

    const items = response.data?.zunoCatalogsByItemTypeAndTimestamp?.items || [];
    
    const courses = items
      .filter((item: ZunoCatalog | null) => item?.metadata?.course)
      .map((item: ZunoCatalog) => ({
        id: item.id,
        title: item.metadata?.course?.title || `Course ${item.id.slice(-8)}`,
        category: item.metadata?.course?.category || 'TECHNOLOGY',
        difficultyLevel: item.metadata?.course?.difficultyLevel || 'BEGINNER',
        description: item.metadata?.course?.description || `Learn about ${item.metadata?.course?.title || 'this course'}`,
        estimatedDurationDays: 14,
        isPremium: false,
        lessonCount: 2, // Updated to match actual lesson count
        progressPercentage: 0,
        totalLessons: 2,
        completedLessons: 0
      } as Course));

    // Filter by category if provided
    if (category) {
      return courses.filter((course: Course) => course.category === category);
    }

    return courses;
  } catch (error) {
    console.error('Error loading courses:', error);
    return [];
  }
}

export default loadCourses;
