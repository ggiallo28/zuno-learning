import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  onSignUpSuccess: (username: string) => void;
}



export function SignUpForm({ onSwitchToSignIn, onSignUpSuccess }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasNumber: false,
    hasLetter: false,
  });
  
  const { signUp, isLoading, error, clearError } = useAuth();

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
    
    if (!formData.username || !formData.email || !formData.password || !formData.fullName) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (!validatePassword(formData.password)) {
      return;
    }

    try {
      const result = await signUp(
        formData.username.trim(),
        formData.password,
        formData.email.trim(),
        formData.fullName.trim()
      );
    
      if (result.isSignUpComplete) {
        console.log('Sign up complete, user signed in');
      } else {
        onSignUpSuccess(formData.username);
      }
    } catch (error) {
      // handled by context
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'password') {
      validatePassword(value);
    }
    
    if (error) clearError();
  };

  const isFormValid = () => {
    return (
      formData.username &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.fullName &&
      formData.password === formData.confirmPassword &&
      Object.values(passwordValidation).every(Boolean)
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Join Zuno://
        </CardTitle>
        <p className="text-muted-foreground">Create your account to start learning</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange('fullName')}
              placeholder="Enter your full name"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange('username')}
              placeholder="Choose a username"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              placeholder="Enter your email"
              disabled={isLoading}
              required
            />
          </div>



          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                placeholder="Create a password"
                disabled={isLoading}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Password validation indicators */}
            {formData.password && (
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
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                placeholder="Confirm your password"
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
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
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
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>

          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Button
                type="button"
                variant="link"
                onClick={onSwitchToSignIn}
                className="p-0 h-auto font-semibold"
              >
                Sign in
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}