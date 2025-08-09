import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthFlow } from './AuthFlow';
import { AuthModeToggle } from '@/components/dev/AuthModeToggle';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, authMode } = useAuth();

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </Card>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="w-full max-w-md space-y-4">
          {/* Show auth mode toggle in development */}
          {import.meta.env?.MODE === 'development' && <AuthModeToggle />}
          
          {/* Show auth flow only in Cognito mode */}
          {authMode === 'cognito' && <AuthFlow />}
          
          {/* In API Key mode, show a simple message */}
          {authMode === 'apikey' && (
            <Card className="p-6 text-center">
              <h2 className="text-lg font-semibold mb-2">API Key Mode</h2>
              <p className="text-muted-foreground">
                Authentication bypassed for local development
              </p>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Show auth mode toggle in development */}
      {import.meta.env?.MODE === 'development' && (
        <div className="fixed top-4 right-4 z-50">
          <AuthModeToggle />
        </div>
      )}
      {children}
    </>
  );
}