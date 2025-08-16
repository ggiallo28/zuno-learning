import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Users, 
  Star,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import type { Course, Lesson } from '@/types';

interface CourseNavigationProps {
  course: Course;
  lessons?: Lesson[];
  currentLessonId?: string;
  onLessonSelect?: (lessonId: string) => void;
  onBackToCatalog?: () => void;
  showProgress?: boolean;
}

export function CourseNavigation({
  course,
  lessons = [],
  currentLessonId,
  onLessonSelect,
  onBackToCatalog,
  showProgress = true
}: CourseNavigationProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'progress'>('overview');

  const currentLessonIndex = lessons.findIndex(lesson => lesson.id === currentLessonId);
  const nextLesson = currentLessonIndex >= 0 && currentLessonIndex < lessons.length - 1 
    ? lessons[currentLessonIndex + 1] 
    : null;
  const prevLesson = currentLessonIndex > 0 
    ? lessons[currentLessonIndex - 1] 
    : null;

  const completedLessons = lessons.filter(() => 
    // This would typically come from user progress data
    false // Placeholder - would check if lesson is completed
  ).length;

  const progressPercentage = lessons.length > 0 
    ? (completedLessons / lessons.length) * 100 
    : course.progressPercentage || course.progress_percentage || 0;

  const handleBackToCatalog = () => {
    if (onBackToCatalog) {
      onBackToCatalog();
    } else {
      navigate('/app');
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (onLessonSelect) {
      onLessonSelect(lesson.id);
    } else {
      navigate(`/app/course/${course.id}/lesson/${lesson.id}`);
    }
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      handleLessonClick(nextLesson);
    }
  };

  const handlePrevLesson = () => {
    if (prevLesson) {
      handleLessonClick(prevLesson);
    }
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

  const isEnrolled = course.enrolledAt !== undefined || course.enrolled_at !== undefined;
  const isCompleted = course.completedAt !== undefined || course.completed_at !== undefined;

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBackToCatalog}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </Button>
        
        {currentLessonId && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevLesson}
              disabled={!prevLesson}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextLesson}
              disabled={!nextLesson}
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Course Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{course.title}</CardTitle>
              <p className="text-muted-foreground">{course.description}</p>
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
        
        {showProgress && isEnrolled && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{completedLessons} of {lessons.length} lessons completed</span>
                {isCompleted && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    <span>Completed</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What you'll learn</h4>
                  <p className="text-muted-foreground">
                    {course.description || 'This comprehensive course will teach you essential skills and knowledge in the subject area.'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Course Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Category:</span>
                      <span className="ml-2">{course.category}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Difficulty:</span>
                      <span className="ml-2">
                        {(course.difficultyLevel || course.difficulty_level || '').charAt(0).toUpperCase() + 
                         (course.difficultyLevel || course.difficulty_level || '').slice(1).toLowerCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="ml-2">{course.estimatedDurationDays || course.estimated_duration_days || 0} days</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lessons:</span>
                      <span className="ml-2">{course.lessonCount || course.lesson_count || lessons.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lessons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              {lessons.length > 0 ? (
                <div className="space-y-2">
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                        currentLessonId === lesson.id ? 'bg-primary/10 border-primary' : ''
                      }`}
                      onClick={() => handleLessonClick(lesson)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
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
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Placeholder for completion status */}
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <Play className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No lessons available yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {isEnrolled ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {Math.round(progressPercentage)}%
                    </div>
                    <p className="text-muted-foreground">Course Completion</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-semibold">{completedLessons}</div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold">{lessons.length - completedLessons}</div>
                      <p className="text-sm text-muted-foreground">Remaining</p>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold">{lessons.length}</div>
                      <p className="text-sm text-muted-foreground">Total</p>
                    </div>
                  </div>

                  {isCompleted && (
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-green-800">Congratulations!</h3>
                      <p className="text-sm text-green-600">You've completed this course</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enroll in this course to track your progress.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}