import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AudienceCardProps {
  items: string[];
}

export function AudienceCard({ items }: AudienceCardProps) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="p-6 md:p-8">
        <CardTitle className="text-xl font-bold tracking-tight leading-tight flex items-center gap-3">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          A chi è rivolto
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 md:p-8 pt-0">
        <ul className="space-y-3" role="list">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3" role="listitem">
              <div className="mt-1.5 w-2 h-2 rounded-full bg-secondary flex-shrink-0" aria-hidden="true" />
              <span className="text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}