import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, Shield, Settings, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function AuthModeToggle() {
  const { authMode, switchToApiKeyMode, switchToCognitoMode, isLoading } = useAuth();
  const [switching, setSwitching] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleModeSwitch = async (mode: 'apikey' | 'cognito') => {
    setSwitching(true);
    try {
      if (mode === 'apikey') {
        switchToApiKeyMode();
      } else {
        switchToCognitoMode();
      }
      // Small delay to show the switching state
      setTimeout(() => setSwitching(false), 1000);
    } catch (error) {
      console.error('Error switching auth mode:', error);
      setSwitching(false);
    }
  };

  return (
    <Card className="border-dashed border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm text-orange-800">
          <Settings className="h-4 w-4" />
          Development Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Auth Mode:</span>
            <Badge 
              variant={authMode === 'cognito' ? 'default' : 'secondary'}
              className="flex items-center gap-1"
            >
              {authMode === 'cognito' ? (
                <Shield className="h-3 w-3" />
              ) : (
                <Key className="h-3 w-3" />
              )}
              {authMode.toUpperCase()}
            </Badge>
          </div>
          
          {switching && (
            <RefreshCw className="h-4 w-4 animate-spin text-orange-600" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={authMode === 'apikey' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleModeSwitch('apikey')}
            disabled={isLoading || switching || authMode === 'apikey'}
            className="flex items-center gap-1"
          >
            <Key className="h-3 w-3" />
            API Key
          </Button>
          
          <Button
            variant={authMode === 'cognito' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleModeSwitch('cognito')}
            disabled={isLoading || switching || authMode === 'cognito'}
            className="flex items-center gap-1"
          >
            <Shield className="h-3 w-3" />
            Cognito
          </Button>
        </div>

        <div className="text-xs text-orange-700 space-y-1">
          <div><strong>API Key:</strong> Local development, no sign-up required</div>
          <div><strong>Cognito:</strong> Production auth with user management</div>
        </div>
      </CardContent>
    </Card>
  );
}