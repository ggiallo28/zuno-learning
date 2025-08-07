// Update user coach and onboarding status
import { action } from '@uibakery/data';

function updateUserCoach() {
  return action('updateUserCoach', 'SQL', {
    databaseName: '[Sample] Custom App_PXDz6TLqtX',
    query: `
      UPDATE users 
      SET coach_type = {{params.coachType}}, 
          onboarding_completed = {{params.onboardingCompleted}},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = {{params.userId}}
      RETURNING *;
    `,
  });
}

export default updateUserCoach;
