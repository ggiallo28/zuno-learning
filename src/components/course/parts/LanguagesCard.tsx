import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LanguagesCardProps {
  languages: string[];
}

export function LanguagesCard({ languages }: LanguagesCardProps) {
  return (
    <Card className="rounded-2xl border shadow-sm" data-testid="languages">
      <CardHeader className="p-6 md:p-8">
        <CardTitle className="text-xl font-bold tracking-tight leading-tight flex items-center gap-3">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          Lingue disponibili
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 md:p-8 pt-0">
        <div className="grid grid-cols-2 gap-2" role="list">
          {languages.map((language, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="justify-center py-2 text-sm"
              role="listitem"
            >
              <span className="sr-only">Lingua supportata: </span>
              {language}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}