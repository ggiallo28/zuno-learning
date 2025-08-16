import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CourseNavigation } from './CourseNavigation';
import { LessonViewer } from '@/components/LessonViewer';
import { CourseService } from '@/services/courseService';
import loadLessons from '@/actions/loadLessons';
import type { Course, Lesson } from '@/types';

export function CoursePage() {
  const { courseId, lessonId } = useParams();
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
        
        // Load lessons for the course
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

  const handleLessonSelect = (selectedLessonId: string) => {
    navigate(`/app/course/${courseId}/lesson/${selectedLessonId}`);
  };

  const handleBackToCatalog = () => {
    navigate('/app');
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
          <button 
            onClick={handleBackToCatalog}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  // If we have a specific lesson ID, show the lesson viewer
  if (lessonId) {
    const currentLesson = lessons.find(l => l.id === lessonId);
    
    if (!currentLesson) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Lesson Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested lesson could not be found.</p>
            <button 
              onClick={() => navigate(`/app/course/${courseId}`)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Back to Course
            </button>
          </div>
        </div>
      );
    }

    const currentIndex = lessons.findIndex(l => l.id === lessonId);
    const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
    const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <LessonViewer
          lesson={currentLesson}
          onNext={nextLesson ? () => handleLessonSelect(nextLesson.id) : undefined}
          onPrevious={prevLesson ? () => handleLessonSelect(prevLesson.id) : undefined}
          onComplete={async () => {
            // Handle lesson completion
            console.log('Lesson completed:', lessonId);
          }}
          onBackToCourse={() => navigate(`/app/course/${courseId}`)}
        />
      </div>
    );
  }

  // Show course navigation/overview
  return (
    <div className="max-w-6xl mx-auto p-6">
      <CourseNavigation
        course={course}
        lessons={lessons}
        onLessonSelect={handleLessonSelect}
        onBackToCatalog={handleBackToCatalog}
        showProgress={true}
      />
    </div>
  );
}