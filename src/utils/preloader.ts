/**
 * Route Preloader for Zuno Learning App
 * 
 * This utility helps preload critical routes and components to improve
 * perceived performance and user experience.
 */

// Preload functions for lazy-loaded components
export const preloadHomePage = () => {
  return import('@/components/HomePage');
};

export const preloadAuthFlow = () => {
  return import('@/components/auth/AuthFlow');
};

export const preloadAuthenticatedApp = () => {
  return import('@/components/AuthenticatedApp');
};

export const preloadCourseCatalog = () => {
  return import('@/components/CourseCatalog');
};

export const preloadAssessmentSystem = () => {
  return import('@/components/AssessmentSystem');
};

export const preloadOnboardingFlow = () => {
  return import('@/components/OnboardingFlow');
};

export const preloadCoachSelection = () => {
  return import('@/components/CoachSelection');
};

// Preload critical routes based on user state
export const preloadCriticalRoutes = async (isAuthenticated: boolean) => {
  if (isAuthenticated) {
    // Preload authenticated app components
    await Promise.allSettled([
      preloadAuthenticatedApp(),
      preloadCourseCatalog(),
      preloadAssessmentSystem()
    ]);
  } else {
    // Preload auth flow for unauthenticated users
    await preloadAuthFlow();
  }
};

// Preload on user interaction (hover, focus)
export const preloadOnInteraction = (componentName: string) => {
  switch (componentName) {
    case 'home':
      return preloadHomePage();
    case 'auth':
      return preloadAuthFlow();
    case 'app':
      return preloadAuthenticatedApp();
    case 'courses':
      return preloadCourseCatalog();
    case 'assessment':
      return preloadAssessmentSystem();
    case 'onboarding':
      return preloadOnboardingFlow();
    case 'coach':
      return preloadCoachSelection();
    default:
      return Promise.resolve();
  }
};

// Preload with idle callback for better performance
export const preloadWhenIdle = (preloadFn: () => Promise<any>) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      preloadFn().catch(console.error);
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      preloadFn().catch(console.error);
    }, 100);
  }
};

// Batch preload multiple components
export const batchPreload = (componentNames: string[]) => {
  return Promise.allSettled(
    componentNames.map(name => preloadOnInteraction(name))
  );
};