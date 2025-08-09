import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentUser, signIn, signUp, signOut, confirmSignUp, resendSignUpCode, type AuthUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { getAuthMode, type AuthMode } from '@/lib/authConfig';
import { configureAmplify } from '@/lib/authConfig';

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  authMode: AuthMode;
}

export interface AuthContextValue extends AuthState {
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, email: string, attributes?: Record<string, string>) => Promise<{ isSignUpComplete: boolean; nextStep: any }>;
  signOut: () => Promise<void>;
  confirmSignUp: (username: string, confirmationCode: string) => Promise<void>;
  resendSignUpCode: (username: string) => Promise<void>;
  clearError: () => void;
  switchToApiKeyMode: () => void;
  switchToCognitoMode: () => void;
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
    authMode: getAuthMode(),
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
      
      // In API Key mode, we skip Cognito authentication
      if (authState.authMode === 'apikey') {
        console.log('🔑 API Key mode: Skipping Cognito authentication');
        setAuthState(prev => ({
          ...prev,
          user: {
            userId: 'api-key-user',
            username: 'developer',
            signInDetails: { loginId: 'developer@localhost' }
          } as AuthUser,
          isAuthenticated: true,
          isLoading: false,
        }));
        return;
      }
      
      // In Cognito mode, check for authenticated user
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
        isAuthenticated: authState.authMode === 'apikey', // Always authenticated in API key mode
        isLoading: false,
      }));
    }
  };

  const handleSignIn = async (username: string, password: string) => {
    // In API Key mode, skip Cognito sign in
    if (authState.authMode === 'apikey') {
      console.log('🔑 API Key mode: Skipping Cognito sign in');
      await checkAuthState();
      return;
    }
    
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

  const handleSignUp = async (username: string, password: string, email: string, attributes: Record<string, string> = {}) => {
    // In API Key mode, skip Cognito sign up
    if (authState.authMode === 'apikey') {
      console.log('🔑 API Key mode: Skipping Cognito sign up');
      await checkAuthState();
      return { isSignUpComplete: true, nextStep: { signUpStep: 'DONE' } };
    }
    
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const signUpAttributes = {
        email,
        name: attributes.name || username,
        birthdate: attributes.birthdate,
        gender: attributes.gender,
        locale: attributes.locale || 'en-US',
        picture: attributes.picture || '',
        profile: attributes.profile || '',
        zoneinfo: attributes.zoneinfo || 'America/New_York',
      };

      const result = await signUp({
        username,
        password,
        options: {
          userAttributes: signUpAttributes,
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
    // In API Key mode, just clear the state
    if (authState.authMode === 'apikey') {
      console.log('🔑 API Key mode: Clearing auth state');
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }));
      return;
    }
    
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
    // In API Key mode, skip confirmation
    if (authState.authMode === 'apikey') {
      console.log('🔑 API Key mode: Skipping confirmation');
      return;
    }
    
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
    // In API Key mode, skip resend
    if (authState.authMode === 'apikey') {
      console.log('🔑 API Key mode: Skipping resend code');
      return;
    }
    
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

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const switchToApiKeyMode = () => {
    console.log('🔑 Switching to API Key mode');
    setAuthState(prev => ({ ...prev, authMode: 'apikey' }));
    // Reconfigure Amplify and check auth state
    configureAmplify();
    checkAuthState();
  };

  const switchToCognitoMode = () => {
    console.log('🔐 Switching to Cognito mode');
    setAuthState(prev => ({ ...prev, authMode: 'cognito' }));
    // Reconfigure Amplify and check auth state
    configureAmplify();
    checkAuthState();
  };

  const contextValue: AuthContextValue = {
    ...authState,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    confirmSignUp: handleConfirmSignUp,
    resendSignUpCode: handleResendSignUpCode,
    clearError,
    switchToApiKeyMode,
    switchToCognitoMode,
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