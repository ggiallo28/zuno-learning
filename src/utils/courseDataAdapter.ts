import type { Course, DifficultyLevelValues, CourseCategoryValues } from '@/types';

/**
 * Unified course data adapter that handles both GraphQL (camelCase) and SQL (snake_case) data formats
 */
export class CourseDataAdapter {
  /**
   * Normalizes course data from any format to the unified Course interface
   */
  static normalizeCourse(rawCourse: any): Course {
    // Handle both string and number IDs
    const id = String(rawCourse.id);
    
    // Normalize properties with fallbacks for both naming conventions
    const course: Course = {
      id,
      title: rawCourse.title || `Course ${id.slice(-8)}`,
      description: rawCourse.description || `Learn about ${rawCourse.title || 'this course'}`,
      category: rawCourse.category || rawCourse.category || 'TECHNOLOGY' as CourseCategoryValues,
      difficultyLevel: rawCourse.difficultyLevel || rawCourse.difficulty_level || 'BEGINNER' as DifficultyLevelValues,
      estimatedDurationDays: rawCourse.estimatedDurationDays || rawCourse.estimated_duration_days || 14,
      coverImageUrl: rawCourse.coverImageUrl || rawCourse.cover_image_url,
      isPremium: rawCourse.isPremium ?? rawCourse.is_premium ?? false,
      lessonCount: rawCourse.lessonCount || rawCourse.lesson_count || 0,
      progressPercentage: rawCourse.progressPercentage || rawCourse.progress_percentage || 0,
      enrolledAt: rawCourse.enrolledAt || rawCourse.enrolled_at,
      completedAt: rawCourse.completedAt || rawCourse.completed_at,
      totalLessons: rawCourse.totalLessons || rawCourse.total_lessons || rawCourse.lessonCount || rawCourse.lesson_count || 0,
      completedLessons: rawCourse.completedLessons || rawCourse.completed_lessons || 0,
      
      // Add snake_case aliases for backward compatibility
      difficulty_level: rawCourse.difficultyLevel || rawCourse.difficulty_level || 'BEGINNER' as DifficultyLevelValues,
      estimated_duration_days: rawCourse.estimatedDurationDays || rawCourse.estimated_duration_days || 14,
      cover_image_url: rawCourse.coverImageUrl || rawCourse.cover_image_url,
      is_premium: rawCourse.isPremium ?? rawCourse.is_premium ?? false,
      lesson_count: rawCourse.lessonCount || rawCourse.lesson_count || 0,
      progress_percentage: rawCourse.progressPercentage || rawCourse.progress_percentage || 0,
      enrolled_at: rawCourse.enrolledAt || rawCourse.enrolled_at,
      completed_at: rawCourse.completedAt || rawCourse.completed_at,
      total_lessons: rawCourse.totalLessons || rawCourse.total_lessons || rawCourse.lessonCount || rawCourse.lesson_count || 0,
      completed_lessons: rawCourse.completedLessons || rawCourse.completed_lessons || 0
    };

    return course;
  }

  /**
   * Normalizes an array of courses
   */
  static normalizeCourses(rawCourses: any[]): Course[] {
    return rawCourses.map(course => this.normalizeCourse(course));
  }

  /**
   * Converts a unified Course object to GraphQL format (camelCase)
   */
  static toGraphQLFormat(course: Course): any {
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category,
      difficultyLevel: course.difficultyLevel,
      estimatedDurationDays: course.estimatedDurationDays,
      coverImageUrl: course.coverImageUrl,
      isPremium: course.isPremium,
      lessonCount: course.lessonCount,
      progressPercentage: course.progressPercentage,
      enrolledAt: course.enrolledAt,
      completedAt: course.completedAt,
      totalLessons: course.totalLessons,
      completedLessons: course.completedLessons
    };
  }

  /**
   * Converts a unified Course object to SQL format (snake_case)
   */
  static toSQLFormat(course: Course): any {
    return {
      id: parseInt(course.id) || course.id, // Handle both string and number IDs
      title: course.title,
      description: course.description,
      category: course.category,
      difficulty_level: course.difficultyLevel,
      estimated_duration_days: course.estimatedDurationDays,
      cover_image_url: course.coverImageUrl,
      is_premium: course.isPremium,
      lesson_count: course.lessonCount,
      progress_percentage: course.progressPercentage,
      enrolled_at: course.enrolledAt,
      completed_at: course.completedAt,
      total_lessons: course.totalLessons,
      completed_lessons: course.completedLessons
    };
  }

  /**
   * Validates course data and provides defaults for missing required fields
   */
  static validateAndDefault(course: Partial<Course>): Course {
    // Check for required ID before normalization
    if (!course.id) {
      throw new Error('Course ID is required');
    }
    
    const normalized = this.normalizeCourse(course);
    
    if (!normalized.title) {
      normalized.title = `Course ${normalized.id.slice(-8)}`;
    }
    
    if (!normalized.category) {
      normalized.category = 'TECHNOLOGY' as CourseCategoryValues;
    }
    
    if (!normalized.difficultyLevel) {
      normalized.difficultyLevel = 'BEGINNER' as DifficultyLevelValues;
    }

    return normalized;
  }

  /**
   * Filters courses based on category and difficulty
   */
  static filterCourses(
    courses: Course[], 
    category?: string, 
    difficulty?: string
  ): Course[] {
    return courses.filter(course => {
      const matchesCategory = !category || category === 'all' || course.category === category;
      const matchesDifficulty = !difficulty || difficulty === 'all' || 
        course.difficultyLevel === difficulty || course.difficulty_level === difficulty;
      return matchesCategory && matchesDifficulty;
    });
  }

  /**
   * Sorts courses by various criteria
   */
  static sortCourses(
    courses: Course[], 
    sortBy: 'title' | 'difficulty' | 'progress' | 'enrolled' = 'title'
  ): Course[] {
    return [...courses].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'difficulty':
          const difficultyOrder = { 'BEGINNER': 1, 'INTERMEDIATE': 2, 'ADVANCED': 3 };
          return (difficultyOrder[a.difficultyLevel as keyof typeof difficultyOrder] || 1) - 
                 (difficultyOrder[b.difficultyLevel as keyof typeof difficultyOrder] || 1);
        case 'progress':
          return (b.progressPercentage || 0) - (a.progressPercentage || 0);
        case 'enrolled':
          // Enrolled courses first
          if (a.enrolledAt && !b.enrolledAt) return -1;
          if (!a.enrolledAt && b.enrolledAt) return 1;
          return 0;
        default:
          return 0;
      }
    });
  }

  /**
   * Gets unique categories from a list of courses
   */
  static getUniqueCategories(courses: Course[]): string[] {
    const categories = new Set<string>();
    courses.forEach(course => {
      if (course.category) {
        categories.add(course.category);
      }
    });
    return Array.from(categories).sort();
  }

  /**
   * Gets unique difficulty levels from a list of courses
   */
  static getUniqueDifficulties(courses: Course[]): string[] {
    const difficulties = new Set<string>();
    courses.forEach(course => {
      if (course.difficultyLevel) {
        difficulties.add(course.difficultyLevel);
      }
    });
    return Array.from(difficulties).sort();
  }
}