import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RelatedCoursesRowProps {
  items?: { title: string; url: string }[];
}

export function RelatedCoursesRow({ items }: RelatedCoursesRowProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="p-6 md:p-8">
        <CardTitle className="text-2xl font-bold tracking-tight leading-tight">
          Corsi correlati
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 md:p-8 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((course, index) => (
            <Card key={index} className="border-2 border-dashed border-muted hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <h3 className="font-medium mb-3 text-sm leading-relaxed">
                  {course.title}
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start p-0 h-auto text-primary hover:text-primary"
                  onClick={() => window.open(course.url, '_blank', 'noopener,noreferrer')}
                >
                  Scopri di più →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}