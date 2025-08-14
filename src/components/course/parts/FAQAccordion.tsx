import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQAccordionProps {
  faqs?: { q: string; a: string }[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="p-6 md:p-8">
        <CardTitle className="text-2xl font-bold tracking-tight leading-tight">
          Domande frequenti
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 md:p-8 pt-0">
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`faq-${index}`}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="text-sm text-muted-foreground leading-relaxed mt-2">
                  {faq.a}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}