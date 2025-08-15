import type { Course, Lesson, QuizQuestion } from '@/types'

export const createMockCourse = (overrides: Partial<Course> = {}): Course => ({
  id: 'test-course-id',
  title: 'Test Course',
  description: 'A comprehensive test course for learning',
  category: 'Technology',
  difficulty: 'Beginner',
  estimatedDuration: 120,
  lessons: [],
  prerequisites: [],
  learningObjectives: ['Understand testing concepts', 'Write effective tests'],
  tags: ['testing', 'javascript', 'react'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
})

export const createMockLesson = (overrides: Partial<Lesson> = {}): Lesson => ({
  id: 'test-lesson-id',
  title: 'Test Lesson',
  content: 'This is test lesson content that explains important concepts.',
  courseId: 'test-course-id',
  order: 1,
  type: 'TEXT',
  estimatedDuration: 15,
  learningObjectives: ['Understand the concept', 'Apply the knowledge'],
  completed: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
})

export const createMockQuizQuestion = (overrides: Partial<QuizQuestion> = {}): QuizQuestion => ({
  id: 'test-quiz-id',
  lessonId: 'test-lesson-id',
  question: 'What is the correct answer?',
  type: 'multiple-choice',
  options: [
    { id: 'option-1', text: 'Option A', isCorrect: true },
    { id: 'option-2', text: 'Option B', isCorrect: false },
    { id: 'option-3', text: 'Option C', isCorrect: false },
    { id: 'option-4', text: 'Option D', isCorrect: false }
  ],
  correctAnswer: 'option-1',
  explanation: 'Option A is correct because...',
  points: 10,
  difficulty: 'easy',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
})

export const createMockCourseWithLessons = (
  courseOverrides: Partial<Course> = {},
  lessonCount: number = 3
): Course => {
  const course = createMockCourse(courseOverrides)
  const lessons = Array.from({ length: lessonCount }, (_, index) =>
    createMockLesson({
      id: `lesson-${index + 1}`,
      courseId: course.id,
      title: `Lesson ${index + 1}`,
      order: index + 1
    })
  )
  
  return {
    ...course,
    lessons
  }
}