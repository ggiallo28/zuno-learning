import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LearningOutcomesCardProps {
  items: string[];
}

export function LearningOutcomesCard({ items }: LearningOutcomesCardProps) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="p-6 md:p-8">
        <CardTitle className="text-xl font-bold tracking-tight leading-tight flex items-center gap-3">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Obiettivi di apprendimento
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 md:p-8 pt-0">
        <ul className="space-y-3" role="list">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3" role="listitem">
              <div className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
              <span className="text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}