import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseOverviewCardProps {
  overview: string;
}

export function CourseOverviewCard({ overview }: CourseOverviewCardProps) {
  const mindsetItems = [
    { label: "Resilienza", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-7 5a9 9 0 1118 0H4z" /></svg> },
    { label: "Sicurezza", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
    { label: "Disponibilità", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
    { label: "Scalabilità", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg> }
  ];

  return (
    <Card className="rounded-2xl border shadow-sm h-fit" data-testid="overview">
      <CardHeader className="p-6 md:p-8">
        <CardTitle className="text-2xl font-bold tracking-tight leading-tight">
          Panoramica del corso
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 md:p-8 pt-0">
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {overview}
        </p>
        
        <div className="space-y-3">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
            Mindset del corso
          </h3>
          <ul className="space-y-3" role="list">
            {mindsetItems.map((item, index) => (
              <li key={index} className="flex items-center gap-3" role="listitem">
                <div className="text-primary" aria-hidden="true">
                  {item.icon}
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}