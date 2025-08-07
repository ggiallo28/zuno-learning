import { action } from '@uibakery/data';

function createUser() {
  return action('createUser', 'SQL', {
    databaseName: '[Sample] Custom App_PXDz6TLqtX',
    query: `
      INSERT INTO users (email, username, full_name, avatar_url)
      VALUES ({{params.email}}, {{params.username}}, {{params.fullName}}, {{params.avatarUrl}})
      RETURNING *;
    `,
  });
}

export default createUser;
