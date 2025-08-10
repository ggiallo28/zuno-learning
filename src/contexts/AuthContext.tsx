import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentUser, signIn, signUp, signOut, confirmSignUp, resendSignUpCode, resetPassword, confirmResetPassword, type AuthUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthContextValue extends AuthState {
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, email: string, name: string) => Promise<{ isSignUpComplete: boolean; nextStep: any }>;
  signOut: () => Promise<void>;
  confirmSignUp: (username: string, confirmationCode: string) => Promise<void>;
  resendSignUpCode: (username: string) => Promise<void>;
  resetPassword: (username: string) => Promise<void>;
  confirmResetPassword: (username: string, confirmationCode: string, newPassword: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Check current authentication status on mount
  useEffect(() => {
    checkAuthState();
  }, []);

  // Listen to authentication events
  useEffect(() => {
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          console.log('User signed in');
          checkAuthState();
          break;
        case 'signedOut':
          console.log('User signed out');
          setAuthState(prev => ({
            ...prev,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          }));
          break;
        case 'tokenRefresh':
          console.log('Token refreshed');
          break;
        case 'tokenRefresh_failure':
          console.log('Token refresh failed');
          handleSignOut();
          break;
        case 'signInWithRedirect':
          console.log('Sign in with redirect');
          checkAuthState();
          break;
        case 'signInWithRedirect_failure':
          console.log('Sign in with redirect failed');
          setAuthState(prev => ({
            ...prev,
            error: 'Sign in with redirect failed',
            isLoading: false,
          }));
          break;
      }
    });

    return unsubscribe;
  }, []);

  const checkAuthState = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Check for authenticated user with Cognito
      const user = await getCurrentUser();
      setAuthState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false,
      }));
    } catch (error) {
      console.log('No authenticated user');
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }));
    }
  };

  const handleSignIn = async (username: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      await signIn({ username, password });
      await checkAuthState();
    } catch (error: any) {
      console.error('Sign in error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Sign in failed',
        isLoading: false,
      }));
      throw error;
    }
  };

  const handleSignUp = async (username: string, password: string, email: string, name: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      });

      setAuthState(prev => ({ ...prev, isLoading: false }));
      return result;
    } catch (error: any) {
      console.error('Sign up error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Sign up failed',
        isLoading: false,
      }));
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      await signOut();
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Sign out error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Sign out failed',
        isLoading: false,
      }));
    }
  };

  const handleConfirmSignUp = async (username: string, confirmationCode: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      await confirmSignUp({ username, confirmationCode });
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      console.error('Confirm sign up error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Confirmation failed',
        isLoading: false,
      }));
      throw error;
    }
  };

  const handleResendSignUpCode = async (username: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      await resendSignUpCode({ username });
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      console.error('Resend code error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Resend code failed',
        isLoading: false,
      }));
      throw error;
    }
  };

  const handleResetPassword = async (username: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      await resetPassword({ username });
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      console.error('Reset password error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Reset password failed',
        isLoading: false,
      }));
      throw error;
    }
  };

  const handleConfirmResetPassword = async (username: string, confirmationCode: string, newPassword: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      await confirmResetPassword({ username, confirmationCode, newPassword });
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      console.error('Confirm reset password error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Password reset confirmation failed',
        isLoading: false,
      }));
      throw error;
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const contextValue: AuthContextValue = {
    ...authState,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    confirmSignUp: handleConfirmSignUp,
    resendSignUpCode: handleResendSignUpCode,
    resetPassword: handleResetPassword,
    confirmResetPassword: handleConfirmResetPassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}