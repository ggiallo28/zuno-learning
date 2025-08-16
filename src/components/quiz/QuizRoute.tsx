import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { QuizNavigation } from './QuizNavigation';
import { useAuth } from '@/contexts/AuthContext';
import loadLessons from '@/actions/loadLessons';
import type { Lesson } from '@/types';

export function QuizRoute() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load lesson data
  useEffect(() => {
    if (!courseId || !lessonId || !user?.userId) {
      setLoading(false);
      return;
    }

    const loadLessonData = async () => {
      try {
        setLoading(true);
        const lessons = await loadLessons({ courseId, userId: user.userId });
        const currentLesson = lessons.find(l => l.id === lessonId);
        
        if (!currentLesson) {
          setError('Lesson not found');
        } else {
          setLesson(currentLesson);
        }
      } catch (err) {
        console.error('Error loading lesson:', err);
        setError('Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    loadLessonData();
  }, [courseId, lessonId, user?.userId]);

  const handleQuizComplete = (completedLessonId: string, score: number) => {
    console.log(`Quiz completed for lesson ${completedLessonId} with score ${score}`);
    // Could show a success message or navigate somewhere
  };

  const handleNavigateToLesson = (targetLessonId: string) => {
    navigate(`/app/course/${courseId}/lesson/${targetLessonId}/quiz`);
  };

  const handleBackToCourse = () => {
    navigate(`/app/course/${courseId}`);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div>Loading lesson...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !courseId || !lessonId) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p className="text-muted-foreground mb-4">
              {error || 'Invalid course or lesson ID'}
            </p>
            <Button onClick={handleBackToCourse}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/app')}
            className="p-0 h-auto font-normal"
          >
            Dashboard
          </Button>
          <span>/</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToCourse}
            className="p-0 h-auto font-normal"
          >
            <BookOpen className="h-3 w-3 mr-1" />
            Course
          </Button>
          <span>/</span>
          <span className="font-medium text-foreground">
            {lesson?.title || 'Quiz'}
          </span>
        </nav>
      </div>

      {/* Quiz Navigation Component */}
      <QuizNavigation
        courseId={courseId}
        lessonId={lessonId}
        onComplete={handleQuizComplete}
        onNavigateToLesson={handleNavigateToLesson}
      />
    </div>
  );
}