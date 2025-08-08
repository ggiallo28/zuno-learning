import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Trophy, Flame, Star, BookOpen } from 'lucide-react';
import type { User } from '@/types';

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getXpForNextLevel = (currentLevel: number) => {
    return currentLevel * 100; // Simple XP calculation
  };

  const getCurrentLevelXp = (totalXp: number, currentLevel: number) => {
    const prevLevelXp = (currentLevel - 1) * 100;
    return totalXp - prevLevelXp;
  };

  const xpForNextLevel = getXpForNextLevel(user.currentLevel);
  const currentLevelXp = getCurrentLevelXp(user.totalXp, user.currentLevel);
  const progressToNextLevel = (currentLevelXp / xpForNextLevel) * 100;

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center space-y-0 pb-4">
        <Avatar className="h-16 w-16 mr-4">
          <AvatarImage src={user.avatarUrl} alt={user.fullName ?? user.username} />
          <AvatarFallback className="text-lg font-semibold">
            {getInitials(user.fullName ?? user.username)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-xl">{user.fullName ?? user.username}</CardTitle>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={user.subscriptionTier === 'free' ? 'secondary' : 'default'}>
              {user.subscriptionTier}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              Level {user.currentLevel}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium">XP</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{user.totalXp}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Flame className="h-4 w-4 text-orange-500 mr-1" />
              <span className="text-sm font-medium">Streak</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{user.currentStreak}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <BookOpen className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-sm font-medium">Courses</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{user.enrolledCourses || 0}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Trophy className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{user.completedCourses || 0}</p>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progress to Level {user.currentLevel + 1}</span>
            <span>{currentLevelXp}/{xpForNextLevel} XP</span>
          </div>
          <Progress value={progressToNextLevel} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
