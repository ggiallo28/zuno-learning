import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { UserProfile } from '@/components/UserProfile';
import { ZunoBrandHeader } from '@/components/ZunoBrandHeader';
import { useCoach } from '@/contexts/CoachContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAdaptiveBehavior } from '@/hooks/useAdaptiveBehavior';
import { BookOpen, User as UserIcon, Settings, Target, Users, Zap, LogOut } from 'lucide-react';
import confetti from 'canvas-confetti';

// Lazy load heavy components
const CourseCatalog = lazy(() => import('@/components/CourseCatalog').then(module => ({ default: module.CourseCatalog })));
const OnboardingFlow = lazy(() => import('@/components/OnboardingFlow').then(module => ({ default: module.OnboardingFlow })));
const CoachSelection = lazy(() => import('@/components/CoachSelection').then(module => ({ default: module.CoachSelection })));
const AssessmentSystem = lazy(() => import('@/components/AssessmentSystem').then(module => ({ default: module.AssessmentSystem })));

const AdaptiveCoachIndicator = lazy(() => import('@/components/AdaptiveCoachIndicator').then(module => ({ default: module.AdaptiveCoachIndicator })));
const QuizRoute = lazy(() => import('@/components/quiz/QuizRoute').then(module => ({ default: module.QuizRoute })));
const CoursePage = lazy(() => import('@/components/course/CoursePage').then(module => ({ default: module.CoursePage })));
const EarlyStoppingDemo = lazy(() => import('@/components/assessment/EarlyStoppingDemo').then(module => ({ default: module.EarlyStoppingDemo })));

// Demo page component
function EarlyStoppingDemoPage() {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button 
        onClick={() => navigate('/app')} 
        variant="outline" 
        className="mb-6"
      >
        ← Back to Dashboard
      </Button>
      <Suspense fallback={<TabLoadingSpinner />}>
        <EarlyStoppingDemo />
      </Suspense>
    </div>
  );
}

import loadUserProfileAction from '@/actions/loadUserProfile';
import createUserAction from '@/actions/createUser';
import updateUserCoachAction from '@/actions/updateUserCoach';
import loadUserAssessmentsAction from '@/actions/loadUserAssessments';
import loadUserKnowledgeGapsAction from '@/actions/loadUserKnowledgeGaps';
import createAssessmentAction from '@/actions/createAssessment';
import { AppDataProvider } from '@/contexts/AppDataContext';

// Import unified services
import { CourseService } from '@/services/courseService';

import type { User, Course, CoachType, Assessment, KnowledgeGap } from '@/types';
import { CoachNameValues } from '@/api/amplify';

// Loading component for tab content
function TabLoadingSpinner() {
  return (
    <Card className="p-8 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <div>Loading...</div>
    </Card>
  );
}

function AuthenticatedAppDashboard() {
  const navigate = useNavigate();
  const { user: authUser, signOut } = useAuth();
  const [showCoachSettings, setShowCoachSettings] = useState(false);

  // Data state
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [knowledgeGaps, setKnowledgeGaps] = useState<KnowledgeGap[]>([]);
  
  // Loading states
  const [userLoading, setUserLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [updatingCoach, setUpdatingCoach] = useState(false);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  


  const { currentCoach, coachConfig, theme, setCoach } = useCoach();
  const { adaptToScenario, currentMode } = useAdaptiveBehavior({
    enableAutoAdaptation: true,
    adaptationInterval: 45000 // 45 seconds for demo
  });

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

  // Load data on mount and when auth user changes
  useEffect(() => {
    if (!authUser) return;

    const loadData = async () => {
      try {
        setUserLoading(true);
        
        // Try to load existing user profile
        let userProfile = await loadUserProfileAction();
        
        // If no profile exists, create one
        if (!userProfile) {
          console.log('No user profile found, creating new profile...');
          userProfile = await createUserAction();
        }
        
        // Use unified course service
        const [allCourses, userCourses, userAssessments, userKnowledgeGaps] = await Promise.all([
          CourseService.loadCourses(),
          CourseService.loadUserCourses(userProfile.id),
          loadUserAssessmentsAction(userProfile.id, 10),
          loadUserKnowledgeGapsAction(userProfile.id)
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
  }, [authUser]);

  const handleCompleteOnboarding = async (coachType: CoachType) => {
    if (!user) return;
    
    try {
      setUpdatingCoach(true);
      await updateUserCoachAction({
        userId: user.id,
        coachType: coachTypeToNameValue(coachType),
        onboardingCompleted: true
      });
      
      setCoach(coachType);
      confetti({ particleCount: 200, spread: 100 });
      // Refresh user data
      const updatedUser = await loadUserProfileAction();
      setUser(updatedUser);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setUpdatingCoach(false);
    }
  };

  const handleCoachChange = async (coachType: CoachType) => {
    if (!user) return;
    
    try {
      setUpdatingCoach(true);
      await updateUserCoachAction({
        userId: user.id,
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
    if (!user) return;
    
    try {
      setEnrolling(true);
      await CourseService.enrollInCourse({ userId: user.id, courseId });
      confetti({ particleCount: 50, spread: 60 });
      // Refresh data using unified service
      const userCourses = await CourseService.loadUserCourses(user.id);
      setEnrolledCourses(userCourses);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartAssessment = async (type: 'initial' | 'progress' | 'focus_check') => {
    if (!user) return;
    
    try {
      setAssessmentLoading(true);
      
      // Create a sample assessment for demonstration
      const sampleQuestions = [
        { id: '1', question: 'Sample question 1', type: 'multiple_choice' },
        { id: '2', question: 'Sample question 2', type: 'multiple_choice' }
      ];
      
      const result = await createAssessmentAction({
        userId: user.id,
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
        const updatedAssessments = await loadUserAssessmentsAction(user.id, 10);
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

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show onboarding if user hasn't completed it
  if (user && !user.onboardingCompleted) {
    return (
      <Suspense fallback={<TabLoadingSpinner />}>
        <OnboardingFlow 
          onComplete={handleCompleteOnboarding}
          isSubmitting={updatingCoach}
        />
      </Suspense>
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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <div className="text-center">
            <p className="mb-4">Unable to load user profile</p>
            <Button onClick={handleSignOut}>Sign Out</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6" style={{ backgroundColor: theme.background }}>
      <ZunoBrandHeader 
        user={user}
        onSettingsClick={() => {
          const settingsTab = document.querySelector('[data-radix-collection-item][value="settings"]') as HTMLElement;
          settingsTab?.click();
        }}
      />

      <UserProfile user={user} />

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
          <Suspense fallback={<TabLoadingSpinner />}>
            <AssessmentSystem 
              userId={user.id}
              onStartAssessment={handleStartAssessment}
              onViewSkillMap={handleViewSkillMap}
              knowledgeGaps={knowledgeGaps}
              recentAssessments={assessments}
              isLoading={assessmentLoading}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="catalog">
          <Suspense fallback={<TabLoadingSpinner />}>
            <CourseCatalog 
              courses={courses}
              onEnrollInCourse={handleEnrollInCourse}
              isEnrolling={enrolling}
              onCourseClick={(course) => navigate(`/app/course/${course.id}`)}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="mycourses">
          <div className="space-y-6">
            {enrolledCourses.length > 0 ? (
              <Suspense fallback={<TabLoadingSpinner />}>
                <CourseCatalog 
                  courses={enrolledCourses}
                  onEnrollInCourse={handleEnrollInCourse}
                  isEnrolling={false}
                  onCourseClick={(course) => navigate(`/app/course/${course.id}`)}
                />
              </Suspense>
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
                  <UserIcon className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Signed in as</h4>
                    <p className="text-sm text-muted-foreground">
                      {authUser?.signInDetails?.loginId || user.email}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
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

            {/* Polpo Adaptive Testing Panel */}
            {currentCoach === 'polpo' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Test Adattività Polpo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="mb-4">
                    <Suspense fallback={<div className="h-16 animate-pulse bg-gray-200 rounded"></div>}>
                      <AdaptiveCoachIndicator showHistory={true} />
                    </Suspense>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adaptToScenario('struggling')}
                      className="text-xs"
                    >
                      Simula Difficoltà
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adaptToScenario('excelling')}
                      className="text-xs"
                    >
                      Simula Eccellenza
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adaptToScenario('social')}
                      className="text-xs"
                    >
                      Simula Sociale
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adaptToScenario('focused')}
                      className="text-xs"
                    >
                      Simula Focus
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground text-center">
                    Modalità corrente: <strong>{currentMode || 'balanced'}</strong>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Early Stopping Demo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Test the precision-based early stopping functionality for assessments.
                </p>
                <Button
                  onClick={() => navigate('/app/demo/early-stopping')}
                  variant="outline"
                  className="w-full"
                >
                  Open Early Stopping Demo
                </Button>
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
                <Suspense fallback={<TabLoadingSpinner />}>
                  <CoachSelection 
                    onCoachSelect={handleCoachChange}
                    selectedCoach={currentCoach}
                    isSubmitting={updatingCoach}
                  />
                </Suspense>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function AuthenticatedApp() {
  const location = useLocation();
  
  // Check if we're on a course or quiz route
  const isCourseRoute = location.pathname.includes('/course/');
  const isQuizRoute = location.pathname.includes('/quiz');
  
  return (
    <AppDataProvider>
      {isCourseRoute || isQuizRoute ? (
        <Suspense fallback={<TabLoadingSpinner />}>
          <Routes>
            {/* Course routes */}
            <Route path="/course/:courseId" element={<CoursePage />} />
            <Route path="/course/:courseId/lesson/:lessonId" element={<CoursePage />} />
            <Route path="/course/:courseId/lesson/:lessonId/quiz" element={<QuizRoute />} />
            {/* Demo routes */}
            <Route path="/demo/early-stopping" element={<EarlyStoppingDemoPage />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Routes>
        </Suspense>
      ) : (
        // Default dashboard view
        <AuthenticatedAppDashboard />
      )}
    </AppDataProvider>
  );
}