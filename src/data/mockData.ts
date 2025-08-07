// Mock data for development without database connection
import type { User, Course, CoachType } from '@/types';

export const mockUsers: User[] = [
  {
    id: 1,
    email: 'demo@zuno.com',
    username: 'demo_user',
    full_name: 'Demo User',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    subscription_tier: 'premium',
    total_xp: 2450,
    current_level: 8,
    current_streak: 12,
    longest_streak: 28,
    last_activity_date: new Date().toISOString(),
    enrolled_courses: 5,
    completed_courses: 2,
    coach_type: 'elia',
    onboarding_completed: true,
    learning_preferences: {
      preferred_difficulty: 'intermediate',
      daily_goal_minutes: 30,
      notifications_enabled: true
    }
  }
];

export const mockCourses: Course[] = [
  {
    id: 1,
    title: 'Introduction to React',
    description: 'Learn the fundamentals of React development with hands-on projects and real-world examples.',
    category: 'Web Development',
    difficulty_level: 'beginner',
    estimated_duration_days: 14,
    cover_image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
    is_premium: false,
    lesson_count: 12,
    progress_percentage: 75,
    enrolled_at: '2024-01-15T10:00:00Z',
    total_lessons: 12,
    completed_lessons: 9
  },
  {
    id: 2,
    title: 'Advanced TypeScript Patterns',
    description: 'Master advanced TypeScript concepts including generics, conditional types, and design patterns.',
    category: 'Programming',
    difficulty_level: 'advanced',
    estimated_duration_days: 21,
    cover_image_url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop',
    is_premium: true,
    lesson_count: 18,
    progress_percentage: 30,
    enrolled_at: '2024-02-01T14:30:00Z',
    total_lessons: 18,
    completed_lessons: 5
  },
  {
    id: 3,
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of user interface and user experience design with practical exercises.',
    category: 'Design',
    difficulty_level: 'intermediate',
    estimated_duration_days: 18,
    cover_image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
    is_premium: false,
    lesson_count: 15,
    progress_percentage: 0,
    total_lessons: 15,
    completed_lessons: 0
  },
  {
    id: 4,
    title: 'AWS Cloud Architecture',
    description: 'Build scalable cloud applications using AWS services and best practices.',
    category: 'Cloud Computing',
    difficulty_level: 'advanced',
    estimated_duration_days: 28,
    cover_image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
    is_premium: true,
    lesson_count: 24,
    progress_percentage: 0,
    total_lessons: 24,
    completed_lessons: 0
  },
  {
    id: 5,
    title: 'JavaScript ES6+ Features',
    description: 'Explore modern JavaScript features and how to use them effectively in your projects.',
    category: 'Programming',
    difficulty_level: 'intermediate',
    estimated_duration_days: 10,
    cover_image_url: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=250&fit=crop',
    is_premium: false,
    lesson_count: 8,
    progress_percentage: 100,
    enrolled_at: '2023-12-10T09:15:00Z',
    completed_at: '2024-01-05T16:45:00Z',
    total_lessons: 8,
    completed_lessons: 8
  }
];

export const mockUserCourses: Course[] = mockCourses.filter(course => 
  course.enrolled_at || course.completed_at
);

// Mock API functions that simulate the @uibakery/data behavior
export const mockLoadAction = <T>(data: T[], loading = false): [T[], boolean] => {
  return [data, loading];
};

export const mockMutateAction = <T>(mockFn: (...args: any[]) => Promise<T>) => {
  return [mockFn, false] as const;
};

// Mock mutation functions
export const mockCreateUser = async (userData: any) => {
  const newUser = {
    id: Date.now(),
    ...userData,
    total_xp: 0,
    current_level: 1,
    current_streak: 0,
    longest_streak: 0,
    enrolled_courses: 0,
    completed_courses: 0,
    onboarding_completed: false
  };
  return [newUser];
};

export const mockEnrollInCourse = async (_data: { userId: number; courseId: number }) => {
  return [{ success: true, enrolledAt: new Date().toISOString() }];
};

export const mockUpdateUserCoach = async (data: { userId: number; coachType: CoachType }) => {
  return [{ success: true, coachType: data.coachType }];
};