import { AuthProvider } from '@/contexts/AuthContext';
import { CoachProvider } from '@/contexts/CoachContext';
import { ZunoManagerProvider } from '@/contexts/ZunoManagerContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthenticatedApp } from '@/components/AuthenticatedApp';

function App() {
  return (
    <AuthProvider>
      <CoachProvider>
        <ZunoManagerProvider>
          <ProtectedRoute>
            <AuthenticatedApp />
          </ProtectedRoute>
        </ZunoManagerProvider>
      </CoachProvider>
    </AuthProvider>
  );
}

export default App;
