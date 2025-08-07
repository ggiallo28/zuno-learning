// Simple test to verify Amplify configuration
import { Amplify } from 'aws-amplify';

export function testAmplifyConfiguration() {
  try {
    const config = Amplify.getConfig();
    console.log('✅ Amplify configuration loaded successfully');
    console.log('Config:', config);
    return true;
  } catch (error) {
    console.error('❌ Amplify configuration error:', error);
    return false;
  }
}

export function getAmplifyInfo() {
  const config = Amplify.getConfig();
  return {
    configured: !!config,
    hasConfig: Object.keys(config).length > 0
  };
}