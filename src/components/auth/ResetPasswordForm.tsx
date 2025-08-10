import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ResetPasswordFormProps {
  username: string;
  onBackToForgotPassword: () => void;
  onResetSuccess: () => void;
}

export function ResetPasswordForm({ username, onBackToForgotPassword, onResetSuccess }: ResetPasswordFormProps) {
  const [formData, setFormData] = useState({
    confirmationCode: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasNumber: false,
    hasLetter: false,
  });
  
  const { confirmResetPassword, isLoading, error, clearError } = useAuth();

  const validatePassword = (password: string) => {
    const validation = {
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasLetter: /[a-zA-Z]/.test(password),
    };
    setPasswordValidation(validation);
    return Object.values(validation).every(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.confirmationCode || !formData.newPassword || !formData.confirmPassword) {
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return;
    }

    if (!validatePassword(formData.newPassword)) {
      return;
    }

    try {
      await confirmResetPassword(username, formData.confirmationCode, formData.newPassword);
      onResetSuccess();
    } catch (error) {
      // Error is handled by the context
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'newPassword') {
      validatePassword(value);
    }
    
    if (error) clearError();
  };

  const isFormValid = () => {
    return (
      formData.confirmationCode &&
      formData.newPassword &&
      formData.confirmPassword &&
      formData.newPassword === formData.confirmPassword &&
      Object.values(passwordValidation).every(Boolean)
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Set New Password
        </CardTitle>
        <p className="text-muted-foreground">
          Enter the verification code sent to your email and choose a new password.
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
              value={formData.confirmationCode}
              onChange={handleInputChange('confirmationCode')}
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

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleInputChange('newPassword')}
                placeholder="Enter new password"
                disabled={isLoading}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isLoading}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Password validation indicators */}
            {formData.newPassword && (
              <div className="space-y-1 text-xs">
                <div className={`flex items-center gap-1 ${passwordValidation.minLength ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <CheckCircle className={`h-3 w-3 ${passwordValidation.minLength ? 'text-green-600' : 'text-muted-foreground'}`} />
                  At least 8 characters
                </div>
                <div className={`flex items-center gap-1 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <CheckCircle className={`h-3 w-3 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-muted-foreground'}`} />
                  Contains a number
                </div>
                <div className={`flex items-center gap-1 ${passwordValidation.hasLetter ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <CheckCircle className={`h-3 w-3 ${passwordValidation.hasLetter ? 'text-green-600' : 'text-muted-foreground'}`} />
                  Contains a letter
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                placeholder="Confirm new password"
                disabled={isLoading}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <p className="text-xs text-red-600">Passwords do not match</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting password...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={onBackToForgotPassword}
              className="p-0 h-auto font-semibold"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Back to reset request
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}