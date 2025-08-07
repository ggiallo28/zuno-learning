'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserProfile } from '@/components/UserProfile';
import { CourseCatalog } from '@/components/CourseCatalog';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { CoachSelection } from '@/components/CoachSelection';
import { CoachProvider, useCoach } from '@/contexts/CoachContext';
import { BookOpen, User as UserIcon, Trophy, Settings, Plus, Palette } from 'lucide-react';
import confetti from 'canvas-confetti';

// Import mock data instead of database actions
import { 
  mockUsers, 
  mockCourses, 
  mockLoadAction,
  mockMutateAction,
  mockCreateUser,
  mockEnrollInCourse,
  mockUpdateUserCoach
} from '@/data/mockData';

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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);

  const { currentCoach, coachConfig, setCoach, getMotivationMessage } = useCoach();

  // Use mock data instead of database actions
  const [userProfile] = mockLoadAction(mockUsers.filter(u => u.id === currentUserId));
  const [allCourses] = mockLoadAction(mockCourses);
  // const [userCourses] = mockLoadAction(mockUserCourses);

  // Mock mutations
  const [createUser, creatingUser] = mockMutateAction(mockCreateUser);
  const [enrollInCourse, enrolling] = mockMutateAction(mockEnrollInCourse);
  const [updateUserCoach, updatingCoach] = mockMutateAction(mockUpdateUserCoach);

  const user: User | null = userProfile?.[0] || null;
  const courses: Course[] = allCourses || [];
  // const enrolledCourses: Course[] = userCourses || [];

  const handleCreateUser = async () => {
    if (!newUserForm.email || !newUserForm.username || !newUserForm.fullName) return;
    
    try {
      const result = await createUser({
        email: newUserForm.email,
        username: newUserForm.username,
        fullName: newUserForm.fullName,
        avatarUrl: newUserForm.avatarUrl || null
      });
      
      if (result && Array.isArray(result) && result[0]) {
        setCurrentUserId((result[0] as any).id);
        setNewUserForm({ email: '', username: '', fullName: '', avatarUrl: '' });
        setShowCreateUser(false);
        confetti({ particleCount: 100, spread: 70 });
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleEnrollInCourse = async (courseId: number) => {
    if (!user) return;
    
    try {
      await enrollInCourse({ userId: user.id, courseId });
      confetti({ particleCount: 50, spread: 60 });
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const handleCoachChange = async (coachType: CoachType) => {
    if (!user) return;
    
    try {
      await updateUserCoach({ userId: user.id, coachType });
      setCoach(coachType);
      setShowCoachSettings(false);
      confetti({ particleCount: 30, spread: 50 });
    } catch (error) {
      console.error('Error updating coach:', error);
    }
  };

  const handleOnboardingComplete = (selectedCoach: CoachType) => {
    setCoach(selectedCoach);
    setShowOnboarding(false);
    confetti({ particleCount: 100, spread: 70 });
  };

  // Show onboarding if user hasn't completed it
  if (user && !user.onboarding_completed && !showOnboarding) {
    return (
      <div className="min-h-screen coach-themed">
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <div className="min-h-screen coach-themed">
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen coach-themed">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold coach-primary">Zuno://</h1>
              <span className="ml-2 text-sm text-gray-500">Personalized Learning Platform</span>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{user.total_xp} XP</span>
                    <span className="mx-2">•</span>
                    <span>Level {user.current_level}</span>
                    <span className="mx-2">•</span>
                    <span>{user.current_streak} day streak</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCoachSettings(true)}
                    className="flex items-center gap-2"
                  >
                    <Palette className="h-4 w-4" />
                    Coach: {coachConfig?.display_name}
                  </Button>
                </>
              )}
              {!user && (
                <Button
                  onClick={() => setShowCreateUser(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Account
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user ? (
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="mt-6">
              <div className="space-y-6">
                {/* Motivation Message */}
                <Card className="coach-bg-primary text-white">
                  <CardContent className="p-6">
                    <p className="text-lg font-medium">{getMotivationMessage()}</p>
                    <p className="text-sm opacity-90 mt-2">- {coachConfig?.display_name}</p>
                  </CardContent>
                </Card>

                <CourseCatalog 
                  courses={courses}
                  onEnrollInCourse={handleEnrollInCourse}
                  isEnrolling={enrolling}
                />
              </div>
            </TabsContent>

            <TabsContent value="profile" className="mt-6">
              <UserProfile user={user} />
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                      <h3 className="font-medium">First Course</h3>
                      <p className="text-sm text-gray-600">Complete your first course</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center opacity-50">
                      <Trophy className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <h3 className="font-medium">Week Warrior</h3>
                      <p className="text-sm text-gray-600">7 day learning streak</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center opacity-50">
                      <Trophy className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <h3 className="font-medium">Knowledge Seeker</h3>
                      <p className="text-sm text-gray-600">Complete 5 courses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Daily Learning Goal</Label>
                      <Input type="number" placeholder="30" className="mt-1" />
                    </div>
                    <div>
                      <Label>Preferred Difficulty</Label>
                      <select className="w-full mt-1 p-2 border rounded">
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Coach Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => setShowCoachSettings(true)}>
                      Change Coach
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Welcome to Zuno://</h2>
            <p className="text-gray-600 mb-6">Create an account to start your personalized learning journey</p>
            <Button onClick={() => setShowCreateUser(true)} size="lg">
              Get Started
            </Button>
          </div>
        )}
      </main>

      {/* Coach Selection Dialog */}
      <Dialog open={showCoachSettings} onOpenChange={setShowCoachSettings}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose Your Learning Coach</DialogTitle>
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

      {/* Create User Dialog */}
      <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Your Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
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
                placeholder="username"
              />
            </div>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={newUserForm.fullName}
                onChange={(e) => setNewUserForm(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Your Full Name"
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
            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateUser} disabled={creatingUser} className="flex-1">
                {creatingUser ? 'Creating...' : 'Create Account'}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateUser(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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