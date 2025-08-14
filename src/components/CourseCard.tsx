import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Play, CheckCircle } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessonsCount: number;
  completedLessons: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  isCompleted: boolean;
  onStartLesson: (courseId: string) => void;
}

export function CourseCard({
  id,
  title,
  description,
  duration,
  lessonsCount,
  completedLessons,
  difficulty,
  isCompleted,
  onStartLesson,
}: CourseCardProps) {
  const progress = (completedLessons / lessonsCount) * 100;
  const isStarted = completedLessons > 0;

  const getDifficultyVariant = (level: string) => {
    switch (level) {
      case "Beginner":
        return "success";
      case "Intermediate":
        return "default";
      case "Advanced":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-lg transition-all duration-300 hover:scale-105 group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant={getDifficultyVariant(difficulty)} size="sm">
            {difficulty}
          </Badge>
          {isCompleted && (
            <Badge variant="achievement" size="sm">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Course Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {duration}
          </div>
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            {lessonsCount} lessons
          </div>
        </div>

        {/* Progress */}
        {isStarted && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-primary">
                {completedLessons}/{lessonsCount} lessons
              </span>
            </div>
            <Progress 
              value={progress} 
              variant="success" 
              className="h-2" 
            />
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={() => onStartLesson(id)}
          variant={isCompleted ? "success" : isStarted ? "experience" : "hero"}
          size="lg"
          className="w-full"
        >
          <Play className="w-4 h-4 mr-2" />
          {isCompleted ? "Review Course" : isStarted ? "Continue Learning" : "Start Course"}
        </Button>
      </CardContent>
    </Card>
  );
}