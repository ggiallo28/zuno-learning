import { Amplify } from 'aws-amplify';
import amplifyconfig from '../amplifyconfiguration.json';

export type AuthMode = 'cognito' | 'apikey';

export interface AuthConfig {
  mode: AuthMode;
  config: any;
}

// Determine auth mode based on environment
export function getAuthMode(): AuthMode {
  // Safe access to environment variables in browser
  const authMode = import.meta.env?.VITE_AUTH_MODE;
  const nodeEnv = import.meta.env?.MODE;
  const useApiKey = import.meta.env?.VITE_USE_API_KEY;
  
  // Check for explicit environment variable
  if (authMode === 'apikey') {
    return 'apikey';
  }
  
  // Check if we're in development mode
  if (nodeEnv === 'development' && useApiKey === 'true') {
    return 'apikey';
  }
  
  // Default to Cognito for production
  return 'cognito';
}

export function getAuthConfig(): AuthConfig {
  const mode = getAuthMode();
  
  if (mode === 'apikey') {
    // API Key configuration for local development
    return {
      mode: 'apikey',
      config: {
        ...amplifyconfig,
        aws_appsync_authenticationType: 'API_KEY',
        aws_appsync_apiKey: amplifyconfig.aws_appsync_apiKey,
      }
    };
  } else {
    // Cognito configuration for production
    return {
      mode: 'cognito',
      config: {
        ...amplifyconfig,
        aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
        // Remove API key for Cognito mode
        aws_appsync_apiKey: amplifyconfig.aws_appsync_apiKey,
      }
    };
  }
}

export function configureAmplify(): AuthConfig {
  const authConfig = getAuthConfig();
  
  console.log(`🔐 Configuring Amplify with ${authConfig.mode.toUpperCase()} authentication`);
  
  Amplify.configure(authConfig.config);
  
  return authConfig;
}