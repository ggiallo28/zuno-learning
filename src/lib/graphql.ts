import { generateClient } from 'aws-amplify/api';

export const client = generateClient({
  authMode: 'apiKey'
});

export default client;