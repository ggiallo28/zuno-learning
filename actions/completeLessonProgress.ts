import { action } from '@uibakery/data';

function completeLessonProgress() {
  return action('completeLessonProgress', 'SQL', {
    databaseName: '[Sample] Custom App_PXDz6TLqtX',
    query: `
      INSERT INTO user_lesson_progress (user_id, lesson_id, completed_at, score, attempts, time_spent_minutes)
      VALUES ({{params.userId}}, {{params.lessonId}}, CURRENT_TIMESTAMP, {{params.score}}, {{params.attempts}}, {{params.timeSpent}})
      ON CONFLICT (user_id, lesson_id) 
      DO UPDATE SET 
        completed_at = CURRENT_TIMESTAMP,
        score = GREATEST(user_lesson_progress.score, {{params.score}}),
        attempts = user_lesson_progress.attempts + 1,
        time_spent_minutes = user_lesson_progress.time_spent_minutes + {{params.timeSpent}},
        last_attempt_at = CURRENT_TIMESTAMP
      RETURNING *;
    `,
  });
}

export default completeLessonProgress;
