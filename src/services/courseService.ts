import { CourseDataAdapter } from '@/utils/courseDataAdapter';
import type { Course } from '@/types';

// Import both API approaches
import loadCoursesGraphQL from '@/actions/loadCourses';
import enrollInCourseGraphQL from '@/actions/enrollInCourse';
import loadUserCoursesGraphQL from '@/actions/loadUserCourses';

/**
 * Unified course service that abstracts the underlying data source
 * Supports both GraphQL (Amplify) and SQL backends
 */
export class CourseService {
  private static apiType: 'graphql' | 'sql' = 'graphql'; // Default to GraphQL

  /**
   * Set the API type to use
   */
  static setApiType(type: 'graphql' | 'sql') {
    this.apiType = type;
  }

  /**
   * Load all courses with optional category filter
   */
  static async loadCourses(category?: string): Promise<Course[]> {
    try {
      let rawCourses: any[] = [];

      if (this.apiType === 'graphql') {
        rawCourses = await loadCoursesGraphQL(category);
      } else {
        // SQL implementation would go here
        // For now, fallback to GraphQL
        rawCourses = await loadCoursesGraphQL(category);
      }

      return CourseDataAdapter.normalizeCourses(rawCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
      return [];
    }
  }

  /**
   * Load courses for a specific user (enrolled courses)
   */
  static async loadUserCourses(_userId?: string): Promise<Course[]> {
    try {
      let rawCourses: any[] = [];

      if (this.apiType === 'graphql') {
        rawCourses = await loadUserCoursesGraphQL();
      } else {
        // SQL implementation would go here
        // For now, fallback to GraphQL
        rawCourses = await loadUserCoursesGraphQL();
      }

      return CourseDataAdapter.normalizeCourses(rawCourses);
    } catch (error) {
      console.error('Error loading user courses:', error);
      return [];
    }
  }

  /**
   * Enroll a user in a course
   */
  static async enrollInCourse(params: { userId?: string; courseId: string }): Promise<{ success: boolean; enrolledAt: string }> {
    try {
      if (this.apiType === 'graphql') {
        return await enrollInCourseGraphQL(params);
      } else {
        // SQL implementation would go here
        // For now, fallback to GraphQL
        return await enrollInCourseGraphQL(params);
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  }

  /**
   * Get course progress for a user
   */
  static async getCourseProgress(_userId: string, _courseId: string): Promise<{
    progressPercentage: number;
    completedLessons: number;
    totalLessons: number;
  }> {
    try {
      // This would typically come from a separate progress tracking system
      // For now, return mock data
      return {
        progressPercentage: Math.floor(Math.random() * 100),
        completedLessons: Math.floor(Math.random() * 10),
        totalLessons: 10
      };
    } catch (error) {
      console.error('Error getting course progress:', error);
      return {
        progressPercentage: 0,
        completedLessons: 0,
        totalLessons: 0
      };
    }
  }

  /**
   * Search courses by title or description
   */
  static async searchCourses(query: string): Promise<Course[]> {
    try {
      const allCourses = await this.loadCourses();
      const searchTerm = query.toLowerCase();
      
      return allCourses.filter(course => 
        course.title?.toLowerCase().includes(searchTerm) ||
        course.description?.toLowerCase().includes(searchTerm) ||
        course.category?.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Error searching courses:', error);
      return [];
    }
  }

  /**
   * Get course recommendations based on user preferences
   */
  static async getRecommendedCourses(userId: string, limit: number = 5): Promise<Course[]> {
    try {
      const allCourses = await this.loadCourses();
      const userCourses = await this.loadUserCourses(userId);
      
      // Simple recommendation: exclude enrolled courses and return random selection
      const availableCourses = allCourses.filter(course => 
        !userCourses.some(userCourse => userCourse.id === course.id)
      );
      
      // Shuffle and take first 'limit' courses
      const shuffled = availableCourses.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit);
    } catch (error) {
      console.error('Error getting recommended courses:', error);
      return [];
    }
  }

  /**
   * Get course statistics
   */
  static async getCourseStats(): Promise<{
    totalCourses: number;
    coursesByCategory: Record<string, number>;
    coursesByDifficulty: Record<string, number>;
    averageProgress: number;
  }> {
    try {
      const allCourses = await this.loadCourses();
      
      const coursesByCategory: Record<string, number> = {};
      const coursesByDifficulty: Record<string, number> = {};
      let totalProgress = 0;
      let coursesWithProgress = 0;

      allCourses.forEach(course => {
        // Count by category
        if (course.category) {
          coursesByCategory[course.category] = (coursesByCategory[course.category] || 0) + 1;
        }

        // Count by difficulty
        if (course.difficultyLevel) {
          coursesByDifficulty[course.difficultyLevel] = (coursesByDifficulty[course.difficultyLevel] || 0) + 1;
        }

        // Calculate average progress
        if (course.progressPercentage && course.progressPercentage > 0) {
          totalProgress += course.progressPercentage;
          coursesWithProgress++;
        }
      });

      return {
        totalCourses: allCourses.length,
        coursesByCategory,
        coursesByDifficulty,
        averageProgress: coursesWithProgress > 0 ? totalProgress / coursesWithProgress : 0
      };
    } catch (error) {
      console.error('Error getting course stats:', error);
      return {
        totalCourses: 0,
        coursesByCategory: {},
        coursesByDifficulty: {},
        averageProgress: 0
      };
    }
  }

  /**
   * Validate course data before saving
   */
  static validateCourse(course: Partial<Course>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!course.id) {
      errors.push('Course ID is required');
    }

    if (!course.title || course.title.trim().length === 0) {
      errors.push('Course title is required');
    }

    if (!course.category) {
      errors.push('Course category is required');
    }

    if (!course.difficultyLevel) {
      errors.push('Course difficulty level is required');
    }

    if (course.estimatedDurationDays && course.estimatedDurationDays <= 0) {
      errors.push('Estimated duration must be positive');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}