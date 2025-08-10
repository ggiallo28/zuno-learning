import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CoachProvider } from '@/contexts/CoachContext';
import { ZunoManagerProvider } from '@/contexts/ZunoManagerContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthenticatedApp } from '@/components/AuthenticatedApp';
import { HomePage } from '@/components/HomePage';
import { AuthFlow } from '@/components/auth/AuthFlow';

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();



  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
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
  );
}

function App() {
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
