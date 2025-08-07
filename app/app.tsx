'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoadAction, useMutateAction } from '@uibakery/data';
import { UserProfile } from '@/components/UserProfile';
import { CourseCatalog } from '@/components/CourseCatalog';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { CoachSelection } from '@/components/CoachSelection';
import { CoachProvider, useCoach } from '@/contexts/CoachContext';
import { BookOpen, User as UserIcon, Trophy, Settings, Plus, Palette } from 'lucide-react';
import confetti from 'canvas-confetti';

import loadCoursesAction from '@/actions/loadCourses';
import loadUserProfileAction from '@/actions/loadUserProfile';
import loadUserCoursesAction from '@/actions/loadUserCourses';
import createUserAction from '@/actions/createUser';
import enrollInCourseAction from '@/actions/enrollInCourse';
import updateUserCoachAction from '@/actions/updateUserCoach';

import type { User, Course, CoachType } from '@/types';

function AppContent() {
  const [currentUserId, setCurrentUserId] = useState<number>(1); // Demo user
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    username: '',
    fullName: '',
    avatarUrl: ''
  });
  const [showCoachSettings, setShowCoachSettings] = useState(false);

  const { currentCoach, coachConfig, theme, setCoach, getMotivationMessage } = useCoach();

  // Load data
  const [userProfile, userLoading] = useLoadAction(loadUserProfileAction, [], { userId: currentUserId });
  const [allCourses, coursesLoading] = useLoadAction(loadCoursesAction, [], { category: '' });
  const [userCourses, userCoursesLoading] = useLoadAction(loadUserCoursesAction, [], { userId: currentUserId });

  // Mutations
  const [createUser, creatingUser] = useMutateAction(createUserAction);
  const [enrollInCourse, enrolling] = useMutateAction(enrollInCourseAction);
  const [updateUserCoach, updatingCoach] = useMutateAction(updateUserCoachAction);

  const user: User | null = userProfile?.[0] || null;
  const courses: Course[] = allCourses || [];
  const enrolledCourses: Course[] = userCourses || [];

  const handleCreateUser = async () => {
    if (!newUserForm.email || !newUserForm.username || !newUserForm.fullName) return;
    
    try {
      const result = await createUser({
        email: newUserForm.email,
        username: newUserForm.username,
        fullName: newUserForm.fullName,
        avatarUrl: newUserForm.avatarUrl || null
      });
      
      if (result?.[0]) {
        setCurrentUserId(result[0].id);
        setNewUserForm({ email: '', username: '', fullName: '', avatarUrl: '' });
        confetti({ particleCount: 100, spread: 70 });
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleCompleteOnboarding = async (coachType: CoachType) => {
    try {
      await updateUserCoach({
        userId: currentUserId,
        coachType: coachType,
        onboardingCompleted: true
      });
      
      setCoach(coachType);
      confetti({ particleCount: 200, spread: 100 });
      // Refresh user data
      window.location.reload();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const handleCoachChange = async (coachType: CoachType) => {
    try {
      await updateUserCoach({
        userId: currentUserId,
        coachType: coachType,
        onboardingCompleted: true
      });
      
      setCoach(coachType);
      setShowCoachSettings(false);
      confetti({ particleCount: 100, spread: 70 });
    } catch (error) {
      console.error('Error updating coach:', error);
    }
  };

  const handleEnrollInCourse = async (courseId: number) => {
    try {
      await enrollInCourse({ userId: currentUserId, courseId });
      confetti({ particleCount: 50, spread: 60 });
      // Refresh data would happen automatically in a real app
      window.location.reload(); // Simple refresh for demo
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  // Demo data seeding button
  const seedDemoData = async () => {
    console.log('Demo data seeding would happen here');
    confetti({ particleCount: 200, spread: 100 });
  };

  // Show onboarding if user hasn't completed it
  if (user && !user.onboarding_completed) {
    return (
      <OnboardingFlow 
        onComplete={handleCompleteOnboarding}
        isSubmitting={updatingCoach}
      />
    );
  }

  if (!user && !userLoading) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome to Zuno://</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-muted-foreground mb-6">
              Create your account to start your learning journey
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newUserForm.username}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="learner123"
                />
              </div>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={newUserForm.fullName}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="avatarUrl">Avatar URL (optional)</Label>
                <Input
                  id="avatarUrl"
                  value={newUserForm.avatarUrl}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, avatarUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>
            
            <Button 
              onClick={handleCreateUser} 
              disabled={creatingUser}
              className="w-full"
            >
              {creatingUser ? 'Creating...' : 'Create Account'}
            </Button>

            <div className="text-center">
              <Button 
                onClick={seedDemoData} 
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Demo Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <div className="text-center">Loading your learning dashboard...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6" style={{ backgroundColor: theme.background }}>
      {/* Header with Coach Integration */}
      <div className="mb-8 relative">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: theme.primary }}>
              Zuno://
            </h1>
            <p className="text-muted-foreground">
              La tua esperienza di apprendimento personalizzata
            </p>
          </div>
          
          {coachConfig && (
            <div className="text-right">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-sm">
                  <div className="font-semibold" style={{ color: theme.primary }}>
                    {coachConfig.display_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {coachConfig.learning_style}
                  </div>
                </div>
                <div 
                  className="p-2 rounded-full"
                  style={{ backgroundColor: `${theme.primary}15` }}
                >
                  {(() => {
                    const IconComponent = currentCoach === 'elia' ? BookOpen : 
                                        currentCoach === 'skippy' ? Trophy : 
                                        UserIcon;
                    return <IconComponent className="h-5 w-5" style={{ color: theme.primary }} />;
                  })()}
                </div>
              </div>
              <div 
                className="text-xs italic px-3 py-1 rounded-full text-center"
                style={{ 
                  backgroundColor: `${theme.accent}10`,
                  color: theme.accent 
                }}
              >
                {getMotivationMessage()}
              </div>
            </div>
          )}
        </div>
      </div>

      {user && <UserProfile user={user} />}

      <Tabs defaultValue="catalog" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="catalog" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Catalogo
          </TabsTrigger>
          <TabsTrigger value="mycourses" className="flex items-center">
            <UserIcon className="h-4 w-4 mr-2" />
            I miei Corsi
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center">
            <Trophy className="h-4 w-4 mr-2" />
            Obiettivi
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Impostazioni
          </TabsTrigger>
        </TabsList>

        <TabsContent value="catalog">
          <CourseCatalog 
            courses={courses}
            onEnrollInCourse={handleEnrollInCourse}
            isEnrolling={enrolling}
          />
        </TabsContent>

        <TabsContent value="mycourses">
          <div className="space-y-6">
            {enrolledCourses.length > 0 ? (
              <CourseCatalog 
                courses={enrolledCourses}
                onEnrollInCourse={handleEnrollInCourse}
                isEnrolling={false}
              />
            ) : (
              <Card className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No enrolled courses yet</h3>
                <p className="text-muted-foreground mb-4">
                  Browse our catalog and enroll in your first course to get started!
                </p>
                <Button onClick={() => {
                  const catalogTab = document.querySelector('[data-radix-collection-item][value="catalog"]') as HTMLElement;
                  catalogTab?.click();
                }}>
                  Browse Courses
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <Card className="p-12 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Achievements Coming Soon</h3>
            <p className="text-muted-foreground">
              Complete lessons and courses to earn badges and unlock achievements!
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Coach e Personalizzazione
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Coach Attuale</h4>
                    <p className="text-sm text-muted-foreground">
                      {coachConfig?.display_name} - {coachConfig?.learning_style}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowCoachSettings(true)}
                  >
                    Cambia Coach
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 p-4 rounded-lg" style={{ backgroundColor: `${theme.primary}10` }}>
                  <div className="text-center">
                    <div 
                      className="w-4 h-4 rounded-full mx-auto mb-1"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div className="text-xs text-muted-foreground">Primario</div>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-4 h-4 rounded-full mx-auto mb-1"
                      style={{ backgroundColor: theme.secondary }}
                    />
                    <div className="text-xs text-muted-foreground">Secondario</div>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-4 h-4 rounded-full mx-auto mb-1"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <div className="text-xs text-muted-foreground">Accento</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 text-center">
              <Settings className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Altre Impostazioni</h3>
              <p className="text-muted-foreground text-sm">
                Ulteriori opzioni di personalizzazione saranno disponibili presto.
              </p>
            </Card>
          </div>

          {/* Coach Settings Dialog */}
          <Dialog open={showCoachSettings} onOpenChange={setShowCoachSettings}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Cambia il tuo Coach</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <CoachSelection 
                  onCoachSelect={handleCoachChange}
                  selectedCoach={currentCoach}
                  isSubmitting={updatingCoach}
                />
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function App() {
  return (
    <CoachProvider>
      <AppContent />
    </CoachProvider>
  );
}

export default App;
