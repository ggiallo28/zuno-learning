import { action } from '@uibakery/data';

function loadLessons() {
  return action('loadLessons', 'SQL', {
    databaseName: '[Sample] Custom App_PXDz6TLqtX',
    query: `
      SELECT 
        l.*,
        CASE WHEN ulp.completed_at IS NOT NULL THEN true ELSE false END as is_completed,
        ulp.score,
        ulp.attempts
      FROM lessons l
      LEFT JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id AND ulp.user_id = {{params.userId}}
      WHERE l.course_id = {{params.courseId}}
      ORDER BY l.lesson_order ASC;
    `,
  });
}

export default loadLessons;
