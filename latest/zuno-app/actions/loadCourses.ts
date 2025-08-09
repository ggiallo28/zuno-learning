import { action } from '@uibakery/data';

function loadCourses() {
  return action('loadCourses', 'SQL', {
    databaseName: '[Sample] Custom App_PXDz6TLqtX',
    query: `
      SELECT 
        c.*,
        COUNT(l.id) as lesson_count
      FROM courses c
      LEFT JOIN lessons l ON c.id = l.course_id
      WHERE 
        COALESCE({{params.category}}, '') = '' 
        OR c.category = {{params.category}}
      GROUP BY c.id
      ORDER BY c.created_at DESC;
    `,
  });
}

export default loadCourses;
