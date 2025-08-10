import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Zap, Target, Trophy } from "lucide-react";

interface LearningStatsProps {
  currentStreak: number;
  experiencePoints: number;
  level: number;
  completedLessons: number;
  totalLessons: number;
  achievements: number;
}

export function LearningStats({
  currentStreak,
  experiencePoints,
  level,
  completedLessons,
  totalLessons,
  achievements,
}: LearningStatsProps) {
  const progressPercentage = (completedLessons / totalLessons) * 100;
  const xpToNextLevel = 1000;
  const currentLevelXP = experiencePoints % xpToNextLevel;
  const levelProgress = (currentLevelXP / xpToNextLevel) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Current Streak */}
      <Card className="bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="text-2xl font-bold text-blue-600">{currentStreak} days</p>
            </div>
            <Badge variant="secondary" size="lg" className="bg-blue-100 text-blue-700">
              <Flame className="w-4 h-4 mr-1" />
              Streak
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Experience Points */}
      <Card className="bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm text-muted-foreground">Level {level}</p>
              <p className="text-2xl font-bold text-purple-600">{experiencePoints} XP</p>
            </div>
            <Badge variant="secondary" size="lg" className="bg-purple-100 text-purple-700">
              <Zap className="w-4 h-4 mr-1" />
              XP
            </Badge>
          </div>
          <Progress 
            value={levelProgress} 
            className="h-2" 
          />
          <p className="text-xs text-muted-foreground mt-1">
            {xpToNextLevel - currentLevelXP} XP to level {level + 1}
          </p>
        </CardContent>
      </Card>

      {/* Course Progress */}
      <Card className="bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm text-muted-foreground">Course Progress</p>
              <p className="text-2xl font-bold text-green-600">
                {completedLessons}/{totalLessons}
              </p>
            </div>
            <Badge variant="secondary" size="lg" className="bg-green-100 text-green-700">
              <Target className="w-4 h-4 mr-1" />
              Progress
            </Badge>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2" 
          />
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round(progressPercentage)}% complete
          </p>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Achievements</p>
              <p className="text-2xl font-bold text-purple-600">{achievements}</p>
            </div>
            <Badge variant="secondary" size="lg" className="bg-purple-100 text-purple-700">
              <Trophy className="w-4 h-4 mr-1" />
              Earned
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}