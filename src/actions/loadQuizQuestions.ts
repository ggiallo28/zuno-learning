import { action } from '@uibakery/data';

function loadQuizQuestions() {
  return action('loadQuizQuestions', 'SQL', {
    databaseName: '[Sample] Custom App_PXDz6TLqtX',
    query: `
      SELECT * FROM quiz_questions
      WHERE lesson_id = {{params.lessonId}}
      ORDER BY id ASC;
    `,
  });
}

export default loadQuizQuestions;
