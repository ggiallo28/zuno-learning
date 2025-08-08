-- Migration to add coach selection and other fields to users table

ALTER TABLE users ADD COLUMN coach_type TEXT DEFAULT 'elia' CHECK (coach_type IN ('elia', 'skippy', 'lupa'));
ALTER TABLE users ADD COLUMN onboarding_completed INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN learning_preferences TEXT DEFAULT '{}';

-- Update existing users to have completed onboarding (for existing demo data)
UPDATE users SET onboarding_completed = 1, coach_type = 'elia' WHERE onboarding_completed IS NULL;
