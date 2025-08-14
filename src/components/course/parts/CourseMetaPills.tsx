import { Badge } from "@/components/ui/badge";

interface CourseMetaPillsProps {
  level: string;
  deliveryMode: string;
  formatLabel: string;
  duration: string;
}

export function CourseMetaPills({ level, deliveryMode, formatLabel, duration }: CourseMetaPillsProps) {
  const pills = [
    { label: level, icon: "📊" },
    { label: deliveryMode, icon: "🎓" },
    { label: formatLabel, icon: "📚" },
    { label: duration, icon: "⏱️" }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6" role="list">
      {pills.map((pill, index) => (
        <Badge 
          key={index} 
          variant="secondary" 
          className="h-11 px-4 text-sm font-medium"
          role="listitem"
          aria-describedby={`pill-hint-${index}`}
        >
          <span className="mr-2" aria-hidden="true">{pill.icon}</span>
          {pill.label}
          <span id={`pill-hint-${index}`} className="sr-only">
            Caratteristica del corso: {pill.label}
          </span>
        </Badge>
      ))}
    </div>
  );
}