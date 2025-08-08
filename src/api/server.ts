import express from 'express';
import { getDb } from './database';


const app = express();
app.use(express.json());

// Middleware to handle async route handlers
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// GET /api/courses - Load all courses
app.get('/courses', asyncHandler(async (req: any, res: any) => {
  const userId = req.query.userId ? Number(req.query.userId) : undefined;
  const db = await getDb();
  const courses = await db.all(`
    SELECT
      c.*,
      uc.enrolled_at,
      uc.completed_at,
      uc.progress_percentage,
      (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) as total_lessons,
      (SELECT COUNT(*) FROM user_lesson_progress ulp JOIN lessons l ON ulp.lesson_id = l.id WHERE l.course_id = c.id AND ulp.user_id = ?) as completed_lessons
    FROM courses c
    LEFT JOIN user_courses uc ON c.id = uc.course_id AND uc.user_id = ?
  `, userId, userId);
  res.json(courses.map((course: any) => ({ ...course, lesson_count: course.total_lessons })));
}));

// GET /api/user/:userId/courses - Load user's enrolled courses
app.get('/user/:userId/courses', asyncHandler(async (req: any, res: any) => {
  const userId = Number(req.params.userId);
  const db = await getDb();
  const courses = await db.all(`
    SELECT
      c.*,
      uc.enrolled_at,
      uc.completed_at,
      uc.progress_percentage,
      uc.last_accessed_at,
      (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) as total_lessons,
      (SELECT COUNT(*) FROM user_lesson_progress ulp JOIN lessons l ON ulp.lesson_id = l.id WHERE l.course_id = c.id AND ulp.user_id = ?) as completed_lessons
    FROM courses c
    INNER JOIN user_courses uc ON c.id = uc.course_id
    WHERE uc.user_id = ?
    ORDER BY uc.last_accessed_at DESC
  `, userId, userId);
  res.json(courses.map((course: any) => ({ ...course, lesson_count: course.total_lessons })));
}));

// GET /api/user/:userId - Load user profile
app.get('/user/:userId', asyncHandler(async (req: any, res: any) => {
    const userId = Number(req.params.userId);
    const db = await getDb();
    const user = await db.get(`
      SELECT 
        u.*,
        COUNT(uc.id) as enrolled_courses,
        COUNT(CASE WHEN uc.completed_at IS NOT NULL THEN 1 END) as completed_courses
      FROM users u
      LEFT JOIN user_courses uc ON u.id = uc.user_id
      WHERE u.id = ?
      GROUP BY u.id
    `, userId);

    if (user && user.learning_preferences) {
      user.learning_preferences = JSON.parse(user.learning_preferences);
    }
    res.json(user);
}));

// POST /api/user - Create a new user
app.post('/user', asyncHandler(async (req: any, res: any) => {
    const { email, username, full_name } = req.body;
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO users (email, username, full_name) VALUES (?, ?, ?)',
      email, username, full_name
    );
    res.status(201).json({ id: result.lastID });
}));

// POST /api/enroll - Enroll in a course
app.post('/enroll', asyncHandler(async (req: any, res: any) => {
    const { userId, courseId } = req.body;
    const db = await getDb();
    await db.run(
      'INSERT INTO user_courses (user_id, course_id) VALUES (?, ?)',
      userId, courseId
    );
    res.json({ success: true });
}));

// POST /api/user/:userId/coach - Update user's coach
app.post('/user/:userId/coach', asyncHandler(async (req: any, res: any) => {
    const userId = Number(req.params.userId);
    const { coachType, onboardingCompleted } = req.body;
    const db = await getDb();
    await db.run(
      'UPDATE users SET coach_type = ?, onboarding_completed = ?, updated_at = datetime(\'now\') WHERE id = ?',
      coachType, onboardingCompleted, userId
    );
    res.json({ success: true });
}));

export default app;
