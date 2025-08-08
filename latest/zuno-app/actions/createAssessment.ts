import { action } from '@uibakery/data';

function createAssessment() {
  return action('createAssessment', 'SQL', {
    databaseName: '[Sample] Custom App_PXDz6TLqtX',
    query: `
      INSERT INTO user_assessments (
        user_id,
        assessment_type,
        subject_area,
        questions_data,
        answers_data,
        score,
        identified_gaps,
        recommendations,
        completed_at
      ) VALUES (
        {{params.userId}},
        {{params.assessmentType}},
        {{params.subjectArea}},
        {{params.questionsData}}::jsonb,
        {{params.answersData}}::jsonb,
        {{params.score}},
        {{params.identifiedGaps}}::jsonb,
        {{params.recommendations}}::jsonb,
        {{params.completedAt}}
      )
      RETURNING *;
    `,
  });
}

export default createAssessment;
