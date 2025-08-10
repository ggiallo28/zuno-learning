import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CoachProvider } from '@/contexts/CoachContext';
import { ZunoManagerProvider } from '@/contexts/ZunoManagerContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { preloadCriticalRoutes, preloadWhenIdle } from '@/utils/preloader';
import { initPerformanceMonitoring } from '@/utils/performance';

// Lazy load main components for code splitting
const HomePage = lazy(() => import('@/components/HomePage').then(module => ({ default: module.HomePage })));
const AuthFlow = lazy(() => import('@/components/auth/AuthFlow').then(module => ({ default: module.AuthFlow })));
const AuthenticatedApp = lazy(() => import('@/components/AuthenticatedApp').then(module => ({ default: module.AuthenticatedApp })));

// Loading component for suspense fallbacks
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div>Loading...</div>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  // Preload critical routes based on authentication state
  useEffect(() => {
    if (!isLoading) {
      preloadWhenIdle(() => preloadCriticalRoutes(isAuthenticated));
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={<HomePage />} 
        />
        
        {/* Auth routes */}
        <Route 
          path="/auth" 
          element={
            isAuthenticated ? (
              <Navigate to="/app" replace />
            ) : (
              <AuthFlow />
            )
          } 
        />
        
        {/* Protected app routes */}
        <Route 
          path="/app/*" 
          element={
            <ProtectedRoute>
              <AuthenticatedApp />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  // Initialize performance monitoring
  useEffect(() => {
    initPerformanceMonitoring();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CoachProvider>
          <ZunoManagerProvider>
            <AppRoutes />
          </ZunoManagerProvider>
        </CoachProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
