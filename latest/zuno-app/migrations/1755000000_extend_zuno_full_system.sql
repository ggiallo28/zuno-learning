-- Migration to extend Zuno system with full requirements compliance

-- Update coach_type constraint to include Polpo (the fourth coach)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_coach_type_check;
ALTER TABLE users ADD CONSTRAINT users_coach_type_check CHECK (coach_type IN ('elia', 'skippy', 'lupa', 'polpo'));

ALTER TABLE coach_configs DROP CONSTRAINT IF EXISTS coach_configs_coach_type_check;
ALTER TABLE coach_configs ADD CONSTRAINT coach_configs_coach_type_check CHECK (coach_type IN ('elia', 'skippy', 'lupa', 'polpo'));

-- Add Polpo coach configuration
INSERT INTO coach_configs (
  coach_type, display_name, description, learning_style,
  primary_color, secondary_color, accent_color, icon_style,
  personality_traits, motivation_messages
) VALUES (
  'polpo',
  'Coach Polpo',
  'Il tuo coach polpo per un apprendimento ibrido e adattivo',
  'Apprendimento ibrido, intelligente, adattivo',
  '#008080',
  '#20B2AA',
  '#FF6347',
  'adaptive-intelligent',
  '["intelligente", "adattivo", "flessibile", "analitico", "versatile"]'::jsonb,
  '["Adattiamo l''approccio per massimizzare i tuoi risultati", "La flessibilità è la chiave dell''apprendimento efficace", "Ogni situazione richiede la strategia giusta", "Intelligenza significa sapere quando cambiare approccio"]'::jsonb
) ON CONFLICT (coach_type) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  learning_style = EXCLUDED.learning_style,
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color,
  accent_color = EXCLUDED.accent_color,
  personality_traits = EXCLUDED.personality_traits,
  motivation_messages = EXCLUDED.motivation_messages;

-- Add brand identity and focus mode settings
ALTER TABLE users ADD COLUMN IF NOT EXISTS focus_mode_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{"analytics_tracking": true, "ai_suggestions": true, "notifications_enabled": true}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"frequency": "daily", "types": ["reminders", "insights"], "tone": "coach"}';

-- Knowledge gap assessment and skill tracking
CREATE TABLE IF NOT EXISTS user_knowledge_gaps (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_area VARCHAR(100) NOT NULL,
  concept_name VARCHAR(200) NOT NULL,
  confidence_level INTEGER CHECK (confidence_level BETWEEN 0 AND 100) DEFAULT 0,
  assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_reviewed_at TIMESTAMP,
  review_count INTEGER DEFAULT 0,
  mastery_status VARCHAR(20) DEFAULT 'unknown' CHECK (mastery_status IN ('unknown', 'weak', 'developing', 'strong', 'mastered')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_knowledge_gaps_user_id ON user_knowledge_gaps(user_id);
CREATE INDEX idx_user_knowledge_gaps_mastery ON user_knowledge_gaps(mastery_status);
CREATE INDEX idx_user_knowledge_gaps_subject ON user_knowledge_gaps(subject_area);

-- Spaced repetition scheduling
CREATE TABLE IF NOT EXISTS spaced_repetition_schedule (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id INTEGER NOT NULL, -- Could be lesson_id or quiz_question_id
  content_type VARCHAR(50) NOT NULL, -- 'lesson', 'quiz', 'concept'
  initial_study_date TIMESTAMP NOT NULL,
  next_review_date TIMESTAMP NOT NULL,
  interval_days INTEGER NOT NULL DEFAULT 1,
  repetition_count INTEGER DEFAULT 0,
  ease_factor DECIMAL(3,2) DEFAULT 2.50, -- SuperMemo algorithm
  last_performance INTEGER CHECK (last_performance BETWEEN 0 AND 100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_spaced_repetition_user_due ON spaced_repetition_schedule(user_id, next_review_date);
CREATE INDEX idx_spaced_repetition_content ON spaced_repetition_schedule(content_type, content_id);

-- Group learning features for Lupa mode
CREATE TABLE IF NOT EXISTS learning_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  subject_area VARCHAR(100),
  max_members INTEGER DEFAULT 8,
  is_active BOOLEAN DEFAULT TRUE,
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS group_memberships (
  id SERIAL PRIMARY KEY,
  group_id INTEGER NOT NULL REFERENCES learning_groups(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'leader')),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(group_id, user_id)
);

CREATE TABLE IF NOT EXISTS group_activities (
  id SERIAL PRIMARY KEY,
  group_id INTEGER NOT NULL REFERENCES learning_groups(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- 'discussion', 'challenge', 'shared_lesson', 'peer_review'
  title VARCHAR(200) NOT NULL,
  description TEXT,
  content_data JSONB DEFAULT '{}',
  created_by INTEGER NOT NULL REFERENCES users(id),
  scheduled_for TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced lesson content for interactive elements
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS interactive_elements JSONB DEFAULT '[]';
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS difficulty_score INTEGER DEFAULT 50 CHECK (difficulty_score BETWEEN 0 AND 100);
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS prerequisites JSONB DEFAULT '[]';
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS learning_objectives JSONB DEFAULT '[]';

-- User learning analytics and adaptation data
CREATE TABLE IF NOT EXISTS user_learning_analytics (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(10,4) NOT NULL,
  metric_context JSONB DEFAULT '{}',
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_learning_analytics_user_metric ON user_learning_analytics(user_id, metric_name, recorded_at);

-- Offline content caching
CREATE TABLE IF NOT EXISTS offline_content_cache (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_type VARCHAR(50) NOT NULL, -- 'lesson', 'course', 'quiz'
  content_id INTEGER NOT NULL,
  cached_data JSONB NOT NULL,
  cache_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, content_type, content_id)
);

-- Assessment and testing system
CREATE TABLE IF NOT EXISTS user_assessments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_type VARCHAR(50) NOT NULL, -- 'initial', 'progress', 'focus_check'
  subject_area VARCHAR(100),
  questions_data JSONB NOT NULL,
  answers_data JSONB,
  score INTEGER CHECK (score BETWEEN 0 AND 100),
  identified_gaps JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update existing lessons with some interactive elements and difficulty scores
UPDATE lessons SET 
  interactive_elements = '[
    {"type": "quiz", "weight": 0.3},
    {"type": "practice", "weight": 0.7}
  ]'::jsonb,
  difficulty_score = CASE
    WHEN lesson_order <= 3 THEN 30
    WHEN lesson_order <= 6 THEN 50
    ELSE 70
  END,
  learning_objectives = '[
    "Understand core concepts",
    "Apply knowledge practically"
  ]'::jsonb
WHERE interactive_elements IS NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_group_memberships_user ON group_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_group_activities_group ON group_activities(group_id, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_offline_cache_user_accessed ON offline_content_cache(user_id, last_accessed_at);
CREATE INDEX IF NOT EXISTS idx_assessments_user_type ON user_assessments(user_id, assessment_type);

-- Update user preferences to include Polpo-specific settings
UPDATE users SET learning_preferences = learning_preferences || '{"adaptive_mix": {"enabled": true, "auto_adjust": true}}' 
WHERE coach_type = 'polpo';

