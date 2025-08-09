-- Migration to add coach system and learning modes

-- Add coach selection to users table
ALTER TABLE users ADD COLUMN coach_type VARCHAR(20) DEFAULT 'elia' CHECK (coach_type IN ('elia', 'skippy', 'lupa'));
ALTER TABLE users ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN learning_preferences JSONB DEFAULT '{}';

-- Update existing users to have completed onboarding (for existing demo data)
UPDATE users SET onboarding_completed = TRUE, coach_type = 'elia' WHERE onboarding_completed IS NULL;

-- Coach configurations table for managing coach personalities and settings
CREATE TABLE coach_configs (
  id SERIAL PRIMARY KEY,
  coach_type VARCHAR(20) NOT NULL UNIQUE CHECK (coach_type IN ('elia', 'skippy', 'lupa')),
  display_name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  learning_style VARCHAR(100) NOT NULL,
  primary_color VARCHAR(7) NOT NULL,
  secondary_color VARCHAR(7) NOT NULL,
  accent_color VARCHAR(7) NOT NULL,
  icon_style VARCHAR(50) NOT NULL,
  personality_traits JSONB NOT NULL,
  motivation_messages JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert coach configurations
INSERT INTO coach_configs (
  coach_type, display_name, description, learning_style,
  primary_color, secondary_color, accent_color, icon_style,
  personality_traits, motivation_messages
) VALUES 
(
  'elia',
  'Coach Elia',
  'Il tuo coach elefante per un apprendimento profondo e riflessivo',
  'Apprendimento lento, riflessivo, approfondito',
  '#8B7355',
  '#A0927B',
  '#6B5B47',
  'solid-stable',
  '["solido", "stabile", "rassicurante", "paziente", "metodico"]'::jsonb,
  '["Prendiamoci il tempo necessario per comprendere a fondo", "La conoscenza profonda richiede pazienza", "Ogni concetto merita la giusta attenzione", "Costruiamo solide fondamenta insieme"]'::jsonb
),
(
  'skippy',
  'Coach Skippy',
  'Il tuo coach scoiattolo per un apprendimento veloce e dinamico',
  'Apprendimento veloce, leggero, esplorativo',
  '#E67E22',
  '#F39C12',
  '#D68910',
  'dynamic-light',
  '["vivace", "dinamico", "flessibile", "curioso", "agile"]'::jsonb,
  '["Esploriamo insieme nuovi orizzonti!", "Velocità e agilità mentale sono i nostri punti di forza", "Scopriamo rapidamente cosa ci serve!", "Manteniamo il ritmo, ma sempre con leggerezza"]'::jsonb
),
(
  'lupa',
  'Coach Lupa',
  'Il tuo coach lupa per un apprendimento collaborativo e sociale',
  'Apprendimento collaborativo e sociale',
  '#2C3E50',
  '#34495E',
  '#B7472A',
  'connected-intense',
  '["intenso", "connesso", "empatico", "sociale", "intuitivo"]'::jsonb,
  '["Insieme siamo più forti", "La conoscenza condivisa è più preziosa", "Impariamo gli uni dagli altri", "Il branco cresce quando tutti crescono"]'::jsonb
);

-- User coach interactions for tracking engagement
CREATE TABLE user_coach_interactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  interaction_type VARCHAR(50) NOT NULL, -- 'motivation', 'tip', 'celebration', 'reminder'
  message_content TEXT NOT NULL,
  shown_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  acknowledged_at TIMESTAMP,
  context_data JSONB DEFAULT '{}'
);

CREATE INDEX idx_user_coach_interactions_user_id ON user_coach_interactions(user_id);
CREATE INDEX idx_user_coach_interactions_type ON user_coach_interactions(interaction_type);
