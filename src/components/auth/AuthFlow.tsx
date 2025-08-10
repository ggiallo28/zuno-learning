import { useState } from 'react';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { ConfirmSignUpForm } from './ConfirmSignUpForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';

type AuthFlowState = 'signIn' | 'signUp' | 'confirmSignUp' | 'forgotPassword' | 'resetPassword';

interface AuthFlowProps {
  onAuthSuccess?: () => void;
}

export function AuthFlow({ onAuthSuccess }: AuthFlowProps) {
  const [currentState, setCurrentState] = useState<AuthFlowState>('signIn');
  const [pendingUsername, setPendingUsername] = useState<string>('');
  const [resetUsername, setResetUsername] = useState<string>('');

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
  };

  const handleResetCodeSent = (username: string) => {
    setResetUsername(username);
    setCurrentState('resetPassword');
  };

  const handleResetSuccess = () => {
    // After successful password reset, go back to sign in
    setCurrentState('signIn');
    setResetUsername('');
  };

  const handleBackToForgotPassword = () => {
    setCurrentState('forgotPassword');
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
      return (
        <ForgotPasswordForm
          onBackToSignIn={handleSwitchToSignIn}
          onResetCodeSent={handleResetCodeSent}
        />
      );

    case 'resetPassword':
      return (
        <ResetPasswordForm
          username={resetUsername}
          onBackToForgotPassword={handleBackToForgotPassword}
          onResetSuccess={handleResetSuccess}
        />
      );

    default:
      return null;
  }
}