import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseFactsCardProps {
  level: string;
  deliveryMode: string;
  duration: string;
  examAlignment?: string;
}

export function CourseFactsCard({ level, deliveryMode, duration, examAlignment }: CourseFactsCardProps) {
  const facts = [
    { label: "Livello", value: level, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> },
    { label: "Modalità", value: deliveryMode, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
    { label: "Durata", value: duration, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> }
  ];

  if (examAlignment) {
    facts.push({
      label: "Certificazione",
      value: examAlignment,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
    });
  }

  return (
    <Card className="rounded-2xl border shadow-sm" data-testid="facts">
      <CardHeader className="p-6 md:p-8">
        <CardTitle className="text-xl font-bold tracking-tight leading-tight">
          Dettagli del corso
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 md:p-8 pt-0">
        <dl className="space-y-4">
          {facts.map((fact, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="text-primary" aria-hidden="true">
                {fact.icon}
              </div>
              <dt className="text-sm font-medium text-muted-foreground min-w-[80px]">
                {fact.label}:
              </dt>
              <dd className="text-sm font-medium">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}