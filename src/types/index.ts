export interface User {
    id: number;
    email: string;
    username: string;
    full_name: string;
    avatar_url?: string;
    subscription_tier: 'free' | 'premium' | 'pro';
    total_xp: number;
    current_level: number;
    current_streak: number;
    longest_streak: number;
    last_activity_date?: string;
    enrolled_courses?: number;
    completed_courses?: number;
    coach_type?: CoachType;
    onboarding_completed?: boolean;
    learning_preferences?: Record<string, any>;
  }
  
  export type CoachType = 'elia' | 'skippy' | 'lupa' | 'polpo';
  
  export interface CoachConfig {
    id: number;
    coach_type: CoachType;
    display_name: string;
    description: string;
    learning_style: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    icon_style: string;
    personality_traits: string[];
    motivation_messages: string[];
  }
  
  export interface CoachTheme {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  }
  
  export interface Course {
    id: number;
    title: string;
    description?: string;
    category: string;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    estimated_duration_days: number;
    cover_image_url?: string;
    is_premium: boolean;
    lesson_count?: number;
    progress_percentage?: number;
    enrolled_at?: string;
    completed_at?: string;
    total_lessons?: number;
    completed_lessons?: number;
  }
  
  export interface Lesson {
    id: number;
    course_id: number;
    title: string;
    content: string;
    lesson_order: number;
    lesson_type: 'text' | 'quiz' | 'practice' | 'game';
    xp_reward: number;
    estimated_minutes: number;
  }
  
  export interface Achievement {
    id: number;
    name: string;
    description?: string;
    icon?: string;
    category?: string;
    requirement_type: string;
    requirement_value: number;
    xp_reward: number;
    earned_at?: string;
  }
  