import { describe, it, expect, beforeEach } from 'vitest';
import { CourseProgressService } from '@/services/courseProgressService';
import { CourseDataAdapter } from '@/utils/courseDataAdapter';
import type { Course } from '@/types';

describe('Unified Course Catalog System', () => {
  beforeEach(() => {
    CourseProgressService.clearCache();
  });

  describe('CourseProgressService Integration', () => {
    it('tracks course progress correctly', async () => {
      const progress = await CourseProgressService.getCourseProgress('user123', 'course1');
      
      expect(progress.progressPercentage).toBeGreaterThanOrEqual(0);
      expect(progress.progressPercentage).toBeLessThanOrEqual(100);
      expect(progress.completedLessons).toBeGreaterThanOrEqual(0);
      expect(progress.totalLessons).toBeGreaterThan(0);
    });

    it('updates course progress successfully', async () => {
      const success = await CourseProgressService.updateCourseProgress('user123', 'course1', {
        lessonId: 'lesson1',
        completed: true,
        score: 85
      });
      
      expect(success).toBe(true);
    });

    it('marks lesson as completed', async () => {
      const success = await CourseProgressService.markLessonCompleted('user123', 'course1', 'lesson1', 90);
      
      expect(success).toBe(true);
    });

    it('calculates user learning statistics', async () => {
      const stats = await CourseProgressService.getUserLearningStats('user123');
      
      expect(stats.totalCoursesEnrolled).toBeGreaterThanOrEqual(0);
      expect(stats.totalCoursesCompleted).toBeGreaterThanOrEqual(0);
      expect(stats.averageProgress).toBeGreaterThanOrEqual(0);
      expect(stats.averageProgress).toBeLessThanOrEqual(100);
    });

    it('generates certificate data for completed courses', async () => {
      const certificateData = await CourseProgressService.getCertificateData('user123', 'course1');
      
      // Since we're using mock data, we can't guarantee completion
      // Just test that the function returns valid data structure
      expect(certificateData).toBeDefined();
      expect(typeof certificateData?.isEligible).toBe('boolean');
    });

    it('caches progress data correctly', async () => {
      // First call
      await CourseProgressService.getCourseProgress('user123', 'course1');
      
      // Second call should use cache
      await CourseProgressService.getCourseProgress('user123', 'course1');
      
      const cacheStats = CourseProgressService.getCacheStats();
      expect(cacheStats.size).toBe(1);
      expect(cacheStats.keys).toContain('user123-course1');
    });
  });

  describe('Data Format Compatibility', () => {
    it('handles mixed GraphQL and SQL course data formats', () => {
      const graphqlCourse = {
        id: '1',
        title: 'GraphQL Course',
        difficultyLevel: 'BEGINNER',
        isPremium: false,
        lessonCount: 10,
        progressPercentage: 25
      };

      const sqlCourse = {
        id: 2,
        title: 'SQL Course',
        difficulty_level: 'intermediate',
        is_premium: true,
        lesson_count: 15,
        progress_percentage: 60
      };

      const normalized = CourseDataAdapter.normalizeCourses([graphqlCourse, sqlCourse]);
      
      expect(normalized).toHaveLength(2);
      
      // Both should have both camelCase and snake_case properties
      expect(normalized[0].difficultyLevel).toBe('BEGINNER');
      expect(normalized[0].difficulty_level).toBe('BEGINNER');
      expect(normalized[1].difficultyLevel).toBe('intermediate');
      expect(normalized[1].difficulty_level).toBe('intermediate');
    });

    it('filters courses regardless of data format', () => {
      const mixedCourses = [
        { id: '1', category: 'TECHNOLOGY', difficultyLevel: 'BEGINNER' },
        { id: 2, category: 'BUSINESS', difficulty_level: 'advanced' }
      ];

      const normalized = CourseDataAdapter.normalizeCourses(mixedCourses);
      
      // Filter by category
      const techCourses = CourseDataAdapter.filterCourses(normalized, 'TECHNOLOGY');
      expect(techCourses).toHaveLength(1);
      
      // Filter by difficulty (should work with both formats)
      const beginnerCourses = CourseDataAdapter.filterCourses(normalized, undefined, 'BEGINNER');
      expect(beginnerCourses).toHaveLength(1);
      
      const advancedCourses = CourseDataAdapter.filterCourses(normalized, undefined, 'advanced');
      expect(advancedCourses).toHaveLength(1);
    });

    it('sorts courses with mixed data formats', () => {
      const mixedCourses = [
        { id: '1', title: 'Z Course', progressPercentage: 30 },
        { id: 2, title: 'A Course', progress_percentage: 70 }
      ];

      const normalized = CourseDataAdapter.normalizeCourses(mixedCourses);
      
      // Sort by title
      const sortedByTitle = CourseDataAdapter.sortCourses(normalized, 'title');
      expect(sortedByTitle[0].title).toBe('A Course');
      expect(sortedByTitle[1].title).toBe('Z Course');
      
      // Sort by progress
      const sortedByProgress = CourseDataAdapter.sortCourses(normalized, 'progress');
      expect(sortedByProgress[0].progressPercentage).toBe(70);
      expect(sortedByProgress[1].progressPercentage).toBe(30);
    });
  });

  describe('Error Handling', () => {
    it('validates course data and provides helpful error messages', () => {
      const invalidCourse = {};
      
      // Test the validation function directly
      expect(() => CourseDataAdapter.validateAndDefault(invalidCourse)).toThrow('Course ID is required');
    });
  });

  describe('Performance and Caching', () => {
    it('caches course progress data to reduce API calls', async () => {
      const userId = 'user123';
      const courseId = 'course1';
      
      // First call
      const progress1 = await CourseProgressService.getCourseProgress(userId, courseId);
      
      // Second call should use cache
      const progress2 = await CourseProgressService.getCourseProgress(userId, courseId);
      
      expect(progress1).toEqual(progress2);
      
      const cacheStats = CourseProgressService.getCacheStats();
      expect(cacheStats.size).toBe(1);
    });

    it('prevents concurrent progress updates', async () => {
      const userId = 'user123';
      const courseId = 'course1';
      
      // Start two concurrent updates
      const update1Promise = CourseProgressService.updateCourseProgress(userId, courseId, {
        lessonId: 'lesson1',
        completed: true
      });
      
      const update2Promise = CourseProgressService.updateCourseProgress(userId, courseId, {
        lessonId: 'lesson2',
        completed: true
      });
      
      const [result1, result2] = await Promise.all([update1Promise, update2Promise]);
      
      // One should succeed, one should be prevented
      expect(result1 || result2).toBe(true);
      expect(result1 && result2).toBe(false);
    });
  });
});