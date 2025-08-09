import { action } from '@uibakery/data';

function loadUserAssessments() {
  return action('loadUserAssessments', 'SQL', {
    databaseName: '[Sample] Custom App_PXDz6TLqtX',
    query: `
      SELECT 
        id,
        user_id,
        assessment_type,
        subject_area,
        questions_data,
        answers_data,
        score,
        identified_gaps,
        recommendations,
        completed_at,
        created_at
      FROM user_assessments
      WHERE user_id = {{params.userId}}
      ORDER BY created_at DESC
      LIMIT {{params.limit}};
    `,
  });
}

export default loadUserAssessments;
