import { Button } from "@/components/ui/button";
import { CourseMetaPills } from "./CourseMetaPills";

interface CourseHeroProps {
  title: string;
  tagline: string;
  level: string;
  deliveryMode: string;
  formatLabel: string;
  duration: string;
  onPrimary: () => void;
  onSecondary: () => void;
  onTertiary: () => void;
}

export function CourseHero({
  title,
  tagline,
  level,
  deliveryMode,
  formatLabel,
  duration,
  onPrimary,
  onSecondary,
  onTertiary
}: CourseHeroProps) {
  const scrollToDateSelector = () => {
    const element = document.getElementById('selettore-date-sedi');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header 
      className="relative min-h-[80vh] flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/10 via-indigo-600/10 to-violet-600/10"
      data-testid="hero"
    >
      <div className="container max-w-6xl mx-auto px-6 py-16 text-center">
        <CourseMetaPills
          level={level}
          deliveryMode={deliveryMode}
          formatLabel={formatLabel}
          duration={duration}
        />
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          {title}
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
          {tagline}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="min-h-[44px] px-8"
            onClick={() => {
              onPrimary();
              scrollToDateSelector();
            }}
          >
            Trova un corso
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="min-h-[44px] px-8"
            onClick={() => {
              onSecondary();
              scrollToDateSelector();
            }}
          >
            Richiedi un corso per il tuo team
          </Button>
          
          <Button 
            variant="ghost" 
            size="lg" 
            className="min-h-[44px] px-8"
            onClick={() => {
              onTertiary();
              scrollToDateSelector();
            }}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Contatta un esperto
          </Button>
        </div>
      </div>
    </header>
  );
}