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
  onEnrollInCourse: (courseId: number) => Promise<void>;
  isEnrolling?: boolean;
}

export function CourseCatalog({ courses, onEnrollInCourse, isEnrolling }: CourseCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categories = Array.from(new Set(courses.map(course => course.category)));
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty_level === selectedDifficulty;
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

  const isEnrolled = (course: Course) => course.enrolled_at !== undefined;
  const isCompleted = (course: Course) => course.completed_at !== undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
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
        
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-full sm:w-48">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="relative overflow-hidden">
            {course.is_premium && (
              <div className="absolute top-3 right-3 z-10">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Lock className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              </div>
            )}
            
            <CardHeader className="pb-3">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-3 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {course.description || 'Learn new skills with this comprehensive course.'}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getDifficultyColor(course.difficulty_level)}>
                  {course.difficulty_level}
                </Badge>
                <Badge variant="outline">{course.category}</Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{course.lesson_count || 0} lessons</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{course.estimated_duration_days} days</span>
                </div>
              </div>

              {isEnrolled(course) && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(course.progress_percentage || 0)}%</span>
                  </div>
                  <Progress value={course.progress_percentage || 0} className="h-2" />
                  {isCompleted(course) && (
                    <Badge variant="default" className="w-full justify-center">
                      <Star className="h-3 w-3 mr-1" />
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
                  variant={course.is_premium ? "secondary" : "default"}
                >
                  {course.is_premium ? 'Upgrade to Access' : 'Enroll Now'}
                </Button>
              )}
              
              {isEnrolled(course) && !isCompleted(course) && (
                <Button className="w-full" variant="outline">
                  Continue Learning
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card className="p-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters to see more courses.
          </p>
        </Card>
      )}
    </div>
  );
}
