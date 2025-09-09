import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sparkles, ChevronDown, ChevronUp, Target, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAssessment } from "@/contexts/AssessmentContext";
import { useCoach } from '@/contexts/CoachContext';
import { cn } from "@/lib/utils";

interface TagInfo {
  tag: string;
  category: 'core' | 'advanced' | 'specialized';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  popularity: number; // 0-1 scale
  userHistory?: {
    attempted: number;
    correct: number;
    lastAttempted?: Date;
  };
  relatedTags: string[];
  description: string;
}

interface TagSelectorProps {
  tags: string[];
  selectedTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  maxRecommended?: number;
  showRecommendations?: boolean;
  className?: string;
}

// Enhanced tag database with metadata
const TAG_DATABASE: Record<string, TagInfo> = {
  'react': {
    tag: 'react',
    category: 'core',
    difficulty: 'intermediate',
    popularity: 0.9,
    relatedTags: ['hooks', 'components', 'jsx'],
    description: 'React library fundamentals and concepts'
  },
  'hooks': {
    tag: 'hooks',
    category: 'core',
    difficulty: 'intermediate',
    popularity: 0.85,
    relatedTags: ['react', 'state', 'effects'],
    description: 'React Hooks (useState, useEffect, custom hooks)'
  },
  'javascript': {
    tag: 'javascript',
    category: 'core',
    difficulty: 'beginner',
    popularity: 0.95,
    relatedTags: ['functions', 'arrays', 'objects'],
    description: 'Core JavaScript language features'
  },
  'typescript': {
    tag: 'typescript',
    category: 'advanced',
    difficulty: 'intermediate',
    popularity: 0.7,
    relatedTags: ['types', 'interfaces', 'generics'],
    description: 'TypeScript type system and advanced features'
  },
  'arrays': {
    tag: 'arrays',
    category: 'core',
    difficulty: 'beginner',
    popularity: 0.8,
    relatedTags: ['javascript', 'methods', 'iteration'],
    description: 'Array methods and manipulation techniques'
  },
  'functions': {
    tag: 'functions',
    category: 'core',
    difficulty: 'beginner',
    popularity: 0.85,
    relatedTags: ['javascript', 'closures', 'scope'],
    description: 'Function declarations, expressions, and advanced patterns'
  },
  'async': {
    tag: 'async',
    category: 'advanced',
    difficulty: 'advanced',
    popularity: 0.6,
    relatedTags: ['promises', 'fetch', 'await'],
    description: 'Asynchronous programming patterns and APIs'
  },
  'objects': {
    tag: 'objects',
    category: 'core',
    difficulty: 'beginner',
    popularity: 0.75,
    relatedTags: ['javascript', 'properties', 'methods'],
    description: 'Object creation, manipulation, and patterns'
  },
  'types': {
    tag: 'types',
    category: 'advanced',
    difficulty: 'intermediate',
    popularity: 0.65,
    relatedTags: ['typescript', 'interfaces', 'generics'],
    description: 'Type definitions and type safety concepts'
  }
};

export function TagSelector({ 
  tags, 
  selectedTags = [], 
  onTagsChange,
  maxRecommended = 5,
  showRecommendations = true,
  className 
}: TagSelectorProps) {
  const [localSelectedTags, setLocalSelectedTags] = useState<string[]>(selectedTags);
  const [showAllTags, setShowAllTags] = useState(false);
  const { state, dispatch } = useAssessment();
  const { currentCoach } = useCoach();

  // Use local state or assessment context
  const currentSelectedTags = onTagsChange ? localSelectedTags : state.tags || [];

  // Generate intelligent recommendations based on user history and coach
  const recommendations = useMemo(() => {
    if (!showRecommendations) return [];

    const availableTags = tags.filter(tag => !currentSelectedTags.includes(tag));
    const tagInfos = availableTags.map(tag => TAG_DATABASE[tag]).filter(Boolean);

    // Score tags based on multiple factors
    const scoredTags = tagInfos.map(tagInfo => {
      let score = 0;

      // Base popularity score
      score += tagInfo.popularity * 0.3;

      // Coach-specific preferences
      const coachPreferences = getCoachTagPreferences(currentCoach);
      if (coachPreferences.preferred.includes(tagInfo.tag)) {
        score += 0.4;
      }
      if (coachPreferences.categories.includes(tagInfo.category)) {
        score += 0.2;
      }

      // Difficulty matching (prefer appropriate difficulty)
      const difficultyScore = {
        'beginner': currentSelectedTags.length === 0 ? 0.3 : 0.1,
        'intermediate': 0.2,
        'advanced': currentSelectedTags.length > 2 ? 0.3 : 0.1
      }[tagInfo.difficulty] || 0;
      score += difficultyScore;

      // Related tags bonus (if user selected related tags)
      const relatedBonus = tagInfo.relatedTags.filter(related => 
        currentSelectedTags.includes(related)
      ).length * 0.15;
      score += relatedBonus;

      // User history bonus (simulate based on tag characteristics)
      if (tagInfo.userHistory) {
        const successRate = tagInfo.userHistory.correct / Math.max(1, tagInfo.userHistory.attempted);
        if (successRate < 0.7) {
          score += 0.25; // Recommend areas where user needs improvement
        }
      }

      return { ...tagInfo, score };
    });

    // Sort by score and return top recommendations
    return scoredTags
      .sort((a, b) => b.score - a.score)
      .slice(0, maxRecommended);
  }, [tags, currentSelectedTags, currentCoach, maxRecommended, showRecommendations]);

  // Get coach-specific tag preferences
  const getCoachTagPreferences = (coach: string) => {
    const preferences = {
      elia: {
        preferred: ['javascript', 'functions', 'objects', 'types'],
        categories: ['core', 'advanced']
      },
      skippy: {
        preferred: ['react', 'hooks', 'arrays'],
        categories: ['core']
      },
      lupa: {
        preferred: ['react', 'hooks', 'async'],
        categories: ['core', 'advanced']
      },
      polpo: {
        preferred: ['typescript', 'async', 'types'],
        categories: ['advanced', 'specialized']
      }
    };
    return preferences[coach as keyof typeof preferences] || preferences.elia;
  };

  // Handle tag selection
  const toggleTag = (tag: string) => {
    const newTags = currentSelectedTags.includes(tag)
      ? currentSelectedTags.filter(t => t !== tag)
      : [...currentSelectedTags, tag];

    if (onTagsChange) {
      setLocalSelectedTags(newTags);
      onTagsChange(newTags);
    } else {
      dispatch({ type: "toggleTag", tag });
    }
  };

  // Quick select recommended tags
  const selectRecommended = () => {
    const recommendedTags = recommendations.slice(0, 4).map(r => r.tag);
    const newTags = [...new Set([...currentSelectedTags, ...recommendedTags])];
    
    if (onTagsChange) {
      setLocalSelectedTags(newTags);
      onTagsChange(newTags);
    } else {
      recommendedTags.forEach(tag => {
        if (!currentSelectedTags.includes(tag)) {
          dispatch({ type: "toggleTag", tag });
        }
      });
    }
  };

  // Clear all selections
  const clearAll = () => {
    if (onTagsChange) {
      setLocalSelectedTags([]);
      onTagsChange([]);
    } else {
      currentSelectedTags.forEach(tag => {
        dispatch({ type: "toggleTag", tag });
      });
    }
  };

  // Categorize tags for display
  const categorizedTags = useMemo(() => {
    const categories = {
      recommended: recommendations.slice(0, 4),
      selected: currentSelectedTags.map(tag => TAG_DATABASE[tag]).filter(Boolean),
      available: tags
        .filter(tag => !currentSelectedTags.includes(tag))
        .map(tag => TAG_DATABASE[tag])
        .filter(Boolean)
        .filter(tagInfo => !recommendations.slice(0, 4).some(r => r.tag === tagInfo.tag))
    };
    return categories;
  }, [tags, currentSelectedTags, recommendations]);

  const getTagIcon = (category: string) => {
    switch (category) {
      case 'core': return <Target className="w-3 h-3" />;
      case 'advanced': return <TrendingUp className="w-3 h-3" />;
      case 'specialized': return <Sparkles className="w-3 h-3" />;
      default: return null;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            Seleziona Argomenti
          </CardTitle>
          <div className="flex items-center gap-2">
            {currentSelectedTags.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Cancella tutto
              </Button>
            )}
            <Badge variant="outline">
              {currentSelectedTags.length} selezionati
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Recommended Tags */}
        {showRecommendations && recommendations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Raccomandati per te
              </h4>
              <Button variant="outline" size="sm" onClick={selectRecommended}>
                Seleziona tutti
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categorizedTags.recommended.map((tagInfo) => (
                <Button
                  key={tagInfo.tag}
                  variant="outline"
                  size="sm"
                  onClick={() => toggleTag(tagInfo.tag)}
                  className={cn(
                    "flex items-center gap-2 transition-all",
                    "hover:bg-blue-50 hover:border-blue-300",
                    "border-blue-200 bg-blue-50/50"
                  )}
                >
                  {getTagIcon(tagInfo.category)}
                  {tagInfo.tag}
                  <Badge 
                    variant="secondary" 
                    className={cn("text-xs", getDifficultyColor(tagInfo.difficulty))}
                  >
                    {tagInfo.difficulty}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Tags */}
        {currentSelectedTags.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Argomenti Selezionati
            </h4>
            <div className="flex flex-wrap gap-2">
              {categorizedTags.selected.map((tagInfo) => (
                <Button
                  key={tagInfo.tag}
                  variant="default"
                  size="sm"
                  onClick={() => toggleTag(tagInfo.tag)}
                  className="flex items-center gap-2"
                >
                  {getTagIcon(tagInfo.category)}
                  {tagInfo.tag}
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    ✓
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Available Tags */}
        <div className="space-y-3">
          <Collapsible open={showAllTags} onOpenChange={setShowAllTags}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Altri Argomenti ({categorizedTags.available.length})
                </span>
                {showAllTags ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="flex flex-wrap gap-2 pt-2">
                {categorizedTags.available.map((tagInfo) => (
                  <Button
                    key={tagInfo.tag}
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTag(tagInfo.tag)}
                    className="flex items-center gap-2 hover:bg-muted"
                  >
                    {getTagIcon(tagInfo.category)}
                    {tagInfo.tag}
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getDifficultyColor(tagInfo.difficulty))}
                    >
                      {tagInfo.difficulty}
                    </Badge>
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Selection Summary */}
        {currentSelectedTags.length > 0 && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Selezione attuale:</strong> {currentSelectedTags.join(', ')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Le domande saranno filtrate per includere questi argomenti
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
