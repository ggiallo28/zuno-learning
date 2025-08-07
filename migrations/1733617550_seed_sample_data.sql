-- Seed sample courses and data

-- Insert sample courses
INSERT INTO courses (title, description, category, difficulty_level, estimated_duration_days, is_premium) VALUES
('JavaScript Fundamentals', 'Learn the core concepts of JavaScript programming from variables to functions and beyond.', 'Programming', 'beginner', 21, FALSE),
('React Basics', 'Build interactive user interfaces with React components, state management, and props.', 'Programming', 'intermediate', 28, FALSE),
('Advanced Python', 'Master advanced Python concepts including decorators, generators, and async programming.', 'Programming', 'advanced', 35, TRUE),
('Digital Marketing 101', 'Learn the fundamentals of digital marketing including SEO, social media, and analytics.', 'Marketing', 'beginner', 14, FALSE),
('Data Science with Python', 'Explore data analysis, visualization, and machine learning with Python libraries.', 'Data Science', 'intermediate', 42, TRUE),
('UI/UX Design Principles', 'Master the principles of user interface and user experience design.', 'Design', 'beginner', 21, FALSE),
('Spanish for Beginners', 'Start your journey learning Spanish with basic vocabulary and grammar.', 'Languages', 'beginner', 30, FALSE),
('Photography Basics', 'Learn the fundamentals of photography including composition, lighting, and editing.', 'Creative', 'beginner', 18, FALSE);

-- Insert sample lessons for JavaScript Fundamentals course
INSERT INTO lessons (course_id, title, content, lesson_order, lesson_type, xp_reward, estimated_minutes) VALUES
(1, 'Introduction to JavaScript', 'Welcome to JavaScript! In this lesson, we''ll cover what JavaScript is and why it''s essential for web development.', 1, 'text', 10, 5),
(1, 'Variables and Data Types', 'Learn about different data types in JavaScript: strings, numbers, booleans, and more.', 2, 'text', 15, 8),
(1, 'Variables Quiz', 'Test your knowledge of JavaScript variables and data types.', 3, 'quiz', 20, 3),
(1, 'Functions Basics', 'Understand how to create and use functions in JavaScript.', 4, 'text', 15, 10),
(1, 'Practice: Create Your First Function', 'Hands-on practice creating JavaScript functions.', 5, 'practice', 25, 15);

-- Insert sample lessons for React Basics course  
INSERT INTO lessons (course_id, title, content, lesson_order, lesson_type, xp_reward, estimated_minutes) VALUES
(2, 'What is React?', 'Introduction to React library and component-based architecture.', 1, 'text', 10, 6),
(2, 'Your First Component', 'Learn how to create your first React component.', 2, 'text', 15, 12),
(2, 'Props and State', 'Understanding how to pass data and manage component state.', 3, 'text', 20, 15),
(2, 'Event Handling', 'Learn how to handle user interactions in React.', 4, 'text', 15, 10);

-- Insert sample achievements
INSERT INTO achievements (name, description, icon, category, requirement_type, requirement_value, xp_reward) VALUES
('First Steps', 'Complete your first lesson', 'star', 'milestone', 'lessons_completed', 1, 50),
('Week Warrior', 'Maintain a 7-day learning streak', 'flame', 'streak', 'streak', 7, 100),
('Course Crusher', 'Complete your first course', 'trophy', 'milestone', 'course_completed', 1, 200),
('XP Hunter', 'Earn 500 total XP', 'target', 'points', 'xp', 500, 100),
('Dedicated Learner', 'Maintain a 30-day learning streak', 'calendar', 'streak', 'streak', 30, 500);

-- Insert sample quiz questions
INSERT INTO quiz_questions (lesson_id, question_text, question_type, correct_answer, options, explanation, points) VALUES
(3, 'Which of the following is NOT a primitive data type in JavaScript?', 'multiple_choice', 'Array', '["String", "Number", "Boolean", "Array"]', 'Arrays are objects in JavaScript, not primitive data types.', 2),
(3, 'What keyword is used to declare a variable in modern JavaScript?', 'multiple_choice', 'let', '["var", "let", "variable", "declare"]', 'let is the modern way to declare variables with block scope.', 1),
(3, 'JavaScript is a statically typed language.', 'true_false', 'false', '["true", "false"]', 'JavaScript is dynamically typed, meaning variable types are determined at runtime.', 1);

-- Create a demo user
INSERT INTO users (email, username, full_name, total_xp, current_level, current_streak, longest_streak) VALUES
('demo@zuno.com', 'demo_learner', 'Demo Learner', 150, 2, 3, 5);
