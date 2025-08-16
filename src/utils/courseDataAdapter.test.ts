import { describe, it, expect } from 'vitest';
import { CourseDataAdapter } from './courseDataAdapter';
import type { Course } from '@/types';

describe('CourseDataAdapter', () => {
  const mockGraphQLCourse = {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn React basics',
    category: 'TECHNOLOGY',
    difficultyLevel: 'BEGINNER',
    estimatedDurationDays: 14,
    isPremium: false,
    lessonCount: 10,
    progressPercentage: 25,
    enrolledAt: '2024-01-01T00:00:00Z'
  };

  const mockSQLCourse = {
    id: 2,
    title: 'Python Basics',
    description: 'Learn Python programming',
    category: 'TECHNOLOGY',
    difficulty_level: 'intermediate',
    estimated_duration_days: 21,
    is_premium: true,
    lesson_count: 15,
    progress_percentage: 60,
    enrolled_at: '2024-01-15T00:00:00Z'
  };

  it('normalizes GraphQL course data correctly', () => {
    const normalized = CourseDataAdapter.normalizeCourse(mockGraphQLCourse);
    
    expect(normalized.id).toBe('1');
    expect(normalized.title).toBe('React Fundamentals');
    expect(normalized.difficultyLevel).toBe('BEGINNER');
    expect(normalized.difficulty_level).toBe('BEGINNER'); // snake_case alias
    expect(normalized.isPremium).toBe(false);
    expect(normalized.is_premium).toBe(false); // snake_case alias
    expect(normalized.lessonCount).toBe(10);
    expect(normalized.lesson_count).toBe(10); // snake_case alias
  });

  it('normalizes SQL course data correctly', () => {
    const normalized = CourseDataAdapter.normalizeCourse(mockSQLCourse);
    
    expect(normalized.id).toBe('2'); // Converted to string
    expect(normalized.title).toBe('Python Basics');
    expect(normalized.difficultyLevel).toBe('intermediate');
    expect(normalized.difficulty_level).toBe('intermediate'); // Original property
    expect(normalized.isPremium).toBe(true);
    expect(normalized.is_premium).toBe(true); // Original property
    expect(normalized.lessonCount).toBe(15);
    expect(normalized.lesson_count).toBe(15); // Original property
  });

  it('normalizes array of mixed course data', () => {
    const courses = [mockGraphQLCourse, mockSQLCourse];
    const normalized = CourseDataAdapter.normalizeCourses(courses);
    
    expect(normalized).toHaveLength(2);
    expect(normalized[0].id).toBe('1');
    expect(normalized[1].id).toBe('2');
    expect(normalized[0].difficultyLevel).toBe('BEGINNER');
    expect(normalized[1].difficultyLevel).toBe('intermediate');
  });

  it('filters courses by category and difficulty', () => {
    const courses = CourseDataAdapter.normalizeCourses([mockGraphQLCourse, mockSQLCourse]);
    
    // Filter by category
    const techCourses = CourseDataAdapter.filterCourses(courses, 'TECHNOLOGY');
    expect(techCourses).toHaveLength(2);
    
    // Filter by difficulty
    const beginnerCourses = CourseDataAdapter.filterCourses(courses, undefined, 'BEGINNER');
    expect(beginnerCourses).toHaveLength(1);
    expect(beginnerCourses[0].title).toBe('React Fundamentals');
    
    // Filter by both
    const techBeginnerCourses = CourseDataAdapter.filterCourses(courses, 'TECHNOLOGY', 'BEGINNER');
    expect(techBeginnerCourses).toHaveLength(1);
  });

  it('sorts courses correctly', () => {
    const courses = CourseDataAdapter.normalizeCourses([mockSQLCourse, mockGraphQLCourse]);
    
    // Sort by title
    const sortedByTitle = CourseDataAdapter.sortCourses(courses, 'title');
    expect(sortedByTitle[0].title).toBe('Python Basics'); // P comes before R
    expect(sortedByTitle[1].title).toBe('React Fundamentals');
    
    // Sort by progress
    const sortedByProgress = CourseDataAdapter.sortCourses(courses, 'progress');
    expect(sortedByProgress[0].progressPercentage).toBe(60); // Higher progress first
    expect(sortedByProgress[1].progressPercentage).toBe(25);
  });

  it('gets unique categories and difficulties', () => {
    const courses = CourseDataAdapter.normalizeCourses([
      mockGraphQLCourse,
      mockSQLCourse,
      { ...mockGraphQLCourse, id: '3', category: 'BUSINESS', difficultyLevel: 'ADVANCED' }
    ]);
    
    const categories = CourseDataAdapter.getUniqueCategories(courses);
    expect(categories).toEqual(['BUSINESS', 'TECHNOLOGY']);
    
    const difficulties = CourseDataAdapter.getUniqueDifficulties(courses);
    expect(difficulties).toEqual(['ADVANCED', 'BEGINNER', 'intermediate']);
  });

  it('validates course data', () => {
    const validCourse = { id: '1', title: 'Test Course', category: 'TECHNOLOGY', difficultyLevel: 'BEGINNER' };
    const validation = CourseDataAdapter.validateAndDefault(validCourse);
    expect(validation.id).toBe('1');
    expect(validation.title).toBe('Test Course');
    
    // Test with missing title
    const courseWithoutTitle = { id: '2', category: 'TECHNOLOGY', difficultyLevel: 'BEGINNER' };
    const validatedWithDefaults = CourseDataAdapter.validateAndDefault(courseWithoutTitle);
    expect(validatedWithDefaults.title).toBe('Course 2');
  });

  it('throws error for course without ID', () => {
    const courseWithoutId = { title: 'Test Course' };
    expect(() => CourseDataAdapter.validateAndDefault(courseWithoutId)).toThrow('Course ID is required');
  });

  it('converts to GraphQL format', () => {
    const normalized = CourseDataAdapter.normalizeCourse(mockSQLCourse);
    const graphqlFormat = CourseDataAdapter.toGraphQLFormat(normalized);
    
    expect(graphqlFormat.difficultyLevel).toBe('intermediate');
    expect(graphqlFormat.isPremium).toBe(true);
    expect(graphqlFormat.lessonCount).toBe(15);
    expect(graphqlFormat.difficulty_level).toBeUndefined(); // Should not have snake_case
  });

  it('converts to SQL format', () => {
    const normalized = CourseDataAdapter.normalizeCourse(mockGraphQLCourse);
    const sqlFormat = CourseDataAdapter.toSQLFormat(normalized);
    
    expect(sqlFormat.difficulty_level).toBe('BEGINNER');
    expect(sqlFormat.is_premium).toBe(false);
    expect(sqlFormat.lesson_count).toBe(10);
    expect(sqlFormat.difficultyLevel).toBeUndefined(); // Should not have camelCase
  });
});