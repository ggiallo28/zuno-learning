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
    focus_mode_enabled?: boolean;
    privacy_settings?: {
      analytics_tracking: boolean;
      ai_suggestions: boolean;
      notifications_enabled: boolean;
    };
    notification_preferences?: {
      frequency: 'daily' | 'weekly' | 'minimal';
      types: Array<'reminders' | 'insights' | 'gamification'>;
      tone: 'coach' | 'neutral' | 'quiet';
    };
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
  
  // New interfaces for expanded functionality
  
  export interface KnowledgeGap {
    id: number;
    user_id: number;
    subject_area: string;
    concept_name: string;
    confidence_level: number;
    assessment_date: string;
    last_reviewed_at?: string;
    review_count: number;
    mastery_status: 'unknown' | 'weak' | 'developing' | 'strong' | 'mastered';
  }
  
  export interface Assessment {
    id: number;
    user_id: number;
    assessment_type: 'initial' | 'progress' | 'focus_check';
    subject_area?: string;
    questions_data: any[];
    answers_data?: any[];
    score?: number;
    identified_gaps: string[];
    recommendations: string[];
    completed_at?: string;
    created_at: string;
  }
  
  export interface LearningGroup {
    id: number;
    name: string;
    description?: string;
    subject_area?: string;
    max_members: number;
    is_active: boolean;
    created_by: number;
    member_count?: number;
    user_role?: 'member' | 'moderator' | 'leader';
  }
  
  export interface SpacedRepetitionItem {
    id: number;
    user_id: number;
    content_id: number;
    content_type: 'lesson' | 'quiz' | 'concept';
    next_review_date: string;
    interval_days: number;
    repetition_count: number;
    ease_factor: number;
    last_performance?: number;
  }
  
  export interface InteractiveElement {
    type: 'quiz' | 'practice' | 'game' | 'discussion' | 'simulation';
    weight: number;
    config?: Record<string, any>;
  }
  
  // Enhanced lesson interface
  export interface EnhancedLesson extends Lesson {
    interactive_elements?: InteractiveElement[];
    difficulty_score?: number;
    prerequisites?: string[];
    learning_objectives?: string[];
  }
  