'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, User as UserIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

import loadCoursesAction from '@/actions/loadCourses';
import loadUserProfileAction from '@/actions/loadUserProfile';
import loadUserCoursesAction from '@/actions/loadUserCourses';
import createUserAction from '@/actions/createUser';
import enrollInCourseAction from '@/actions/enrollInCourse';
import type { User, Course } from '@/types';

function App() {
  const [currentUserId, setCurrentUserId] = useState<string>('user_1');
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    username: '',
    fullName: '',
    avatarUrl: ''
  });

  // Data state
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  
  // Loading states
  const [userLoading, setUserLoading] = useState(true);
  const [creatingUser, setCreatingUser] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setUserLoading(true);
        const [userProfile, allCourses, userCourses] = await Promise.all([
          loadUserProfileAction(currentUserId),
          loadCoursesAction(),
          loadUserCoursesAction(currentUserId)
        ]);
        
        setUser(userProfile);
        setCourses(allCourses);
        setEnrolledCourses(userCourses);
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

  // Show user creation form if no user
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
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-blue-600">
          Zuno://
        </h1>
        <p className="text-muted-foreground">
          Your personalized learning experience
        </p>
      </div>

      {/* User Profile Card */}
      {user && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Welcome back, {user.fullName || user.username}!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{user.totalXp}</div>
                <div className="text-sm text-muted-foreground">Total XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{user.currentStreak || 0}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{user.enrolledCourses || 0}</div>
                <div className="text-sm text-muted-foreground">Enrolled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{user.completedCourses || 0}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Courses Section */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Available Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <Card key={course.id} className="p-4">
                    <h3 className="font-semibold mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {course.category}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleEnrollInCourse(course.id)}
                        disabled={enrolling}
                      >
                        {enrolling ? 'Enrolling...' : 'Enroll'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No courses available yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enrolled Courses */}
        {enrolledCourses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                My Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrolledCourses.map((course) => (
                  <Card key={course.id} className="p-4 border-green-200">
                    <h3 className="font-semibold mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Enrolled
                      </span>
                      <Button size="sm" variant="outline">
                        Continue
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default App;