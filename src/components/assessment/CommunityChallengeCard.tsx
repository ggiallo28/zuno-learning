import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CommunityChallengeCard({
  title = "Sfida della Community",
  stat = "Il 65% ha sbagliato questa domanda",
  onAccept,
}: {
  title?: string;
  stat?: string;
  onAccept: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{stat}</div>
        <Button size="sm" onClick={onAccept}>Provala</Button>
      </CardContent>
    </Card>
  );
}
