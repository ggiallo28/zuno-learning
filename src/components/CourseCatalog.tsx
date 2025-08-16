import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { BookOpen, Clock, Star, Users, Lock, Search, Filter, SortAsc } from 'lucide-react';
import { CourseDataAdapter } from '@/utils/courseDataAdapter';
import type { Course } from '@/types';

interface CourseCatalogProps {
  courses: Course[];
  onEnrollInCourse: (courseId: string) => Promise<void>;
  isEnrolling?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
  showSort?: boolean;
  defaultView?: 'grid' | 'list';
  onCourseClick?: (course: Course) => void;
}

export function CourseCatalog({ 
  courses, 
  onEnrollInCourse, 
  isEnrolling,
  showSearch = true,
  showFilters = true,
  showSort = true,
  defaultView = 'grid',
  onCourseClick
}: CourseCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'title' | 'difficulty' | 'progress' | 'enrolled'>('title');
  const [viewMode] = useState<'grid' | 'list'>(defaultView);

  // Normalize courses to ensure consistent data format
  const normalizedCourses = useMemo(() => {
    return CourseDataAdapter.normalizeCourses(courses);
  }, [courses]);

  // Get unique categories and difficulties from normalized data
  const categories = useMemo(() => {
    return CourseDataAdapter.getUniqueCategories(normalizedCourses);
  }, [normalizedCourses]);

  const difficulties = useMemo(() => {
    return CourseDataAdapter.getUniqueDifficulties(normalizedCourses);
  }, [normalizedCourses]);

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = normalizedCourses;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course => 
        course.title?.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query) ||
        course.category?.toLowerCase().includes(query)
      );
    }

    // Apply category and difficulty filters
    filtered = CourseDataAdapter.filterCourses(filtered, selectedCategory, selectedDifficulty);

    // Apply sorting
    return CourseDataAdapter.sortCourses(filtered, sortBy);
  }, [normalizedCourses, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  const getDifficultyColor = (difficulty: string) => {
    const normalizedDifficulty = difficulty?.toLowerCase();
    switch (normalizedDifficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isEnrolled = (course: Course) => course.enrolledAt !== undefined || course.enrolled_at !== undefined;
  const isCompleted = (course: Course) => course.completedAt !== undefined || course.completed_at !== undefined;

  const handleCourseCardClick = (course: Course) => {
    if (onCourseClick) {
      onCourseClick(course);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSearchQuery('');
    setSortBy('title');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Search and Filter Controls */}
      {(showSearch || showFilters || showSort) && (
        <div 
          className="space-y-4 p-4 bg-muted/50 rounded-lg"
          role="search"
          aria-label="Course search and filters"
        >
          {/* Search Bar */}
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses by title, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 min-h-[44px]"
                aria-label="Search courses"
              />
            </div>
          )}

          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            {showFilters && (
              <>
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
                      <Filter className="h-4 w-4 mr-2" />
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
                      <Filter className="h-4 w-4 mr-2" />
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
              </>
            )}

            {showSort && (
              <div className="flex-1 sm:flex-none">
                <label htmlFor="sort-select" className="block text-sm font-medium mb-2 sm:sr-only">
                  Sort courses
                </label>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger 
                    id="sort-select"
                    className="w-full sm:w-48 min-h-[44px]"
                    aria-label="Sort courses"
                  >
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title A-Z</SelectItem>
                    <SelectItem value="difficulty">Difficulty</SelectItem>
                    <SelectItem value="progress">Progress</SelectItem>
                    <SelectItem value="enrolled">Enrolled First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Clear Filters Button */}
            {(searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all' || sortBy !== 'title') && (
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="min-h-[44px]"
                aria-label="Clear all filters"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredAndSortedCourses.length === 0 
            ? "No courses found with current filters"
            : `Showing ${filteredAndSortedCourses.length} course${filteredAndSortedCourses.length === 1 ? '' : 's'}`
          }
        </div>
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {filteredAndSortedCourses.length === 0 
            ? "No courses found with current filters"
            : `Showing ${filteredAndSortedCourses.length} course${filteredAndSortedCourses.length === 1 ? '' : 's'}`
          }
        </div>
      </div>

      {/* Course Grid */}
      <div 
        className={`grid gap-4 sm:gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}
        role="list"
        aria-label="Available courses"
      >
        {filteredAndSortedCourses.map((course) => (
          <Card 
            key={course.id} 
            className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
              onCourseClick ? 'cursor-pointer hover:scale-[1.02]' : ''
            }`}
            role="listitem"
            aria-labelledby={`course-title-${course.id}`}
            aria-describedby={`course-description-${course.id}`}
            onClick={() => handleCourseCardClick(course)}
          >
            {(course.isPremium || course.is_premium) && (
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
                  className={getDifficultyColor(course.difficultyLevel || course.difficulty_level || '')}
                  aria-label={`Difficulty level: ${course.difficultyLevel || course.difficulty_level}`}
                >
                  {(course.difficultyLevel || course.difficulty_level || '').charAt(0).toUpperCase() + 
                   (course.difficultyLevel || course.difficulty_level || '').slice(1).toLowerCase()}
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
                  <span>{course.lessonCount || course.lesson_count || 0} lessons</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span>{course.estimatedDurationDays || course.estimated_duration_days || 0} days</span>
                </div>
              </div>

              {isEnrolled(course) && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span aria-label={`${Math.round((course.progressPercentage || course.progress_percentage || 0))} percent complete`}>
                      {Math.round((course.progressPercentage || course.progress_percentage || 0))}%
                    </span>
                  </div>
                  <Progress 
                    value={course.progressPercentage || course.progress_percentage || 0} 
                    className="h-2"
                    aria-label={`Course progress: ${Math.round((course.progressPercentage || course.progress_percentage || 0))}%`}
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
                  variant={(course.isPremium || course.is_premium) ? "secondary" : "default"}
                  aria-describedby={(course.isPremium || course.is_premium) ? `premium-notice-${course.id}` : undefined}
                >
                  {isEnrolling ? 'Enrolling...' : (course.isPremium || course.is_premium) ? 'Upgrade to Access' : 'Enroll Now'}
                </Button>
              )}
              
              {(course.isPremium || course.is_premium) && (
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
      {filteredAndSortedCourses.length === 0 && (
        <Card className="p-8 sm:p-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-lg font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters to see more courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button 
              variant="outline" 
              onClick={clearAllFilters}
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
