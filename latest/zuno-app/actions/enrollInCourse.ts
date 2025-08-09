import { action } from '@uibakery/data';

function enrollInCourse() {
  return action('enrollInCourse', 'SQL', {
    databaseName: '[Sample] Custom App_PXDz6TLqtX',
    query: `
      INSERT INTO user_courses (user_id, course_id)
      VALUES ({{params.userId}}, {{params.courseId}})
      ON CONFLICT (user_id, course_id) DO NOTHING
      RETURNING *;
    `,
  });
}

export default enrollInCourse;
