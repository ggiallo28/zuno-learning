import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ConfirmSignUpFormProps {
  username: string;
  onBackToSignUp: () => void;
  onConfirmationSuccess: () => void;
}

export function ConfirmSignUpForm({ username, onBackToSignUp, onConfirmationSuccess }: ConfirmSignUpFormProps) {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const { confirmSignUp, resendSignUpCode, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationCode) return;

    try {
      await confirmSignUp(username, confirmationCode);
      onConfirmationSuccess();
    } catch (error) {
      // Error is handled by the context
    }
  };

  const handleResendCode = async () => {
    try {
      setIsResending(true);
      await resendSignUpCode(username);
      // Show success message or toast
    } catch (error) {
      // Error is handled by the context
    } finally {
      setIsResending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmationCode(e.target.value);
    if (error) clearError();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Verify Your Email
        </CardTitle>
        <div className="flex items-center justify-center mb-4">
          <Mail className="h-12 w-12 text-blue-500" />
        </div>
        <p className="text-muted-foreground">
          We've sent a verification code to your email address. Please enter it below to complete your registration.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="confirmationCode">Verification Code</Label>
            <Input
              id="confirmationCode"
              type="text"
              value={confirmationCode}
              onChange={handleInputChange}
              placeholder="Enter 6-digit code"
              disabled={isLoading}
              maxLength={6}
              className="text-center text-lg tracking-widest"
              required
            />
            <p className="text-xs text-muted-foreground text-center">
              Code sent to the email address for <strong>{username}</strong>
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !confirmationCode || confirmationCode.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>

          <div className="text-center space-y-2">
            <Button
              type="button"
              variant="link"
              onClick={handleResendCode}
              disabled={isResending || isLoading}
              className="text-sm"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Resending...
                </>
              ) : (
                'Resend verification code'
              )}
            </Button>
            
            <div className="text-sm">
              <Button
                type="button"
                variant="link"
                onClick={onBackToSignUp}
                className="p-0 h-auto font-semibold"
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                Back to sign up
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}