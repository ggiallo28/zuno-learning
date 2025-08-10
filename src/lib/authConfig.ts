import { Amplify } from 'aws-amplify';
import amplifyconfig from '../amplifyconfiguration.json';

export function configureAmplify() {
  console.log('🔐 Configuring Amplify with Cognito authentication');
  
  // Configure Amplify with the standard configuration
  // Amplify will use Cognito authentication as configured in the backend
  Amplify.configure(amplifyconfig);
}