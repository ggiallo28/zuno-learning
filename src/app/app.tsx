'use client';


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { UserProfile } from '@/components/UserProfile';
import { CourseCatalog } from '@/components/CourseCatalog';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { CoachSelection } from '@/components/CoachSelection';
import { ZunoBrandHeader } from '@/components/ZunoBrandHeader';
import { AssessmentSystem } from '@/components/AssessmentSystem';
import { CoachProvider, useCoach } from '@/contexts/CoachContext';
import { BookOpen, User as UserIcon, /* Trophy,*/ Settings, Plus, Palette, Target, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

import loadCoursesAction from '@/actions/loadCourses';
import loadUserProfileAction from '@/actions/loadUserProfile';
import loadUserCoursesAction from '@/actions/loadUserCourses';
import createUserAction from '@/actions/createUser';
import enrollInCourseAction from '@/actions/enrollInCourse';
import updateUserCoachAction from '@/actions/updateUserCoach';
import loadUserAssessmentsAction from '@/actions/loadUserAssessments';
import loadUserKnowledgeGapsAction from '@/actions/loadUserKnowledgeGaps';
import createAssessmentAction from '@/actions/createAssessment';

import type { User, Course, CoachType, Assessment, KnowledgeGap } from '@/types';
import { CoachNameValues } from '@/api/amplify';

function AppContent() {
  const [currentUserId, setCurrentUserId] = useState<string>('user_1'); // Demo user
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    username: '',
    fullName: '',
    avatarUrl: ''
  });
  const [showCoachSettings, setShowCoachSettings] = useState(false);

  // Data state
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [knowledgeGaps, setKnowledgeGaps] = useState<KnowledgeGap[]>([]);
  
  // Loading states
  const [userLoading, setUserLoading] = useState(true);
  const [creatingUser, setCreatingUser] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [updatingCoach, setUpdatingCoach] = useState(false);
  const [assessmentLoading, setAssessmentLoading] = useState(false);

  const { currentCoach, coachConfig, theme, setCoach/*, getMotivationMessage*/ } = useCoach();

  // Helper function to convert CoachType to CoachNameValues
  const coachTypeToNameValue = (coachType: CoachType): CoachNameValues => {
    const mapping: Record<CoachType, CoachNameValues> = {
      'elia': CoachNameValues.ELIA,
      'skippy': CoachNameValues.SKIPPY,
      'lupa': CoachNameValues.LUPA,
      'polpo': CoachNameValues.POLPO
    };
    return mapping[coachType];
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setUserLoading(true);
        const [userProfile, allCourses, userCourses, userAssessments, userKnowledgeGaps] = await Promise.all([
          loadUserProfileAction(currentUserId),
          loadCoursesAction(),
          loadUserCoursesAction(currentUserId),
          loadUserAssessmentsAction(currentUserId, 10),
          loadUserKnowledgeGapsAction(currentUserId)
        ]);
        
        setUser(userProfile);
        setCourses(allCourses);
        setEnrolledCourses(userCourses);
        setAssessments(userAssessments);
        setKnowledgeGaps(userKnowledgeGaps);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setUserLoading(false);
      }
    };

    loadData();
  }, [currentUserId]);

  const handleCreateUser = async () => {
    if (!newUserForm.email || !newUserForm.username || !newUserForm.fullName) return;
    
    try {
      setCreatingUser(true);
      const result = await createUserAction({
        email: newUserForm.email,
        username: newUserForm.username,
        fullName: newUserForm.fullName,
        avatarUrl: newUserForm.avatarUrl || undefined
      });
      
      if (result) {
        setCurrentUserId(result.id);
        setUser(result);
        setNewUserForm({ email: '', username: '', fullName: '', avatarUrl: '' });
        confetti({ particleCount: 100, spread: 70 });
      }
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setCreatingUser(false);
    }
  };

  const handleCompleteOnboarding = async (coachType: CoachType) => {
    try {
      setUpdatingCoach(true);
      await updateUserCoachAction({
        userId: currentUserId,
        coachType: coachTypeToNameValue(coachType),
        onboardingCompleted: true
      });
      
      setCoach(coachType);
      confetti({ particleCount: 200, spread: 100 });
      // Refresh user data
      const updatedUser = await loadUserProfileAction(currentUserId);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setUpdatingCoach(false);
    }
  };

  const handleCoachChange = async (coachType: CoachType) => {
    try {
      setUpdatingCoach(true);
      await updateUserCoachAction({
        userId: currentUserId,
        coachType: coachTypeToNameValue(coachType),
        onboardingCompleted: true
      });
      
      setCoach(coachType);
      setShowCoachSettings(false);
      confetti({ particleCount: 100, spread: 70 });
    } catch (error) {
      console.error('Error updating coach:', error);
    } finally {
      setUpdatingCoach(false);
    }
  };

  const handleEnrollInCourse = async (courseId: string) => {
    try {
      setEnrolling(true);
      await enrollInCourseAction({ userId: currentUserId, courseId });
      confetti({ particleCount: 50, spread: 60 });
      // Refresh data
      const userCourses = await loadUserCoursesAction(currentUserId);
      setEnrolledCourses(userCourses);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartAssessment = async (type: 'initial' | 'progress' | 'focus_check') => {
    try {
      setAssessmentLoading(true);
      
      // Create a sample assessment for demonstration
      const sampleQuestions = [
        { id: '1', question: 'Sample question 1', type: 'multiple_choice' },
        { id: '2', question: 'Sample question 2', type: 'multiple_choice' }
      ];
      
      const result = await createAssessmentAction({
        userId: currentUserId,
        assessmentType: type,
        subjectArea: 'General Knowledge',
        questionsData: sampleQuestions,
        answersData: [],
        score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
        identifiedGaps: ['Sample gap 1', 'Sample gap 2'],
        recommendations: ['Focus on area 1', 'Practice more in area 2']
      });

      if (result.success) {
        confetti({ particleCount: 100, spread: 70 });
        // Refresh assessments data
        const updatedAssessments = await loadUserAssessmentsAction(currentUserId, 10);
        setAssessments(updatedAssessments);
      }
    } catch (error) {
      console.error('Error starting assessment:', error);
    } finally {
      setAssessmentLoading(false);
    }
  };

  const handleViewSkillMap = () => {
    console.log('Opening skill map view');
    // In a real app, this would navigate to a detailed skill map
  };

  // Demo data seeding button
  const seedDemoData = async () => {
    console.log('Demo data seeding would happen here');
    confetti({ particleCount: 200, spread: 100 });
  };

  // Show onboarding if user hasn't completed it
  if (user && !user.onboardingCompleted) {
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

  // Ho cambiato user={user} in user={user!} #TODO
  return (
    <div className="max-w-7xl mx-auto p-6" style={{ backgroundColor: theme.background }}>
      <ZunoBrandHeader 
        user={user!}
        onSettingsClick={() => {
          const settingsTab = document.querySelector('[data-radix-collection-item][value="settings"]') as HTMLElement;
          settingsTab?.click();
        }}
      />

      {user && <UserProfile user={user} />}

      <Tabs defaultValue="assessment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="assessment" className="flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Focus
          </TabsTrigger>
          <TabsTrigger value="catalog" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Catalogo
          </TabsTrigger>
          <TabsTrigger value="mycourses" className="flex items-center">
            <UserIcon className="h-4 w-4 mr-2" />
            I miei Corsi
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Collaborativo
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Impostazioni
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assessment">
          <AssessmentSystem 
            userId={currentUserId}
            onStartAssessment={handleStartAssessment}
            onViewSkillMap={handleViewSkillMap}
            knowledgeGaps={knowledgeGaps}
            recentAssessments={assessments}
            isLoading={assessmentLoading}
          />
        </TabsContent>

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

        <TabsContent value="social">
          <Card className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {currentCoach === 'lupa' 
                ? 'Apprendimento Collaborativo' 
                : 'Funzionalità Sociale'
              }
            </h3>
            <p className="text-muted-foreground mb-6">
              {currentCoach === 'lupa' 
                ? 'Unisciti a gruppi di studio, partecipa a discussioni guidate e impara insieme ai tuoi colleghi.'
                : 'Connettiti con altri learner, condividi progressi e partecipa alla community Zuno.'
              }
            </p>
            {currentCoach === 'lupa' && (
              <div className="space-y-4 max-w-md mx-auto">
                <Button className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Trova Gruppi di Studio
                </Button>
                <Button variant="outline" className="w-full">
                  Crea Nuovo Gruppo
                </Button>
              </div>
            )}
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
                      {coachConfig?.displayName} - {coachConfig?.learningStyle}
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
