import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Clock, Star, Users, Lock } from 'lucide-react';
import type { Course } from '@/types';

interface CourseCatalogProps {
  courses: Course[];
  onEnrollInCourse: (courseId: string) => Promise<void>;
  isEnrolling?: boolean;
}

export function CourseCatalog({ courses, onEnrollInCourse, isEnrolling }: CourseCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categories = Array.from(new Set(courses.map(course => course.category)));
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficultyLevel === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isEnrolled = (course: Course) => course.enrolledAt !== undefined;
  const isCompleted = (course: Course) => course.completedAt !== undefined;

  return (
    <div className="space-y-8 p-4 sm:p-6">
      {/* Filter Controls */}
      <div 
        className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg"
        role="search"
        aria-label="Course filters"
      >
        <div className="flex-1 sm:flex-none">
          <label htmlFor="category-select" className="block text-sm font-medium mb-2 sm:sr-only">
            Filter by category
          </label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger 
              id="category-select"
              className="w-full sm:w-48 min-h-[44px]"
              aria-label="Filter courses by category"
            >
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1 sm:flex-none">
          <label htmlFor="difficulty-select" className="block text-sm font-medium mb-2 sm:sr-only">
            Filter by difficulty level
          </label>
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger 
              id="difficulty-select"
              className="w-full sm:w-48 min-h-[44px]"
              aria-label="Filter courses by difficulty level"
            >
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {difficulties.map(difficulty => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {filteredCourses.length === 0 
          ? "No courses found with current filters"
          : `Showing ${filteredCourses.length} course${filteredCourses.length === 1 ? '' : 's'}`
        }
      </div>

      {/* Course Grid */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        role="list"
        aria-label="Available courses"
      >
        {filteredCourses.map((course) => (
          <Card 
            key={course.id} 
            className="relative overflow-hidden"
            role="listitem"
            aria-labelledby={`course-title-${course.id}`}
            aria-describedby={`course-description-${course.id}`}
          >
            {course.isPremium && (
              <div className="absolute top-3 right-3 z-10">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Lock className="h-3 w-3 mr-1" aria-hidden="true" />
                  Premium
                </Badge>
              </div>
            )}
            
            <CardHeader className="pb-2">
              <div 
                className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-2 flex items-center justify-center"
                role="img"
                aria-label={`Course thumbnail for ${course.title}`}
              >
                <BookOpen className="h-8 w-8 text-blue-600" aria-hidden="true" />
              </div>
              <CardTitle 
                id={`course-title-${course.id}`}
                className="text-lg line-clamp-2"
              >
                {course.title}
              </CardTitle>
              <p 
                id={`course-description-${course.id}`}
                className="text-sm text-muted-foreground line-clamp-2"
              >
                {course.description || 'Learn new skills with this comprehensive course.'}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge 
                  className={getDifficultyColor(course.difficultyLevel)}
                  aria-label={`Difficulty level: ${course.difficultyLevel}`}
                >
                  {course.difficultyLevel}
                </Badge>
                <Badge 
                  variant="outline"
                  aria-label={`Category: ${course.category}`}
                >
                  {course.category}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground flex-wrap gap-2">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span>{course.lessonCount || 0} lessons</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span>{course.estimatedDurationDays} days</span>
                </div>
              </div>

              {isEnrolled(course) && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span aria-label={`${Math.round(course.progressPercentage || 0)} percent complete`}>
                      {Math.round(course.progressPercentage || 0)}%
                    </span>
                  </div>
                  <Progress 
                    value={course.progressPercentage || 0} 
                    className="h-2"
                    aria-label={`Course progress: ${Math.round(course.progressPercentage || 0)}%`}
                  />
                  {isCompleted(course) && (
                    <Badge variant="default" className="w-full justify-center">
                      <Star className="h-3 w-3 mr-1" aria-hidden="true" />
                      Completed
                    </Badge>
                  )}
                </div>
              )}

              {!isEnrolled(course) && (
                <Button
                  onClick={() => onEnrollInCourse(course.id)}
                  disabled={isEnrolling}
                  className="w-full"
                  variant={course.isPremium ? "secondary" : "default"}
                  loading={isEnrolling}
                  loadingText="Enrolling..."
                  aria-describedby={course.isPremium ? `premium-notice-${course.id}` : undefined}
                >
                  {course.isPremium ? 'Upgrade to Access' : 'Enroll Now'}
                </Button>
              )}
              
              {course.isPremium && (
                <div id={`premium-notice-${course.id}`} className="sr-only">
                  This is a premium course. Upgrade your account to access this content.
                </div>
              )}
              
              {isEnrolled(course) && !isCompleted(course) && (
                <Button 
                  className="w-full" 
                  variant="outline"
                  aria-label={`Continue learning ${course.title}`}
                >
                  Continue Learning
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <Card className="p-8 sm:p-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-lg font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters to see more courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className=""
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
