import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ForgotPasswordFormProps {
  onBackToSignIn: () => void;
  onResetCodeSent: (username: string) => void;
}

export function ForgotPasswordForm({ onBackToSignIn, onResetCodeSent }: ForgotPasswordFormProps) {
  const [username, setUsername] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { resetPassword, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    try {
      await resetPassword(username);
      setSuccessMessage('Password reset code sent to your email address.');
      onResetCodeSent(username);
    } catch (error) {
      // Error is handled by the context
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (error) clearError();
    if (successMessage) setSuccessMessage('');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Reset Your Password
        </CardTitle>
        <div className="flex items-center justify-center mb-4">
          <Mail className="h-12 w-12 text-blue-500" />
        </div>
        <p className="text-muted-foreground">
          Enter your username or email address and we'll send you a code to reset your password.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Username or Email</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={handleInputChange}
              placeholder="Enter your username or email"
              disabled={isLoading}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !username}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset code...
              </>
            ) : (
              'Send Reset Code'
            )}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={onBackToSignIn}
              className="p-0 h-auto font-semibold"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Back to sign in
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}