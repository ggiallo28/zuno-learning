import { action } from '@uibakery/data';

function loadUserProfile() {
  return action('loadUserProfile', 'SQL', {
    databaseName: '[Sample] Custom App_PXDz6TLqtX',
    query: `
      SELECT 
        u.*,
        COUNT(uc.id) as enrolled_courses,
        COUNT(CASE WHEN uc.completed_at IS NOT NULL THEN 1 END) as completed_courses
      FROM users u
      LEFT JOIN user_courses uc ON u.id = uc.user_id
      WHERE u.id = {{params.userId}}
      GROUP BY u.id;
    `,
  });
}

export default loadUserProfile;
