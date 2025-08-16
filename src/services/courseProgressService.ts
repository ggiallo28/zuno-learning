// Course progress service for unified course catalog system

/**
 * Unified course progress service that synchronizes progress between different systems
 */
export class CourseProgressService {
  private static progressCache = new Map<string, any>();
  private static syncInProgress = new Set<string>();

  /**
   * Get course progress for a user
   */
  static async getCourseProgress(userId: string, courseId: string): Promise<{
    progressPercentage: number;
    completedLessons: number;
    totalLessons: number;
    lastAccessedAt?: string;
    timeSpent?: number;
    currentLessonId?: string;
  }> {
    const cacheKey = `${userId}-${courseId}`;
    
    // Return cached data if available and recent
    if (this.progressCache.has(cacheKey)) {
      const cached = this.progressCache.get(cacheKey);
      const isRecent = Date.now() - cached.timestamp < 5 * 60 * 1000; // 5 minutes
      if (isRecent) {
        return cached.data;
      }
    }

    try {
      // This would typically fetch from your backend
      // For now, return mock data that would come from GraphQL or SQL
      const mockProgress = {
        progressPercentage: Math.floor(Math.random() * 100),
        completedLessons: Math.floor(Math.random() * 10),
        totalLessons: 10,
        lastAccessedAt: new Date().toISOString(),
        timeSpent: Math.floor(Math.random() * 3600), // seconds
        currentLessonId: `lesson-${Math.floor(Math.random() * 10) + 1}`
      };

      // Cache the result
      this.progressCache.set(cacheKey, {
        data: mockProgress,
        timestamp: Date.now()
      });

      return mockProgress;
    } catch (error) {
      console.error('Error fetching course progress:', error);
      return {
        progressPercentage: 0,
        completedLessons: 0,
        totalLessons: 0
      };
    }
  }

  /**
   * Update course progress
   */
  static async updateCourseProgress(
    userId: string, 
    courseId: string, 
    progress: {
      lessonId?: string;
      completed?: boolean;
      timeSpent?: number;
      score?: number;
    }
  ): Promise<boolean> {
    const syncKey = `${userId}-${courseId}`;
    
    // Prevent concurrent updates
    if (this.syncInProgress.has(syncKey)) {
      return false;
    }

    try {
      this.syncInProgress.add(syncKey);

      // This would typically update both GraphQL and SQL backends
      // For now, simulate the update
      await new Promise(resolve => setTimeout(resolve, 100));

      // Invalidate cache
      this.progressCache.delete(syncKey);

      // Trigger progress sync across systems
      await this.syncProgressAcrossSystems(userId, courseId, progress);

      return true;
    } catch (error) {
      console.error('Error updating course progress:', error);
      return false;
    } finally {
      this.syncInProgress.delete(syncKey);
    }
  }

  /**
   * Sync progress across different backend systems
   */
  private static async syncProgressAcrossSystems(
    userId: string,
    courseId: string,
    _progress: any
  ): Promise<void> {
    try {
      // This would sync between GraphQL (Amplify) and SQL backends
      // Implementation would depend on your specific architecture
      
      // Example: Update GraphQL backend
      // await this.updateGraphQLProgress(userId, courseId, progress);
      
      // Example: Update SQL backend
      // await this.updateSQLProgress(userId, courseId, progress);
      
      console.log('Progress synced across systems for user:', userId, 'course:', courseId);
    } catch (error) {
      console.error('Error syncing progress across systems:', error);
    }
  }

  /**
   * Get all course progress for a user
   */
  static async getAllUserProgress(userId: string): Promise<Record<string, any>> {
    try {
      // This would fetch all progress data for the user
      // For now, return mock data
      return {
        'course-1': await this.getCourseProgress(userId, 'course-1'),
        'course-2': await this.getCourseProgress(userId, 'course-2'),
        'course-3': await this.getCourseProgress(userId, 'course-3')
      };
    } catch (error) {
      console.error('Error fetching all user progress:', error);
      return {};
    }
  }

  /**
   * Calculate overall learning statistics
   */
  static async getUserLearningStats(userId: string): Promise<{
    totalCoursesEnrolled: number;
    totalCoursesCompleted: number;
    totalLessonsCompleted: number;
    totalTimeSpent: number;
    averageProgress: number;
    currentStreak: number;
    longestStreak: number;
  }> {
    try {
      const allProgress = await this.getAllUserProgress(userId);
      const progressValues = Object.values(allProgress);

      const totalCoursesEnrolled = progressValues.length;
      const totalCoursesCompleted = progressValues.filter(p => p.progressPercentage === 100).length;
      const totalLessonsCompleted = progressValues.reduce((sum, p) => sum + p.completedLessons, 0);
      const totalTimeSpent = progressValues.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
      const averageProgress = progressValues.length > 0 
        ? progressValues.reduce((sum, p) => sum + p.progressPercentage, 0) / progressValues.length 
        : 0;

      return {
        totalCoursesEnrolled,
        totalCoursesCompleted,
        totalLessonsCompleted,
        totalTimeSpent,
        averageProgress,
        currentStreak: 5, // Mock data - would come from streak tracking
        longestStreak: 12 // Mock data - would come from streak tracking
      };
    } catch (error) {
      console.error('Error calculating learning stats:', error);
      return {
        totalCoursesEnrolled: 0,
        totalCoursesCompleted: 0,
        totalLessonsCompleted: 0,
        totalTimeSpent: 0,
        averageProgress: 0,
        currentStreak: 0,
        longestStreak: 0
      };
    }
  }

  /**
   * Mark lesson as completed
   */
  static async markLessonCompleted(
    userId: string,
    courseId: string,
    lessonId: string,
    score?: number
  ): Promise<boolean> {
    return await this.updateCourseProgress(userId, courseId, {
      lessonId,
      completed: true,
      score,
      timeSpent: Math.floor(Math.random() * 600) + 300 // 5-15 minutes
    });
  }

  /**
   * Track lesson access
   */
  static async trackLessonAccess(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<void> {
    try {
      await this.updateCourseProgress(userId, courseId, {
        lessonId,
        timeSpent: 0 // Just tracking access, not completion
      });
    } catch (error) {
      console.error('Error tracking lesson access:', error);
    }
  }

  /**
   * Get course completion certificate data
   */
  static async getCertificateData(userId: string, courseId: string): Promise<{
    isEligible: boolean;
    completionDate?: string;
    finalScore?: number;
    certificateId?: string;
  } | null> {
    try {
      const progress = await this.getCourseProgress(userId, courseId);
      
      if (progress.progressPercentage === 100) {
        return {
          isEligible: true,
          completionDate: new Date().toISOString(),
          finalScore: 85 + Math.floor(Math.random() * 15), // 85-100
          certificateId: `cert-${userId}-${courseId}-${Date.now()}`
        };
      }

      return {
        isEligible: false
      };
    } catch (error) {
      console.error('Error getting certificate data:', error);
      return null;
    }
  }

  /**
   * Clear progress cache (useful for testing or manual refresh)
   */
  static clearCache(): void {
    this.progressCache.clear();
  }

  /**
   * Get cache statistics (for debugging)
   */
  static getCacheStats(): {
    size: number;
    keys: string[];
    syncInProgress: string[];
  } {
    return {
      size: this.progressCache.size,
      keys: Array.from(this.progressCache.keys()),
      syncInProgress: Array.from(this.syncInProgress)
    };
  }
}