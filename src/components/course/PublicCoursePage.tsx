import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Clock, 
  Users, 
  ArrowLeft,
  LogIn,
  Star
} from 'lucide-react';
import { CourseService } from '@/services/courseService';
import loadLessons from '@/actions/loadLessons';
import type { Course, Lesson } from '@/types';

export function PublicCoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourseData = async () => {
      if (!courseId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Load course data
        const courses = await CourseService.loadCourses();
        const foundCourse = courses.find(c => c.id === courseId);
        
        if (!foundCourse) {
          setError('Course not found');
          return;
        }
        
        setCourse(foundCourse);
        
        // Load lessons for the course (for count and overview)
        const courseLessons = await loadLessons({ courseId });
        setLessons(courseLessons);
        
      } catch (err) {
        console.error('Error loading course data:', err);
        setError('Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [courseId]);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleSignInToEnroll = () => {
    navigate('/auth');
  };

  const getDifficultyColor = (difficulty: string) => {
    const normalizedDifficulty = difficulty?.toLowerCase();
    switch (normalizedDifficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div>Loading course...</div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error || 'Course not found'}</p>
          <Button onClick={handleBackToHome}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBackToHome}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={handleSignInToEnroll}
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign In to Enroll
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Course Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <CardTitle className="text-3xl">{course.title}</CardTitle>
                  <p className="text-lg text-muted-foreground">{course.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                      className={getDifficultyColor(course.difficultyLevel || course.difficulty_level || '')}
                    >
                      {(course.difficultyLevel || course.difficulty_level || '').charAt(0).toUpperCase() + 
                       (course.difficultyLevel || course.difficulty_level || '').slice(1).toLowerCase()}
                    </Badge>
                    <Badge variant="outline">{course.category}</Badge>
                    {(course.isPremium || course.is_premium) && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{course.lessonCount || course.lesson_count || lessons.length} lessons</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{course.estimatedDurationDays || course.estimated_duration_days || 0} days</span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Course Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>What you'll learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {course.description || 'This comprehensive course will teach you essential skills and knowledge in the subject area. You\'ll gain practical experience and theoretical understanding that will help you advance in your learning journey.'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                </CardHeader>
                <CardContent>
                  {lessons.length > 0 ? (
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground mb-4">
                        {lessons.length} lessons • Estimated {course.estimatedDurationDays || course.estimated_duration_days || 0} days
                      </div>
                      {lessons.slice(0, 5).map((lesson, index) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-sm font-medium text-primary">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{lesson.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{lesson.estimatedMinutes || 5} min</span>
                              {lesson.lessonType && (
                                <>
                                  <span>•</span>
                                  <span>{lesson.lessonType}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="text-muted-foreground">
                            <BookOpen className="h-4 w-4" />
                          </div>
                        </div>
                      ))}
                      {lessons.length > 5 && (
                        <div className="text-center py-4 text-muted-foreground">
                          <p>+ {lessons.length - 5} more lessons</p>
                          <p className="text-sm">Sign in to see all course content</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Course content will be available soon.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium">{course.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Difficulty:</span>
                      <span className="font-medium">
                        {(course.difficultyLevel || course.difficulty_level || '').charAt(0).toUpperCase() + 
                         (course.difficultyLevel || course.difficulty_level || '').slice(1).toLowerCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{course.estimatedDurationDays || course.estimated_duration_days || 0} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lessons:</span>
                      <span className="font-medium">{course.lessonCount || course.lesson_count || lessons.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ready to start learning?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Sign in to enroll in this course and start your learning journey with Zuno's adaptive AI coaching system.
                  </p>
                  <Button 
                    onClick={handleSignInToEnroll}
                    className="w-full"
                    size="lg"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In to Enroll
                  </Button>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      New to Zuno? Create your account to get started
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}