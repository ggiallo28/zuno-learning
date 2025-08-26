/**
 * Application configuration management
 * Centralizes environment variables and app settings
 */

export interface AppConfig {
  app: {
    name: string;
    version: string;
    description: string;
    environment: 'development' | 'production' | 'test';
  };
  features: {
    analytics: boolean;
    errorReporting: boolean;
    performanceMonitoring: boolean;
    debugMode: boolean;
    showBundleAnalyzer: boolean;
  };
  api: {
    timeout: number;
    maxRetryAttempts: number;
  };
  ui: {
    defaultTheme: 'light' | 'dark';
    enableAnimations: boolean;
    enableSoundEffects: boolean;
  };
}

/**
 * Get configuration value with fallback
 */
function getEnvVar(key: string, fallback: string = ''): string {
  return import.meta.env[key] || fallback;
}

function getEnvBool(key: string, fallback: boolean = false): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return fallback;
  return value === 'true' || value === '1';
}

function getEnvNumber(key: string, fallback: number = 0): number {
  const value = import.meta.env[key];
  if (value === undefined) return fallback;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Application configuration
 */
export const config: AppConfig = {
  app: {
    name: getEnvVar('VITE_APP_NAME', 'Zuno'),
    version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
    description: getEnvVar('VITE_APP_DESCRIPTION', 'Intelligenza Adattiva per l\'Apprendimento Professionale'),
    environment: (import.meta.env.MODE as AppConfig['app']['environment']) || 'development'
  },
  features: {
    analytics: getEnvBool('VITE_ENABLE_ANALYTICS', true),
    errorReporting: getEnvBool('VITE_ENABLE_ERROR_REPORTING', true),
    performanceMonitoring: getEnvBool('VITE_ENABLE_PERFORMANCE_MONITORING', true),
    debugMode: getEnvBool('VITE_DEBUG_MODE', !import.meta.env.PROD),
    showBundleAnalyzer: getEnvBool('VITE_SHOW_BUNDLE_ANALYZER', false)
  },
  api: {
    timeout: getEnvNumber('VITE_API_TIMEOUT', 30000),
    maxRetryAttempts: getEnvNumber('VITE_MAX_RETRY_ATTEMPTS', 3)
  },
  ui: {
    defaultTheme: (getEnvVar('VITE_DEFAULT_THEME', 'light') as AppConfig['ui']['defaultTheme']),
    enableAnimations: getEnvBool('VITE_ENABLE_ANIMATIONS', true),
    enableSoundEffects: getEnvBool('VITE_ENABLE_SOUND_EFFECTS', false)
  }
};

/**
 * Check if we're in development mode
 */
export const isDevelopment = config.app.environment === 'development';

/**
 * Check if we're in production mode
 */
export const isProduction = config.app.environment === 'production';

/**
 * Check if we're in test mode
 */
export const isTest = config.app.environment === 'test';

/**
 * Get app metadata for HTML head
 */
export function getAppMetadata() {
  return {
    title: config.app.name,
    description: config.app.description,
    version: config.app.version
  };
}

/**
 * Log configuration in development
 */
if (isDevelopment && config.features.debugMode) {
  console.log('🔧 App Configuration:', config);
}