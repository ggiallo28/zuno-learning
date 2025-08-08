import { action } from '@uibakery/data';

function loadUserKnowledgeGaps() {
  return action('loadUserKnowledgeGaps', 'SQL', {
    databaseName: '[Sample] Custom App_PXDz6TLqtX',
    query: `
      SELECT 
        id,
        user_id,
        subject_area,
        concept_name,
        confidence_level,
        assessment_date,
        last_reviewed_at,
        review_count,
        mastery_status,
        created_at,
        updated_at
      FROM user_knowledge_gaps
      WHERE user_id = {{params.userId}}
      ORDER BY assessment_date DESC, mastery_status ASC;
    `,
  });
}

export default loadUserKnowledgeGaps;
