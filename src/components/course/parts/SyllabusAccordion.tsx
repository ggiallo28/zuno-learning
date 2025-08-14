import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface SyllabusAccordionProps {
  modules?: { title: string; bullets: string[] }[];
}

export function SyllabusAccordion({ modules }: SyllabusAccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const storageKey = "course.syllabus.open";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setOpenItems(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Failed to load syllabus state from localStorage:', error);
    }
  }, []);

  const handleValueChange = (value: string[]) => {
    setOpenItems(value);
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save syllabus state to localStorage:', error);
    }
  };

  if (!modules || modules.length === 0) {
    return null;
  }

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="p-6 md:p-8">
        <CardTitle className="text-2xl font-bold tracking-tight leading-tight">
          Programma del corso
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 md:p-8 pt-0">
        <Accordion 
          type="multiple" 
          value={openItems} 
          onValueChange={handleValueChange}
          className="space-y-2"
        >
          {modules.map((module, index) => (
            <AccordionItem 
              key={index} 
              value={`module-${index}`}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                {module.title}
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <ul className="space-y-2 mt-2" role="list">
                  {module.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-start gap-3" role="listitem">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm text-muted-foreground leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}