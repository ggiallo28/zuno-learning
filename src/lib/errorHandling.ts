/**
 * Error handling utilities for production deployment
 */

export interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  userId?: string;
  additionalInfo?: Record<string, any>;
}

/**
 * Global error handler for unhandled promise rejections and runtime errors
 */
export function setupGlobalErrorHandling() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    const errorReport: ErrorReport = {
      message: `Unhandled Promise Rejection: ${event.reason?.message || event.reason}`,
      stack: event.reason?.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      additionalInfo: {
        type: 'unhandledrejection',
        reason: event.reason
      }
    };
    
    reportError(errorReport);
    
    // Prevent the default browser behavior
    event.preventDefault();
  });

  // Handle uncaught JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
    
    const errorReport: ErrorReport = {
      message: event.message,
      stack: event.error?.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      additionalInfo: {
        type: 'javascript',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    };
    
    reportError(errorReport);
  });

  // Handle resource loading errors
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      const target = event.target as HTMLElement;
      console.error('Resource loading error:', target.tagName, target.getAttribute('src') || target.getAttribute('href'));
      
      const errorReport: ErrorReport = {
        message: `Resource loading failed: ${target.tagName}`,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        additionalInfo: {
          type: 'resource',
          tagName: target.tagName,
          src: target.getAttribute('src') || target.getAttribute('href'),
          outerHTML: target.outerHTML
        }
      };
      
      reportError(errorReport);
    }
  }, true);
}

/**
 * Report error to logging service (in production)
 */
function reportError(errorReport: ErrorReport) {
  // In development, just log to console
  if (!import.meta.env.PROD) {
    console.error('Error Report:', errorReport);
    return;
  }

  // In production, you would send this to your error reporting service
  // Examples: Sentry, LogRocket, Bugsnag, etc.
  try {
    // Example implementation:
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorReport)
    // }).catch(err => console.error('Failed to report error:', err));
    
    // For now, just store in localStorage for debugging
    const errors = JSON.parse(localStorage.getItem('zuno_errors') || '[]');
    errors.push(errorReport);
    // Keep only last 10 errors
    if (errors.length > 10) {
      errors.splice(0, errors.length - 10);
    }
    localStorage.setItem('zuno_errors', JSON.stringify(errors));
  } catch (err) {
    console.error('Failed to report error:', err);
  }
}

/**
 * Manually report an error
 */
export function reportManualError(error: Error, additionalInfo?: Record<string, any>) {
  const errorReport: ErrorReport = {
    message: error.message,
    stack: error.stack,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
    additionalInfo: {
      type: 'manual',
      ...additionalInfo
    }
  };
  
  reportError(errorReport);
}

/**
 * Async error wrapper for handling promise-based operations
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context?: string
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    console.error(`Error in ${context || 'async operation'}:`, error);
    
    if (error instanceof Error) {
      reportManualError(error, { context });
    }
    
    return null;
  }
}

/**
 * Sync error wrapper for handling synchronous operations
 */
export function withSyncErrorHandling<T>(
  operation: () => T,
  context?: string,
  fallback?: T
): T | null {
  try {
    return operation();
  } catch (error) {
    console.error(`Error in ${context || 'sync operation'}:`, error);
    
    if (error instanceof Error) {
      reportManualError(error, { context });
    }
    
    return fallback ?? null;
  }
}