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

const ASSETS_BASE =
  import.meta.env.VITE_ASSETS_BASE_URL ?? 'https://cdn.zuno.app/assets/avatars';

function getAge(birthdate?: string) {
  if (!birthdate) return undefined;
  const b = new Date(birthdate);
  if (Number.isNaN(b.getTime())) return undefined;
  const today = new Date();
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
  return Math.max(age, 0);
}

function getAgeBracket(age?: number): 'child' | 'teen' | 'adult' | 'senior' {
  if (age == null) return 'adult';
  if (age < 13) return 'child';
  if (age < 18) return 'teen';
  if (age < 65) return 'adult';
  return 'senior';
}

function normalizeGender(g?: string): 'male' | 'female' | 'other' | 'prefer-not-to-say' {
  const v = (g ?? '').toLowerCase();
  if (v === 'male') return 'male';
  if (v === 'female') return 'female';
  if (v === 'prefer-not-to-say') return 'prefer-not-to-say';
  return 'other';
}

function getDefaultPicture(gender?: string, birthdate?: string) {
  const age = getAge(birthdate);
  const bracket = getAgeBracket(age);
  const g = normalizeGender(gender);
  return `${ASSETS_BASE}/${g}-${bracket}.png`;
}

export function SignUpForm({ onSwitchToSignIn, onSignUpSuccess }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    birthdate: '',
    gender: '',
    locale: 'en-US',
    picture: '',
    profile: '',
    zoneinfo: 'America/New_York',
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
      const clean = (v?: string) => (v && v.trim() ? v.trim() : undefined);
    
      const picture = clean(formData.picture) ?? getDefaultPicture(formData.gender, formData.birthdate);
      const profile = clean(formData.profile) ?? (import.meta.env.VITE_DEFAULT_PROFILE ?? 'New Zuno user');
    
      const attributes: Record<string, string> = {
        name: clean(formData.fullName)!,
        birthdate: clean(formData.birthdate)!,
        gender: clean(formData.gender)!,
        locale: clean(formData.locale) ?? 'en-US',
        zoneinfo: clean(formData.zoneinfo) ?? 'UTC',
        picture,
        profile,
      };
    
      const result = await signUp(
        formData.username.trim(),
        formData.password,
        formData.email.trim(),
        attributes
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
      formData.birthdate &&
      formData.gender &&
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
            <Label htmlFor="birthdate">Date of Birth</Label>
            <Input
              id="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleInputChange('birthdate')}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="picture">Profile Picture URL (optional)</Label>
            <Input
              id="picture"
              type="url"
              value={formData.picture}
              onChange={handleInputChange('picture')}
              placeholder="https://example.com/photo.jpg"
              disabled={isLoading}
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