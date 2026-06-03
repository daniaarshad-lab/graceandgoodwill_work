import Card from "./Card";
import Button from "./Button";
import { ReactNode } from "react";
import { GraduationCap } from "lucide-react";

interface TrainingCardProps {
  title: string;
  description: string;
  bullets?: string[];
  cta?: string;
  icon?: ReactNode;
}

export default function TrainingCard({
  title,
  description,
  bullets = [],
  cta = "Learn more",
  icon,
}: TrainingCardProps) {
  return (
    <Card className="hover:shadow-md transition">
      <div className="flex items-start gap-4">
        <div className="shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon ?? <GraduationCap className="h-6 w-6" strokeWidth={1.5} />}
        </div>

        <div className="grow">
          <h3 className="mb-1">{title}</h3>
          <p className="body-small text-muted-foreground mb-3">{description}</p>

          {bullets.length > 0 && (
            <ul className="mb-4 ml-4 list-disc body-small text-muted-foreground">
              {bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}

          <div className="mt-2">
            <Button text={cta} variant="outline" />
          </div>
        </div>
      </div>
    </Card>
  );
}
