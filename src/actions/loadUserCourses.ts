import { action } from '@uibakery/data';

function loadUserCourses() {
  return action('loadUserCourses', 'SQL', {
    databaseName: '[Sample] Custom App_PXDz6TLqtX',
    query: `
      SELECT 
        c.*,
        uc.progress_percentage,
        uc.enrolled_at,
        uc.completed_at,
        uc.last_accessed_at,
        COUNT(l.id) as total_lessons,
        COUNT(ulp.id) as completed_lessons
      FROM user_courses uc
      JOIN courses c ON uc.course_id = c.id
      LEFT JOIN lessons l ON c.id = l.course_id
      LEFT JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id AND ulp.user_id = uc.user_id AND ulp.completed_at IS NOT NULL
      WHERE uc.user_id = {{params.userId}}
      GROUP BY c.id, uc.id
      ORDER BY uc.last_accessed_at DESC;
    `,
  });
}

export default loadUserCourses;
