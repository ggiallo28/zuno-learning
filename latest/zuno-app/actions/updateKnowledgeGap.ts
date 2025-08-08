import { action } from '@uibakery/data';

function updateKnowledgeGap() {
  return action('updateKnowledgeGap', 'SQL', {
    databaseName: '[Sample] Custom App_PXDz6TLqtX',
    query: `
      INSERT INTO user_knowledge_gaps (
        user_id,
        subject_area,
        concept_name,
        confidence_level,
        mastery_status,
        assessment_date
      ) VALUES (
        {{params.userId}},
        {{params.subjectArea}},
        {{params.conceptName}},
        {{params.confidenceLevel}},
        {{params.masteryStatus}},
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (user_id, subject_area, concept_name) 
      DO UPDATE SET
        confidence_level = EXCLUDED.confidence_level,
        mastery_status = EXCLUDED.mastery_status,
        assessment_date = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `,
  });
}

export default updateKnowledgeGap;
