import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PrerequisitesCardProps {
  items: string[];
}

export function PrerequisitesCard({ items }: PrerequisitesCardProps) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="p-6 md:p-8">
        <CardTitle className="text-xl font-bold tracking-tight leading-tight flex items-center gap-3">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          Prerequisiti
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 md:p-8 pt-0">
        <ul className="space-y-3" role="list">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3" role="listitem">
              <div className="mt-1.5 w-2 h-2 rounded-full bg-accent flex-shrink-0" aria-hidden="true" />
              <span className="text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}