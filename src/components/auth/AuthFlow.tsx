import { useState } from 'react';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { ConfirmSignUpForm } from './ConfirmSignUpForm';

type AuthFlowState = 'signIn' | 'signUp' | 'confirmSignUp' | 'forgotPassword';

interface AuthFlowProps {
  onAuthSuccess?: () => void;
}

export function AuthFlow({ onAuthSuccess }: AuthFlowProps) {
  const [currentState, setCurrentState] = useState<AuthFlowState>('signIn');
  const [pendingUsername, setPendingUsername] = useState<string>('');

  const handleSwitchToSignUp = () => {
    setCurrentState('signUp');
  };

  const handleSwitchToSignIn = () => {
    setCurrentState('signIn');
  };

  const handleSignUpSuccess = (username: string) => {
    setPendingUsername(username);
    setCurrentState('confirmSignUp');
  };

  const handleConfirmationSuccess = () => {
    // After successful confirmation, user will be automatically signed in
    // The AuthContext will handle the state change
    onAuthSuccess?.();
  };

  const handleBackToSignUp = () => {
    setCurrentState('signUp');
  };

  const handleForgotPassword = () => {
    setCurrentState('forgotPassword');
    // TODO: Implement forgot password flow
    console.log('Forgot password flow not implemented yet');
  };

  switch (currentState) {
    case 'signIn':
      return (
        <SignInForm
          onSwitchToSignUp={handleSwitchToSignUp}
          onForgotPassword={handleForgotPassword}
        />
      );

    case 'signUp':
      return (
        <SignUpForm
          onSwitchToSignIn={handleSwitchToSignIn}
          onSignUpSuccess={handleSignUpSuccess}
        />
      );

    case 'confirmSignUp':
      return (
        <ConfirmSignUpForm
          username={pendingUsername}
          onBackToSignUp={handleBackToSignUp}
          onConfirmationSuccess={handleConfirmationSuccess}
        />
      );

    case 'forgotPassword':
      // TODO: Implement forgot password component
      return (
        <div className="text-center">
          <p>Forgot password flow coming soon...</p>
          <button onClick={handleSwitchToSignIn}>Back to Sign In</button>
        </div>
      );

    default:
      return null;
  }
}